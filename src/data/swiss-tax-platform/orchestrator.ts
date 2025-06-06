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
} from './types';
import { BaseCollector, CollectionResult, CollectionError } from './collectors/base-collector';
import { ZurichCollector } from './collectors/zurich-collector';
import { GenevaCollector } from './collectors/geneva-collector';
// Import other canton collectors as they are created
// import { BernCollector } from './collectors/bern-collector';
// import { VaudCollector } from './collectors/vaud-collector';

const DEFAULT_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 60 * 1000; // 1 minute

export interface OrchestrationReport {
  sourceId: string;
  sourceName: string;
  startTime: string;
  endTime: string;
  durationMs: number;
  status: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILURE' | 'SKIPPED';
  itemsCollected: number; // Number of raw items/documents fetched
  itemsParsed: number;    // Number of structured records parsed from raw data
  itemsImported: number;  // Number of records successfully saved to final tables
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
    // Initialize with dbManager already available
    console.log('TaxDataOrchestrator initialized.');
  }

  /**
   * Loads data source configurations from the database or a config file.
   * For this example, we'll use a predefined list and insert/update them.
   */
  public async initializeDataSources(predefinedSources: DataSource[]): Promise<void> {
    console.log('Initializing data sources...');
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      for (const ds of predefinedSources) {
        await dbManager.insertDataSource(ds, client);
      }
      await dbManager.commitTransaction(client);
      
      const { rows } = await dbManager.query<DataSource>('SELECT * FROM data_sources');
      this.dataSources = rows;
      console.log(`Loaded ${this.dataSources.length} data sources.`);
      this.initializeCollectors();
    } catch (error) {
      console.error('Failed to initialize data sources:', error);
      await dbManager.rollbackTransaction(client);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Creates collector instances based on loaded data sources.
   */
  private initializeCollectors(): void {
    this.collectors.clear();
    for (const ds of this.dataSources) {
      const collector = this.createCollectorForDataSource(ds);
      if (collector) {
        this.collectors.set(ds.source_id, collector);
      } else {
        console.warn(`No collector available for data source type/ID: ${ds.type} / ${ds.source_id}`);
      }
    }
    console.log(`Initialized ${this.collectors.size} collectors.`);
  }

  /**
   * Factory method to create collector instances.
   */
  private createCollectorForDataSource(dataSource: DataSource): BaseCollector | null {
    // Logic to determine collector type based on dataSource properties
    // For example, based on canton_id embedded in source_id or a dedicated field
    if (dataSource.source_id.includes('canton_zh')) {
      return new ZurichCollector(dataSource);
    }
    if (dataSource.source_id.includes('canton_ge')) {
      return new GenevaCollector(dataSource);
    }
    // Add cases for BernCollector, VaudCollector, etc.
    // if (dataSource.source_id.includes('canton_be')) {
    //   return new BernCollector(dataSource);
    // }
    // if (dataSource.source_id.includes('federal_estv_brackets')) {
    //   return new FederalBracketCollector(dataSource);
    // }
    // if (dataSource.source_id.includes('federal_fso_municipalities')) {
    //   return new FSOMunicipalityListCollector(dataSource);
    // }
    console.warn(`No specific collector found for source_id: ${dataSource.source_id}. Using generic or skipping.`);
    return null; // Or a generic collector if applicable
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
      log.push(`[INFO] Items Collected (raw docs/calls): ${collectionResult.items_collected}`);
      log.push(`[INFO] Items Parsed from Source: ${collectionResult.items_parsed_successfully}`);
      collectionResult.errors.forEach(e => log.push(`[COLLECTOR_ERROR] ${e.type}: ${e.message}`));

      if (collectionResult.status === 'failure' && collectionResult.errors.some(e => e.type === 'rate_limit')) {
         // Handle rate limit specifically, maybe schedule a later retry without counting against general retries.
         log.push(`[WARN] Rate limit hit for ${dataSource.name}. Will retry later.`);
         // Update data source status to reflect rate limit issue
         await this.updateDataSourceScrapeStatus(dataSource.source_id, 'needs_update', collectionResult.last_scrape_attempt, null, 'Rate limited');
         return createReport('SKIPPED', collectionResult.items_collected, collectionResult.items_parsed_successfully, 0, 'Rate limited');
      }
      
      if (collectionResult.status === 'failure') {
        throw new Error(collectionResult.errors[0]?.message || 'Collector returned failure status.');
      }

      // Process and import the data
      // The `data_preview` in CollectionResult contains an array of ScrapedDataItem-like objects
      // or the actual parsed data items depending on the collector's implementation.
      // For ZurichCollector, mapToScrapedDataItems returns ScrapedDataItem[]
      // and this is what should be in collectionResult.data_preview (or a dedicated field)
      
      let itemsToProcess: ScrapedDataItem[] = [];
      if (collectionResult.data_preview && Array.isArray(collectionResult.data_preview)) {
         // Assuming data_preview contains ScrapedDataItem objects or their JSON strings
         itemsToProcess = collectionResult.data_preview.map(item => 
            typeof item === 'string' ? JSON.parse(item) : item
         ).filter(item => item && item.parsed_data_preview_json); // Ensure it has the data
      } else if ((collector as any).lastScrapedItems) { // Fallback if collectors store items internally
         itemsToProcess = (collector as any).lastScrapedItems;
      }


      const importStats = await this.processAndImportData(itemsToProcess, dataSource);
      log.push(`[INFO] Items imported to DB: ${importStats.importedCount}`);
      log.push(`[INFO] Items failed to import: ${importStats.failedCount}`);
      
      await this.updateDataSourceScrapeStatus(dataSource.source_id, 'active', startTime.toISOString(), new Date().toISOString());

      return createReport(
        collectionResult.status === 'success' && importStats.failedCount === 0 ? 'SUCCESS' : 'PARTIAL_SUCCESS',
        collectionResult.items_collected,
        collectionResult.items_parsed_successfully,
        importStats.importedCount,
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
        return createReport('FAILURE', 0, 0, 0, `Max retries reached. Last error: ${error.message}`, error);
      }
    }
  }

  /**
   * Processes ScrapedDataItems and imports them into the final database tables.
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
          // Assuming parsed_data_preview_json contains a single MunicipalTaxRate object as a string
          const taxRateData = JSON.parse(item.parsed_data_preview_json) as MunicipalTaxRate;
          
          // Further validation/transformation if needed before inserting
          // Example: Ensure BFS_NR exists in municipalities table, canton_id matches dataSource
          const { rows: muniExists } = await client.query('SELECT 1 FROM municipalities WHERE bfs_nr = $1 AND canton_id = $2', [taxRateData.municipality_bfs_nr, dataSource.source_id.split('_')[1].toUpperCase()]);
          if (muniExists.length === 0) {
            console.warn(`Municipality BFS ${taxRateData.municipality_bfs_nr} for canton ${dataSource.source_id.split('_')[1].toUpperCase()} not found. Skipping rate import.`);
            failedCount++;
            continue;
          }
          
          await dbManager.insertMunicipalTaxRate(taxRateData, client);
          importedCount++;
        } catch (parseOrDbError: any) {
          console.error(`Failed to import item ${item.item_id}: ${parseOrDbError.message}`, item);
          failedCount++;
          // Optionally log this specific item failure to a separate table/log
        }
      }

      await dbManager.commitTransaction(client);
    } catch (error: any) {
      console.error(`Transaction failed during data import for source ${dataSource.source_id}: ${error.message}`);
      await dbManager.rollbackTransaction(client);
      // Mark all items intended for this batch as failed if the transaction rolls back
      failedCount += importedCount; // Items that were part of the transaction but not committed
      importedCount = 0; 
    } finally {
      client.release();
    }
    return { importedCount, failedCount };
  }
  
  /**
   * Updates the data source status in the database.
   */
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
        if (notes) currentSource.notes = notes.substring(0, 250); // Truncate notes if too long
        await dbManager.insertDataSource(currentSource, client); // This will UPSERT
      }
      await dbManager.commitTransaction(client);
    } catch (error) {
      console.error(`Failed to update data source status for ${sourceId}:`, error);
      await dbManager.rollbackTransaction(client);
    } finally {
      client.release();
    }
  }

  /**
   * Runs all registered collectors.
   */
  public async runAllCollectors(sequential: boolean = true): Promise<OrchestrationReport[]> {
    console.log(`Starting run for all ${this.collectors.size} collectors. Sequential: ${sequential}`);
    const reports: OrchestrationReport[] = [];
    const sourceIds = Array.from(this.collectors.keys());

    if (sequential) {
      for (const sourceId of sourceIds) {
        const report = await this.runCollector(sourceId);
        reports.push(report);
      }
    } else {
      // Parallel execution (use with caution for external sources)
      const promises = sourceIds.map(sourceId => this.runCollector(sourceId));
      const results = await Promise.allSettled(promises);
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          reports.push(result.value);
        } else {
          // Handle rejected promises if runCollector itself could throw before returning a report
          console.error('A collector run failed unexpectedly in parallel execution:', result.reason);
          // Construct a basic failure report if needed
        }
      });
    }
    console.log('Finished running all collectors.');
    return reports;
  }

  /**
   * Starts a simple scheduler for automated runs.
   * In production, a more robust scheduler like node-cron or an external service (Airflow, AWS Step Functions) would be used.
   */
  public startScheduler(intervalMinutes: number = 60 * 24): void { // Default: run once a day
    if (this.schedulerIntervalId) {
      console.log('Scheduler already running.');
      return;
    }
    console.log(`Starting scheduler to run all collectors every ${intervalMinutes} minutes.`);
    this.schedulerIntervalId = setInterval(async () => {
      console.log(`[Scheduler] Triggering automated run for all collectors at ${new Date().toISOString()}`);
      // Implement logic to check if a source is due for scraping based on scrape_frequency_days
      // For now, just runs all.
      const reports = await this.runAllCollectors();
      // Optionally, generate and store/send a status report after each scheduled run.
      console.log(`[Scheduler] Automated run completed. Reports generated: ${reports.length}`);
    }, intervalMinutes * 60 * 1000);
  }

  public stopScheduler(): void {
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = undefined;
      console.log('Scheduler stopped.');
    }
  }

  /**
   * Generates an overall status report of the data collection platform.
   */
  public async generateOverallStatusReport(recentReports?: OrchestrationReport[]): Promise<OverallStatusReport> {
    const { rows: sourcesFromDb } = await dbManager.query<DataSource>('SELECT * FROM data_sources ORDER BY source_id');
    this.dataSources = sourcesFromDb; // Refresh local cache

    let overallStatus: OverallStatusReport['overallStatus'] = 'HEALTHY';
    let successfulSources = 0;
    let failedSources = 0;

    const dataSourceReports: OrchestrationReport[] = recentReports || []; // Use provided reports or fetch last status
    
    // If no recent reports provided, create a basic status from DB for each source
    if (!recentReports) {
        for (const ds of this.dataSources) {
            dataSourceReports.push({
                sourceId: ds.source_id,
                sourceName: ds.name,
                startTime: ds.last_scrape_attempt || new Date(0).toISOString(),
                endTime: ds.last_scrape_success || new Date(0).toISOString(),
                durationMs: 0, // Not available without a specific run
                status: ds.scraper_status === 'active' && ds.last_scrape_success ? 'SUCCESS' : 
                        ds.scraper_status === 'error' ? 'FAILURE' : 'SKIPPED', // Simplified status
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
        successfulSources++; // Counted as success but might need attention
        if (overallStatus !== 'ERROR') overallStatus = 'WARNING';
      } else if (report.status === 'SUCCESS') {
        successfulSources++;
      }
      // SKIPPED sources do not change overall status from HEALTHY unless others are in error/warning
    });
    
    if (overallStatus === 'HEALTHY' && failedSources === 0 && dataSourceReports.some(r => r.status === 'SKIPPED')) {
        // If some were skipped but no failures, it's a warning
        overallStatus = 'WARNING';
    }


    return {
      overallStatus,
      lastFullRunTime: dataSourceReports.length > 0 ? new Date(Math.max(...dataSourceReports.map(r => new Date(r.endTime).getTime()))).toISOString() : undefined,
      // nextScheduledRunTime: // This would require more complex scheduling logic
      dataSourceReports,
      totalSources: this.dataSources.length,
      successfulSources,
      failedSources,
    };
  }
  
  // --- Methods for populating core reference data (Cantons, Federal Brackets) ---
  
  public async populateInitialCantons(cantonsData: Canton[]): Promise<void> {
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      for (const canton of cantonsData) {
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
  
  public async populateFederalTaxBrackets(bracketsData: FederalTaxBracket[]): Promise<void> {
    const client = await dbManager.connect();
    try {
      await dbManager.beginTransaction(client);
      for (const bracket of bracketsData) {
        await dbManager.insertFederalTaxBracket(bracket, client);
      }
      await dbManager.commitTransaction(client);
      console.log(`Successfully populated/updated ${bracketsData.length} federal tax brackets.`);
    } catch (error) {
      await dbManager.rollbackTransaction(client);
      console.error('Error populating federal tax brackets:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Example of how the orchestrator might be used in a main script/service:
/*
async function mainPlatformRun() {
  const orchestrator = new TaxDataOrchestrator();

  // Define data sources (this would typically come from a config file or DB table itself)
  const predefinedSources: DataSource[] = [
    {
      source_id: 'canton_zh_tax_rates_simulated',
      name: 'Canton Zürich Municipal Tax Rates (Simulated)',
      type: 'cantonal_admin', url: 'simulated://zurich/taxrates.json',
      specific_document_url_pattern: null, data_format: ['json_api'],
      scraper_status: 'active', last_scrape_attempt: null, last_scrape_success: null,
      scrape_frequency_days: 1, notes: 'Simulated ZH source.',
    },
    {
      source_id: 'canton_ge_tax_rates_simulated',
      name: 'Canton Genève Municipal Tax Rates (Simulated)',
      type: 'cantonal_admin', url: 'simulated://geneva/taxrates.json',
      specific_document_url_pattern: null, data_format: ['json_api'],
      scraper_status: 'active', last_scrape_attempt: null, last_scrape_success: null,
      scrape_frequency_days: 1, notes: 'Simulated GE source.',
    },
    // ... add other data sources for FSO, ESTV, and other cantons
  ];

  await orchestrator.initializeDataSources(predefinedSources);

  // Run all collectors
  const reports = await orchestrator.runAllCollectors();
  console.log("\\n--- Overall Orchestration Run Summary ---");
  reports.forEach(report => {
    console.log(`Source: ${report.sourceName}, Status: ${report.status}, Imported: ${report.itemsImported}, Duration: ${report.durationMs}ms`);
    if (report.error) console.error(`  Error: ${report.error}`);
  });

  const statusReport = await orchestrator.generateOverallStatusReport(reports);
  console.log("\\n--- Platform Status Report ---");
  console.log(`Overall Status: ${statusReport.overallStatus}`);
  console.log(`Successful Sources: ${statusReport.successfulSources}/${statusReport.totalSources}`);
  
  // Start scheduler for continuous operation (in a long-running service)
  // orchestrator.startScheduler(60 * 24); // Run daily
  
  // Ensure to close DB pool when application exits
  // process.on('exit', () => dbManager.close());
}

// mainPlatformRun().catch(console.error);
*/
