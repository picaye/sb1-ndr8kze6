/**
 * src/data/swiss-tax-platform/collectors/jura-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Jura (JU).
 * This collector handles Jura's "quotité communale" system, where municipal
 * tax rates are typically expressed as percentages or coefficients applied to
 * the cantonal base tax. Jura is a French-speaking canton with approximately 53 municipalities.
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

// Define the expected structure of a row parsed from Jura's data source
interface JuraTaxRateRow {
  BFS_NR: number; // Official municipality number (Numéro OFS)
  COMMUNE_NOM: string; // Municipality name (Nom de la commune)
  ANNEE: number; // Tax year (Année fiscale)
  QUOTITE_COMMUNALE_POURCENT: number; // Municipal tax rate as a percentage (e.g., 190 for 190%)
  QUOTITE_CATH_ROMAIN_POURCENT?: number; // Roman Catholic church tax as %
  QUOTITE_REF_EVANG_POURCENT?: number; // Protestant church tax as %
}

export class JuraCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`JuraCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Jura.
   * Simulating fetching by returning a predefined JSON string with ~53 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Jura data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleJUData: JuraTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Jura (quotité communale in %)
    // BFS numbers are official. Rates are illustrative but realistic for Jura (tend to be higher).
    const majorMunicipalities: { name: string, bfs: number, rate: number, cathChurch: number, refChurch: number }[] = [
      { name: 'Delémont', bfs: 6706, rate: 190, cathChurch: 15, refChurch: 10 }, // Capital
      { name: 'Porrentruy', bfs: 6721, rate: 195, cathChurch: 16, refChurch: 11 },
      { name: 'Haute-Sorne', bfs: 6809, rate: 185, cathChurch: 14, refChurch: 9 }, // Merged municipality
      { name: 'Saignelégier', bfs: 6757, rate: 180, cathChurch: 13, refChurch: 8 },
      { name: 'Courroux', bfs: 6705, rate: 188, cathChurch: 15, refChurch: 10 },
      { name: 'Val Terbi', bfs: 6810, rate: 192, cathChurch: 16, refChurch: 11 }, // Merged municipality
      { name: 'Courtételle', bfs: 6704, rate: 187, cathChurch: 14, refChurch: 9 },
      { name: 'Clos du Doubs', bfs: 6808, rate: 193, cathChurch: 16, refChurch: 11 },
      { name: 'Les Bois', bfs: 6742, rate: 175, cathChurch: 12, refChurch: 7 },
      { name: 'Courrendlin', bfs: 6703, rate: 186, cathChurch: 14, refChurch: 9 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        // Simulate slight year-over-year changes for the next year
        const rateForYear = year === currentYear ? muni.rate : Math.max(170, Math.min(210, muni.rate + Math.floor(Math.random() * 6) - 3));
        const cathChurchForYear = year === currentYear ? muni.cathChurch : Math.max(10, Math.min(20, muni.cathChurch + Math.floor(Math.random() * 3) - 1));
        const refChurchForYear = year === currentYear ? muni.refChurch : Math.max(7, Math.min(15, muni.refChurch + Math.floor(Math.random() * 2) - 1));

        sampleJUData.push({
          BFS_NR: muni.bfs,
          COMMUNE_NOM: muni.name,
          ANNEE: year,
          QUOTITE_COMMUNALE_POURCENT: rateForYear,
          QUOTITE_CATH_ROMAIN_POURCENT: cathChurchForYear,
          QUOTITE_REF_EVANG_POURCENT: refChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~53
      // Jura has ~53 municipalities. We have 10 major ones. Need ~43 more.
      const numPlaceholders = 53 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 6700 + i + 30 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); 
        const communeName = `Commune JU-${String(i + 1).padStart(2, '0')}`;
        // Realistic Jura rates often range from 170% to 200%
        const rate = Math.floor(Math.random() * (200 - 170 + 1) + 170); 
        const cathChurchRate = Math.floor(Math.random() * (18 - 12 + 1) + 12);
        const refChurchRate = Math.floor(Math.random() * (14 - 8 + 1) + 8);
        
        if (!sampleJUData.some(d => d.BFS_NR === bfsNr && d.ANNEE === year)) {
          sampleJUData.push({
            BFS_NR: bfsNr,
            COMMUNE_NOM: communeName,
            ANNEE: year,
            QUOTITE_COMMUNALE_POURCENT: rate,
            QUOTITE_CATH_ROMAIN_POURCENT: cathChurchRate,
            QUOTITE_REF_EVANG_POURCENT: refChurchRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleJUData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of JuraTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<JuraTaxRateRow[]> {
    this.logInfo(`Parsing Jura data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for JU simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as JuraTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed JU data is not an array as expected.');
      }

      const validatedData: JuraTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.COMMUNE_NOM !== 'string' || row.COMMUNE_NOM.trim() === '' ||
            typeof row.ANNEE !== 'number' ||
            typeof row.QUOTITE_COMMUNALE_POURCENT !== 'number') {
          this.logWarn('Skipping invalid row in JU data due to missing core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for JU: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Jura-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: JuraTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Jura's "quotité communale" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.QUOTITE_COMMUNALE_POURCENT / 100;
        // Assume wealth tax multiplier is the same as income tax for Jura
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const catholicChurchTax = item.QUOTITE_CATH_ROMAIN_POURCENT !== undefined 
          ? item.QUOTITE_CATH_ROMAIN_POURCENT / 100 
          : null;
        const protestantChurchTax = item.QUOTITE_REF_EVANG_POURCENT !== undefined 
          ? item.QUOTITE_REF_EVANG_POURCENT / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.ANNEE}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.ANNEE,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Jura uses multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Jura municipal tax rate (Quotité communale en %). Original rate: ${item.QUOTITE_COMMUNALE_POURCENT}%.`,
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
        this.logError(`Error mapping JU item for BFS_NR ${item.BFS_NR}, Year ${item.ANNEE}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from JU source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} JU items to ScrapedDataItem format.`);
      
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
async function runJuraCollection() {
  const juraDataSource: DataSource = {
    source_id: 'canton_ju_tax_rates_simulated',
    name: 'Canton Jura Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://jura/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Jura tax rates (quotité communale).',
  };

  const collector = new JuraCollector(juraDataSource);
  const result = await collector.collect();

  console.log("\n--- Jura Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runJuraCollection();
*/
