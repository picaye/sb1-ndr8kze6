/**
 * src/data/swiss-tax-platform/collectors/zurich-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Zürich.
 * This collector is responsible for fetching, parsing, and standardizing
 * municipal tax rate data from Canton Zürich's specific data sources.
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

// Define the expected structure of a row parsed from Zürich's data source (e.g., an Excel file)
interface ZurichTaxRateRow {
  BFS_NR: number; // Official municipality number
  GEMEINDE_NAME: string; // Municipality name
  STEUERJAHR: number; // Tax year
  POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: number; // e.g., 119 for 119%
  REF_KIRCHENSTEUERFUSS_PROZENT?: number; // Reformed church tax rate %
  KATH_KIRCHENSTEUERFUSS_PROZENT?: number; // Catholic church tax rate %
  CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT?: number; // Christian Catholic church tax rate %
  // Potentially other fields like wealth tax multipliers if provided separately
}

export class ZurichCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'json_api'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`ZurichCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Zürich.
   * This might involve downloading an Excel/CSV file or calling a specific API endpoint.
   * For this example, we'll simulate fetching by returning a predefined JSON string
   * representing the content of such a file.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Zürich data from: ${this.dataSource.url}`);
    await this.applyRateLimiting(); // Ensure rate limiting is applied

    // In a real scenario, this would be an actual fetch call:
    // const response = await fetch(this.dataSource.url);
    // if (!response.ok) throw this.createCollectionError('fetch', `HTTP error! Status: ${response.status}`);
    // const rawData = await response.text(); // or response.arrayBuffer() for binary files

    // SIMULATED DATA for 2024 and 2025 (as if parsed from an Excel/CSV)
    // Typically, a file would contain data for one year, or multiple years in separate sheets/sections.
    // For simplicity, this example combines data for two years.
    // A real implementation would handle different file structures.
    const sampleZurichData: ZurichTaxRateRow[] = [
      { BFS_NR: 1, GEMEINDE_NAME: 'Aeugst am Albis', STEUERJAHR: 2024, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 95, REF_KIRCHENSTEUERFUSS_PROZENT: 10, KATH_KIRCHENSTEUERFUSS_PROZENT: 12 },
      { BFS_NR: 1, GEMEINDE_NAME: 'Aeugst am Albis', STEUERJAHR: 2025, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 95, REF_KIRCHENSTEUERFUSS_PROZENT: 10, KATH_KIRCHENSTEUERFUSS_PROZENT: 12 },
      { BFS_NR: 231, GEMEINDE_NAME: 'Zürich', STEUERJAHR: 2024, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 119, REF_KIRCHENSTEUERFUSS_PROZENT: 8, KATH_KIRCHENSTEUERFUSS_PROZENT: 9 },
      { BFS_NR: 231, GEMEINDE_NAME: 'Zürich', STEUERJAHR: 2025, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 118, REF_KIRCHENSTEUERFUSS_PROZENT: 8, KATH_KIRCHENSTEUERFUSS_PROZENT: 9 },
      { BFS_NR: 230, GEMEINDE_NAME: 'Winterthur', STEUERJAHR: 2024, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 122, REF_KIRCHENSTEUERFUSS_PROZENT: 9, KATH_KIRCHENSTEUERFUSS_PROZENT: 10 },
      { BFS_NR: 230, GEMEINDE_NAME: 'Winterthur', STEUERJAHR: 2025, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 122, REF_KIRCHENSTEUERFUSS_PROZENT: 9, KATH_KIRCHENSTEUERFUSS_PROZENT: 10 },
      { BFS_NR: 130, GEMEINDE_NAME: 'Zumikon', STEUERJAHR: 2024, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 78, REF_KIRCHENSTEUERFUSS_PROZENT: 7, KATH_KIRCHENSTEUERFUSS_PROZENT: 8 },
      { BFS_NR: 130, GEMEINDE_NAME: 'Zumikon', STEUERJAHR: 2025, POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT: 78, REF_KIRCHENSTEUERFUSS_PROZENT: 7, KATH_KIRCHENSTEUERFUSS_PROZENT: 8 },
      // ... more sample data for other municipalities and potentially other years
    ];
    
    this.lastRequestTimestamp = Date.now(); // Update timestamp after simulated fetch
    return JSON.stringify(sampleZurichData); // Return as JSON string, mimicking an API or parsed file content
  }

  /**
   * Parses the raw data (expected to be a JSON string of ZurichTaxRateRow[] in this simulation).
   * In a real scenario, this would parse Excel, CSV, or actual API JSON.
   * @param rawData The raw data as a string.
   * @param format The data format (unused in this simulation as we assume JSON string).
   * @returns A promise resolving to an array of ZurichTaxRateRow objects.
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<ZurichTaxRateRow[]> {
    this.logInfo(`Parsing Zürich data (format hint: ${format}). Expecting JSON string of ZurichTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as ZurichTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed data is not an array as expected.');
      }

      // Basic validation of the parsed structure
      const validatedData: ZurichTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.GEMEINDE_NAME !== 'string' ||
            typeof row.STEUERJAHR !== 'number' ||
            typeof row.POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT !== 'number') {
          this.logWarn('Skipping invalid row due to missing or incorrect core fields:', row);
          continue;
        }
        // Ensure optional church tax rates are numbers if present
        if (row.REF_KIRCHENSTEUERFUSS_PROZENT !== undefined && typeof row.REF_KIRCHENSTEUERFUSS_PROZENT !== 'number') row.REF_KIRCHENSTEUERFUSS_PROZENT = undefined;
        if (row.KATH_KIRCHENSTEUERFUSS_PROZENT !== undefined && typeof row.KATH_KIRCHENSTEUERFUSS_PROZENT !== 'number') row.KATH_KIRCHENSTEUERFUSS_PROZENT = undefined;
        if (row.CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT !== undefined && typeof row.CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT !== 'number') row.CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT = undefined;
        
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Zürich: ${error.message}`, error);
    }
  }

  /**
   * Converts the parsed Zürich-specific data rows into standardized ScrapedDataItem objects,
   * where each item's `parsed_data_preview_json` contains a `MunicipalTaxRate` object.
   * @param parsedItems An array of ZurichTaxRateRow objects.
   * @returns An array of ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: ZurichTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Convert percentage Steuerfuss to decimal multiplier
        const incomeTaxMultiplier = item.POLITISCHE_GEMEINDE_STEUERFUSS_PROZENT / 100;
        
        // Church tax multipliers also need conversion if they are percentages of the base tax
        // Assuming they are also percentages to be applied (like political Gemeinde)
        const protestantChurchTax = item.REF_KIRCHENSTEUERFUSS_PROZENT !== undefined ? item.REF_KIRCHENSTEUERFUSS_PROZENT / 100 : null;
        const catholicChurchTax = item.KATH_KIRCHENSTEUERFUSS_PROZENT !== undefined ? item.KATH_KIRCHENSTEUERFUSS_PROZENT / 100 : null;
        const christianCatholicChurchTax = item.CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT !== undefined ? item.CHRISTKATH_KIRCHENSTEUERFUSS_PROZENT / 100 : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.STEUERJAHR}_${generateUUID().substring(0,8)}`, // Composite ID
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.STEUERJAHR,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Zürich uses multipliers
          wealth_tax_multiplier: incomeTaxMultiplier, // Often same as income tax multiplier in ZH, but could be different
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: christianCatholicChurchTax,
          source_url: this.dataSource.url, // Or a more specific URL if available
          valid_from: `${item.STEUERJAHR}-01-01`,
          valid_to: `${item.STEUERJAHR}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Zürich municipal tax rate (Steuerfuss politische Gemeinde). Church taxes are separate multipliers.`,
        };

        scrapedDataItems.push({
          item_id: generateUUID(),
          source_id: this.dataSource.source_id,
          retrieved_at: retrievalTimestamp,
          raw_content_path: null, // Not storing raw file in this example
          raw_content_inline: null, // Parsed from simulated data
          content_type_detected: 'application/json', // Since we simulate with JSON
          status: 'parsed_successfully' as ScrapedItemStatusType, // Type assertion
          error_message: null,
          parsed_data_preview_json: JSON.stringify(municipalTaxRate),
        });
      } catch (error: any) {
        this.logError(`Error mapping item for BFS_NR ${item.BFS_NR}, Year ${item.STEUERJAHR}: ${error.message}`, item);
        // Optionally create a ScrapedDataItem with error status
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
      
      // Assuming primary format is what fetchRawData provides or is specified
      const primaryDataFormat = this.dataSource.data_format[0] || 'text';
      const parsedItemsArray = await this.parseData(rawData, primaryDataFormat);
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} items to ScrapedDataItem format.`);
      
      // Here, you would typically save `allScrapedDataItems` to a staging database or message queue.
      // For this example, we just return a summary.

      return {
        source_id: this.dataSource.source_id,
        status: errors.length > 0 && allScrapedDataItems.length > 0 ? 'partial_success' : 'success',
        items_collected: allScrapedDataItems.length, // Number of standardized items produced
        items_parsed_successfully: parsedItemsArray.length, // Number of rows/objects from raw source
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

// Example Usage (conceptual, would be part of a larger orchestration script)
/*
async function runZurichCollection() {
  const zurichDataSource: DataSource = {
    source_id: 'canton_zh_tax_rates_simulated',
    name: 'Canton Zürich Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://zurich/taxrates.json', // URL is conceptual for simulation
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Zürich tax rates.',
  };

  const collector = new ZurichCollector(zurichDataSource);
  const result = await collector.collect();

  console.log("\n--- Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  console.log(`Items Parsed from Source: ${result.items_parsed_successfully}`);
  console.log(`Duration: ${result.duration_ms}ms`);
  if (result.errors.length > 0) {
    console.error("Errors encountered:", result.errors);
  }
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runZurichCollection();
*/
