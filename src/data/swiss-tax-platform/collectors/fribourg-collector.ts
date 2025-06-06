/**
 * src/data/swiss-tax-platform/collectors/fribourg-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Fribourg (Freiburg).
 * This collector handles Fribourg's "coefficient communal" / "Gemeindesteuerfuss" system,
 * where municipal tax rates are percentages of the cantonal base tax.
 * Fribourg is a bilingual canton (French/German) with approximately 136 municipalities.
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

// Define the expected structure of a row parsed from Fribourg's data source
interface FribourgTaxRateRow {
  BFS_NR: number; // Official municipality number / Numéro OFS / BFS-Nummer
  NOM_COMMUNE_FR: string; // Municipality name in French
  GEMEINDE_NAME_DE: string; // Municipality name in German
  ANNEE: number; // Tax year / Année fiscale / Steuerjahr
  COEFFICIENT_COMMUNAL_POURCENT: number; // Municipal tax rate as a percentage (e.g., 83 for 83%)
  COEFF_CATH_ROMAIN_POURCENT?: number; // Roman Catholic church tax as %
  COEFF_REF_EVANG_POURCENT?: number; // Protestant church tax as %
}

export class FribourgCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`FribourgCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Fribourg.
   * Simulating fetching by returning a predefined JSON string with ~136 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Fribourg/Freiburg data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleFribourgData: FribourgTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Fribourg (coefficient communal in %)
    // BFS numbers are official. Rates are illustrative but realistic.
    const majorMunicipalities: { nameFr: string, nameDe: string, bfs: number, rate: number, cathChurch: number, refChurch: number }[] = [
      { nameFr: 'Fribourg', nameDe: 'Freiburg', bfs: 2196, rate: 83, cathChurch: 15, refChurch: 12 },
      { nameFr: 'Bulle', nameDe: 'Bulle', bfs: 2125, rate: 81, cathChurch: 14, refChurch: 11 },
      { nameFr: 'Villars-sur-Glâne', nameDe: 'Villars-sur-Glâne', bfs: 2231, rate: 75, cathChurch: 13, refChurch: 10 },
      { nameFr: 'Murten', nameDe: 'Morat', bfs: 2270, rate: 70, cathChurch: 12, refChurch: 15 }, // Murten is predominantly Protestant
      { nameFr: 'Estavayer', nameDe: 'Estavayer', bfs: 2171, rate: 85, cathChurch: 15, refChurch: 12 },
      { nameFr: 'Châtel-Saint-Denis', nameDe: 'Kastels Sankt Dionys', bfs: 2141, rate: 88, cathChurch: 16, refChurch: 13 },
      { nameFr: 'Düdingen', nameDe: 'Guin', bfs: 2252, rate: 80, cathChurch: 14, refChurch: 11 },
      { nameFr: 'Marly', nameDe: 'Marly', bfs: 2191, rate: 78, cathChurch: 13, refChurch: 10 },
      { nameFr: 'Romont (FR)', nameDe: 'Remund', bfs: 2206, rate: 82, cathChurch: 15, refChurch: 12 },
      { nameFr: 'Wünnewil-Flamatt', nameDe: 'Wünnewil-Flamatt', bfs: 2308, rate: 86, cathChurch: 15, refChurch: 12 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate : Math.max(65, Math.min(95, muni.rate + Math.floor(Math.random() * 5) - 2));
        const cathChurchForYear = year === currentYear ? muni.cathChurch : Math.max(10, Math.min(20, muni.cathChurch + Math.floor(Math.random() * 3) - 1));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(8, Math.min(18, muni.refChurch + Math.floor(Math.random() * 3) - 1));

        sampleFribourgData.push({
          BFS_NR: muni.bfs,
          NOM_COMMUNE_FR: muni.nameFr,
          GEMEINDE_NAME_DE: muni.nameDe,
          ANNEE: year,
          COEFFICIENT_COMMUNAL_POURCENT: rateForYear,
          COEFF_CATH_ROMAIN_POURCENT: cathChurchForYear,
          COEFF_REF_EVANG_POURCENT: refChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~136
      // Fribourg has ~126-136 municipalities. We have 10 major ones. Need ~116-126 more.
      const numPlaceholders = 126 - majorMunicipalities.length; 
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 2000 + i + (majorMunicipalities.length * yearsToGenerate.indexOf(year)) + 100; 
        const communeNameFr = `Commune FR-${String(i + 1).padStart(3, '0')}`;
        const communeNameDe = `Gemeinde FR-${String(i + 1).padStart(3, '0')}`;
        const rate = Math.floor(Math.random() * (90 - 70 + 1) + 70); 
        const cathChurchRate = Math.floor(Math.random() * (18 - 10 + 1) + 10);
        const refChurchRate = Math.floor(Math.random() * (16 - 8 + 1) + 8);
        
        if (!sampleFribourgData.some(d => d.BFS_NR === bfsNr && d.ANNEE === year)) {
          sampleFribourgData.push({
            BFS_NR: bfsNr,
            NOM_COMMUNE_FR: communeNameFr,
            GEMEINDE_NAME_DE: communeNameDe,
            ANNEE: year,
            COEFFICIENT_COMMUNAL_POURCENT: rate,
            COEFF_CATH_ROMAIN_POURCENT: cathChurchRate,
            COEFF_REF_EVANG_POURCENT: refChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleFribourgData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of FribourgTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<FribourgTaxRateRow[]> {
    this.logInfo(`Parsing Fribourg/Freiburg data (format hint: ${format}). Expecting JSON string of FribourgTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Fribourg simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as FribourgTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Fribourg data is not an array as expected.');
      }

      const validatedData: FribourgTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            (typeof row.NOM_COMMUNE_FR !== 'string' || row.NOM_COMMUNE_FR.trim() === '') ||
            (typeof row.GEMEINDE_NAME_DE !== 'string' || row.GEMEINDE_NAME_DE.trim() === '') ||
            typeof row.ANNEE !== 'number' ||
            typeof row.COEFFICIENT_COMMUNAL_POURCENT !== 'number') {
          this.logWarn('Skipping invalid row in Fribourg data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Fribourg: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Fribourg-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: FribourgTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Fribourg's "coefficient communal" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.COEFFICIENT_COMMUNAL_POURCENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Fribourg
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const catholicChurchTax = item.COEFF_CATH_ROMAIN_POURCENT !== undefined 
          ? item.COEFF_CATH_ROMAIN_POURCENT / 100 
          : null;
        const protestantChurchTax = item.COEFF_REF_EVANG_POURCENT !== undefined 
          ? item.COEFF_REF_EVANG_POURCENT / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.ANNEE}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.ANNEE,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Fribourg uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not separately listed or common
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Fribourg/Freiburg municipal tax rate (Coefficient communal / Gemeindesteuerfuss in %). FR: ${item.NOM_COMMUNE_FR}, DE: ${item.GEMEINDE_NAME_DE}. Original rate: ${item.COEFFICIENT_COMMUNAL_POURCENT}%.`,
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
        this.logError(`Error mapping Fribourg item for BFS_NR ${item.BFS_NR}, Year ${item.ANNEE}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Fribourg/Freiburg source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Fribourg/Freiburg items to ScrapedDataItem format.`);
      
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
async function runFribourgCollection() {
  const fribourgDataSource: DataSource = {
    source_id: 'canton_fr_tax_rates_simulated',
    name: 'Canton Fribourg/Freiburg Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://fribourg/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Fribourg/Freiburg tax rates (coefficient communal).',
  };

  const collector = new FribourgCollector(fribourgDataSource);
  const result = await collector.collect();

  console.log("\n--- Fribourg/Freiburg Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runFribourgCollection();
*/
