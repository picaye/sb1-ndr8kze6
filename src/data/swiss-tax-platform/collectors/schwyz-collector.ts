/**
 * src/data/swiss-tax-platform/collectors/schwyz-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Schwyz (SZ).
 * This collector handles Schwyz's "Steuerfuss in % des kantonalen Einheitssatzes" system.
 * Schwyz is a historic canton in Central Switzerland with approximately 30 municipalities.
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

// Define the expected structure of a row parsed from Schwyz's data source
interface SchwyzTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage (e.g., 130 for 130%)
  KIRCHENSTEUER_REF_PROZENT_EINHEITSSATZ?: number; // Reformed church tax as % of the cantonal unit rate
  KIRCHENSTEUER_KATH_PROZENT_EINHEITSSATZ?: number; // Catholic church tax as % of the cantonal unit rate
}

export class SchwyzCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`SchwyzCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Schwyz.
   * Simulating fetching by returning a predefined JSON string for its ~30 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Schwyz data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleSZData: SchwyzTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Schwyz (Steuerfuss in %)
    // BFS numbers are official. Rates are illustrative, reflecting Schwyz's moderate to low tax environment.
    const majorMunicipalities: { name: string, bfs: number, rate: number, refChurch: number, kathChurch: number }[] = [
      { name: 'Schwyz', bfs: 1305, rate: 130, refChurch: 10, kathChurch: 12 }, // Capital
      { name: 'Einsiedeln', bfs: 1301, rate: 180, refChurch: 12, kathChurch: 15 }, // Higher, pilgrimage site
      { name: 'Küssnacht (SZ)', bfs: 1302, rate: 90, refChurch: 7, kathChurch: 8 }, // Note: often referred to as Küssnacht am Rigi. Low tax.
      { name: 'Freienbach', bfs: 1321, rate: 75, refChurch: 6, kathChurch: 7 }, // Very low tax municipality
      { name: 'Wollerau', bfs: 1323, rate: 60, refChurch: 5, kathChurch: 6 }, // One of the lowest tax municipalities in CH
      { name: 'Arth', bfs: 1300, rate: 160, refChurch: 11, kathChurch: 14 },
      { name: 'Lachen', bfs: 1343, rate: 100, refChurch: 8, kathChurch: 9 },
      { name: 'Galgenen', bfs: 1342, rate: 110, refChurch: 9, kathChurch: 10 },
      { name: 'Ingenbohl', bfs: 1302, rate: 125, refChurch: 10, kathChurch: 11 }, // BFS for Küssnacht, Ingenbohl is 1365. Correcting.
    //   { name: 'Ingenbohl', bfs: 1365, rate: 125, refChurch: 10, kathChurch: 11 },
      { name: 'Muotathal', bfs: 1303, rate: 170, refChurch: 12, kathChurch: 14 },
      { name: 'Altendorf', bfs: 1320, rate: 85, refChurch: 7, kathChurch: 8 },
    ];
    // Correcting BFS for Ingenbohl
    const ingenbohlEntry = majorMunicipalities.find(m => m.name === 'Ingenbohl');
    if (ingenbohlEntry) ingenbohlEntry.bfs = 1365;


    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        // Simulate slight year-over-year changes for the next year
        const rateForYear = year === currentYear ? muni.rate : Math.max(55, Math.min(190, muni.rate + Math.floor(Math.random() * 5) - 2));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(4, Math.min(18, muni.refChurch + Math.floor(Math.random() * 2) - 1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(5, Math.min(19, muni.kathChurch + Math.floor(Math.random() * 2) - 1));

        sampleSZData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT_EINHEITSSATZ: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_EINHEITSSATZ: kathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~30
      // Schwyz has 30 municipalities. We have 11 major ones. Need ~19 more.
      const numPlaceholders = 30 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 1300 + i + 30 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `SZ Municipality-${String(i + 1).padStart(2, '0')}`;
        // Realistic Schwyz rates: 60% (Wollerau) to 180% (Einsiedeln)
        const rate = Math.floor(Math.random() * (180 - 60 + 1) + 60); 
        const refChurchRate = Math.floor(Math.random() * (15 - 5 + 1) + 5);
        const kathChurchRate = Math.floor(Math.random() * (17 - 6 + 1) + 6);
        
        if (!sampleSZData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleSZData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_PROZENT: rate,
            KIRCHENSTEUER_REF_PROZENT_EINHEITSSATZ: refChurchRate,
            KIRCHENSTEUER_KATH_PROZENT_EINHEITSSATZ: kathChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleSZData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of SchwyzTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<SchwyzTaxRateRow[]> {
    this.logInfo(`Parsing Schwyz data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for SZ simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as SchwyzTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed SZ data is not an array as expected.');
      }

      const validatedData: SchwyzTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in SZ data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for SZ: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Schwyz-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: SchwyzTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Schwyz's "Steuerfuss" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Schwyz
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_EINHEITSSATZ !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT_EINHEITSSATZ / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT_EINHEITSSATZ !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT_EINHEITSSATZ / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Schwyz uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Schwyz municipal tax rate (Steuerfuss in % des kantonalen Einheitssatzes). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%.`,
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
        this.logError(`Error mapping SZ item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from SZ source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} SZ items to ScrapedDataItem format.`);
      
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
async function runSchwyzCollection() {
  const schwyzDataSource: DataSource = {
    source_id: 'canton_sz_tax_rates_simulated',
    name: 'Canton Schwyz Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://schwyz/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Schwyz tax rates (Steuerfuss).',
  };

  const collector = new SchwyzCollector(schwyzDataSource);
  const result = await collector.collect();

  console.log("\n--- Schwyz Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runSchwyzCollection();
*/
