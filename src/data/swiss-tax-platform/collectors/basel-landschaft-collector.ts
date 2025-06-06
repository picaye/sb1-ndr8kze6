/**
 * src/data/swiss-tax-platform/collectors/basel-landschaft-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Basel-Landschaft (BL).
 * This collector handles BL's "Steuerfuss in % des Staatssteuerbetrags" system,
 * where municipal tax rates are percentages of the cantonal tax amount.
 * Basel-Landschaft has approximately 86 municipalities.
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

// Define the expected structure of a row parsed from Basel-Landschaft's data source
interface BaselLandschaftTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage of cantonal tax (e.g., 60 for 60%)
  KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER?: number; // Reformed church tax as % of cantonal tax
  KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER?: number; // Catholic church tax as % of cantonal tax
  KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER?: number; // Christian Catholic church tax as % of cantonal tax
}

export class BaselLandschaftCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`BaselLandschaftCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Basel-Landschaft.
   * Simulating fetching by returning a predefined JSON string with ~86 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Basel-Landschaft data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleBLData: BaselLandschaftTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Basel-Landschaft (Steuerfuss in % of cantonal tax)
    // Rates are illustrative, reflecting BL's generally lower tax environment.
    // BFS numbers are official and unique per municipality.
    const majorMunicipalities: { name: string, bfs: number, rate: number, refChurch?: number, kathChurch?: number, christKathChurch?: number }[] = [
      { name: 'Liestal', bfs: 2829, rate: 62, refChurch: 5, kathChurch: 4, christKathChurch: 6 }, // Cantonal capital
      { name: 'Allschwil', bfs: 2761, rate: 60, refChurch: 5, kathChurch: 4 },
      { name: 'Reinach (BL)', bfs: 2830, rate: 56, refChurch: 4.5, kathChurch: 3.5 },
      { name: 'Muttenz', bfs: 2828, rate: 55, refChurch: 5, kathChurch: 4 },
      { name: 'Pratteln', bfs: 2831, rate: 60, refChurch: 5.5, kathChurch: 4.5 },
      { name: 'Binningen', bfs: 2762, rate: 48, refChurch: 4, kathChurch: 3 }, // Known for very low rates
      { name: 'Münchenstein', bfs: 2827, rate: 58, refChurch: 5, kathChurch: 4 },
      { name: 'Oberwil (BL)', bfs: 2836, rate: 50, refChurch: 4, kathChurch: 3 }, // Corrected BFS
      { name: 'Aesch (BL)', bfs: 2763, rate: 57, refChurch: 5, kathChurch: 4 }, // Corrected BFS (Aesch is 2763, not 2762 which is Binningen)
      { name: 'Sissach', bfs: 2861, rate: 65, refChurch: 6, kathChurch: 5 },
      { name: 'Laufen', bfs: 2787, rate: 63, refChurch: 5.5, kathChurch: 4.5 },
      { name: 'Waldenburg', bfs: 2864, rate: 68, refChurch: 6, kathChurch: 5 },
      { name: 'Birsfelden', bfs: 2766, rate: 61, refChurch: 5, kathChurch: 4 },
      { name: 'Therwil', bfs: 2832, rate: 52, refChurch: 4.5, kathChurch: 3.5 },
      { name: 'Bottmingen', bfs: 2764, rate: 49, refChurch: 4, kathChurch: 3 }, // Corrected BFS (Bottmingen is 2764)
    ];


    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate : Math.max(45, Math.min(75, muni.rate + Math.floor(Math.random() * 4) - 2)); // Simulate slight changes
        const refChurchForYear = muni.refChurch ? (year === currentYear ? muni.refChurch : Math.max(3, Math.min(7, muni.refChurch + (Math.random() * 1 - 0.5)))) : undefined;
        const kathChurchForYear = muni.kathChurch ? (year === currentYear ? muni.kathChurch : Math.max(2.5, Math.min(6.5, muni.kathChurch + (Math.random() * 1 - 0.5)))) : undefined;
        const christKathChurchForYear = muni.christKathChurch ? (year === currentYear ? muni.christKathChurch : Math.max(4, Math.min(8, muni.christKathChurch + (Math.random() * 1 - 0.5)))) : undefined;

        sampleBLData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER: kathChurchForYear,
          KIRCHENSTEUER_CHRISTKATH_PROZENT_STAATSSTEUER: christKathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~86
      // BL has ~86 municipalities. We have 15 major ones. Need ~71 more.
      const numPlaceholders = 86 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 2700 + i + (majorMunicipalities.length * yearsToGenerate.indexOf(year)) + 50; 
        const communeName = `BL Municipality-${String(i + 1).padStart(3, '0')}`;
        const rate = Math.floor(Math.random() * (70 - 45 + 1) + 45); // Random rate between 45% and 70%
        const refChurchRate = Math.floor(Math.random() * (6 - 3 + 1) + 3);
        const kathChurchRate = Math.floor(Math.random() * (5 - 2 + 1) + 2);
        
        if (!sampleBLData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleBLData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_PROZENT: rate,
            KIRCHENSTEUER_REF_PROZENT_STAATSSTEUER: refChurchRate,
            KIRCHENSTEUER_KATH_PROZENT_STAATSSTEUER: kathChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleBLData);
  }

  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<BaselLandschaftTaxRateRow[]> {
    this.logInfo(`Parsing Basel-Landschaft data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for BL simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as BaselLandschaftTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed BL data is not an array as expected.');
      }

      const validatedData: BaselLandschaftTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in BL data:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for BL: ${error.message}`, error);
    }
  }

  protected mapToScrapedDataItems(parsedItems: BaselLandschaftTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // BL's "Steuerfuss" is a percentage of the cantonal tax amount.
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for BL.
        const wealthTaxMultiplier = incomeTaxMultiplier; 

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
          income_tax_rate_direct_percentage: null, // BL uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: christianCatholicChurchTax,
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Basel-Landschaft municipal tax rate (Steuerfuss in % des Staatssteuerbetrags). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%.`,
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
        this.logError(`Error mapping BL item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from BL source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} BL items to ScrapedDataItem format.`);
      
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
async function runBaselLandschaftCollection() {
  const blDataSource: DataSource = {
    source_id: 'canton_bl_tax_rates_simulated',
    name: 'Canton Basel-Landschaft Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://basel-landschaft/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Basel-Landschaft tax rates (Steuerfuss % des Staatssteuerbetrags).',
  };

  const collector = new BaselLandschaftCollector(blDataSource);
  const result = await collector.collect();

  console.log("\n--- Basel-Landschaft Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runBaselLandschaftCollection();
*/
