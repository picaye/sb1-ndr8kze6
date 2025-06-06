/**
 * src/data/swiss-tax-platform/types.ts
 *
 * Defines the core TypeScript interfaces and types for the Swiss Tax Data Platform.
 * These types are based on the standardized schema outlined in the architecture document
 * and support data collection, storage, and tax calculation processes.
 */

// ==============================
// Enumerations and Literal Types
// ==============================

/**
 * Defines the type of tax system a canton uses for municipal taxes.
 */
export type CantonTaxSystemType =
  | 'MultiplierOfCantonalBase' // Municipality applies a multiplier to the cantonal base tax.
  | 'DirectMunicipalRate'      // Municipality sets its own direct tax rate.
  | 'UnifiedCantonalTax';      // Tax is largely unified at cantonal level (e.g., BS).

/**
 * Marital status categories relevant for federal tax calculations.
 */
export type MaritalStatusFederal = 'single' | 'married_joint';

/**
 * Standardized civil status categories.
 */
export type CivilStatusType =
  | 'single'
  | 'married'
  | 'registered_partnership'
  | 'divorced'
  | 'widowed'
  | 'separated'; // Added for completeness

/**
 * Standardized religion types relevant for church tax.
 */
export type ReligionType =
  | 'protestant'           // Evangelisch-Reformiert
  | 'roman_catholic'       // Römisch-Katholisch
  | 'christian_catholic'   // Christkatholisch / Alt-Katholisch
  | 'other'
  | 'none';

/**
 * Types of data sources for tax information.
 */
export type DataSourceType = 'federal_estv' | 'federal_fso' | 'cantonal_admin' | 'municipal_admin' | 'other';

/**
 * Common data formats encountered during collection.
 */
export type DataFormatType = 'pdf' | 'excel_xlsx' | 'excel_xls' | 'csv' | 'html_table' | 'api_json' | 'api_xml' | 'text' | 'manual';

/**
 * Status of a web scraper for a data source.
 */
export type ScraperStatusType = 'active' | 'needs_update' | 'error' | 'manual_only' | 'inactive';

/**
 * Status of a raw data item collected by a scraper.
 */
export type ScrapedItemStatusType = 'pending_parse' | 'parsed_successfully' | 'parse_error' | 'validated' | 'imported';

// ==============================
// Core Data Entities
// ==============================

/**
 * Represents a Swiss Canton.
 */
export interface Canton {
  canton_id: string; // Primary Key (e.g., "ZH", "BE")
  name_de: string;
  name_fr: string;
  name_it: string;
  name_en: string;
  official_website_tax_info: string | null; // URL to the canton's tax information page
  tax_system_type: CantonTaxSystemType;
  last_checked_for_update: string; // ISO Date string
}

/**
 * Represents a Swiss Municipality.
 * Data primarily sourced from the Federal Statistical Office (FSO/BFS).
 */
export interface Municipality {
  bfs_nr: number; // Primary Key (Official BFS Number)
  canton_id: string; // Foreign Key to Canton.canton_id
  name: string; // Official name of the municipality
  postal_code: string; // Main postal code (municipalities can have multiple)
  active_status: boolean; // True if currently an active municipality, false if merged/dissolved
  last_updated_bfs: string; // ISO Date string of last FSO data update for this record
}

/**
 * Stores municipal tax rates for a specific municipality and tax year.
 */
export interface MunicipalTaxRate {
  rate_id: string; // Primary Key (e.g., UUID or composite bfs_nr + tax_year)
  municipality_bfs_nr: number; // Foreign Key to Municipality.bfs_nr
  tax_year: number;
  income_tax_multiplier: number | null; // e.g., 1.19 for 119% of cantonal base tax
  income_tax_rate_direct_percentage: number | null; // Direct municipal income tax rate, if applicable
  wealth_tax_multiplier: number | null;
  wealth_tax_rate_direct_percentage: number | null; // Direct municipal wealth tax rate, if applicable
  church_tax_rate_protestant_multiplier: number | null; // Multiplier on cantonal or municipal tax base
  church_tax_rate_catholic_multiplier: number | null;
  church_tax_rate_christian_catholic_multiplier: number | null;
  source_url: string | null; // URL of the specific document/page for this rate
  valid_from: string | null; // ISO Date string, if specified by source
  valid_to: string | null; // ISO Date string, if specified by source
  data_retrieved_at: string; // ISO Date string when this data was collected/updated
  notes: string | null; // For canton-specific details, e.g., "Steuerfuss in % der einfachen Kantonssteuer"
}

/**
 * Represents a federal tax bracket for income tax.
 */
export interface FederalTaxBracket {
  bracket_id: string; // Primary Key
  tax_year: number;
  marital_status: MaritalStatusFederal;
  income_limit_upper: number; // Upper income limit for this bracket (CHF)
  tax_rate_percentage: number; // Tax rate for income within this bracket (%)
  base_tax_amount: number; // Fixed tax amount for this bracket (CHF)
  // cumulative_tax_at_lower_limit: number; // Total tax up to the lower limit of this bracket (CHF)
  // The 'base_tax_amount' in official tables often represents the 'cumulative_tax_at_lower_limit' plus the tax on the first CHF of the current bracket.
  // For clarity, we might rename or add fields based on how ESTV presents this.
  // For now, base_tax_amount is assumed to be the flat amount added before applying the rate to the excess.
}

/**
 * Stores various cantonal tax parameters that are not municipal-specific rates
 * e.g., cantonal income tax tables, general deductions, wealth tax free amounts.
 */
export interface CantonalTaxParameter {
  parameter_id: string; // Primary Key
  canton_id: string; // Foreign Key to Canton.canton_id
  tax_year: number;
  parameter_name: string; // e.g., "IncomeTaxTable_Single_Unmarried", "ChildDeduction_PerChild", "WealthTaxFreeAmount_Single"
  parameter_value_json: string; // JSON string representing the value (e.g., a rate table, a single number, an array of objects)
  parameter_description: string | null; // Description of what this parameter represents
  source_url: string | null;
  data_retrieved_at: string; // ISO Date string
}

// ==============================
// Supporting Types for Data Collection & Processing
// ==============================

/**
 * Describes a data source for tax information.
 */
export interface DataSource {
  source_id: string; // Primary Key (e.g., "estv_federal_brackets_2024", "canton_zh_tax_rates_2024")
  name: string; // Human-readable name (e.g., "ESTV Federal Tax Brackets 2024", "Canton ZH Tax Admin Rates 2024")
  type: DataSourceType;
  url: string; // Main URL of the data source (e.g., overview page)
  specific_document_url_pattern: string | null; // Pattern for direct document links, if applicable
  data_format: DataFormatType[]; // Array of possible formats (e.g., ['pdf', 'html_table'])
  scraper_status: ScraperStatusType;
  last_scrape_attempt: string | null; // ISO Date string
  last_scrape_success: string | null; // ISO Date string
  scrape_frequency_days: number; // How often to check for updates
  notes: string | null; // Any relevant notes about this data source
}

/**
 * Represents a raw data item collected from a DataSource before parsing.
 */
export interface ScrapedDataItem {
  item_id: string; // Primary Key (e.g., UUID)
  source_id: string; // Foreign Key to DataSource.source_id
  retrieved_at: string; // ISO Date string
  raw_content_path: string | null; // Path to stored raw content (e.g., S3 URI for PDF/Excel)
  raw_content_inline: string | null; // For small text/HTML snippets
  content_type_detected: string | null; // e.g., 'application/pdf', 'text/csv'
  status: ScrapedItemStatusType;
  error_message: string | null; // If status is 'parse_error'
  parsed_data_preview_json: string | null; // Preview of parsed data (JSON string)
}

// ==============================
// Supporting Types for Tax Calculation Engine
// ==============================

/**
 * Standardized input for the tax calculation engine.
 */
export interface TaxCalculationInput {
  request_id: string; // Unique ID for this calculation request
  tax_year: number;
  personal_details: {
    canton_id: string; // e.g., "ZH"
    municipality_bfs_nr: number;
    civil_status: CivilStatusType;
    religion_person1: ReligionType;
    religion_person2: ReligionType | null; // Null if single or not applicable
    number_of_children: number;
  };
  financial_details: {
    taxable_income_federal_chf: number;
    taxable_income_cantonal_chf: number; // Can differ from federal due to cantonal deductions
    taxable_wealth_chf: number;
    // Other relevant financial details might be added here if calculation logic needs them directly
    // e.g., specific deduction amounts if not already factored into taxable_income.
  };
  calculation_options?: {
    include_church_tax: boolean;
    // Other options like "calculate_provisional" vs "calculate_final"
  };
}

/**
 * Standardized output from the tax calculation engine.
 */
export interface TaxCalculationOutput {
  request_id: string; // Corresponds to TaxCalculationInput.request_id
  tax_year: number;
  canton_id: string;
  municipality_bfs_nr: number;
  taxes: {
    federal_income_tax: number | null;
    cantonal_income_tax: number | null;
    municipal_income_tax: number | null;
    church_tax_person1: number | null;
    church_tax_person2: number | null;
    total_church_tax: number | null;
    total_income_tax: number | null;
    cantonal_wealth_tax: number | null;
    municipal_wealth_tax: number | null;
    total_wealth_tax: number | null;
    total_tax_burden: number | null;
  };
  effective_rates: {
    effective_income_tax_rate_percentage: number | null; // (Total Income Tax / Taxable Income Federal) * 100
    overall_effective_tax_rate_percentage: number | null; // (Total Tax Burden / Taxable Income Federal) * 100
  };
  calculation_timestamp: string; // ISO Date string
  calculation_details_json: string | null; // JSON string of intermediate steps or parameters used
  warnings: string[] | null; // Any warnings during calculation (e.g., fallback data used)
  error_message: string | null; // If calculation failed
}

/**
 * Represents a single tax component in a detailed breakdown.
 */
export interface TaxComponent {
  name: string; // e.g., "Federal Direct Tax", "Cantonal Tax Zürich", "Municipal Tax Adliswil"
  amount_chf: number;
  basis_chf?: number; // The taxable amount this component was calculated on
  rate_applied_percentage?: number; // The rate or multiplier used
  notes?: string;
}

/**
 * Detailed breakdown of a tax calculation, often used for display.
 */
export interface DetailedTaxBreakdown {
  summary: TaxCalculationOutput; // Contains the main totals and effective rates
  income_tax_components: TaxComponent[];
  wealth_tax_components?: TaxComponent[];
  church_tax_components?: TaxComponent[];
}
