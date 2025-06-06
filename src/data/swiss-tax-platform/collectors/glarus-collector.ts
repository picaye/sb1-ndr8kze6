/**
 * src/data/swiss-tax-platform/collectors/glarus-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Glarus (GL).
 * This collector handles Glarus's "Steuerfuss in % der einfachen Kantonssteuer" system.
 * Glarus has a unique unified structure with only 3 municipalities: Glarus, Glarus Nord, Glarus Süd.
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
import { generateUUID } from '../../security/encryption';

// Define the expected structure of a row parsed from Glarus's data source
interface GlarusTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage (e.g., 58 for 58%)
  KIRCHENSTEUER_REF_PROZENT_EINFACHE_STAATSSTEUER?: number; // Reformed church tax as % of the simple cantonal tax unit
  KIRCHENSTEUER_KATH_PROZENT_EINFACHE_STAATSSTEUER?: number; // Catholic church tax as % of the simple cantonal tax unit
}

export class GlarusCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`GlarusCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Glarus.
   * Simulating fetching by returning a predefined JSON string for its 3 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Glarus data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleGLData: GlarusTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Data for Glarus's 3 municipalities. BFS numbers are official.
    // Glarus has a unified tax system, so the municipal Steuerfuss is often the same.
    // Illustrative rates (Steuerfuss in %):
    const municipalitiesData: { name: string, bfs: number, rate: number, refChurch: number, kathChurch: number }[] = [
      { name: 'Glarus Nord', bfs: 1627, rate: 58, refChurch: 6, kathChurch: 5 },
      { name: 'Glarus', bfs: 1628, rate: 58, refChurch: 6, kathChurch: 5 }, // Capital
      { name: 'Glarus Süd', bfs: 1629, rate: 58, refChurch: 6, kathChurch: 5 },
    ];

    yearsToGenerate.forEach(year => {
      municipalitiesData.forEach(muni => {
        // Simulate slight year-over-year changes for the next year, though Glarus rates are often stable
        const rateForYear = year === currentYear ? muni.rate : Math.max(55, Math.min(65, muni.rate + Math.floor(Math.random() * 2) - 1));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(4, Math.min(8, muni.refChurch + Math.floor(Math.random() * 1) - 0.5));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(3, Math.min(7, muni.kathChurch + Math.floor(Math.random() * 1) - 0.5));

        sampleGLData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT_EINFACHE_STAATSSTEUER: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_EINFACHE_STAATSSTEUER: kathChurchForYear,
        });
      });
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleGLData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of GlarusTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<GlarusTaxRateRow[]> {
    this.logInfo(`Parsing Glarus data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for GL simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as GlarusTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed GL data is not an array as expected.');
      }

      const validatedData: GlarusTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in GL data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for GL: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Glarus-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: GlarusTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Glarus's "Steuerfuss" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Glarus
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_EINFACHE_STAATSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT_EINFACHE_STAATSSTEUER / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT_EINFACHE_STAATSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT_EINFACHE_STAATSSTEUER / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Glarus uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Glarus municipal tax rate (Steuerfuss in % der einfachen Kantonssteuer). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%. Due to unified structure, rates are often identical for Glarus, Glarus Nord, Glarus Süd.`,
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
        this.logError(`Error mapping GL item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
      }
    }
    return scrapedDataItems;
  }
  
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from GL source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} GL items to ScrapedDataItem format.`);
      
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
async function runGlarusCollection() {
  const glarusDataSource: DataSource = {
    source_id: 'canton_gl_tax_rates_simulated',
    name: 'Canton Glarus Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://glarus/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Glarus tax rates (Steuerfuss).',
  };

  const collector = new GlarusCollector(glarusDataSource);
  const result = await collector.collect();

  console.log("\n--- Glarus Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runGlarusCollection();
*/
