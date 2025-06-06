/**
 * src/data/swiss-tax-platform/collectors/basel-stadt-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Basel-Stadt (BS).
 * This collector handles Basel-Stadt's unique status as a city-canton with a
 * largely unified cantonal tax system. Municipal tax multipliers are effectively 1.0
 * or integrated into the cantonal rates.
 * Basel-Stadt has only 3 municipalities: Basel, Riehen, and Bettingen.
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

// Define the expected structure of a row parsed from Basel-Stadt's data source
// Even with a unified system, we might find church tax rates or specific notes.
interface BaselStadtTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  // For BS, the main municipal tax is part of the cantonal tax.
  // We'll represent this with a multiplier of 1.0 for consistency.
  // Specific cantonal documents might detail how the "communal share" is derived.
  KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER?: number; // Reformed church tax as % of cantonal tax
  KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER?: number; // Catholic church tax as % of cantonal tax
  KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER?: number; // Christian Catholic church tax as %
}

export class BaselStadtCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`BaselStadtCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Basel-Stadt.
   * Simulating fetching by returning a predefined JSON string for its 3 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Basel-Stadt data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleBSData: BaselStadtTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Data for Basel-Stadt's 3 municipalities.
    // BFS: Basel (2701), Riehen (2702), Bettingen (2703)
    // Main municipal tax is unified; we use 1.0 as multiplier. Church taxes are separate.
    const municipalitiesData: { name: string, bfs: number, refChurch: number, kathChurch: number, christKath?: number }[] = [
      { name: 'Basel', bfs: 2701, refChurch: 5.0, kathChurch: 5.0, christKath: 7.0 },
      { name: 'Riehen', bfs: 2702, refChurch: 5.0, kathChurch: 5.0, christKath: 7.0 }, // Rates often similar to Basel city
      { name: 'Bettingen', bfs: 2703, refChurch: 4.5, kathChurch: 4.5, christKath: 6.5 }, // Might have slightly different church rates
    ];

    yearsToGenerate.forEach(year => {
      municipalitiesData.forEach(muni => {
        // Simulate slight year-over-year changes for church taxes for 2025
        const refChurchForYear = year === currentYear ? muni.refChurch : parseFloat((muni.refChurch + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : parseFloat((muni.kathChurch + (Math.random() * 0.4 - 0.2)).toFixed(1));
        const christKathForYear = muni.christKath ? (year === currentYear ? muni.christKath : parseFloat((muni.christKath + (Math.random() * 0.4 - 0.2)).toFixed(1))) : undefined;

        sampleBSData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          // Main municipal tax multiplier is effectively 1.0 as it's part of the cantonal tax
          KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER: kathChurchForYear,
          KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER: christKathForYear,
        });
      });
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleBSData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of BaselStadtTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<BaselStadtTaxRateRow[]> {
    this.logInfo(`Parsing Basel-Stadt data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for BS simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as BaselStadtTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed BS data is not an array as expected.');
      }

      const validatedData: BaselStadtTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number') {
          this.logWarn('Skipping invalid row in BS data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for BS: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Basel-Stadt-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: BaselStadtTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // For Basel-Stadt, the municipal income and wealth tax is unified with the cantonal tax.
        // We represent this with a multiplier of 1.0, meaning the municipal portion is
        // fully accounted for within the cantonal tax calculation itself.
        const incomeTaxMultiplier = 1.0;
        const wealthTaxMultiplier = 1.0; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER / 100 
          : null;
        const christianCatholicChurchTax = item.KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // BS uses unified system
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: christianCatholicChurchTax,
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Basel-Stadt has a unified cantonal tax system. Municipal multiplier is effectively 1.0 or integrated. Church taxes are separate.`,
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
        this.logError(`Error mapping BS item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from BS source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} BS items to ScrapedDataItem format.`);
      
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
async function runBaselStadtCollection() {
  const bsDataSource: DataSource = {
    source_id: 'canton_bs_tax_rates_simulated',
    name: 'Canton Basel-Stadt Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://basel-stadt/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Basel-Stadt tax rates (unified system).',
  };

  const collector = new BaselStadtCollector(bsDataSource);
  const result = await collector.collect();

  console.log("\n--- Basel-Stadt Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runBaselStadtCollection();
*/
