/**
 * src/data/swiss-tax-platform/collectors/aargau-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Aargau.
 * This collector handles Aargau's "Steuerfuss" system, where municipal
 * tax rates are percentage multipliers.
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

// Define the expected structure of a row parsed from Aargau's data source
interface AargauTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_PROZENT: number; // Municipal tax rate as a percentage (e.g., 109 for 109%)
  REF_KIRCHENSTEUER_PROZENT?: number; // Reformed church tax as %
  KATH_KIRCHENSTEUER_PROZENT?: number; // Catholic church tax as %
  // Aargau might have other specific fields, this is a simplified model
}

export class AargauCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`AargauCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Aargau.
   * Simulating fetching by returning a predefined JSON string with ~210 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Aargau data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleAargauData: AargauTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; // Generate for current and next year

    // Major municipalities with known-ish rates for Aargau (Steuerfuss in %)
    const majorMunicipalities: { name: string, bfs: number, rate2024: number, rate2025: number, refChurch?: number, kathChurch?: number }[] = [
      { name: 'Aarau', bfs: 4001, rate2024: 109, rate2025: 109, refChurch: 18, kathChurch: 15 },
      { name: 'Baden', bfs: 4021, rate2024: 95, rate2025: 95, refChurch: 15, kathChurch: 14 },
      { name: 'Wettingen', bfs: 4040, rate2024: 90, rate2025: 90, refChurch: 16, kathChurch: 15 },
      { name: 'Rheinfelden', bfs: 4258, rate2024: 105, rate2025: 105, refChurch: 17, kathChurch: 16 },
      { name: 'Wohlen', bfs: 4081, rate2024: 115, rate2025: 115, refChurch: 18, kathChurch: 17 },
      { name: 'Brugg', bfs: 4095, rate2024: 107, rate2025: 107, refChurch: 16, kathChurch: 15 },
      { name: 'Zofingen', bfs: 4289, rate2024: 106, rate2025: 106, refChurch: 17, kathChurch: 15 },
      { name: 'Lenzburg', bfs: 4201, rate2024: 103, rate2025: 103, refChurch: 16, kathChurch: 14 },
      { name: 'Oftringen', bfs: 4280, rate2024: 112, rate2025: 112, refChurch: 18, kathChurch: 16 },
      { name: 'Spreitenbach', bfs: 4037, rate2024: 105, rate2025: 105, refChurch: 17, kathChurch: 16 },
      { name: 'Frick', bfs: 4165, rate2024: 98, rate2025: 98, refChurch: 15, kathChurch: 14 },
      { name: 'Suhr', bfs: 4012, rate2024: 108, rate2025: 108, refChurch: 17, kathChurch: 15 },
      { name: 'Möhlin', bfs: 4257, rate2024: 100, rate2025: 100, refChurch: 16, kathChurch: 15 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        sampleAargauData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_PROZENT: year === currentYear ? muni.rate2024 : muni.rate2025,
          REF_KIRCHENSTEUER_PROZENT: muni.refChurch,
          KATH_KIRCHENSTEUER_PROZENT: muni.kathChurch,
        });
      });

      // Generate ~190 more placeholder municipalities for Aargau to reach ~210 total
      // Aargau has around 200 municipalities, so we need about 200 - majorMunicipalities.length
      const numPlaceholders = 210 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        // Ensure unique BFS_NR for placeholders across years if needed, or just unique within the year
        const bfsNr = 4000 + i + 100 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `Aargau Municipality-${String(i + 1).padStart(3, '0')}`;
        // Realistic Aargau rates often range from 90% to 120%
        const rate = Math.floor(Math.random() * (120 - 90 + 1) + 90); 
        const refChurchRate = Math.floor(Math.random() * (20 - 10 + 1) + 10);
        const kathChurchRate = Math.floor(Math.random() * (18 - 10 + 1) + 10);
        
        if (!sampleAargauData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
            sampleAargauData.push({
                BFS_NR: bfsNr,
                GEMEINDE_NAME: communeName,
                STEUERJAHR: year,
                STEUERFUSS_PROZENT: rate,
                REF_KIRCHENSTEUER_PROZENT: refChurchRate,
                KATH_KIRCHENSTEUER_PROZENT: kathChurchRate,
            });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleAargauData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of AargauTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<AargauTaxRateRow[]> {
    this.logInfo(`Parsing Aargau data (format hint: ${format}). Expecting JSON string of AargauTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Aargau simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as AargauTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Aargau data is not an array as expected.');
      }

      const validatedData: AargauTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in Aargau data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Aargau: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Aargau-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: AargauTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        const incomeTaxMultiplier = item.STEUERFUSS_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Aargau
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.REF_KIRCHENSTEUER_PROZENT !== undefined ? item.REF_KIRCHENSTEUER_PROZENT / 100 : null;
        const catholicChurchTax = item.KATH_KIRCHENSTEUER_PROZENT !== undefined ? item.KATH_KIRCHENSTEUER_PROZENT / 100 : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Aargau uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not commonly separate in AG or covered by general Christian
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Aargau municipal tax rate (Steuerfuss in %). Original rate: ${item.STEUERFUSS_PROZENT}%.`,
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
        this.logError(`Error mapping Aargau item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Aargau source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Aargau items to ScrapedDataItem format.`);
      
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
async function runAargauCollection() {
  const aargauDataSource: DataSource = {
    source_id: 'canton_ag_tax_rates_simulated',
    name: 'Canton Aargau Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://aargau/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Aargau tax rates (Steuerfuss).',
  };

  const collector = new AargauCollector(aargauDataSource);
  const result = await collector.collect();

  console.log("\n--- Aargau Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runAargauCollection();
*/
