/**
 * src/data/swiss-tax-platform/orchestrator.ts
 *
 * Orchestrates the collection, processing, and storage of Swiss tax data
 * from various cantonal and federal sources.
 */

import { dbManager } from './database/connection';
import {
  DataSource,
  ScrapedDataItem,
  MunicipalTaxRate,
  CantonalTaxParameter,
  FederalTaxBracket,
  ScraperStatusType,
  Canton,
  Municipality, // Added for processing FSO data
} from '../types';
import { BaseCollector, CollectionResult } from './collectors/base-collector';
import { CollectorFactory, PREDEFINED_DATA_SOURCES, CANTON_CODES_FOR_POPULATION } from './collector-factory'; // Updated import

const DEFAULT_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 60 * 1000; // 1 minute

export interface OrchestrationReport {
  sourceId: string;
  sourceName: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILURE' | 'SKIPPED';
  itemsCollected: number; // Number of raw items/documents fetched by collector
  itemsParsed: number;    // Number of structured records parsed from raw data by collector
  itemsImported: number;  // Number of records successfully saved to final tables by orchestrator
  error?: string;
  errorDetails?: any;
  log: string[];
}

export interface OverallStatusReport {
  overallStatus: 'HEALTHY' | 'WARNING' | 'ERROR';
  lastFullRunTime?: string;
  nextScheduledRunTime?: string; // Conceptual for now
  dataSourceReports: OrchestrationReport[];
  totalSources: number;
  successfulSources: number;
  failedSources: number;
}

export class TaxDataOrchestrator {
  private collectors: Map<string, BaseCollector> = new Map();
  private dataSources: DataSource[] = [];
  private schedulerIntervalId?: NodeJS.Timeout;

  constructor() {
    console.log('TaxDataOrchestrator initialized.');
  }

  /**
   * Loads data source configurations from CollectorFactory and populates/updates them in the database.
   * Then initializes collector instances.
   */
  public async initializeDataSourcesAndCollectors(): Promise<void> {
    console.log('Initializing data sources from CollectorFactory...');
    const predefinedSources = CollectorFactory.getAllDataSources();
    
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      for (const ds of predefinedSources) {
        // Ensure data_format is an array of strings for PostgreSQL array type
        const formattedDs = { ...ds, data_format: Array.isArray(ds.data_format) ? ds.data_format : [ds.data_format] };
        await dbManager.insertDataSource(formattedDs, client);
      }
      await dbManager.commitTransaction(client);
      
      const { rows } = await dbManager.query<DataSource>('SELECT * FROM data_sources');
      this.dataSources = rows;
      console.log(`Loaded and synchronized ${this.dataSources.length} data sources with database.`);
      this.initializeCollectorsInternal();
    } catch (error) {
      console.error('Failed to initialize data sources:', error);
      await dbManager.rollbackTransaction(client);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Creates collector instances based on loaded data sources using CollectorFactory.
   */
  private initializeCollectorsInternal(): void {
    this.collectors.clear();
    for (const ds of this.dataSources) {
      const collector = CollectorFactory.createCollector(ds);
      if (collector) {
        this.collectors.set(ds.source_id, collector);
      } else {
        console.warn(`No collector available for data source ID: ${ds.source_id} (Type: ${ds.type})`);
      }
    }
    console.log(`Initialized ${this.collectors.size} collectors.`);
  }
  
  /**
   * Populates core reference data like Cantons.
   * This should be run once during setup or if canton data changes.
   */
  public async populateCoreReferenceData(): Promise<void> {
    console.log('Populating core reference data (Cantons)...');
    const cantonsData: Canton[] = CANTON_CODES_FOR_POPULATION.map(c => ({
        canton_id: c.code,
        name_de: c.name_de,
        name_fr: c.name_fr,
        name_it: c.name_it,
        name_en: c.name_en, // Assuming English name is same as German for simplicity, adjust if needed
        official_website_tax_info: PREDEFINED_DATA_SOURCES.find(ds => ds.source_id.startsWith(`canton_${c.code.toLowerCase()}_`))?.url || null,
        tax_system_type: 'MultiplierOfCantonalBase', // Default, needs to be accurate per canton
        last_checked_for_update: new Date().toISOString(),
    }));
    
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      for (const canton of cantonsData) {
         // Adjust tax_system_type based on actual canton data if available
        if (canton.canton_id === 'BS') canton.tax_system_type = 'UnifiedCantonalTax';
        // Add other specific canton tax system types here
        await dbManager.insertCanton(canton, client);
      }
      await dbManager.commitTransaction(client);
      console.log(`Successfully populated/updated ${cantonsData.length} cantons.`);
    } catch (error) {
      await dbManager.rollbackTransaction(client);
      console.error('Error populating cantons:', error);
      throw error;
    } finally {
      client.release();
    }
  }


  /**
   * Runs a specific data collector by its source ID.
   */
  public async runCollector(sourceId: string, attempt: number = 1): Promise<OrchestrationReport> {
    const collector = this.collectors.get(sourceId);
    const dataSource = this.dataSources.find(ds => ds.source_id === sourceId);
    const log: string[] = [];
    const startTime = new Date();

    const createReport = (
      status: OrchestrationReport['status'],
      itemsCollected: number = 0,
      itemsParsed: number = 0,
      itemsImported: number = 0,
      error?: string,
      errorDetails?: any
    ): OrchestrationReport => ({
      sourceId,
      sourceName: dataSource?.name || 'Unknown Source',
      startTime: startTime.toISOString(),
      endTime: new Date().toISOString(),
      durationMs: Date.now() - startTime.getTime(),
      status,
      itemsCollected,
      itemsParsed,
      itemsImported,
      error,
      errorDetails,
      log,
    });

    if (!collector || !dataSource) {
      const msg = `Collector or DataSource not found for source ID: ${sourceId}`;
      log.push(`[ERROR] ${msg}`);
      console.error(msg);
      return createReport('FAILURE', 0, 0, 0, msg);
    }

    log.push(`[INFO] Orchestrator: Starting run for ${dataSource.name} (Attempt ${attempt})`);
    
    try {
      const collectionResult: CollectionResult = await collector.collect();
      log.push(`[INFO] Collector Result Status: ${collectionResult.status}`);
      log.push(`[INFO] Items Collected (raw docs/calls by collector): ${collectionResult.items_collected}`);
      log.push(`[INFO] Items Parsed from Source (by collector): ${collectionResult.items_parsed_successfully}`);
      collectionResult.errors.forEach(e => log.push(`[COLLECTOR_ERROR] ${e.type}: ${e.message}`));

      if (collectionResult.status === 'failure' && collectionResult.errors.some(e => e.type === 'rate_limit')) {
         log.push(`[WARN] Rate limit hit for ${dataSource.name}. Will retry later.`);
         await this.updateDataSourceScrapeStatus(dataSource.source_id, 'needs_update', collectionResult.last_scrape_attempt || startTime.toISOString(), null, 'Rate limited');
         return createReport('SKIPPED', collectionResult.items_collected, collectionResult.items_parsed_successfully, 0, 'Rate limited');
      }
      
      if (collectionResult.status === 'failure') {
        throw new Error(collectionResult.errors[0]?.message || 'Collector returned failure status.');
      }
      
      // The data_preview from CollectionResult should contain ScrapedDataItem[]
      const scrapedItemsToProcess: ScrapedDataItem[] = (collectionResult.data_preview || [])
        .map(item => (typeof item === 'string' ? JSON.parse(item) : item))
        .filter(item => item && item.parsed_data_preview_json) as ScrapedDataItem[];

      const importStats = await this.processAndImportData(scrapedItemsToProcess, dataSource);
      log.push(`[INFO] Items imported to DB: ${importStats.importedCount}`);
      log.push(`[INFO] Items failed to import: ${importStats.failedCount}`);
      
      await this.updateDataSourceScrapeStatus(dataSource.source_id, 'active', startTime.toISOString(), new Date().toISOString());

      return createReport(
        collectionResult.status === 'success' && importStats.failedCount === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
        collectionResult.items_collected, // This is items from collector's perspective (e.g. standardized items it produced)
        collectionResult.items_parsed_successfully, // This is raw items it parsed
        importStats.importedCount, // Items successfully inserted into DB by orchestrator
        importStats.failedCount > 0 ? `${importStats.failedCount} items failed to import.` : undefined
      );

    } catch (error: any) {
      log.push(`[ERROR] Orchestrator: Run failed for ${dataSource.name}: ${error.message}`);
      console.error(`Error running collector for ${sourceId}:`, error);
      await this.updateDataSourceScrapeStatus(dataSource.source_id, 'error', startTime.toISOString(), null, error.message);

      if (attempt < DEFAULT_RETRY_ATTEMPTS) {
        log.push(`[INFO] Scheduling retry ${attempt + 1} for ${dataSource.name} in ${RETRY_DELAY_MS / 1000}s.`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return this.runCollector(sourceId, attempt + 1);
      } else {
        log.push(`[ERROR] Max retries reached for ${dataSource.name}.`);
        return createReport('FAILURE', 0,0,0, `Max retries reached. Last error: ${error.message}`, error);
      }
    }
  }

  /**
   * Processes ScrapedDataItems and imports them into the final database tables based on source type.
   */
  private async processAndImportData(
    scrapedItems: ScrapedDataItem[],
    dataSource: DataSource
  ): Promise<{ importedCount: number; failedCount: number }> {
    let importedCount = 0;
    let failedCount = 0;
    const client = await dbManager.connect();

    try {
      await dbManager.beginTransaction(client);

      for (const item of scrapedItems) {
        if (item.status !== 'parsed_successfully' || !item.parsed_data_preview_json) {
          failedCount++;
          continue;
        }
        try {
          const parsedData = JSON.parse(item.parsed_data_preview_json);

          if (dataSource.source_id.startsWith('canton_') && dataSource.source_id.endsWith('_municipal_tax_rates')) {
            const taxRateData = parsedData as MunicipalTaxRate;
             // Ensure related canton and municipality exist
            const { rows: cantonExists } = await client.query('SELECT 1 FROM cantons WHERE canton_id = $1', [dataSource.source_id.split('_')[1].toUpperCase()]);
            if (cantonExists.length === 0) {
                console.warn(`Canton ${dataSource.source_id.split('_')[1].toUpperCase()} not found for tax rate of municipality BFS ${taxRateData.municipality_bfs_nr}. Skipping.`);
                failedCount++;
                continue;
            }
            const { rows: muniExists } = await client.query('SELECT 1 FROM municipalities WHERE bfs_nr = $1', [taxRateData.municipality_bfs_nr]);
            if (muniExists.length === 0) {
              console.warn(`Municipality BFS ${taxRateData.municipality_bfs_nr} not found for tax rate import. Skipping. (Source: ${dataSource.name})`);
              failedCount++;
              continue;
            }
            await dbManager.insertMunicipalTaxRate(taxRateData, client);
          } else if (dataSource.source_id === 'federal_fso_municipalities') {
            const municipalityData = parsedData as Municipality;
            // Ensure related canton exists
            const { rows: cantonExists } = await client.query('SELECT 1 FROM cantons WHERE canton_id = $1', [municipalityData.canton_id]);
             if (cantonExists.length === 0) {
                console.warn(`Canton ${municipalityData.canton_id} not found for municipality BFS ${municipalityData.bfs_nr}. Skipping.`);
                failedCount++;
                continue;
            }
            await dbManager.insertMunicipality(municipalityData, client);
          } else if (dataSource.source_id === 'federal_estv_tax_brackets') {
            const bracketData = parsedData as FederalTaxBracket;
            await dbManager.insertFederalTaxBracket(bracketData, client);
          } else if (dataSource.source_id.startsWith('canton_') && dataSource.source_id.endsWith('_parameters')) {
            const paramData = parsedData as CantonalTaxParameter;
             // Ensure related canton exists
            const { rows: cantonExists } = await client.query('SELECT 1 FROM cantons WHERE canton_id = $1', [paramData.canton_id]);
             if (cantonExists.length === 0) {
                console.warn(`Canton ${paramData.canton_id} not found for cantonal parameter ${paramData.parameter_name}. Skipping.`);
                failedCount++;
                continue;
            }
            await dbManager.insertCantonalTaxParameter(paramData, client);
          } else {
            console.warn(`Unknown data type for source ID ${dataSource.source_id}. Cannot import.`);
            failedCount++;
            continue;
          }
          importedCount++;
        } catch (parseOrDbError: any) {
          console.error(`Failed to import item ${item.item_id} from source ${dataSource.source_id}: ${parseOrDbError.message}`, item.parsed_data_preview_json);
          failedCount++;
        }
      }

      await dbManager.commitTransaction(client);
    } catch (error: any) {
      console.error(`Transaction failed during data import for source ${dataSource.source_id}: ${error.message}`);
      await dbManager.rollbackTransaction(client);
      failedCount += importedCount; 
      importedCount = 0; 
    } finally {
      client.release();
    }
    return { importedCount, failedCount };
  }
  
  private async updateDataSourceScrapeStatus(
    sourceId: string,
    status: ScraperStatusType,
    lastAttempt: string | null,
    lastSuccess: string | null,
    notes?: string
  ): Promise<void> {
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      const currentSource = this.dataSources.find(ds => ds.source_id === sourceId);
      if (currentSource) {
        currentSource.scraper_status = status;
        currentSource.last_scrape_attempt = lastAttempt;
        currentSource.last_scrape_success = lastSuccess;
        if (notes) currentSource.notes = notes.substring(0, 250);
        // Ensure data_format is an array of strings for PostgreSQL array type
        const formattedDs = { ...currentSource, data_format: Array.isArray(currentSource.data_format) ? currentSource.data_format : [currentSource.data_format] };
        await dbManager.insertDataSource(formattedDs, client);
      }
      await dbManager.commitTransaction(client);
    } catch (error) {
      console.error(`Failed to update data source status for ${sourceId}:`, error);
      await dbManager.rollbackTransaction(client);
    } finally {
      client.release();
    }
  }

  public async runAllCollectors(sequential: boolean = true): Promise<OrchestrationReport[]> {
    console.log(`Starting run for all ${this.collectors.size} collectors. Sequential: ${sequential}`);
    const reports: OrchestrationReport[] = [];
    
    // Define preferred order: FSO first, then federal, then cantonal
    const orderedSourceIds: string[] = [];
    const fsoSource = this.dataSources.find(ds => ds.source_id === 'federal_fso_municipalities');
    if (fsoSource) orderedSourceIds.push(fsoSource.source_id);

    const federalBracketSource = this.dataSources.find(ds => ds.source_id === 'federal_estv_tax_brackets');
    if (federalBracketSource) orderedSourceIds.push(federalBracketSource.source_id);
    
    this.dataSources.forEach(ds => {
        if (!orderedSourceIds.includes(ds.source_id)) {
            orderedSourceIds.push(ds.source_id);
        }
    });


    if (sequential) {
      for (const sourceId of orderedSourceIds) {
        if (this.collectors.has(sourceId)) { // Only run if a collector exists
            const report = await this.runCollector(sourceId);
            reports.push(report);
        } else {
            console.warn(`Skipping source ID ${sourceId} as no collector is registered for it.`);
        }
      }
    } else {
      const promises = orderedSourceIds
        .filter(sourceId => this.collectors.has(sourceId))
        .map(sourceId => this.runCollector(sourceId));
      const results = await Promise.allSettled(promises);
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          reports.push(result.value);
        } else {
          console.error('A collector run failed unexpectedly in parallel execution:', result.reason);
        }
      });
    }
    console.log('Finished running all collectors.');
    return reports;
  }

  public startScheduler(intervalMinutes: number = 60 * 24): void {
    if (this.schedulerIntervalId) {
      console.log('Scheduler already running.');
      return;
    }
    console.log(`Starting scheduler to run all collectors every ${intervalMinutes} minutes.`);
    this.schedulerIntervalId = setInterval(async () => {
      console.log(`[Scheduler] Triggering automated run for all collectors at ${new Date().toISOString()}`);
      await this.initializeDataSourcesAndCollectors(); // Refresh sources and collectors
      await this.populateCoreReferenceData(); // Ensure cantons are up-to-date
      const reports = await this.runAllCollectors();
      console.log(`[Scheduler] Automated run completed. Reports generated: ${reports.length}`);
      const statusReport = await this.generateOverallStatusReport(reports);
      console.log(`[Scheduler] Overall Platform Status: ${statusReport.overallStatus}`);
    }, intervalMinutes * 60 * 1000);
  }

  public stopScheduler(): void {
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = undefined;
      console.log('Scheduler stopped.');
    }
  }

  public async generateOverallStatusReport(recentReports?: OrchestrationReport[]): Promise<OverallStatusReport> {
    const { rows: sourcesFromDb } = await dbManager.query<DataSource>('SELECT * FROM data_sources ORDER BY source_id');
    this.dataSources = sourcesFromDb; 

    let overallStatus: OverallStatusReport['overallStatus'] = 'HEALTHY';
    let successfulSources = 0;
    let failedSources = 0;

    const dataSourceReports: OrchestrationReport[] = recentReports || [];
    
    if (!recentReports) {
        for (const ds of this.dataSources) {
            dataSourceReports.push({
                sourceId: ds.source_id,
                sourceName: ds.name,
                startTime: ds.last_scrape_attempt || new Date(0).toISOString(),
                endTime: ds.last_scrape_success || new Date(0).toISOString(),
                durationMs: 0, 
                status: ds.scraper_status === 'active' && ds.last_scrape_success ? 'SUCCESS' : 
                        ds.scraper_status === 'error' ? 'FAILURE' : 'SKIPPED',
                itemsCollected: 0, itemsParsed: 0, itemsImported: 0,
                log: ds.notes ? [ds.notes] : [],
            });
        }
    }

    dataSourceReports.forEach(report => {
      if (report.status === 'FAILURE') {
        failedSources++;
        overallStatus = 'ERROR';
      } else if (report.status === 'PARTIAL_SUCCESS') {
        successfulSources++; 
        if (overallStatus !== 'ERROR') overallStatus = 'WARNING';
      } else if (report.status === 'SUCCESS') {
        successfulSources++;
      }
    });
    
    if (overallStatus === 'HEALTHY' && failedSources === 0 && dataSourceReports.some(r => r.status === 'SKIPPED')) {
        overallStatus = 'WARNING';
    }

    return {
      overallStatus,
      lastFullRunTime: dataSourceReports.length > 0 ? new Date(Math.max(...dataSourceReports.map(r => new Date(r.endTime).getTime()))).toISOString() : undefined,
      dataSourceReports,
      totalSources: this.dataSources.length,
      successfulSources,
      failedSources,
    };
  }
}
