/**
 * src/data/swiss-tax-platform/collectors/valais-collector.ts
 *
 * Concrete implementation of BaseCollector for Canton Valais (Wallis).
 * This collector handles Valais' "coefficient communal" / "Gemeindekoeffizient" system,
 * where municipal tax rates are multipliers of the cantonal base tax.
 * Valais is a bilingual canton (French/German) with approximately 122 municipalities.
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

// Define the expected structure of a row parsed from Valais' data source
// Structure des données brutes attendue pour le Valais
// Erwartete Rohdatenstruktur für Wallis
interface ValaisTaxRateRow {
  BFS_NR: number; // Official municipality number / Numéro OFS / BFS-Nummer
  NOM_COMMUNE_FR: string; // Municipality name in French / Nom de la commune en français
  GEMEINDE_NAME_DE: string; // Municipality name in German / Gemeindename auf Deutsch
  ANNEE: number; // Tax year / Année fiscale / Steuerjahr
  COEFFICIENT_COMMUNAL: number; // Municipal coefficient (e.g., 1.25 for 125%) / Coefficient communal / Gemeindekoeffizient
  COEFF_CATH_ROMAIN?: number; // Roman Catholic church tax coefficient / Coefficient culte catholique romain / Koeffizient römisch-katholische Kirchensteuer
  COEFF_REF_EVANG?: number; // Protestant church tax coefficient / Coefficient culte réformé évangélique / Koeffizient evangelisch-reformierte Kirchensteuer
  // Christian Catholic church tax is less common or might be grouped in Valais.
}

export class ValaisCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`ValaisCollector initialized with potentially unsupported data format: ${this.dataSource.data_format.join(', ')}. Expected Excel, CSV, PDF, HTML or JSON API.`);
    }
  }

  /**
   * Fetches raw data for Canton Valais.
   * Simulating fetching by returning a predefined JSON string with ~122 municipalities.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulating fetch for Valais/Wallis data from: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleValaisData: ValaisTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Major municipalities with illustrative but realistic coefficients for Valais
    // BFS numbers are official. Coefficients are typically between 1.00 and 1.70.
    const majorMunicipalities: ValaisTaxRateRow[] = [
      // Data for 2024
      { BFS_NR: 6266, NOM_COMMUNE_FR: 'Sion', GEMEINDE_NAME_DE: 'Sitten', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.25, COEFF_CATH_ROMAIN: 0.10, COEFF_REF_EVANG: 0.08 },
      { BFS_NR: 6136, NOM_COMMUNE_FR: 'Martigny', GEMEINDE_NAME_DE: 'Martinach', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.25, COEFF_CATH_ROMAIN: 0.11, COEFF_REF_EVANG: 0.09 },
      { BFS_NR: 6156, NOM_COMMUNE_FR: 'Monthey', GEMEINDE_NAME_DE: 'Monthey', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.30, COEFF_CATH_ROMAIN: 0.12, COEFF_REF_EVANG: 0.10 },
      { BFS_NR: 6244, NOM_COMMUNE_FR: 'Sierre', GEMEINDE_NAME_DE: 'Siders', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.20, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 },
      { BFS_NR: 6002, NOM_COMMUNE_FR: 'Brigue-Glis', GEMEINDE_NAME_DE: 'Brig-Glis', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.10, COEFF_CATH_ROMAIN: 0.08, COEFF_REF_EVANG: 0.06 },
      { BFS_NR: 6298, NOM_COMMUNE_FR: 'Viège', GEMEINDE_NAME_DE: 'Visp', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.15, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 },
      { BFS_NR: 6300, NOM_COMMUNE_FR: 'Zermatt', GEMEINDE_NAME_DE: 'Zermatt', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.00, COEFF_CATH_ROMAIN: 0.07, COEFF_REF_EVANG: 0.05 }, // Tourist resort, often lower
      { BFS_NR: 6252, NOM_COMMUNE_FR: 'Crans-Montana', GEMEINDE_NAME_DE: 'Crans-Montana', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.05, COEFF_CATH_ROMAIN: 0.08, COEFF_REF_EVANG: 0.06 },
      { BFS_NR: 6031, NOM_COMMUNE_FR: 'Val de Bagnes', GEMEINDE_NAME_DE: 'Val de Bagnes', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.18, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 }, // Includes Verbier
      { BFS_NR: 6195, NOM_COMMUNE_FR: 'Nendaz', GEMEINDE_NAME_DE: 'Nendaz', ANNEE: 2024, COEFFICIENT_COMMUNAL: 1.28, COEFF_CATH_ROMAIN: 0.10, COEFF_REF_EVANG: 0.08 },
      // Data for 2025 (simulating slight changes)
      { BFS_NR: 6266, NOM_COMMUNE_FR: 'Sion', GEMEINDE_NAME_DE: 'Sitten', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.26, COEFF_CATH_ROMAIN: 0.10, COEFF_REF_EVANG: 0.08 },
      { BFS_NR: 6136, NOM_COMMUNE_FR: 'Martigny', GEMEINDE_NAME_DE: 'Martinach', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.25, COEFF_CATH_ROMAIN: 0.11, COEFF_REF_EVANG: 0.09 },
      { BFS_NR: 6156, NOM_COMMUNE_FR: 'Monthey', GEMEINDE_NAME_DE: 'Monthey', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.31, COEFF_CATH_ROMAIN: 0.12, COEFF_REF_EVANG: 0.10 },
      { BFS_NR: 6244, NOM_COMMUNE_FR: 'Sierre', GEMEINDE_NAME_DE: 'Siders', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.20, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 },
      { BFS_NR: 6002, NOM_COMMUNE_FR: 'Brigue-Glis', GEMEINDE_NAME_DE: 'Brig-Glis', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.11, COEFF_CATH_ROMAIN: 0.08, COEFF_REF_EVANG: 0.06 },
      { BFS_NR: 6298, NOM_COMMUNE_FR: 'Viège', GEMEINDE_NAME_DE: 'Visp', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.15, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 },
      { BFS_NR: 6300, NOM_COMMUNE_FR: 'Zermatt', GEMEINDE_NAME_DE: 'Zermatt', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.00, COEFF_CATH_ROMAIN: 0.07, COEFF_REF_EVANG: 0.05 },
      { BFS_NR: 6252, NOM_COMMUNE_FR: 'Crans-Montana', GEMEINDE_NAME_DE: 'Crans-Montana', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.06, COEFF_CATH_ROMAIN: 0.08, COEFF_REF_EVANG: 0.06 },
      { BFS_NR: 6031, NOM_COMMUNE_FR: 'Val de Bagnes', GEMEINDE_NAME_DE: 'Val de Bagnes', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.19, COEFF_CATH_ROMAIN: 0.09, COEFF_REF_EVANG: 0.07 },
      { BFS_NR: 6195, NOM_COMMUNE_FR: 'Nendaz', GEMEINDE_NAME_DE: 'Nendaz', ANNEE: 2025, COEFFICIENT_COMMUNAL: 1.28, COEFF_CATH_ROMAIN: 0.10, COEFF_REF_EVANG: 0.08 },
    ];

    sampleValaisData.push(...majorMunicipalities);

    // Generate placeholders for the remaining municipalities to reach ~122
    // Valais has ~122 municipalities. We have 10 major ones listed for 2 years (20 entries).
    // Need ~102 more unique municipalities.
    const numUniquePlaceholders = 122 - majorMunicipalities.length / 2; // Divide by 2 as majorMunicipalities has 2 years of data for each

    for (let i = 0; i < numUniquePlaceholders; i++) {
      const bfsNr = 6000 + i + 50; // Start BFS numbers for placeholders after major ones
      const communeNameFr = `Commune VS-FR-${String(i + 1).padStart(3, '0')}`;
      const communeNameDe = `Gemeinde VS-DE-${String(i + 1).padStart(3, '0')}`;
      // Realistic Valais coefficients: 1.00 to 1.70
      const coeff = parseFloat((Math.random() * (1.70 - 1.00) + 1.00).toFixed(2));
      const coeffCath = parseFloat((Math.random() * (0.15 - 0.05) + 0.05).toFixed(2));
      const coeffRef = parseFloat((Math.random() * (0.12 - 0.04) + 0.04).toFixed(2));
      
      yearsToGenerate.forEach(year => {
          if (!sampleValaisData.some(d => d.BFS_NR === bfsNr && d.ANNEE === year)) {
            sampleValaisData.push({
                BFS_NR: bfsNr,
                NOM_COMMUNE_FR: communeNameFr,
                GEMEINDE_NAME_DE: communeNameDe,
                ANNEE: year,
                COEFFICIENT_COMMUNAL: year === currentYear ? coeff : parseFloat((coeff + (Math.random() * 0.04 - 0.02)).toFixed(2)),
                COEFF_CATH_ROMAIN: year === currentYear ? coeffCath : parseFloat((coeffCath + (Math.random() * 0.01 - 0.005)).toFixed(2)),
                COEFF_REF_EVANG: year === currentYear ? coeffRef : parseFloat((coeffRef + (Math.random() * 0.01 - 0.005)).toFixed(2)),
            });
          }
      });
    }
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleValaisData);
  }

  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<ValaisTaxRateRow[]> {
    this.logInfo(`Parsing Valais/Wallis data (format hint: ${format}).`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Raw data is not a string, expected JSON for Valais simulation.');
    }

    try {
      const parsedData = JSON.parse(rawData) as ValaisTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Parsed Valais data is not an array as expected.');
      }

      const validatedData: ValaisTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            (typeof row.NOM_COMMUNE_FR !== 'string' || row.NOM_COMMUNE_FR.trim() === '') ||
            (typeof row.GEMEINDE_NAME_DE !== 'string' || row.GEMEINDE_NAME_DE.trim() === '') ||
            typeof row.ANNEE !== 'number' ||
            typeof row.COEFFICIENT_COMMUNAL !== 'number') {
          this.logWarn('Skipping invalid row in Valais data:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Failed to parse JSON data for Valais: ${error.message}`, error);
    }
  }

  protected mapToScrapedDataItems(parsedItems: ValaisTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Valais "coefficient communal" is already a decimal multiplier (e.g., 1.25 for 125%)
        const incomeTaxMultiplier = item.COEFFICIENT_COMMUNAL;
        const wealthTaxMultiplier = item.COEFFICIENT_COMMUNAL; // Often the same in Valais

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.ANNEE}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.ANNEE,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Valais uses coefficients
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: item.COEFF_REF_EVANG,
          church_tax_rate_catholic_multiplier: item.COEFF_CATH_ROMAIN,
          church_tax_rate_christian_catholic_multiplier: null, // Less common or grouped
          source_url: this.dataSource.url,
          valid_from: `${item.ANNEE}-01-01`,
          valid_to: `${item.ANNEE}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Valais/Wallis municipal coefficient. FR: ${item.NOM_COMMUNE_FR}, DE: ${item.GEMEINDE_NAME_DE}. Original coefficient: ${item.COEFFICIENT_COMMUNAL}.`,
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
        this.logError(`Error mapping Valais item for BFS_NR ${item.BFS_NR}, Year ${item.ANNEE}: ${error.message}`, item);
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
      
      this.logInfo(`Successfully parsed ${parsedItemsArray.length} raw items from Valais/Wallis source.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Successfully mapped ${allScrapedDataItems.length} Valais/Wallis items to ScrapedDataItem format.`);
      
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
async function runValaisCollection() {
  const valaisDataSource: DataSource = {
    source_id: 'canton_vs_tax_rates_simulated',
    name: 'Canton Valais/Wallis Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://valais/taxrates.json', // Conceptual URL
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulating JSON API response
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Simulated data source for Valais/Wallis tax rates (coefficient communal).',
  };

  const collector = new ValaisCollector(valaisDataSource);
  const result = await collector.collect();

  console.log("\n--- Valais/Wallis Collection Result ---");
  console.log(`Status: ${result.status}`);
  console.log(`Items Collected (Standardized): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Data Preview (first few standardized items):", result.data_preview);
  }
}

// runValaisCollection();
*/
