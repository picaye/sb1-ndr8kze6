/**
 * src/data/swiss-tax-platform/collectors/thurgau-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Thurgau.
 * This collector handles Thurgau's "Gemeindesteuerfuss (Total in % der einfachen Steuer)" system,
 * where municipal tax rates are percentages of the simple cantonal tax unit.
 * Thurgau has approximately 80 municipalities.
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

// Define the expected structure of a row parsed from Thurgau's data source
interface ThurgauTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_TOTAL_PROZENT: number; // Municipal tax rate as a total percentage (e.g., 163 for 163%)
  REF_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER?: number; // Reformed church tax as % of the simple cantonal tax unit
  KATH_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER?: number; // Catholic church tax as % of the simple cantonal tax unit
}

export class ThurgauCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`ThurgauCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Thurgau.
   * Simulating fetching by returning a predefined JSON string with ~80 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Thurgau data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleThurgauData: ThurgauTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Thurgau (Steuerfuss in % der einfachen Steuer)
    // BFS numbers are official. Rates are illustrative but realistic for Thurgau (moderate).
    const majorMunicipalities: { name: string, bfs: number, rate: number, refChurch: number, kathChurch: number }[] = [
      { name: 'Frauenfeld', bfs: 4566, rate: 163, refChurch: 22, kathChurch: 20 },
      { name: 'Kreuzlingen', bfs: 4666, rate: 168, refChurch: 20, kathChurch: 18 }, // BFS for Kreuzlingen is 4666
      { name: 'Arbon', bfs: 4401, rate: 173, refChurch: 23, kathChurch: 21 },
      { name: 'Weinfelden', bfs: 4946, rate: 155, refChurch: 19, kathChurch: 17 }, // BFS for Weinfelden is 4946
      { name: 'Amriswil', bfs: 4461, rate: 160, refChurch: 21, kathChurch: 19 },
      { name: 'Romanshorn', bfs: 4846, rate: 165, refChurch: 20, kathChurch: 18 },
      { name: 'Sirnach', bfs: 4751, rate: 170, refChurch: 22, kathChurch: 20 }, // BFS for Sirnach is 4751
      { name: 'Aadorf', bfs: 4551, rate: 158, refChurch: 20, kathChurch: 18 },
      { name: 'Münchwilen (TG)', bfs: 4736, rate: 150, refChurch: 18, kathChurch: 16 },
      { name: 'Bischofszell', bfs: 4471, rate: 172, refChurch: 23, kathChurch: 21 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        // Simulate slight year-over-year changes for the next year
        const rateForYear = year === currentYear ? muni.rate : Math.max(140, Math.min(190, muni.rate + Math.floor(Math.random() * 6) - 3));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(15, Math.min(28, muni.refChurch + Math.floor(Math.random() * 3) - 1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(14, Math.min(26, muni.kathChurch + Math.floor(Math.random() * 3) - 1));

        sampleThurgauData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_TOTAL_PROZENT: rateForYear,
          REF_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER: refChurchForYear,
          KATH_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER: kathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~80
      // Thurgau has ~80 municipalities. We have 10 major ones. Need ~70 more.
      const numPlaceholders = 80 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 4400 + i + 100 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `TG Municipality-${String(i + 1).padStart(3, '0')}`;
        // Realistic Thurgau rates often range from 150% to 180%
        const rate = Math.floor(Math.random() * (180 - 150 + 1) + 150); 
        const refChurchRate = Math.floor(Math.random() * (25 - 18 + 1) + 18);
        const kathChurchRate = Math.floor(Math.random() * (23 - 16 + 1) + 16);
        
        if (!sampleThurgauData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleThurgauData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_TOTAL_PROZENT: rate,
            REF_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER: refChurchRate,
            KATH_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER: kathChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleThurgauData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of ThurgauTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<ThurgauTaxRateRow[]> {
    this.logInfo(`Parsing Thurgau data (format hint: ${format}). Expecting JSON string of ThurgauTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Thurgau simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as ThurgauTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Thurgau data is not an array as expected.');
      }

      const validatedData: ThurgauTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_TOTAL_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in Thurgau data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Thurgau: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Thurgau-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: ThurgauTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Thurgau's "Steuerfuss" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_TOTAL_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Thurgau
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.REF_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER !== undefined 
          ? item.REF_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER / 100 
          : null;
        const catholicChurchTax = item.KATH_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER !== undefined 
          ? item.KATH_KIRCHENSTEUER_PROZENT_EINFACHE_STAATSSTEUER / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Thurgau uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not separately listed or common
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Thurgau municipal tax rate (Gesamtsteuerfuss Gemeinde in % der einfachen Steuer). Original rate: ${item.STEUERFUSS_GEMEINDE_TOTAL_PROZENT}%. Church tax is % of simple cantonal tax.`,
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
        this.logError(`Error mapping Thurgau item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Thurgau source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Thurgau items to ScrapedDataItem format.`);
      
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
async function runThurgauCollection() {
  const thurgauDataSource: DataSource = {
    source_id: 'canton_tg_tax_rates_simulated',
    name: 'Canton Thurgau Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://thurgau/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Thurgau tax rates (Gesamtsteuerfuss Gemeinde).',
  };

  const collector = new ThurgauCollector(thurgauDataSource);
  const result = await collector.collect();

  console.log("\n--- Thurgau Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runThurgauCollection();
*/
