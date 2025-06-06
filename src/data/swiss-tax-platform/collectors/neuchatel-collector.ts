/**
 * src/data/swiss-tax-platform/collectors/neuchatel-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Neuchâtel (NE).
 * This collector handles Neuchâtel's "coefficient communal" system, where municipal
 * tax rates are percentages of the cantonal base tax.
 * Neuchâtel is a French-speaking canton with approximately 27 municipalities.
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

// Define the expected structure of a row parsed from Neuchâtel's data source
interface NeuchatelTaxRateRow {
  BFS_NR: number; // Official municipality number (Numéro OFS)
  COMMUNE_NOM: string; // Municipality name (Nom de la commune)
  ANNEE: number; // Tax year (Année fiscale)
  COEFFICIENT_COMMUNAL_POURCENT: number; // Municipal tax rate as a percentage (e.g., 65 for 65%)
  COEFF_CATH_ROMAIN_POURCENT?: number; // Roman Catholic church tax as %
  COEFF_REF_EVANG_POURCENT?: number; // Protestant church tax as %
  // Christian Catholic church tax is rare in NE, often covered by general Protestant.
}

export class NeuchatelCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`NeuchatelCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Neuchâtel.
   * Simulating fetching by returning a predefined JSON string with ~27 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Neuchâtel data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleNEData: NeuchatelTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Neuchâtel (coefficient communal in %)
    // BFS numbers are official. Rates are illustrative but realistic for Neuchâtel (moderate).
    const majorMunicipalities: { name: string, bfs: number, rate: number, cathChurch?: number, refChurch?: number }[] = [
      { name: 'Neuchâtel', bfs: 6421, rate: 65, cathChurch: 8, refChurch: 10 }, // Capital
      { name: 'La Chaux-de-Fonds', bfs: 6424, rate: 75, cathChurch: 9, refChurch: 11 },
      { name: 'Le Locle', bfs: 6425, rate: 78, cathChurch: 9, refChurch: 12 },
      { name: 'Val-de-Ruz', bfs: 6430, rate: 70, cathChurch: 8, refChurch: 10 }, // Merged municipality
      { name: 'Val-de-Travers', bfs: 6429, rate: 72, cathChurch: 8, refChurch: 11 }, // Merged municipality
      { name: 'Milvignes', bfs: 6428, rate: 60, cathChurch: 7, refChurch: 9 }, // Merged, often lower tax
      { name: 'Peseux', bfs: 6458, rate: 68, cathChurch: 8, refChurch: 10 }, // Now part of Neuchâtel, but historically distinct
      { name: 'Cortaillod', bfs: 6406, rate: 62, cathChurch: 7, refChurch: 9 },
      { name: 'Boudry', bfs: 6403, rate: 67, cathChurch: 8, refChurch: 10 },
      { name: 'Saint-Blaise', bfs: 6460, rate: 58, cathChurch: 6, refChurch: 8 }, // Known for lower rates
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        // Simulate slight year-over-year changes for the next year
        const rateForYear = year === currentYear ? muni.rate : Math.max(55, Math.min(85, muni.rate + Math.floor(Math.random() * 4) - 2));
        const cathChurchForYear = muni.cathChurch ? (year === currentYear ? muni.cathChurch : Math.max(5, Math.min(15, muni.cathChurch + Math.floor(Math.random() * 2) - 1))) : undefined;
        const refChurchForYear = muni.refChurch ? (year === currentYear ? muni.refChurch : Math.max(6, Math.min(16, muni.refChurch + Math.floor(Math.random() * 2) - 1))) : undefined;

        sampleNEData.push({
          BFS_NR: muni.bfs,
          COMMUNE_NOM: muni.name,
          ANNEE: year,
          COEFFICIENT_COMMUNAL_POURCENT: rateForYear,
          COEFF_CATH_ROMAIN_POURCENT: cathChurchForYear,
          COEFF_REF_EVANG_POURCENT: refChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~27
      // Neuchâtel has ~27 municipalities. We have 10 major ones. Need ~17 more.
      const numPlaceholders = 27 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 6400 + i + 35 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `Commune NE-${String(i + 1).padStart(2, '0')}`;
        // Realistic Neuchâtel rates often range from 55% to 80%
        const rate = Math.floor(Math.random() * (80 - 55 + 1) + 55); 
        const cathChurchRate = Math.floor(Math.random() * (12 - 6 + 1) + 6);
        const refChurchRate = Math.floor(Math.random() * (14 - 7 + 1) + 7);
        
        if (!sampleNEData.some(d => d.BFS_NR === bfsNr && d.ANNEE === year)) {
          sampleNEData.push({
            BFS_NR: bfsNr,
            COMMUNE_NOM: communeName,
            ANNEE: year,
            COEFFICIENT_COMMUNAL_POURCENT: rate,
            COEFF_CATH_ROMAIN_POURCENT: cathChurchRate,
            COEFF_REF_EVANG_POURCENT: refChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleNEData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of NeuchatelTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<NeuchatelTaxRateRow[]> {
    this.logInfo(`Parsing Neuchâtel data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for NE simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as NeuchatelTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed NE data is not an array as expected.');
      }

      const validatedData: NeuchatelTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.COMMUNE_NOM !== 'string' || row.COMMUNE_NOM.trim() === '' ||
            typeof row.ANNEE !== 'number' ||
            typeof row.COEFFICIENT_COMMUNAL_POURCENT !== 'number') {
          this.logWarn('Skipping invalid row in NE data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for NE: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Neuchâtel-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: NeuchatelTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Neuchâtel's "coefficient communal" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.COEFFICIENT_COMMUNAL_POURCENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Neuchâtel
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
          income_tax_rate_direct_percentage: null, // Neuchâtel uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Neuchâtel municipal tax rate (Coefficient communal en %). Original rate: ${item.COEFFICIENT_COMMUNAL_POURCENT}%.`,
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
        this.logError(`Error mapping NE item for BFS_NR ${item.BFS_NR}, Year ${item.ANNEE}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from NE source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} NE items to ScrapedDataItem format.`);
      
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
async function runNeuchatelCollection() {
  const neuchatelDataSource: DataSource = {
    source_id: 'canton_ne_tax_rates_simulated',
    name: 'Canton Neuchâtel Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://neuchatel/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Neuchâtel tax rates (coefficient communal).',
  };

  const collector = new NeuchatelCollector(neuchatelDataSource);
  const result = await collector.collect();

  console.log("\n--- Neuchâtel Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runNeuchatelCollection();
*/
