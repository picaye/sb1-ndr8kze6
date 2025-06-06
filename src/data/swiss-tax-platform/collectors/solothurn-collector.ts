/**
 * src/data/swiss-tax-platform/collectors/solothurn-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Solothurn.
 * This collector handles Solothurn's "Steuerfuss" system for municipal taxes,
 * where rates are percentage multipliers of the cantonal tax unit.
 * Solothurn has approximately 109 municipalities.
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

// Define the expected structure of a row parsed from Solothurn's data source
interface SolothurnTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage (e.g., 120 for 120%)
  KIRCHENSTEUER_REF_PROZENT?: number; // Reformed church tax as %
  KIRCHENSTEUER_KATH_PROZENT?: number; // Catholic church tax as %
  KIRCHENSTEUER_CHRISTKATH_PROZENT?: number; // Christian Catholic church tax as %
}

export class SolothurnCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`SolothurnCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Solothurn.
   * Simulating fetching by returning a predefined JSON string with ~109 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Solothurn data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleSolothurnData: SolothurnTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Solothurn (Steuerfuss in %)
    // BFS numbers are official. Rates are illustrative but realistic for Solothurn (moderate).
    const majorMunicipalities: { name: string, bfs: number, rate: number, refChurch: number, kathChurch: number, christKath?: number }[] = [
      { name: 'Solothurn', bfs: 2601, rate: 120, refChurch: 18, kathChurch: 18, christKath: 20 },
      { name: 'Olten', bfs: 2581, rate: 118, refChurch: 17, kathChurch: 17, christKath: 19 },
      { name: 'Grenchen', bfs: 2517, rate: 128, refChurch: 20, kathChurch: 20, christKath: 22 },
      { name: 'Zuchwil', bfs: 2607, rate: 122, refChurch: 18, kathChurch: 18, christKath: 20 },
      { name: 'Biberist', bfs: 2441, rate: 125, refChurch: 19, kathChurch: 19, christKath: 21 },
      { name: 'Dornach', bfs: 2473, rate: 105, refChurch: 15, kathChurch: 15, christKath: 18 }, // Often lower due to proximity to Basel
      { name: 'Balsthal', bfs: 2421, rate: 130, refChurch: 20, kathChurch: 20, christKath: 22 },
      { name: 'Derendingen', bfs: 2543, rate: 124, refChurch: 18, kathChurch: 18, christKath: 20 },
      { name: 'Trimbach', bfs: 2588, rate: 126, refChurch: 19, kathChurch: 19, christKath: 21 },
      { name: 'Bellach', bfs: 2511, rate: 115, refChurch: 16, kathChurch: 16, christKath: 18 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate : Math.max(100, Math.min(140, muni.rate + Math.floor(Math.random() * 6) - 3));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(10, Math.min(25, muni.refChurch + Math.floor(Math.random() * 3) - 1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(10, Math.min(25, muni.kathChurch + Math.floor(Math.random() * 3) - 1));
        const christKathForYear = muni.christKath ? (year === currentYear ? muni.christKath : Math.max(12, Math.min(28, muni.christKath + Math.floor(Math.random() * 3) - 1))) : undefined;

        sampleSolothurnData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT: kathChurchForYear,
          KIRCHENSTEUER_CHRISTKATH_PROZENT: christKathForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~109
      // Solothurn has ~109 municipalities. We have 10 major ones. Need ~99 more.
      const numPlaceholders = 109 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 2400 + i + (majorMunicipalities.length * yearsToGenerate.indexOf(year)) + 20; 
        const communeName = `SO Municipality-${String(i + 1).padStart(3, '0')}`;
        const rate = Math.floor(Math.random() * (135 - 100 + 1) + 100); // Random rate between 100% and 135%
        const refChurchRate = Math.floor(Math.random() * (22 - 15 + 1) + 15);
        const kathChurchRate = Math.floor(Math.random() * (22 - 15 + 1) + 15);
        const christKathRate = Math.floor(Math.random() * (25 - 18 + 1) + 18);
        
        if (!sampleSolothurnData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleSolothurnData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_PROZENT: rate,
            KIRCHENSTEUER_REF_PROZENT: refChurchRate,
            KIRCHENSTEUER_KATH_PROZENT: kathChurchRate,
            KIRCHENSTEUER_CHRISTKATH_PROZENT: christKathRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleSolothurnData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of SolothurnTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<SolothurnTaxRateRow[]> {
    this.logInfo(`Parsing Solothurn data (format hint: ${format}). Expecting JSON string of SolothurnTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Solothurn simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as SolothurnTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Solothurn data is not an array as expected.');
      }

      const validatedData: SolothurnTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in Solothurn data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Solothurn: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Solothurn-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: SolothurnTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Solothurn's "Steuerfuss" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Solothurn
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT / 100 
          : null;
        const christianCatholicChurchTax = item.KIRCHENSTEUER_CHRISTKATH_PROZENT !== undefined 
          ? item.KIRCHENSTEUER_CHRISTKATH_PROZENT / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Solothurn uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: christianCatholicChurchTax,
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Solothurn municipal tax rate (Steuerfuss in %). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%.`,
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
        this.logError(`Error mapping Solothurn item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Solothurn source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Solothurn items to ScrapedDataItem format.`);
      
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
async function runSolothurnCollection() {
  const solothurnDataSource: DataSource = {
    source_id: 'canton_so_tax_rates_simulated',
    name: 'Canton Solothurn Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://solothurn/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Solothurn tax rates (Steuerfuss).',
  };

  const collector = new SolothurnCollector(solothurnDataSource);
  const result = await collector.collect();

  console.log("\n--- Solothurn Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runSolothurnCollection();
*/
