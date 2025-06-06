/**
 * src/data/swiss-tax-platform/collectors/ticino-collector.ts
 *
 * Implementazione concreta di BaseCollector per il Cantone Ticino.
 * Questo collector gestisce il sistema del "moltiplicatore comunale" del Ticino,
 * dove le aliquote fiscali comunali sono percentuali dell'imposta cantonale di base.
 * Il Ticino è il cantone di lingua italiana e conta circa 100-115 comuni.
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
import { generateUUID } from '../../security/encryption'; // Assumendo che questa utilità esista

// Definizione della struttura attesa per una riga di dati del Cantone Ticino
interface TicinoTaxRateRow {
  BFS_NR: number; // Numero UST del comune
  NOME_COMUNE: string; // Nome del comune
  ANNO: number; // Anno fiscale
  MOLTIPLICATORE_COMUNALE_PERCENTUALE: number; // Moltiplicatore comunale come percentuale (es. 75 per 75%)
  MOLTIPLICATORE_CULTO_CATTOLICO_PERCENTUALE?: number; // Moltiplicatore imposta di culto cattolica (%)
  MOLTIPLICATORE_CULTO_RIFORMATO_PERCENTUALE?: number; // Moltiplicatore imposta di culto riformata (%)
}

export class TicinoCollector extends BaseCollector {
  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    super(dataSource, minRequestIntervalMs);
    if (!['excel_xlsx', 'csv', 'pdf', 'json_api', 'html_table'].some(format => this.dataSource.data_format.includes(format as DataFormatType))) {
      this.logWarn(`TicinoCollector inizializzato con formato dati potenzialmente non supportato: ${this.dataSource.data_format.join(', ')}. Previsti Excel, CSV, PDF, HTML o JSON API.`);
    }
  }

  /**
   * Recupera i dati grezzi per il Cantone Ticino.
   * Simula il recupero restituendo una stringa JSON predefinita con circa 100-115 comuni.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Simulazione recupero dati per il Ticino da: ${this.dataSource.url}`);
    await this.applyRateLimiting();

    const sampleTicinoData: TicinoTaxRateRow[] = [];
    const currentYear = new Date().getFullYear();
    const yearsToGenerate = [currentYear, currentYear + 1]; 

    // Comuni principali con moltiplicatori noti (illustrativi ma realistici)
    // Fonte per i moltiplicatori: Dipartimento delle finanze e dell'economia (DFE) del Cantone Ticino
    // I moltiplicatori sono espressi in percentuale (es. 75% = 75)
    const majorMunicipalities: { name: string, bfs: number, rate2024: number, rate2025: number, cultoCatt?: number, cultoRif?: number }[] = [
      { name: 'Lugano', bfs: 5192, rate2024: 75, rate2025: 75, cultoCatt: 7, cultoRif: 5 },
      { name: 'Bellinzona', bfs: 5002, rate2024: 90, rate2025: 90, cultoCatt: 8, cultoRif: 6 },
      { name: 'Locarno', bfs: 5113, rate2024: 85, rate2025: 85, cultoCatt: 7, cultoRif: 5 },
      { name: 'Chiasso', bfs: 5249, rate2024: 90, rate2025: 90, cultoCatt: 8, cultoRif: 6 },
      { name: 'Mendrisio', bfs: 5254, rate2024: 80, rate2025: 80, cultoCatt: 7, cultoRif: 5 },
      { name: 'Biasca', bfs: 5003, rate2024: 95, rate2025: 95, cultoCatt: 9, cultoRif: 7 },
      { name: 'Minusio', bfs: 5118, rate2024: 70, rate2025: 70, cultoCatt: 6, cultoRif: 4 },
      { name: 'Losone', bfs: 5115, rate2024: 78, rate2025: 78, cultoCatt: 7, cultoRif: 5 },
      { name: 'Capriasca', bfs: 5175, rate2024: 88, rate2025: 88, cultoCatt: 8, cultoRif: 6 },
      { name: 'Massagno', bfs: 5196, rate2024: 65, rate2025: 65, cultoCatt: 6, cultoRif: 4 }, // Known for lower rates
      { name: 'Ascona', bfs: 5091, rate2024: 70, rate2025: 70, cultoCatt: 6, cultoRif: 4 },
    ];

    yearsToGenerate.forEach(year => {
      majorMunicipalities.forEach(muni => {
        const rateForYear = year === currentYear ? muni.rate2024 : muni.rate2025;
        const cultoCattForYear = year === currentYear ? muni.cultoCatt : (muni.cultoCatt ? muni.cultoCatt + (Math.floor(Math.random()*3-1)) : undefined); // slight variation
        const cultoRifForYear = year === currentYear ? muni.cultoRif : (muni.cultoRif ? muni.cultoRif + (Math.floor(Math.random()*3-1)) : undefined);

        sampleTicinoData.push({
          BFS_NR: muni.bfs,
          NOME_COMUNE: muni.name,
          ANNO: year,
          MOLTIPLICATORE_COMUNALE_PERCENTUALE: rateForYear,
          MOLTIPLICATORE_CULTO_CATTOLICO_PERCENTUALE: cultoCattForYear,
          MOLTIPLICATORE_CULTO_RIFORMATO_PERCENTUALE: cultoRifForYear,
        });
      });

      // Genera dati per i restanti comuni per raggiungere circa 115
      // Il Ticino ha circa 106-108 comuni. Abbiamo 11 principali. Ne servono circa 95-97.
      const numPlaceholders = 108 - majorMunicipalities.length;
      for (let i = 0; i < numPlaceholders; i++) {
        const bfsNr = 5000 + i + 100 + (majorMunicipalities.length * yearsToGenerate.indexOf(year)); // BFS univoco per placeholder
        const communeName = `Comune TI-${String(i + 1).padStart(3, '0')}`;
        // Moltiplicatori realistici in Ticino variano spesso tra 70% e 100%
        const rate = Math.floor(Math.random() * (100 - 70 + 1) + 70); 
        const cultoCattRate = Math.floor(Math.random() * (10 - 5 + 1) + 5);
        const cultoRifRate = Math.floor(Math.random() * (8 - 4 + 1) + 4);
        
        if (!sampleTicinoData.some(d => d.BFS_NR === bfsNr && d.ANNO === year)) {
          sampleTicinoData.push({
            BFS_NR: bfsNr,
            NOME_COMUNE: communeName,
            ANNO: year,
            MOLTIPLICATORE_COMUNALE_PERCENTUALE: rate,
            MOLTIPLICATORE_CULTO_CATTOLICO_PERCENTUALE: cultoCattRate,
            MOLTIPLICATORE_CULTO_RIFORMATO_PERCENTUALE: cultoRifRate,
          });
        }
      }
    });
    
    this.lastRequestTimestamp = Date.now();
    return JSON.stringify(sampleTicinoData);
  }

  /**
   * Analizza i dati grezzi (prevista stringa JSON di TicinoTaxRateRow[]).
   */
  protected async parseData(rawData: string | Buffer, format: DataFormatType): Promise<TicinoTaxRateRow[]> {
    this.logInfo(`Analisi dati Ticino (formato: ${format}). Prevista stringa JSON di TicinoTaxRateRow[].`);
    if (typeof rawData !== 'string') {
      throw this.createCollectionError('parse', 'Dati grezzi non stringa, previsto JSON per simulazione Ticino.');
    }

    try {
      const parsedData = JSON.parse(rawData) as TicinoTaxRateRow[];
      if (!Array.isArray(parsedData)) {
        throw this.createCollectionError('parse', 'Dati Ticino analizzati non sono un array come previsto.');
      }

      const validatedData: TicinoTaxRateRow[] = [];
      for (const row of parsedData) {
        if (typeof row.BFS_NR !== 'number' ||
            typeof row.NOME_COMUNE !== 'string' || row.NOME_COMUNE.trim() === '' ||
            typeof row.ANNO !== 'number' ||
            typeof row.MOLTIPLICATORE_COMUNALE_PERCENTUALE !== 'number') {
          this.logWarn('Riga non valida nei dati Ticino scartata per campi principali mancanti o errati:', row);
          continue;
        }
        validatedData.push(row);
      }
      return validatedData;
    } catch (error: any) {
      throw this.createCollectionError('parse', `Fallita analisi JSON dati Ticino: ${error.message}`, error);
    }
  }

  /**
   * Converte le righe di dati specifici del Ticino in oggetti ScrapedDataItem standardizzati.
   */
  protected mapToScrapedDataItems(parsedItems: TicinoTaxRateRow[]): ScrapedDataItem[] {
    const scrapedDataItems: ScrapedDataItem[] = [];
    const retrievalTimestamp = new Date().toISOString();

    for (const item of parsedItems) {
      try {
        // Il moltiplicatore comunale del Ticino è una percentuale, convertire in decimale
        const incomeTaxMultiplier = item.MOLTIPLICATORE_COMUNALE_PERCENTUALE / 100;
        // Assumere che il moltiplicatore per l'imposta sul patrimonio sia lo stesso
        const wealthTaxMultiplier = incomeTaxMultiplier; 

        const catholicChurchTax = item.MOLTIPLICATORE_CULTO_CATTOLICO_PERCENTUALE !== undefined 
          ? item.MOLTIPLICATORE_CULTO_CATTOLICO_PERCENTUALE / 100 
          : null;
        const protestantChurchTax = item.MOLTIPLICATORE_CULTO_RIFORMATO_PERCENTUALE !== undefined 
          ? item.MOLTIPLICATORE_CULTO_RIFORMATO_PERCENTUALE / 100 
          : null;

        const municipalTaxRate: MunicipalTaxRate = {
          rate_id: `${item.BFS_NR}_${item.ANNO}_${generateUUID().substring(0,8)}`,
          municipality_bfs_nr: item.BFS_NR,
          tax_year: item.ANNO,
          income_tax_multiplier: incomeTaxMultiplier,
          income_tax_rate_direct_percentage: null, // Ticino usa moltiplicatori
          wealth_tax_multiplier: wealthTaxMultiplier,
          wealth_tax_rate_direct_percentage: null,
          church_tax_rate_protestant_multiplier: protestantChurchTax,
          church_tax_rate_catholic_multiplier: catholicChurchTax,
          church_tax_rate_christian_catholic_multiplier: null, // Meno comune in TI, o non specificato
          source_url: this.dataSource.url,
          valid_from: `${item.ANNO}-01-01`,
          valid_to: `${item.ANNO}-12-31`,
          data_retrieved_at: retrievalTimestamp,
          notes: `Moltiplicatore comunale Ticino. Moltiplicatore originale: ${item.MOLTIPLICATORE_COMUNALE_PERCENTUALE}%. Imposta di culto è un moltiplicatore separato.`,
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
        this.logError(`Errore mappatura dati Ticino per BFS_NR ${item.BFS_NR}, Anno ${item.ANNO}: ${error.message}`, item);
      }
    }
    return scrapedDataItems;
  }
  
  /**
   * Metodo collect sovrascritto per integrare correttamente mapToScrapedDataItems.
   */
  public async collect(): Promise<CollectionResult> {
    const startTime = Date.now();
    const errors: CollectionError[] = [];
    let allScrapedDataItems: ScrapedDataItem[] = [];
    let rawDataPath: string | undefined;

    this.logInfo(`Inizio raccolta per fonte: ${this.dataSource.name} (ID: ${this.dataSource.source_id})`);

    try {
      await this.applyRateLimiting();
      const rawData = await this.fetchRawData();
      
      const primaryDataFormat = this.dataSource.data_format[0] || 'text';
      const parsedItemsArray = await this.parseData(rawData, primaryDataFormat);
      
      this.logInfo(`Analizzati con successo ${parsedItemsArray.length} elementi grezzi da fonte Ticino.`);

      allScrapedDataItems = this.mapToScrapedDataItems(parsedItemsArray);
      this.logInfo(`Mappati con successo ${allScrapedDataItems.length} elementi Ticino a formato ScrapedDataItem.`);
      
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
      this.logError(`Raccolta fallita per fonte ${this.dataSource.name}: ${collectionError.message}`, collectionError.details);
      
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

// Esempio di utilizzo (concettuale)
/*
async function runTicinoCollection() {
  const ticinoDataSource: DataSource = {
    source_id: 'canton_ti_tax_rates_simulated',
    name: 'Canton Ticino Municipal Tax Rates (Simulated)',
    type: 'cantonal_admin',
    url: 'simulated://ticino/taxrates.json', // URL concettuale
    specific_document_url_pattern: null,
    data_format: ['json_api'], // Simulazione risposta API JSON
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 30,
    notes: 'Fonte dati simulata per moltiplicatori comunali del Ticino.',
  };

  const collector = new TicinoCollector(ticinoDataSource);
  const result = await collector.collect();

  console.log("\n--- Risultato Raccolta Ticino ---");
  console.log(`Stato: ${result.status}`);
  console.log(`Elementi Raccolti (Standardizzati): ${result.items_collected}`);
  if (result.data_preview) {
    console.log("Anteprima Dati (primi elementi standardizzati):", result.data_preview);
  }
}

// runTicinoCollection();
*/
