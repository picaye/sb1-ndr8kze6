/**
 * src/data/swiss-tax-platform/collectors/geneva-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Geneva.
 * This collector handles Geneva's "centimes additionnels" system for municipal taxes.
 */

import {
  BaseCollector,
  CollectionResult,
  CollectionError,
} from './base-collector';
import {
  DataSource,
  ScrapedDataItem,
  MunicipalTaxRate,
  DataFormatType,
  ScrapedItemStatusType,
} from '../types';
import { generateUUID } from '../../security/encryption'; // Assuming this utility exists

// Define the expected structure of a row parsed from Geneva's data source
interface GenevaTaxRateRow {
  NO_OFS: number; // BFS_NR - Official municipality number (Numéro OFS de la commune)
  COMMUNE: string; // Municipality name (Nom de la commune)
  ANNEE: number; // Tax year (Année fiscale)
  CENT_ADD_REV: number; // Centimes additionnels sur le revenu (decimal, e.g., 0.455)
  CENT_ADD_FORT: number; // Centimes additionnels sur la fortune (decimal, e.g., 0.455)
  // Geneva does not typically levy a separate church tax in the same way as other cantons.
  // It's often integrated or not applicable as a separate municipal rate.
  // So, church tax fields will likely be null.
}

export class GenevaCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'json_api', 'pdf'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`GenevaCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Geneva.
   * Simulating fetching by returning a predefined JSON string.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Geneva data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleGenevaData: GenevaTaxRateRow[] = [
      { NO_OFS: 6621, COMMUNE: 'Genève', ANNEE: 2024, CENT_ADD_REV: 0.455, CENT_ADD_FORT: 0.455 },
      { NO_OFS: 6621, COMMUNE: 'Genève', ANNEE: 2025, CENT_ADD_REV: 0.455, CENT_ADD_FORT: 0.455 },
      { NO_OFS: 6608, COMMUNE: 'Carouge (GE)', ANNEE: 2024, CENT_ADD_REV: 0.445, CENT_ADD_FORT: 0.445 },
      { NO_OFS: 6608, COMMUNE: 'Carouge (GE)', ANNEE: 2025, CENT_ADD_REV: 0.445, CENT_ADD_FORT: 0.445 },
      { NO_OFS: 6624, COMMUNE: 'Lancy', ANNEE: 2024, CENT_ADD_REV: 0.475, CENT_ADD_FORT: 0.475 },
      { NO_OFS: 6624, COMMUNE: 'Lancy', ANNEE: 2025, CENT_ADD_REV: 0.475, CENT_ADD_FORT: 0.475 },
      { NO_OFS: 6628, COMMUNE: 'Meyrin', ANNEE: 2024, CENT_ADD_REV: 0.440, CENT_ADD_FORT: 0.440 },
      { NO_OFS: 6628, COMMUNE: 'Meyrin', ANNEE: 2025, CENT_ADD_REV: 0.440, CENT_ADD_FORT: 0.440 },
      { NO_OFS: 6644, COMMUNE: 'Vernier', ANNEE: 2024, CENT_ADD_REV: 0.475, CENT_ADD_FORT: 0.475 },
      { NO_OFS: 6644, COMMUNE: 'Vernier', ANNEE: 2025, CENT_ADD_REV: 0.475, CENT_ADD_FORT: 0.475 },
      { NO_OFS: 6610, COMMUNE: 'Cologny', ANNEE: 2024, CENT_ADD_REV: 0.300, CENT_ADD_FORT: 0.300 },
      { NO_OFS: 6610, COMMUNE: 'Cologny', ANNEE: 2025, CENT_ADD_REV: 0.300, CENT_ADD_FORT: 0.300 },
    ];
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleGenevaData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of GenevaTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<GenevaTaxRateRow[]> {
    this.logInfo(`Parsing Geneva data (format hint: ${format}). Expecting JSON string of GenevaTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Geneva simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as GenevaTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Geneva data is not an array as expected.');
      }

      const validatedData: GenevaTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.NO_OFS !== 'number' ||
            typeof row.COMMUNE !== 'string' ||
            typeof row.ANNEE !== 'number' ||
            typeof row.CENT_ADD_REV !== 'number' ||
            typeof row.CENT_ADD_FORT !== 'number') {
          this.logWarn('Skipping invalid row in Geneva data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Geneva: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Geneva-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: GenevaTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Geneva's "centimes additionnels" are direct multipliers on the cantonal base tax.
        const incomeTaxMultiplier = item.CENT_ADD_REV;
        const wealthTaxMultiplier = item.CENT_ADD_FORT;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.NO_OFS}_${item.ANNEE}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.NO_OFS,
          tax_year: item.ANNEE,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Geneva uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null, // Geneva uses multipliers
          church_tax_rate_protestant_multiplier: null, // Geneva does not have separate municipal church tax rates in this manner
          church_tax_rate_catholic_multiplier: null,
          church_tax_rate_christian_catholic_multiplier: null,
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Geneva municipal tax rate (centimes additionnels). Multiplier applied to cantonal base tax.`,
        };

        scrapedDataItems.push({
          item_id: generateUUID(),
          source_id: this.dataSource.source_id,
          retrieved_at: retrievalTimestamp,
          raw_content_path: null,
          raw_content_inline: null,
          content_type_detected: 'application/json',
          status: 'parsed_successfully' as ScrapedItemStatusType,
          error_message: null,
          parsed_data_preview_json: JSON.stringify(municipalTaxRate),
        });
      } catch (error: any) {
        this.logError(`Error mapping Geneva item for BFS_NR ${item.NO_OFS}, Year ${item.ANNEE}: ${error.message}`, item);
      }
    }
    return scrapedDataItems;
  }

  /**
   * Overridden collect method to integrate mapToScrapedDataItems correctly.
   */
  public async collect(): Promise<CollectionResult> {
    const startTime = Date.now();
    const errors: CollectionError[] = [];
    let allScrapedDataItems: ScrapedDataItem[] = [];
    let rawDataPath: string | undefined;

    this.logInfo(`Starting collection for source: ${this.dataSource.name} (ID: ${this.dataSource.source_id})`);

    try {
      await this.applyRateLimiting();
      const rawData = await this.fetchRawData();
      
      const primaryDataFormat = this.dataSource.data_format[0] || 'text';
      const parsedItemsArray = await this.parseData(rawData, primaryDataFormat);
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Geneva source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Geneva items to ScrapedDataItem format.`);
      
      return {
        source_id: this.dataSource.source_id,
        status: errors.length > 0 && allScrapedDataItems.length > 0 ? 'partial_success' : 'success',
        items_collected: allScrapedDataItems.length,
        items_parsed_successfully: parsedItemsArray.length,
        items_with_errors: errors.filter(e => e.type === 'parse' || e.type === 'validation').length,
        errors,
        data_preview: allScrapedDataItems.slice(0, Math.min(3, allScrapedDataItems.length)).map(item => item.parsed_data_preview_json ? JSON.parse(item.parsed_data_preview_json) : null),
        raw_data_path: rawDataPath,
        duration_ms: Date.now() - startTime,
        next_scrape_scheduled_at: this.calculateNextScrapeTime(),
      };

    } catch (error: any) {
      const collectionError = error.isCollectionError ? error as CollectionError : this.createCollectionError('unknown', error.message, error);
      errors.push(collectionError);
      this.logError(`Collection failed for source ${this.dataSource.name}: ${collectionError.message}`, collectionError.details);
      
      return {
        source_id: this.dataSource.source_id,
        status: 'failure',
        items_collected: 0,
        items_parsed_successfully: 0,
        items_with_errors: errors.length,
        errors,
        duration_ms: Date.now() - startTime,
        next_scrape_scheduled_at: this.calculateNextScrapeTime(true),
      };
    } finally {
      this.updateDataSourceStatus(errors.length > 0 ? 'error' : 'active');
    }
  }
}

// Example Usage (conceptual)
/*
async function runGenevaCollection() {
  const genevaDataSource: DataSource = {
    source_id: 'canton_ge_tax_rates_simulated',
    name: 'Canton Genève Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://geneva/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Geneva centimes additionnels.',
  };

  const collector = new GenevaCollector(genevaDataSource);
  const result = await collector.collect();

  console.log("\n--- Geneva Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runGenevaCollection();
*/
