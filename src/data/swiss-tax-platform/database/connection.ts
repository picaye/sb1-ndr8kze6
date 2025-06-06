/**
 * src/data/swiss-tax-platform/database/connection.ts
 *
 * PostgreSQL database connection manager using the 'pg' library.
 * Includes connection pooling, transaction support, query helpers,
 * and methods for data insertion and schema migrations.
 */

import { Pool, Client, PoolClient, QueryConfig, QueryResult } from 'pg';
import fs from 'fs';
import path from 'path';
import {
  Canton,
  Municipality,
  MunicipalTaxRate,
  FederalTaxBracket,
  CantonalTaxParameter,
  DataSource,
  ScrapedDataItem,
} from '../types';

// For environment variables, ensure you have a .env file or set them in your environment:
// PGHOST=localhost
// PGUSER=your_db_user
// PGDATABASE=swiss_tax_data
// PGPASSWORD=your_db_password
// PGPORT=5432

class DatabaseManager {
  private static instance: DatabaseManager;
  private pool: Pool;

  private constructor() {
    this.pool = new Pool({
      host: process.env.PGHOST || 'localhost',
      user: process.env.PGUSER || 'postgres', // Default user
      database: process.env.PGDATABASE || 'swiss_tax_platform', // Default DB name
      password: process.env.PGPASSWORD || 'password', // Default password - CHANGE THIS
      port: parseInt(process.env.PGPORT || '5432', 10),
      max: 20, // Max number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait for a client to connect
    });

    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on idle client', err);
      // Optionally, you might want to terminate the client or take other actions
    });

    this.pool.on('connect', (client) => {
      // console.log('Database client connected to pool');
    });

    this.pool.on('acquire', (client) => {
      // console.log('Database client acquired from pool');
    });

    this.pool.on('remove', (client) => {
      // console.log('Database client removed from pool');
    });
    
    console.log('DatabaseManager initialized and pool created.');
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  public getPool(): Pool {
    return this.pool;
  }

  public async connect(): Promise<PoolClient> {
    try {
      const client = await this.pool.connect();
      return client;
    } catch (error) {
      console.error('Failed to connect to database pool:', error);
      throw error;
    }
  }

  public async query<T = any>(text: string | QueryConfig, params?: any[]): Promise<QueryResult<T>> {
    const client = await this.connect();
    try {
      const start = Date.now();
      const res = await client.query<T>(text, params);
      const duration = Date.now() - start;
      // console.log('Executed query', { text: typeof text === 'string' ? text : text.text, duration, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('Error executing query:', { text: typeof text === 'string' ? text : text.text, params, error });
      throw error;
    } finally {
      client.release();
    }
  }

  public async beginTransaction(client: PoolClient): Promise<void> {
    await client.query('BEGIN');
  }

  public async commitTransaction(client: PoolClient): Promise<void> {
    await client.query('COMMIT');
  }

  public async rollbackTransaction(client: PoolClient): Promise<void> {
    await client.query('ROLLBACK');
  }

  public async close(): Promise<void> {
    try {
      await this.pool.end();
      console.log('Database pool has been closed.');
    } catch (error) {
      console.error('Error closing database pool:', error);
      throw error;
    }
  }

  // --- Data Insertion Methods ---

  public async insertCanton(canton: Canton, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO cantons (canton_id, name_de, name_fr, name_it, name_en, official_website_tax_info, tax_system_type, last_checked_for_update)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (canton_id) DO UPDATE SET
        name_de = EXCLUDED.name_de,
        name_fr = EXCLUDED.name_fr,
        name_it = EXCLUDED.name_it,
        name_en = EXCLUDED.name_en,
        official_website_tax_info = EXCLUDED.official_website_tax_info,
        tax_system_type = EXCLUDED.tax_system_type,
        last_checked_for_update = EXCLUDED.last_checked_for_update;
    `;
    const params = [
      canton.canton_id, canton.name_de, canton.name_fr, canton.name_it, canton.name_en,
      canton.official_website_tax_info, canton.tax_system_type, canton.last_checked_for_update
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertMunicipality(municipality: Municipality, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO municipalities (bfs_nr, canton_id, name, postal_code, active_status, last_updated_bfs)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (bfs_nr) DO UPDATE SET
        canton_id = EXCLUDED.canton_id,
        name = EXCLUDED.name,
        postal_code = EXCLUDED.postal_code,
        active_status = EXCLUDED.active_status,
        last_updated_bfs = EXCLUDED.last_updated_bfs;
    `;
    const params = [
      municipality.bfs_nr, municipality.canton_id, municipality.name,
      municipality.postal_code, municipality.active_status, municipality.last_updated_bfs
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertMunicipalTaxRate(rate: MunicipalTaxRate, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO municipal_tax_rates (
        rate_id, municipality_bfs_nr, tax_year, 
        income_tax_multiplier, income_tax_rate_direct_percentage,
        wealth_tax_multiplier, wealth_tax_rate_direct_percentage,
        church_tax_rate_protestant_multiplier, church_tax_rate_catholic_multiplier, church_tax_rate_christian_catholic_multiplier,
        source_url, valid_from, valid_to, data_retrieved_at, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (municipality_bfs_nr, tax_year) DO UPDATE SET
        income_tax_multiplier = EXCLUDED.income_tax_multiplier,
        income_tax_rate_direct_percentage = EXCLUDED.income_tax_rate_direct_percentage,
        wealth_tax_multiplier = EXCLUDED.wealth_tax_multiplier,
        wealth_tax_rate_direct_percentage = EXCLUDED.wealth_tax_rate_direct_percentage,
        church_tax_rate_protestant_multiplier = EXCLUDED.church_tax_rate_protestant_multiplier,
        church_tax_rate_catholic_multiplier = EXCLUDED.church_tax_rate_catholic_multiplier,
        church_tax_rate_christian_catholic_multiplier = EXCLUDED.church_tax_rate_christian_catholic_multiplier,
        source_url = EXCLUDED.source_url,
        valid_from = EXCLUDED.valid_from,
        valid_to = EXCLUDED.valid_to,
        data_retrieved_at = EXCLUDED.data_retrieved_at,
        notes = EXCLUDED.notes,
        rate_id = EXCLUDED.rate_id; -- Update rate_id as well if it's newly generated for an update
    `;
    const params = [
      rate.rate_id, rate.municipality_bfs_nr, rate.tax_year,
      rate.income_tax_multiplier, rate.income_tax_rate_direct_percentage,
      rate.wealth_tax_multiplier, rate.wealth_tax_rate_direct_percentage,
      rate.church_tax_rate_protestant_multiplier, rate.church_tax_rate_catholic_multiplier, rate.church_tax_rate_christian_catholic_multiplier,
      rate.source_url, rate.valid_from, rate.valid_to, rate.data_retrieved_at, rate.notes
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertFederalTaxBracket(bracket: FederalTaxBracket, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO federal_tax_brackets (tax_year, marital_status, income_limit_upper, tax_rate_percentage, base_tax_amount)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (tax_year, marital_status, income_limit_upper) DO UPDATE SET
        tax_rate_percentage = EXCLUDED.tax_rate_percentage,
        base_tax_amount = EXCLUDED.base_tax_amount;
    `;
    const params = [
      bracket.tax_year, bracket.marital_status, bracket.income_limit_upper,
      bracket.tax_rate_percentage, bracket.base_tax_amount
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertCantonalTaxParameter(param: CantonalTaxParameter, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO cantonal_tax_parameters (
        canton_id, tax_year, parameter_name, parameter_value_json, 
        parameter_description, source_url, data_retrieved_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (canton_id, tax_year, parameter_name) DO UPDATE SET
        parameter_value_json = EXCLUDED.parameter_value_json,
        parameter_description = EXCLUDED.parameter_description,
        source_url = EXCLUDED.source_url,
        data_retrieved_at = EXCLUDED.data_retrieved_at;
    `;
    const params = [
      param.canton_id, param.tax_year, param.parameter_name, param.parameter_value_json,
      param.parameter_description, param.source_url, param.data_retrieved_at
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertDataSource(dataSource: DataSource, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO data_sources (
        source_id, name, type, url, specific_document_url_pattern, data_format, 
        scraper_status, last_scrape_attempt, last_scrape_success, scrape_frequency_days, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (source_id) DO UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        url = EXCLUDED.url,
        specific_document_url_pattern = EXCLUDED.specific_document_url_pattern,
        data_format = EXCLUDED.data_format,
        scraper_status = EXCLUDED.scraper_status,
        last_scrape_attempt = EXCLUDED.last_scrape_attempt,
        last_scrape_success = EXCLUDED.last_scrape_success,
        scrape_frequency_days = EXCLUDED.scrape_frequency_days,
        notes = EXCLUDED.notes;
    `;
    const params = [
      dataSource.source_id, dataSource.name, dataSource.type, dataSource.url,
      dataSource.specific_document_url_pattern, dataSource.data_format, dataSource.scraper_status,
      dataSource.last_scrape_attempt, dataSource.last_scrape_success,
      dataSource.scrape_frequency_days, dataSource.notes
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  public async insertScrapedDataItem(item: ScrapedDataItem, client?: PoolClient): Promise<QueryResult> {
    const sql = `
      INSERT INTO scraped_data_items (
        item_id, source_id, retrieved_at, raw_content_path, raw_content_inline,
        content_type_detected, status, error_message, parsed_data_preview_json
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (item_id) DO UPDATE SET
        source_id = EXCLUDED.source_id,
        retrieved_at = EXCLUDED.retrieved_at,
        raw_content_path = EXCLUDED.raw_content_path,
        raw_content_inline = EXCLUDED.raw_content_inline,
        content_type_detected = EXCLUDED.content_type_detected,
        status = EXCLUDED.status,
        error_message = EXCLUDED.error_message,
        parsed_data_preview_json = EXCLUDED.parsed_data_preview_json;
    `;
    const params = [
      item.item_id, item.source_id, item.retrieved_at, item.raw_content_path, item.raw_content_inline,
      item.content_type_detected, item.status, item.error_message, item.parsed_data_preview_json
    ];
    return client ? client.query(sql, params) : this.query(sql, params);
  }

  // --- Data Migration Method ---
  public async runMigrations(migrationsDir: string): Promise<void> {
    console.log(`Running migrations from directory: ${migrationsDir}`);
    const client = await this.connect();
    try {
      await this.beginTransaction(client);

      const files = fs.readdirSync(migrationsDir)
        .filter(file => file.endsWith('.sql'))
        .sort(); // Ensure migrations run in order (e.g., V1_init.sql, V2_add_feature.sql)

      if (files.length === 0) {
        console.log('No migration files found.');
        await this.commitTransaction(client); // Commit even if no migrations
        return;
      }

      for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        console.log(`Applying migration: ${file}`);
        const sql = fs.readFileSync(filePath, 'utf8');
        await client.query(sql);
        console.log(`Successfully applied migration: ${file}`);
        // In a more robust system, you'd record this migration in a 'migrations' table.
      }

      await this.commitTransaction(client);
      console.log('All migrations applied successfully.');
    } catch (error) {
      console.error('Error running migrations:', error);
      await this.rollbackTransaction(client);
      throw error;
    } finally {
      client.release();
    }
  }
}

// Export a singleton instance
export const dbManager = DatabaseManager.getInstance();

// Example of how to use it (conceptual):
// async function main() {
//   try {
//     await dbManager.runMigrations(path.join(__dirname, 'migrations')); // Assuming migrations folder is sibling
//     const res = await dbManager.query('SELECT NOW()');
//     console.log('Current time from DB:', res.rows[0]);
//   } catch (err) {
//     console.error('Database operation failed:', err);
//   } finally {
//     await dbManager.close();
//   }
// }
// main();
