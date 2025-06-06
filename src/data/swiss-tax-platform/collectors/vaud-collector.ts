/**
 * src/data/swiss-tax-platform/collectors/vaud-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Vaud.
 * This collector handles Vaud's "taux d'impôt communal" system, where municipal
 * tax rates are percentages of the cantonal base tax.
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

// Define the expected structure of a row parsed from Vaud's data source
interface VaudTaxRateRow {
  BFS_NR: number; // Official municipality number (Numéro OFS)
  COMMUNE_NOM: string; // Municipality name (Nom de la commune)
  ANNEE: number; // Tax year (Année fiscale)
  TAUX_COMMUNAL_POURCENT: number; // Municipal tax rate as a percentage (e.g., 79 for 79%)
  // Vaud may have separate wealth tax rates or they might follow income tax multiplier.
  // For simplicity, we'll assume the same multiplier applies to wealth unless specified.
  // Church tax in Vaud is generally not a separate municipal levy in the same way as other cantons;
  // it's often part of the cantonal tax or voluntary.
}

export class VaudCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`VaudCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Vaud.
   * Simulating fetching by returning a predefined JSON string with ~300 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Vaud data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleVaudData: VaudTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; // Generate for current and next year

    // Major municipalities with known-ish rates
    const majorMunicipalities: { name: string, bfs: number, rate2024: number, rate2025: number }[] = [
      { name: 'Lausanne', bfs: 5586, rate2024: 79, rate2025: 79 },
      { name: 'Yverdon-les-Bains', bfs: 5938, rate2024: 75, rate2025: 75 },
      { name: 'Montreux', bfs: 5886, rate2024: 69, rate2025: 69 },
      { name: 'Nyon', bfs: 5724, rate2024: 60, rate2025: 60 },
      { name: 'Vevey', bfs: 5887, rate2024: 78, rate2025: 78 },
      { name: 'Morges', bfs: 5722, rate2024: 68, rate2025: 68 },
      { name: 'Renens (VD)', bfs: 5588, rate2024: 82, rate2025: 82 },
      { name: 'Pully', bfs: 5589, rate2024: 65, rate2025: 65 },
      { name: 'Gland', bfs: 5719, rate2024: 55, rate2025: 55 },
      { name: 'Aigle', bfs: 5401, rate2024: 72, rate2025: 72 },
      { name: 'Ecublens (VD)', bfs: 5583, rate2024: 63, rate2025: 63 },
      { name: 'Prilly', bfs: 5587, rate2024: 77, rate2025: 77 },
      { name: 'Crissier', bfs: 5582, rate2024: 68, taxMultiplier2025: 68 },
      { name: 'Bex', bfs: 5402, rate2024: 70, taxMultiplier2025: 70 },
      { name: 'Bussigny', bfs: 5581, rate2024: 70, taxMultiplier2025: 70 },
      { name: 'Chavannes-près-Renens', bfs: 5584, rate2024: 62, taxMultiplier2025: 62 },
      { name: 'La Tour-de-Peilz', bfs: 5885, rate2024: 70, taxMultiplier2025: 70 },
      { name: 'Le Mont-sur-Lausanne', bfs: 5585, rate2024: 64, taxMultiplier2025: 64 },
      { name: 'Ollon', bfs: 5409, rate2024: 73, taxMultiplier2025: 73 },
      { name: 'Orbe', bfs: 5760, rate2024: 76, taxMultiplier2025: 76 },
      { name: 'Payerne', bfs: 5803, rate2024: 80, taxMultiplier2025: 80 },
      { name: 'Rolle', bfs: 5728, rate2024: 58, taxMultiplier2025: 58 },
      { name: 'Saint-Prex', bfs: 5729, rate2024: 53, taxMultiplier2025: 53 },
      { name: 'Villeneuve (VD)', bfs: 5412, rate2024: 74, taxMultiplier2025: 74 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        sampleVaudData.push({
          BFS_NR: muni.bfs,
          COMMUNE_NOM: muni.name,
          ANNEE: year,
          TAUX_COMMUNAL_POURCENT: year === currentYear ? muni.rate2024 : muni.rate2025,
        });
      });

      // Generate ~280 more placeholder municipalities for Vaud
      for (let i = 0; i < 280; i++) {
        const bfsNr = 5000 + i + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); // Ensure unique BFS for placeholders
        const communeName = `Municipality VD-${String(i + 1).padStart(3, '0')}`;
        // Realistic Vaud rates often range from 50% to 85%
        const rate = Math.floor(Math.random() * (85 - 50 + 1) + 50); 
        
        // Avoid duplicate BFS_NR for the same year if generating for multiple years
        if (!sampleVaudData.some(d => d.BFS_NR === bfsNr && d.ANNEE === year)) {
            sampleVaudData.push({
                BFS_NR: bfsNr,
                COMMUNE_NOM: communeName,
                ANNEE: year,
                TAUX_COMMUNAL_POURCENT: rate,
            });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleVaudData);
  }

  /**
   * Parses the raw data (expected to be a JSON string of VaudTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<VaudTaxRateRow[]> {
    this.logInfo(`Parsing Vaud data (format hint: ${format}). Expecting JSON string of VaudTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Vaud simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as VaudTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Vaud data is not an array as expected.');
      }

      const validatedData: VaudTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.COMMUNE_NOM !== 'string' || row.COMMUNE_NOM.trim() === '' ||
            typeof row.ANNEE !== 'number' ||
            typeof row.TAUX_COMMUNAL_POURCENT !== 'number') {
          this.logWarn('Skipping invalid row in Vaud data due to missing or incorrect core fields:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Vaud: ${error.message}`, error);
    }
  }

  /**
   * Converts parsed Vaud-specific data rows into standardized ScrapedDataItem objects.
   */
  protected mapToScrapedDataItems(parsedItems: VaudTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Vaud's "taux communal" is a percentage, convert to decimal multiplier
        const incomeTaxMultiplier = item.TAUX_COMMUNAL_POURCENT / 100;
        // Assume wealth tax multiplier is often similar or derived from income tax for Vaud for this simulation
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.ANNEE}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.ANNEE,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Vaud uses multipliers on cantonal base
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: null, // Vaud church tax is typically not a separate municipal multiplier
          church_tax_rate_catholic_multiplier: null,
          church_tax_rate_christian_catholic_multiplier: null,
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Vaud municipal tax rate (Taux d'impôt communal en % de l'impôt cantonal de base). Original rate: ${item.TAUX_COMMUNAL_POURCENT}%.`,
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
        this.logError(`Error mapping Vaud item for BFS_NR ${item.BFS_NR}, Year ${item.ANNEE}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Vaud source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Vaud items to ScrapedDataItem format.`);
      
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
async function runVaudCollection() {
  const vaudDataSource: DataSource = {
    source_id: 'canton_vd_tax_rates_simulated',
    name: 'Canton Vaud Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://vaud/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Vaud tax rates (taux communal).',
  };

  const collector = new VaudCollector(vaudDataSource);
  const result = await collector.collect();

  console.log("\n--- Vaud Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runVaudCollection();
*/
