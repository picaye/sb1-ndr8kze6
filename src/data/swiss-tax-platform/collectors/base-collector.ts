/**
 * src/data/swiss-tax-platform/collectors/base-collector.ts
 *
 * Defines the base abstract class for data collectors.
 * This class provides a common interface and shared functionality for scraping
 * or collecting data from various Swiss tax administration sources.
 */

import { DataSource, ScrapedDataItem, ScraperStatusType, ScrapedItemStatusType, DataFormatType } from '../types';

// Helper for simple delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export interface CollectionResult {
  source_id: string;
  status: 'success' | 'partial_success' | 'failure';
  items_collected: number;
  items_parsed_successfully: number;
  items_with_errors: number;
  errors: CollectionError[];
  data_preview?: any[]; // Preview of a few successfully parsed items
  raw_data_path?: string; // Path where raw data was stored, if applicable
  duration_ms: number;
  next_scrape_scheduled_at?: string; // ISO date string
}

export interface CollectionError {
  type: 'fetch' | 'parse' | 'rate_limit' | 'validation' | 'unknown';
  message: string;
  details?: any; // e.g., specific error from a library, line number
}

export abstract class BaseCollector {
  protected dataSource: DataSource;
  protected lastRequestTimestamp: number = 0;
  protected minRequestIntervalMs: number = 5000; // Default: 5 seconds between requests to the same source host

  constructor(dataSource: DataSource, minRequestIntervalMs?: number) {
    this.dataSource = dataSource;
    if (minRequestIntervalMs !== undefined) {
      this.minRequestIntervalMs = minRequestIntervalMs;
    }
  }

  /**
   * Abstract method to parse the raw data into a structured format.
   * Must be implemented by subclasses.
   * @param rawData The raw data fetched from the source (string or Buffer).
   * @param format The expected format of the raw data.
   * @returns A promise resolving to an array of structured data items.
   */
  protected abstract parseData(rawData: string | Buffer, format: DataFormatType): Promise<any[]>;

  /**
   * Fetches raw data from the source URL.
   * Can be overridden by subclasses for more complex fetching logic (e.g., using Puppeteer).
   * @returns A promise resolving to the raw data as a string or Buffer.
   */
  protected async fetchRawData(): Promise<string | Buffer> {
    this.logInfo(`Fetching raw data from: ${this.dataSource.url}`);
    
    if (!this.dataSource.url.startsWith('http')) {
      // For now, only support HTTP/HTTPS URLs. Local file handling could be added.
      throw this.createCollectionError('fetch', `Unsupported URL scheme: ${this.dataSource.url}. Only HTTP(S) is supported by base fetcher.`);
    }

    const response = await fetch(this.dataSource.url);
    if (!response.ok) {
      throw this.createCollectionError('fetch', `HTTP error! Status: ${response.status} for ${this.dataSource.url}`, { status: response.status, statusText: response.statusText });
    }

    // Determine if data is binary (e.g., PDF, Excel) or text-based
    const contentType = response.headers.get('content-type');
    if (this.isBinaryFormat(this.dataSource.data_format) || (contentType && this.isBinaryContentType(contentType))) {
      this.logInfo(`Detected binary content type: ${contentType}. Fetching as ArrayBuffer.`);
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer); // Convert to Node.js Buffer
    } else {
      this.logInfo(`Detected text-based content type: ${contentType}. Fetching as text.`);
      return await response.text();
    }
  }
  
  private isBinaryFormat(formats: DataFormatType[]): boolean {
    return formats.some(format => ['pdf', 'excel_xlsx', 'excel_xls'].includes(format));
  }

  private isBinaryContentType(contentType: string): boolean {
    const binaryTypes = ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/octet-stream'];
    return binaryTypes.some(binaryType => contentType.toLowerCase().includes(binaryType));
  }

  /**
   * Orchestrates the data collection process.
   * 1. Applies rate limiting.
   * 2. Fetches raw data.
   * 3. Parses raw data.
   * 4. (Subclass responsibility) Stores/handles parsed data and creates ScrapedDataItem objects.
   * 5. Returns a summary of the collection attempt.
   */
  public async collect(): Promise<CollectionResult> {
    const startTime = Date.now();
    const errors: CollectionError[] = [];
    let parsedItems: any[] = [];
    let rawDataPath: string | undefined; // Subclass might set this if raw data is stored

    this.logInfo(`Starting collection for source: ${this.dataSource.name} (ID: ${this.dataSource.source_id})`);

    try {
      // 1. Rate Limiting
      await this.applyRateLimiting();

      // 2. Fetch Raw Data
      const rawData = await this.fetchRawData();
      // In a real scenario, rawData might be stored to a file/S3, and rawDataPath would be set.
      // For simplicity, we pass it directly to parseData.

      // 3. Parse Data
      // Assuming the first format in the array is the primary one to try.
      // Subclasses might have more sophisticated logic to determine or try multiple formats.
      const primaryDataFormat = this.dataSource.data_format[0] || 'text'; // Default to text if not specified
      parsedItems = await this.parseData(rawData, primaryDataFormat);
      
      this.logInfo(`Successfully parsed ${parsedItems.length} items.`);

      // 4. Process/Store Parsed Data (Abstracted - to be handled by subclass or a subsequent step)
      // This method in a subclass would convert parsedItems into ScrapedDataItem[]
      // and potentially save them or pass them to another service.
      // For this base class, we'll just include a preview in the result.

      return {
        source_id: this.dataSource.source_id,
        status: errors.length > 0 && parsedItems.length > 0 ? 'partial_success' : 'success',
        items_collected: rawData ? 1 : 0, // Assuming one "document" or API call per collection run
        items_parsed_successfully: parsedItems.length,
        items_with_errors: errors.filter(e => e.type === 'parse').length, // Example, could be more granular
        errors,
        data_preview: parsedItems.slice(0, Math.min(3, parsedItems.length)), // Preview first 3 items
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
        next_scrape_scheduled_at: this.calculateNextScrapeTime(true), // Schedule retry sooner on failure
      };
    } finally {
      this.updateDataSourceStatus(errors.length > 0 ? 'error' : 'active');
    }
  }

  /**
   * Applies rate limiting to be polite to the data source.
   */
  protected async applyRateLimiting(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTimestamp;

    if (timeSinceLastRequest < this.minRequestIntervalMs) {
      const delayTime = this.minRequestIntervalMs - timeSinceLastRequest;
      this.logInfo(`Rate limiting: waiting ${delayTime}ms before next request to host of ${this.dataSource.url}`);
      await delay(delayTime);
    }
    this.lastRequestTimestamp = Date.now();
  }

  /**
   * Logs an informational message.
   * @param message The message to log.
   * @param data Optional additional data.
   */
  protected logInfo(message: string, data?: any): void {
    console.log(`[INFO][${this.dataSource.source_id}] ${new Date().toISOString()}: ${message}`, data || '');
  }

  /**
   * Logs an error message.
   * @param message The error message.
   * @param error Optional error object or details.
   */
  protected logError(message: string, error?: any): void {
    console.error(`[ERROR][${this.dataSource.source_id}] ${new Date().toISOString()}: ${message}`, error || '');
  }
  
  /**
   * Logs a warning message.
   * @param message The warning message.
   * @param data Optional additional data.
   */
  protected logWarn(message: string, data?: any): void {
    console.warn(`[WARN][${this.dataSource.source_id}] ${new Date().toISOString()}: ${message}`, data || '');
  }

  /**
   * Creates a standardized CollectionError object.
   */
  protected createCollectionError(type: CollectionError['type'], message: string, details?: any): CollectionError & { isCollectionError: boolean } {
    return { type, message, details, isCollectionError: true };
  }

  /**
   * Updates the status of the data source (conceptual).
   * In a real system, this would update a record in a database or state management.
   */
  protected updateDataSourceStatus(status: ScraperStatusType): void {
    this.logInfo(`Updating data source status to: ${status}`);
    this.dataSource.scraper_status = status;
    this.dataSource.last_scrape_attempt = new Date().toISOString();
    if (status === 'active') {
      this.dataSource.last_scrape_success = new Date().toISOString();
    }
    // Here, you would typically save this updated dataSource object.
  }

  /**
   * Calculates the next scheduled scrape time (conceptual).
   */
  protected calculateNextScrapeTime(dueToFailure: boolean = false): string {
    const now = new Date();
    let intervalDays = this.dataSource.scrape_frequency_days;
    if (dueToFailure) {
      // If failed, retry sooner, e.g., in 1/4 of the normal interval, but not less than 1 day
      intervalDays = Math.max(1, Math.floor(this.dataSource.scrape_frequency_days / 4));
    }
    now.setDate(now.getDate() + intervalDays);
    return now.toISOString();
  }
  
  /**
   * Abstract method to convert parsed items into ScrapedDataItem format.
   * This is often specific to the data structure returned by parseData.
   * @param parsedItems Items returned by this.parseData()
   * @returns An array of ScrapedDataItem objects.
   */
  protected abstract mapToScrapedDataItems(parsedItems: any[]): ScrapedDataItem[];
}
