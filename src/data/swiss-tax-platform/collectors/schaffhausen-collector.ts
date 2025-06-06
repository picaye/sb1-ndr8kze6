/**
 * src/data/swiss-tax-platform/collectors/schaffhausen-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Schaffhausen (SH).
 * This collector handles Schaffhausen's "Steuerfuss in % des Kantonssteuerbetrags" system.
 * Schaffhausen has approximately 26 municipalities and is a border region with Germany.
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

// Define the expected structure of a row parsed from Schaffhausen's data source
interface SchaffhausenTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage (e.g., 98 for 98%)
  KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER?: number; // Reformed church tax as % of cantonal tax
  KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER?: number; // Catholic church tax as % of cantonal tax
  // Christian Catholic church tax might also exist but is less common.
}

export class SchaffhausenCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`SchaffhausenCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Schaffhausen.
   * Simulating fetching by returning a predefined JSON string for its ~26 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Schaffhausen data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleSHData: SchaffhausenTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Schaffhausen (Steuerfuss in %)
    // BFS numbers are official. Rates are illustrative but realistic (90-110% range).
    const majorMunicipalities: { name: string, bfs: number, rate: number, refChurch: number, kathChurch: number }[] = [
      { name: 'Schaffhausen', bfs: 2939, rate: 98, refChurch: 12, kathChurch: 10 },
      { name: 'Neuhausen am Rheinfall', bfs: 2937, rate: 104, refChurch: 13, kathChurch: 11 },
      { name: 'Thayngen', bfs: 2974, rate: 108, refChurch: 14, kathChurch: 12 }, // BFS for merged Thayngen
      { name: 'Stein am Rhein', bfs: 2940, rate: 95, refChurch: 11, kathChurch: 9 },
      { name: 'Beringen', bfs: 2931, rate: 102, refChurch: 12, kathChurch: 10 },
      { name: 'Hallau', bfs: 2951, rate: 110, refChurch: 15, kathChurch: 13 },
      { name: 'Wilchingen', bfs: 2973, rate: 105, refChurch: 13, kathChurch: 11 }, // BFS for merged Wilchingen
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate : Math.max(90, Math.min(115, muni.rate + Math.floor(Math.random() * 4) - 2));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(8, Math.min(18, muni.refChurch + Math.floor(Math.random() * 2) - 1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(7, Math.min(16, muni.kathChurch + Math.floor(Math.random() * 2) - 1));

        sampleSHData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER: kathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~26
      // Schaffhausen has ~26 municipalities. We have 7 major ones. Need ~19 more.
      const numPlaceholders = 26 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 2900 + i + 50 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `SH Municipality-${String(i + 1).padStart(2, '0')}`;
        const rate = Math.floor(Math.random() * (110 - 90 + 1) + 90); 
        const refChurchRate = Math.floor(Math.random() * (15 - 10 + 1) + 10);
        const kathChurchRate = Math.floor(Math.random() * (14 - 9 + 1) + 9);
        
        if (!sampleSHData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleSHData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_PROZENT: rate,
            KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: refChurchRate,
            KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER: kathChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleSHData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of SchaffhausenTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<SchaffhausenTaxRateRow[]> {
    this.logInfo(`Parsing Schaffhausen data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for SH simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as SchaffhausenTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed SH data is not an array as expected.');
      }

      const validatedData: SchaffhausenTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in SH data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for SH: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Schaffhausen-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: SchaffhausenTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Schaffhausen's "Steuerfuss" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Schaffhausen
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Schaffhausen uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Schaffhausen municipal tax rate (Steuerfuss in % des Kantonssteuerbetrags). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%.`,
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
        this.logError(`Error mapping SH item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from SH source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} SH items to ScrapedDataItem format.`);
      
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
async function runSchaffhausenCollection() {
  const shDataSource: DataSource = {
    source_id: 'canton_sh_tax_rates_simulated',
    name: 'Canton Schaffhausen Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://schaffhausen/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Schaffhausen tax rates (Steuerfuss).',
  };

  const collector = new SchaffhausenCollector(shDataSource);
  const result = await collector.collect();

  console.log("\n--- Schaffhausen Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runSchaffhausenCollection();
*/
