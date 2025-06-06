/**
 * src/data/swiss-tax-platform/collectors/graubuenden-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Graubünden (GR).
 * This collector handles Graubünden's "Steuerfuss in % des Kantonssteuerbetrags" system.
 * Graubünden is trilingual (German, Italian, Romansh) with approximately 101 municipalities.
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

// Define the expected structure of a row parsed from Graubünden's data source
interface GraubuendenTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME_DE: string; // Municipality name in German
  GEMEINDE_NAME_IT?: string; // Municipality name in Italian (for Italian-speaking regions)
  GEMEINDE_NAME_RM?: string; // Municipality name in Romansh (for Romansh-speaking regions)
  STEUERJAHR: number; // Tax year
  STEUERFUSS_GEMEINDE_PROZENT: number; // Municipal tax rate as a percentage (e.g., 105 for 105%)
  KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER?: number; // Reformed church tax as % of cantonal tax
  KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER?: number; // Catholic church tax as % of cantonal tax
}

export class GraubuendenCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`GraubuendenCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Graubünden.
   * Simulating fetching by returning a predefined JSON string for ~101 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Graubünden data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleGRData: GraubuendenTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Graubünden (Steuerfuss in %)
    // BFS numbers are official. Rates reflect tourism impact (lower) vs regular municipalities.
    const majorMunicipalities: { nameDe: string, nameIt?: string, nameRm?: string, bfs: number, rate: number, refChurch: number, kathChurch: number }[] = [
      { nameDe: 'Chur', bfs: 3901, rate: 105, refChurch: 15, kathChurch: 13 }, // Capital
      { nameDe: 'Davos', bfs: 3871, rate: 80, refChurch: 10, kathChurch: 8 }, // Tourism resort
      { nameDe: 'St. Moritz', bfs: 3785, rate: 70, refChurch: 8, kathChurch: 6 }, // Luxury tourism
      { nameDe: 'Domat/Ems', bfs: 3722, rate: 100, refChurch: 14, kathChurch: 12 },
      { nameDe: 'Landquart', bfs: 3951, rate: 95, refChurch: 13, kathChurch: 11 },
      { nameDe: 'Klosters-Serneus', nameDe: 'Klosters', bfs: 3861, rate: 85, refChurch: 11, kathChurch: 9 }, // Tourism
      { nameDe: 'Arosa', bfs: 3506, rate: 75, refChurch: 9, kathChurch: 7 }, // Tourism resort
      { nameDe: 'Pontresina', bfs: 3784, rate: 78, refChurch: 9, kathChurch: 7 }, // Tourism
      { nameDe: 'Flims', bfs: 3982, rate: 82, refChurch: 10, kathChurch: 8 }, // Tourism
      { nameDe: 'Laax', bfs: 3983, rate: 80, refChurch: 10, kathChurch: 8 }, // Tourism
      // Italian-speaking region examples
      { nameDe: 'Poschiavo', nameIt: 'Poschiavo', bfs: 3551, rate: 110, refChurch: 16, kathChurch: 14 },
      { nameDe: 'Brusio', nameIt: 'Brusio', bfs: 3561, rate: 108, refChurch: 15, kathChurch: 13 },
      // Romansh-speaking region examples  
      { nameDe: 'Scuol', nameRm: 'Scuol', bfs: 3762, rate: 88, refChurch: 12, kathChurch: 10 },
      { nameDe: 'Zernez', nameRm: 'Zernez', bfs: 3752, rate: 90, refChurch: 12, kathChurch: 10 },
      { nameDe: 'Ilanz/Glion', nameRm: 'Glion', bfs: 3619, rate: 92, refChurch: 13, kathChurch: 11 }, // Merged municipality, Romansh influence
      { nameDe: 'Disentis/Mustér', nameRm: 'Mustér', bfs: 3631, rate: 95, refChurch: 13, kathChurch: 11 },
      { nameDe: 'Samedan', nameRm: 'Samedan', bfs: 3786, rate: 72, refChurch: 8, kathChurch: 6 }, // Engadine tourism
      { nameDe: 'Zuoz', nameRm: 'Zuoz', bfs: 3790, rate: 75, refChurch: 9, kathChurch: 7 }, // Engadine tourism
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate : Math.max(65, Math.min(120, muni.rate + Math.floor(Math.random() * 5) - 2));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(6, Math.min(20, muni.refChurch + Math.floor(Math.random() * 3) - 1));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : Math.max(5, Math.min(18, muni.kathChurch + Math.floor(Math.random() * 3) - 1));

        sampleGRData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME_DE: muni.nameDe,
          GEMEINDE_NAME_IT: muni.nameIt,
          GEMEINDE_NAME_RM: muni.nameRm,
          STEUERJAHR: year,
          STEUERFUSS_GEMEINDE_PROZENT: rateForYear,
          KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: refChurchForYear,
          KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER: kathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~101
      // Graubünden has ~101 municipalities. We have 18 major ones. Need ~83 more.
      const numPlaceholders = 101 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 3400 + i + 100 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)) + 50; // Ensure unique BFS for placeholders
        const communeNameDe = `GR Municipality-${String(i + 1).padStart(3, '0')}`;
        // Mix of tourism (lower rates) and regular (higher rates) municipalities
        const isTourism = Math.random() < 0.3; // 30% tourism municipalities
        const rate = isTourism ? 
          Math.floor(Math.random() * (90 - 70 + 1) + 70) : // Tourism: 70-90%
          Math.floor(Math.random() * (115 - 95 + 1) + 95); // Regular: 95-115%
        const refChurchRate = Math.floor(Math.random() * (16 - 9 + 1) + 9);
        const kathChurchRate = Math.floor(Math.random() * (15 - 8 + 1) + 8);
        
        if (!sampleGRData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleGRData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME_DE: communeNameDe,
            STEUERJAHR: year,
            STEUERFUSS_GEMEINDE_PROZENT: rate,
            KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER: refChurchRate,
            KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER: kathChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleGRData);
  }

  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<GraubuendenTaxRateRow[]> {
    this.logInfo(`Parsing Graubünden data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for GR simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as GraubuendenTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed GR data is not an array as expected.');
      }

      const validatedData: GraubuendenTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME_DE !== 'string' || row.GEMEINDE_NAME_DE.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUERFUSS_GEMEINDE_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row in GR data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for GR: ${error.message}`, error);
    }
  }

  protected mapToScrapedDataItems(parsedItems: GraubuendenTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        const incomeTaxMultiplier = item.STEUERFUSS_GEMEINDE_PROZENT / 100;
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const protestantChurchTax = item.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_REF_PROZENT_KANTONSSTEUER / 100 
          : null;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER !== undefined 
          ? item.KIRCHENSTEUER_KATH_PROZENT_KANTONSSTEUER / 100 
          : null;

        // Build multilingual name string for notes
        let nameDisplay = item.GEMEINDE_NAME_DE;
        if (item.GEMEINDE_NAME_IT) nameDisplay += ` / ${item.GEMEINDE_NAME_IT}`;
        if (item.GEMEINDE_NAME_RM) nameDisplay += ` / ${item.GEMEINDE_NAME_RM}`;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Graubünden uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not commonly separate
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Graubünden municipality (${nameDisplay}). Original rate: ${item.STEUERFUSS_GEMEINDE_PROZENT}%.`,
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
        this.logError(`Error mapping GR item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from GR source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} GR items to ScrapedDataItem format.`);
      
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
async function runGraubuendenCollection() {
  const grDataSource: DataSource = {
    source_id: 'canton_gr_tax_rates_simulated',
    name: 'Canton Graubünden Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://graubuenden/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Graubünden tax rates (Steuerfuss).',
  };

  const collector = new GraubuendenCollector(grDataSource);
  const result = await collector.collect();

  console.log("\n--- Graubünden Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runGraubuendenCollection();
*/
