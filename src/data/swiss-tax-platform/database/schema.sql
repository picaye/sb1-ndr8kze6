-- PostgreSQL schema for the Swiss Tax Data Platform
-- Version 1.0

-- Enable UUID generation if needed, though application can generate UUIDs
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM Types
-- =============================================================================

CREATE TYPE canton_tax_system_type AS ENUM (
    'MultiplierOfCantonalBase',
    'DirectMunicipalRate',
    'UnifiedCantonalTax'
);

COMMENT ON TYPE canton_tax_system_type IS 'Defines the type of tax system a canton uses for municipal taxes.';

CREATE TYPE marital_status_federal AS ENUM (
    'single',
    'married_joint'
);

COMMENT ON TYPE marital_status_federal IS 'Marital status categories relevant for federal tax calculations.';

CREATE TYPE civil_status_type AS ENUM (
    'single',
    'married',
    'registered_partnership',
    'divorced',
    'widowed',
    'separated'
);

COMMENT ON TYPE civil_status_type IS 'Standardized civil status categories for individuals.';

CREATE TYPE religion_type AS ENUM (
    'protestant',
    'roman_catholic',
    'christian_catholic',
    'other',
    'none'
);

COMMENT ON TYPE religion_type IS 'Standardized religion types relevant for church tax.';

CREATE TYPE data_source_type AS ENUM (
    'federal_estv',
    'federal_fso',
    'cantonal_admin',
    'municipal_admin',
    'other'
);

COMMENT ON TYPE data_source_type IS 'Types of data sources for tax information.';

CREATE TYPE data_format_type AS ENUM (
    'pdf',
    'excel_xlsx',
    'excel_xls',
    'csv',
    'html_table',
    'api_json',
    'api_xml',
    'text',
    'manual'
);

COMMENT ON TYPE data_format_type IS 'Common data formats encountered during collection.';

CREATE TYPE scraper_status_type AS ENUM (
    'active',
    'needs_update',
    'error',
    'manual_only',
    'inactive'
);

COMMENT ON TYPE scraper_status_type IS 'Status of a web scraper for a data source.';

CREATE TYPE scraped_item_status_type AS ENUM (
    'pending_parse',
    'parsed_successfully',
    'parse_error',
    'validated',
    'imported'
);

COMMENT ON TYPE scraped_item_status_type IS 'Status of a raw data item collected by a scraper.';


-- =============================================================================
-- Tables
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Cantons Table
-- Stores information about Swiss cantons.
-- -----------------------------------------------------------------------------
CREATE TABLE cantons (
    canton_id VARCHAR(2) PRIMARY KEY,
    name_de VARCHAR(255) NOT NULL,
    name_fr VARCHAR(255) NOT NULL,
    name_it VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    official_website_tax_info TEXT,
    tax_system_type canton_tax_system_type NOT NULL,
    last_checked_for_update TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE cantons IS 'Stores information about Swiss cantons.';
COMMENT ON COLUMN cantons.canton_id IS 'Primary Key, 2-letter canton abbreviation (e.g., ZH, BE).';
COMMENT ON COLUMN cantons.name_de IS 'Official German name of the canton.';
COMMENT ON COLUMN cantons.name_fr IS 'Official French name of the canton.';
COMMENT ON COLUMN cantons.name_it IS 'Official Italian name of the canton.';
COMMENT ON COLUMN cantons.name_en IS 'English name of the canton.';
COMMENT ON COLUMN cantons.official_website_tax_info IS 'URL to the canton''s main tax information page.';
COMMENT ON COLUMN cantons.tax_system_type IS 'Type of tax system the canton uses for municipal taxes.';
COMMENT ON COLUMN cantons.last_checked_for_update IS 'Timestamp of when this canton''s data sources were last checked for updates.';

-- -----------------------------------------------------------------------------
-- Municipalities Table
-- Stores information about Swiss municipalities, sourced from FSO/BFS.
-- -----------------------------------------------------------------------------
CREATE TABLE municipalities (
    bfs_nr INTEGER PRIMARY KEY,
    canton_id VARCHAR(2) NOT NULL REFERENCES cantons(canton_id),
    name VARCHAR(255) NOT NULL,
    postal_code VARCHAR(10) NOT NULL, -- Main postal code, can be multiple in reality
    active_status BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated_bfs TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE municipalities IS 'Stores information about Swiss municipalities, primarily sourced from the Federal Statistical Office (FSO/BFS).';
COMMENT ON COLUMN municipalities.bfs_nr IS 'Official BFS Number of the municipality (Bundesamt für Statistik). Primary Key.';
COMMENT ON COLUMN municipalities.canton_id IS 'Foreign Key referencing the canton this municipality belongs to.';
COMMENT ON COLUMN municipalities.name IS 'Official name of the municipality.';
COMMENT ON COLUMN municipalities.postal_code IS 'Main postal code of the municipality. Note: A municipality can have multiple postal codes.';
COMMENT ON COLUMN municipalities.active_status IS 'True if the municipality is currently active, False if merged or dissolved.';
COMMENT ON COLUMN municipalities.last_updated_bfs IS 'Timestamp of the last FSO data update for this municipality record.';

CREATE INDEX idx_municipalities_canton_id ON municipalities(canton_id);
CREATE INDEX idx_municipalities_name ON municipalities(name); -- For searching by name

-- -----------------------------------------------------------------------------
-- Municipal Tax Rates Table
-- Stores specific tax rates for each municipality per year.
-- -----------------------------------------------------------------------------
CREATE TABLE municipal_tax_rates (
    rate_id TEXT PRIMARY KEY, -- Application-generated UUID
    municipality_bfs_nr INTEGER NOT NULL REFERENCES municipalities(bfs_nr),
    tax_year INTEGER NOT NULL,
    income_tax_multiplier DECIMAL(6, 4), -- e.g., 1.1900 for 119.00% or 0.8500 for 85.00%
    income_tax_rate_direct_percentage DECIMAL(7, 4), -- e.g., 12.3456 for 12.3456%
    wealth_tax_multiplier DECIMAL(6, 4),
    wealth_tax_rate_direct_percentage DECIMAL(7, 4),
    church_tax_rate_protestant_multiplier DECIMAL(6, 4),
    church_tax_rate_catholic_multiplier DECIMAL(6, 4),
    church_tax_rate_christian_catholic_multiplier DECIMAL(6, 4),
    source_url TEXT,
    valid_from DATE,
    valid_to DATE,
    data_retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT,
    CONSTRAINT uq_municipality_year UNIQUE (municipality_bfs_nr, tax_year)
);

COMMENT ON TABLE municipal_tax_rates IS 'Stores specific tax rates (multipliers or direct rates) for each municipality per tax year.';
COMMENT ON COLUMN municipal_tax_rates.rate_id IS 'Primary Key, typically an application-generated UUID.';
COMMENT ON COLUMN municipal_tax_rates.municipality_bfs_nr IS 'Foreign Key referencing the municipality.';
COMMENT ON COLUMN municipal_tax_rates.tax_year IS 'The tax year these rates apply to (e.g., 2024).';
COMMENT ON COLUMN municipal_tax_rates.income_tax_multiplier IS 'Municipal income tax multiplier (decimal form, e.g., 1.19 for 119%). Null if canton uses direct rates.';
COMMENT ON COLUMN municipal_tax_rates.income_tax_rate_direct_percentage IS 'Direct municipal income tax rate as a percentage (e.g., 5.5 for 5.5%). Null if canton uses multipliers.';
COMMENT ON COLUMN municipal_tax_rates.wealth_tax_multiplier IS 'Municipal wealth tax multiplier.';
COMMENT ON COLUMN municipal_tax_rates.wealth_tax_rate_direct_percentage IS 'Direct municipal wealth tax rate as a percentage.';
COMMENT ON COLUMN municipal_tax_rates.church_tax_rate_protestant_multiplier IS 'Multiplier for Protestant church tax, applied to cantonal or municipal tax base.';
COMMENT ON COLUMN municipal_tax_rates.church_tax_rate_catholic_multiplier IS 'Multiplier for Roman Catholic church tax.';
COMMENT ON COLUMN municipal_tax_rates.church_tax_rate_christian_catholic_multiplier IS 'Multiplier for Christian Catholic church tax.';
COMMENT ON COLUMN municipal_tax_rates.source_url IS 'URL of the specific document/page where this rate was found.';
COMMENT ON COLUMN municipal_tax_rates.valid_from IS 'Date from which this rate is valid, if specified by source.';
COMMENT ON COLUMN municipal_tax_rates.valid_to IS 'Date until which this rate is valid, if specified by source.';
COMMENT ON COLUMN municipal_tax_rates.data_retrieved_at IS 'Timestamp when this specific rate data was collected/updated.';
COMMENT ON COLUMN municipal_tax_rates.notes IS 'Notes on specific calculation details or context for this rate (e.g., "Steuerfuss in % der einfachen Kantonssteuer").';
COMMENT ON CONSTRAINT uq_municipality_year ON municipal_tax_rates IS 'Ensures only one set of rates per municipality per year.';

CREATE INDEX idx_mtr_municipality_bfs_nr ON municipal_tax_rates(municipality_bfs_nr);
CREATE INDEX idx_mtr_tax_year ON municipal_tax_rates(tax_year);

-- -----------------------------------------------------------------------------
-- Federal Tax Brackets Table
-- Stores federal income tax brackets.
-- -----------------------------------------------------------------------------
CREATE TABLE federal_tax_brackets (
    bracket_id SERIAL PRIMARY KEY,
    tax_year INTEGER NOT NULL,
    marital_status marital_status_federal NOT NULL,
    income_limit_upper DECIMAL(15, 2) NOT NULL, -- Upper income limit for this bracket (CHF)
    tax_rate_percentage DECIMAL(5, 2) NOT NULL, -- Tax rate for income within this bracket (%)
    base_tax_amount DECIMAL(15, 2) NOT NULL, -- Fixed tax amount for income up to the lower limit of this bracket (CHF)
    CONSTRAINT uq_federal_bracket UNIQUE (tax_year, marital_status, income_limit_upper)
);

COMMENT ON TABLE federal_tax_brackets IS 'Stores federal income tax brackets for different tax years and marital statuses.';
COMMENT ON COLUMN federal_tax_brackets.bracket_id IS 'Auto-incrementing Primary Key.';
COMMENT ON COLUMN federal_tax_brackets.tax_year IS 'The tax year these brackets apply to.';
COMMENT ON COLUMN federal_tax_brackets.marital_status IS 'Marital status for these brackets (single or married_joint).';
COMMENT ON COLUMN federal_tax_brackets.income_limit_upper IS 'Upper income threshold for this tax bracket in CHF. The last bracket for a status will have a very large number or specific handling for infinity.';
COMMENT ON COLUMN federal_tax_brackets.tax_rate_percentage IS 'The marginal tax rate percentage for income falling into this bracket (e.g., 11.50 for 11.50%).';
COMMENT ON COLUMN federal_tax_brackets.base_tax_amount IS 'The fixed base amount of tax due for income reaching the lower limit of this bracket. Tax for income in this bracket is base_tax_amount + (income_in_this_bracket * tax_rate_percentage).';
COMMENT ON CONSTRAINT uq_federal_bracket ON federal_tax_brackets IS 'Ensures uniqueness for each bracket definition.';

CREATE INDEX idx_ftb_tax_year_status ON federal_tax_brackets(tax_year, marital_status);

-- -----------------------------------------------------------------------------
-- Cantonal Tax Parameters Table
-- Stores various cantonal tax parameters like deduction amounts, cantonal tax tables, etc.
-- -----------------------------------------------------------------------------
CREATE TABLE cantonal_tax_parameters (
    parameter_id SERIAL PRIMARY KEY,
    canton_id VARCHAR(2) NOT NULL REFERENCES cantons(canton_id),
    tax_year INTEGER NOT NULL,
    parameter_name VARCHAR(255) NOT NULL, -- e.g., "IncomeTaxTable_Single", "ChildDeduction", "WealthTaxFreeAmount"
    parameter_value_json JSONB NOT NULL, -- Stores complex values like rate tables or arrays of objects as JSON
    parameter_description TEXT,
    source_url TEXT,
    data_retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT uq_cantonal_parameter UNIQUE (canton_id, tax_year, parameter_name)
);

COMMENT ON TABLE cantonal_tax_parameters IS 'Stores various cantonal tax parameters that are not municipal-specific rates, e.g., cantonal income tax tables, general deductions, wealth tax free amounts.';
COMMENT ON COLUMN cantonal_tax_parameters.parameter_id IS 'Auto-incrementing Primary Key.';
COMMENT ON COLUMN cantonal_tax_parameters.canton_id IS 'Foreign Key referencing the canton.';
COMMENT ON COLUMN cantonal_tax_parameters.tax_year IS 'The tax year this parameter applies to.';
COMMENT ON COLUMN cantonal_tax_parameters.parameter_name IS 'Unique name identifying the parameter (e.g., "ChildDeduction_PerChild_MaxAge18").';
COMMENT ON COLUMN cantonal_tax_parameters.parameter_value_json IS 'The value of the parameter, stored as JSONB to accommodate various data structures (single values, arrays, objects, tables).';
COMMENT ON COLUMN cantonal_tax_parameters.parameter_description IS 'A human-readable description of what this parameter represents.';
COMMENT ON COLUMN cantonal_tax_parameters.source_url IS 'URL of the specific document/page where this parameter was found.';
COMMENT ON COLUMN cantonal_tax_parameters.data_retrieved_at IS 'Timestamp when this parameter data was collected/updated.';
COMMENT ON CONSTRAINT uq_cantonal_parameter ON cantonal_tax_parameters IS 'Ensures uniqueness for each cantonal parameter per year.';

CREATE INDEX idx_ctp_canton_year_name ON cantonal_tax_parameters(canton_id, tax_year, parameter_name);

-- -----------------------------------------------------------------------------
-- Data Sources Table
-- Describes the sources from which tax data is collected.
-- -----------------------------------------------------------------------------
CREATE TABLE data_sources (
    source_id VARCHAR(255) PRIMARY KEY, -- e.g., "estv_federal_brackets_2024", "canton_zh_tax_rates_2024"
    name VARCHAR(255) NOT NULL,
    type data_source_type NOT NULL,
    url TEXT NOT NULL, -- Main URL of the data source
    specific_document_url_pattern TEXT, -- Pattern for direct document links, if applicable
    data_format data_format_type[] NOT NULL, -- Array of possible formats (e.g., {'pdf', 'html_table'})
    scraper_status scraper_status_type NOT NULL,
    last_scrape_attempt TIMESTAMP WITH TIME ZONE,
    last_scrape_success TIMESTAMP WITH TIME ZONE,
    scrape_frequency_days INTEGER NOT NULL DEFAULT 30,
    notes TEXT
);

COMMENT ON TABLE data_sources IS 'Describes the sources from which tax data is collected (e.g., specific government web pages, APIs, documents).';
COMMENT ON COLUMN data_sources.source_id IS 'Unique identifier for the data source, application-generated.';
COMMENT ON COLUMN data_sources.name IS 'Human-readable name of the data source.';
COMMENT ON COLUMN data_sources.type IS 'Type of the data source (federal, cantonal, etc.).';
COMMENT ON COLUMN data_sources.url IS 'Main URL of the data source page or API endpoint.';
COMMENT ON COLUMN data_sources.specific_document_url_pattern IS 'A URL pattern if documents are versioned by year or other parameters (e.g., https://example.com/tax_rates_{year}.pdf).';
COMMENT ON COLUMN data_sources.data_format IS 'Array of expected data formats from this source.';
COMMENT ON COLUMN data_sources.scraper_status IS 'Current status of the automated scraper for this source.';
COMMENT ON COLUMN data_sources.last_scrape_attempt IS 'Timestamp of the last attempt to scrape this source.';
COMMENT ON COLUMN data_sources.last_scrape_success IS 'Timestamp of the last successful scrape from this source.';
COMMENT ON COLUMN data_sources.scrape_frequency_days IS 'How often (in days) this source should be checked for updates.';
COMMENT ON COLUMN data_sources.notes IS 'Any relevant notes about this data source, e.g., access restrictions, data structure peculiarities.';

CREATE INDEX idx_ds_type ON data_sources(type);
CREATE INDEX idx_ds_scraper_status ON data_sources(scraper_status);

-- -----------------------------------------------------------------------------
-- Scraped Data Items Table
-- Stores raw or semi-processed data items collected from data sources before full normalization and import.
-- -----------------------------------------------------------------------------
CREATE TABLE scraped_data_items (
    item_id TEXT PRIMARY KEY, -- Application-generated UUID
    source_id VARCHAR(255) NOT NULL REFERENCES data_sources(source_id),
    retrieved_at TIMESTAMP WITH TIME ZONE NOT NULL,
    raw_content_path TEXT, -- Path to stored raw content (e.g., S3 URI for PDF/Excel)
    raw_content_inline TEXT, -- For small text/HTML snippets directly stored
    content_type_detected VARCHAR(100), -- e.g., 'application/pdf', 'text/csv'
    status scraped_item_status_type NOT NULL,
    error_message TEXT, -- If status is 'parse_error' or similar
    parsed_data_preview_json JSONB, -- Preview of parsed data (JSON string) for quick inspection
    CONSTRAINT chk_raw_content CHECK (raw_content_path IS NOT NULL OR raw_content_inline IS NOT NULL)
);

COMMENT ON TABLE scraped_data_items IS 'Stores raw or semi-processed data items collected from DataSources before full normalization and import into main tax tables.';
COMMENT ON COLUMN scraped_data_items.item_id IS 'Primary Key, typically an application-generated UUID.';
COMMENT ON COLUMN scraped_data_items.source_id IS 'Foreign Key referencing the data source from which this item was collected.';
COMMENT ON COLUMN scraped_data_items.retrieved_at IS 'Timestamp when this item was retrieved from the source.';
COMMENT ON COLUMN scraped_data_items.raw_content_path IS 'Path/URI to the stored raw content if it''s a file (e.g., S3, local file system).';
COMMENT ON COLUMN scraped_data_items.raw_content_inline IS 'The raw content itself if it''s small enough to be stored directly (e.g., a few lines of text, small JSON).';
COMMENT ON COLUMN scraped_data_items.content_type_detected IS 'The detected MIME type of the raw content.';
COMMENT ON COLUMN scraped_data_items.status IS 'Current processing status of this scraped item.';
COMMENT ON COLUMN scraped_data_items.error_message IS 'Details of any error encountered during parsing or processing.';
COMMENT ON COLUMN scraped_data_items.parsed_data_preview_json IS 'A JSONB representation of the parsed data for quick inspection or debugging, before it is transformed into the final schema.';
COMMENT ON CONSTRAINT chk_raw_content ON scraped_data_items IS 'Ensures that either a path to raw content or inline raw content is provided.';

CREATE INDEX idx_sdi_source_id ON scraped_data_items(source_id);
CREATE INDEX idx_sdi_status ON scraped_data_items(status);
CREATE INDEX idx_sdi_retrieved_at ON scraped_data_items(retrieved_at);

-- =============================================================================
-- End of Schema
-- =============================================================================
