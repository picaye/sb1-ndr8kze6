/**
 * src/data/swiss-tax-platform/collectors/lucerne-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Lucerne.
 * This collector handles Lucerne's "Steuereinheit" system for municipal taxes,
 * where rates are multipliers of the cantonal base tax unit.
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

// Define the expected structure of a row parsed from Lucerne's data source
interface LucerneTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  STEUEREINHEIT_GEMEINDE: number; // Municipal tax unit (e.g., 1.75)
  KIRCHENSTEUER_REF_EINHEIT?: number; // Reformed church tax unit
  KIRCHENSTEUER_KATH_EINHEIT?: number; // Catholic church tax unit
  // Lucerne might also have Christkatholisch, often less common.
}

export class LucerneCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`LucerneCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Lucerne.
   * Simulating fetching by returning a predefined JSON string with ~83 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Lucerne data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleLucerneData: LucerneTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with known-ish rates for Lucerne (Steuereinheit)
    // BFS numbers are official. Rates are illustrative but realistic.
    const majorMunicipalities: { name: string, bfs: number, unit2024: number, unit2025: number, refChurch?: number, kathChurch?: number }[] = [
      { name: 'Luzern', bfs: 1061, unit2024: 1.75, unit2025: 1.75, refChurch: 0.20, kathChurch: 0.22 },
      { name: 'Emmen', bfs: 1024, unit2024: 1.95, unit2025: 1.95, refChurch: 0.22, kathChurch: 0.24 },
      { name: 'Kriens', bfs: 1059, unit2024: 1.80, unit2025: 1.80, refChurch: 0.21, kathChurch: 0.23 },
      { name: 'Horw', bfs: 1058, unit2024: 1.45, unit2025: 1.45, refChurch: 0.18, kathChurch: 0.20 },
      { name: 'Sursee', bfs: 1100, unit2024: 1.70, unit2025: 1.70, refChurch: 0.20, kathChurch: 0.21 },
      { name: 'Ebikon', bfs: 1023, unit2024: 1.85, unit2025: 1.85, refChurch: 0.21, kathChurch: 0.23 },
      { name: 'Hochdorf', bfs: 1030, unit2024: 1.90, unit2025: 1.90, refChurch: 0.22, kathChurch: 0.24 },
      { name: 'Willisau', bfs: 1108, unit2024: 1.85, unit2025: 1.85, refChurch: 0.21, kathChurch: 0.23 },
      { name: 'Ruswil', bfs: 1094, unit2024: 1.98, unit2025: 1.98, refChurch: 0.23, kathChurch: 0.25 },
      { name: 'Meggen', bfs: 1063, unit2024: 0.95, unit2025: 0.95, refChurch: 0.12, kathChurch: 0.14 }, // Known for low tax rates
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        // Simulate slight year-over-year changes for 2025
        const unitForYear = year === currentYear ? muni.unit2024 : parseFloat((muni.unit2025 + (Math.random() * 0.04 - 0.02)).toFixed(2));
        const refChurchForYear = year === currentYear ? muni.refChurch : parseFloat(((muni.refChurch || 0.20) + (Math.random() * 0.02 - 0.01)).toFixed(2));
        const kathChurchForYear = year === currentYear ? muni.kathChurch : parseFloat(((muni.kathChurch || 0.22) + (Math.random() * 0.02 - 0.01)).toFixed(2));

        sampleLucerneData.push({
          BFS_NR: muni.bfs,
          GEMEINDE_NAME: muni.name,
          STEUERJAHR: year,
          STEUEREINHEIT_GEMEINDE: unitForYear,
          KIRCHENSTEUER_REF_EINHEIT: refChurchForYear,
          KIRCHENSTEUER_KATH_EINHEIT: kathChurchForYear,
        });
      });

      // Generate placeholders for the remaining municipalities to reach ~83
      // Lucerne has around 80-83 municipalities. We have 10 major ones. Need ~73 more.
      const numPlaceholders = 83 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 1000 + i + (majorMunicipalities.length * yearsToGenerate.indexOf(year)) + 20; // Ensure unique BFS for placeholders
        const communeName = `LU Municipality-${String(i + 1).padStart(3, '0')}`;
        // Realistic Lucerne units often range from 1.5 to 2.2
        const unit = parseFloat((Math.random() * (2.2 - 1.5) + 1.5).toFixed(2)); 
        const refChurchUnit = parseFloat((Math.random() * (0.25 - 0.15) + 0.15).toFixed(2));
        const kathChurchUnit = parseFloat((Math.random() * (0.28 - 0.18) + 0.18).toFixed(2));
        
        if (!sampleLucerneData.some(d => d.BFS_NR === bfsNr && d.STEUERJAHR === year)) {
          sampleLucerneData.push({
            BFS_NR: bfsNr,
            GEMEINDE_NAME: communeName,
            STEUERJAHR: year,
            STEUEREINHEIT_GEMEINDE: unit,
            KIRCHENSTEUER_REF_EINHEIT: refChurchUnit,
            KIRCHENSTEUER_KATH_EINHEIT: kathChurchUnit,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleLucerneData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of LucerneTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<LucerneTaxRateRow[]> {
    this.logInfo(`Parsing Lucerne data (format hint: ${format}). Expecting JSON string of LucerneTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Lucerne simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as LucerneTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Lucerne data is not an array as expected.');
      }

      const validatedData: LucerneTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' || row.GEMEINDE_NAME.trim() === '' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.STEUEREINHEIT_GEMEINDE !== 'number') {
          this.logWarn('Skipping invalid row in Lucerne data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Lucerne: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Lucerne-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: LucerneTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Lucerne's "Steuereinheit" is the direct multiplier for income and wealth tax.
        const incomeTaxMultiplier = item.STEUEREINHEIT_GEMEINDE;
        const wealthTaxMultiplier = item.STEUEREINHEIT_GEMEINDE; // Typically the same for Lucerne

        const protestantChurchTax = item.KIRCHENSTEUER_REF_EINHEIT;
        const catholicChurchTax = item.KIRCHENSTEUER_KATH_EINHEIT;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Lucerne uses units/multipliers
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Assuming not separately listed or common for this simulation
          source_url: this.dataSource.url,
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Lucerne municipal tax rate (Steuereinheit). Original unit: ${item.STEUEREINHEIT_GEMEINDE}. Church tax also in units.`,
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
        this.logError(`Error mapping Lucerne item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Lucerne source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Lucerne items to ScrapedDataItem format.`);
      
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
async function runLucerneCollection() {
  const lucerneDataSource: DataSource = {
    source_id: 'canton_lu_tax_rates_simulated',
    name: 'Canton Lucerne Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://lucerne/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Lucerne tax rates (Steuereinheit).',
  };

  const collector = new LucerneCollector(lucerneDataSource);
  const result = await collector.collect();

  console.log("\n--- Lucerne Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runLucerneCollection();
*/
