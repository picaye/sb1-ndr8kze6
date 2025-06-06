/**
 * src/data/swiss-tax-platform/collectors/bern-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Bern.
 * This collector handles Bern's municipal tax multipliers (Steueranlage)
 * and its specific church tax structure. It's designed to parse data
 * typically found in PDF or Excel documents from Bern's cantonal tax administration,
 * accommodating both German and French municipality names.
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

// Define the expected structure of a row parsed from Bern's data source
interface BernTaxRateRow {
  BFS_NR: number; // Official municipality number (Gemeindenummer)
  GEMEINDE_DE: string; // Municipality name in German
  COMMUNE_FR: string; // Municipality name in French
  STEUERJAHR: number; // Tax year
  STEUERANLAGE_GEMEINDE: number; // Municipal tax multiplier (e.g., 1.54 for 154%)
  KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER?: number; // Reformed church tax as % of cantonal tax
  KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER?: number; // Roman Catholic church tax as % of cantonal tax
  KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER?: number; // Christian Catholic church tax as % of cantonal tax
}

export class BernCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`BernCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Bern.
   * Simulating fetching by returning a predefined JSON string.
   * In a real scenario, this would involve downloading and parsing a PDF/Excel.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Bern data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleBernData: BernTaxRateRow[] = [
      { BFS_NR: 351, GEMEINDE_DE: 'Bern', COMMUNE_FR: 'Berne', STEUERJAHR: 2024, STEUERANLAGE_GEMEINDE: 1.54, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.108, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.125, KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER: 0.150 },
      { BFS_NR: 351, GEMEINDE_DE: 'Bern', COMMUNE_FR: 'Berne', STEUERJAHR: 2025, STEUERANLAGE_GEMEINDE: 1.54, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.108, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.125, KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER: 0.150 },
      { BFS_NR: 371, GEMEINDE_DE: 'Biel/Bienne', COMMUNE_FR: 'Biel/Bienne', STEUERJAHR: 2024, STEUERANLAGE_GEMEINDE: 1.63, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.110, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.130 },
      { BFS_NR: 371, GEMEINDE_DE: 'Biel/Bienne', COMMUNE_FR: 'Biel/Bienne', STEUERJAHR: 2025, STEUERANLAGE_GEMEINDE: 1.63, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.110, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.130 },
      { BFS_NR: 942, GEMEINDE_DE: 'Thun', COMMUNE_FR: 'Thoune', STEUERJAHR: 2024, STEUERANLAGE_GEMEINDE: 1.65, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.095, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.115 },
      { BFS_NR: 942, GEMEINDE_DE: 'Thun', COMMUNE_FR: 'Thoune', STEUERJAHR: 2025, STEUERANLAGE_GEMEINDE: 1.65, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.095, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.115 },
      { BFS_NR: 585, GEMEINDE_DE: 'Köniz', COMMUNE_FR: 'Köniz', STEUERJAHR: 2024, STEUERANLAGE_GEMEINDE: 1.49, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.090, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.100 },
      { BFS_NR: 585, GEMEINDE_DE: 'Köniz', COMMUNE_FR: 'Köniz', STEUERJAHR: 2025, STEUERANLAGE_GEMEINDE: 1.49, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.090, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.100 },
      { BFS_NR: 623, GEMEINDE_DE: 'Muri bei Bern', COMMUNE_FR: 'Muri bei Bern', STEUERJAHR: 2024, STEUERANLAGE_GEMEINDE: 1.15, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.070, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.080 },
      { BFS_NR: 623, GEMEINDE_DE: 'Muri bei Bern', COMMUNE_FR: 'Muri bei Bern', STEUERJAHR: 2025, STEUERANLAGE_GEMEINDE: 1.15, KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: 0.070, KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER: 0.080 },
    ];
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleBernData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of BernTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<BernTaxRateRow[]> {
    this.logInfo(`Parsing Bern data (format hint: ${format}). Expecting JSON string of BernTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Bern simulation.');
    }

    try {
      // In a real scenario, PDF or Excel parsing would happen here.
      // For example, using 'pdf-parse' for PDFs or 'xlsx' for Excel files.
      // const pdfParser = require('pdf-parse'); // Placeholder
      // const excelParser = require('xlsx'); // Placeholder
      // if (format === 'pdf') { /* ... parse PDF ... */ }
      // if (format === 'excel_xlsx') { /* ... parse Excel ... */ }

      const parsedData = JSON.parse(rawData) as BernTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Bern data is not an array as expected.');
      }

      const validatedData: BernTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            (typeof row.GEMEINDE_DE !== 'string' || row.GEMEINDE_DE.trim() === '') ||
            // French name can be optional or same as German for some municipalities
            (row.COMMUNE_FR !== undefined && typeof row.COMMUNE_FR !== 'string') || 
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERANLAGE_GEMEINDE !== 'number') {
          this.logWarn('Skipping invalid row in Bern data due to missing or incorrect core fields:', row);
          continue;
        }
        // Ensure optional church tax rates are numbers if present
        if (row.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER !== undefined && typeof row.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER !== 'number') row.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER = undefined;
        if (row.KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER !== undefined && typeof row.KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER !== 'number') row.KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER = undefined;
        if (row.KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER !== undefined && typeof row.KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER !== 'number') row.KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER = undefined;
        
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Bern: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Bern-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: BernTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Bern's Steueranlage is already a decimal multiplier (e.g., 1.54 for 154%)
        const incomeTaxMultiplier = item.STEUERANLAGE_GEMEINDE;
        // Assuming wealth tax multiplier is the same as income tax for Bern, unless specified otherwise
        const wealthTaxMultiplier = item.STEUERANLAGE_GEMEINDE; 

        // Bern church tax rates are typically percentages of the *cantonal tax amount*.
        // Our MunicipalTaxRate stores multipliers that are applied to a base (like cantonal tax).
        // So, if KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER is 0.108 (for 10.8%), this is the multiplier.
        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER; // Already a decimal if source is e.g. 0.108
        const catholicChurchTax = item.KIRCHENSTEUER_RKATH_PROZENT_KANTONSSTEUER;
        const christianCatholicChurchTax = item.KIRCHENSTEUER_CKATH_PROZENT_KANTONSSTEUER;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Bern uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: christianCatholicChurchTax,
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Bern municipal tax rate (Steueranlage Gemeinde). Church tax rates are multipliers on the cantonal tax amount. German Name: ${item.GEMEINDE_DE}, French Name: ${item.COMMUNE_FR || item.GEMEINDE_DE}.`,
        };

        scrapedDataItems.push({
          item_id: generateUUID(),
          source_id: this.dataSource.source_id,
          retrieved_at: retrievalTimestamp,
          raw_content_path: null,
          raw_content_inline: null,
          content_type_detected: 'application/json', // As we simulate with JSON
          status: 'parsed_successfully' as ScrapedItemStatusType,
          error_message: null,
          parsed_data_preview_json: JSON.stringify(municipalTaxRate),
        });
      } catch (error: any) {
        this.logError(`Error mapping Bern item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Bern source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Bern items to ScrapedDataItem format.`);
      
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
async function runBernCollection() {
  const bernDataSource: DataSource = {
    source_id: 'canton_be_tax_rates_simulated',
    name: 'Canton Bern Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://bern/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Bern tax rates (Steueranlage).',
  };

  const collector = new BernCollector(bernDataSource);
  const result = await collector.collect();

  console.log("\n--- Bern Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runBernCollection();
*/
