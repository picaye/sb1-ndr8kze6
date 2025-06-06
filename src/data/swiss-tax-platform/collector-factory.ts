/**
 * src/data/swiss-tax-platform/collector-factory.ts
 *
 * Factory for creating canton-specific data collectors and managing data source configurations.
 * This centralizes the logic for instantiating the correct collector based on the data source
 * and provides a canonical list of data sources for the platform.
 */

import { DataSource, DataFormatType, CantonTaxSystemType } from '../types';
import { BaseCollector } from './collectors/base-collector';
import { ZurichCollector } from './collectors/zurich-collector';
import { GenevaCollector } from './collectors/geneva-collector';
import { BernCollector } from './collectors/bern-collector';
import { VaudCollector } from './collectors/vaud-collector';
import { AargauCollector } from './collectors/aargau-collector';
import { StGallenCollector } from './collectors/stgallen-collector';
import { LucerneCollector } from './collectors/lucerne-collector';
import { TicinoCollector } from './collectors/ticino-collector';
import { BaselLandschaftCollector } from './collectors/basel-landschaft-collector';
import { ValaisCollector } from './collectors/valais-collector';
import { ThurgauCollector } from './collectors/thurgau-collector';
import { SolothurnCollector } from './collectors/solothurn-collector';
import { FribourgCollector } from './collectors/fribourg-collector';
import { BaselStadtCollector } from './collectors/basel-stadt-collector';
import { ZugCollector } from './collectors/zug-collector';
import { SchaffhausenCollector } from './collectors/schaffhausen-collector';
import { GraubuendenCollector } from './collectors/graubuenden-collector';
import { JuraCollector } from './collectors/jura-collector';
import { NeuchatelCollector } from './collectors/neuchatel-collector'; // Added import
import { SchwyzCollector } from './collectors/schwyz-collector'; // Added import
import { GlarusCollector } from './collectors/glarus-collector'; // Added import
// Import other implemented canton collectors here as they are created
// e.g., import { SchwyzCollector } from './collectors/schwyz-collector';
// e.g., import { GlarusCollector } from './collectors/glarus-collector';

/**
 * Comprehensive list of Swiss Cantons with names in multiple languages and their codes.
 * This is the canonical source for canton information within the platform.
 */
export const CANTON_CODES_FOR_POPULATION: Array<{
  code: string;
  name_de: string;
  name_fr: string;
  name_it: string;
  name_en: string;
}> = [
  { code: 'AG', name_de: 'Aargau', name_fr: 'Argovie', name_it: 'Argovia', name_en: 'Aargau' },
  { code: 'AI', name_de: 'Appenzell Innerrhoden', name_fr: 'Appenzell Rhodes-Intérieures', name_it: 'Appenzello Interno', name_en: 'Appenzell Innerrhoden' },
  { code: 'AR', name_de: 'Appenzell Ausserrhoden', name_fr: 'Appenzell Rhodes-Extérieures', name_it: 'Appenzello Esterno', name_en: 'Appenzell Ausserrhoden' },
  { code: 'BE', name_de: 'Bern', name_fr: 'Berne', name_it: 'Berna', name_en: 'Bern' },
  { code: 'BL', name_de: 'Basel-Landschaft', name_fr: 'Bâle-Campagne', name_it: 'Basilea Campagna', name_en: 'Basel-Landschaft' },
  { code: 'BS', name_de: 'Basel-Stadt', name_fr: 'Bâle-Ville', name_it: 'Basilea Città', name_en: 'Basel-Stadt' },
  { code: 'FR', name_de: 'Freiburg', name_fr: 'Fribourg', name_it: 'Friburgo', name_en: 'Fribourg' },
  { code: 'GE', name_de: 'Genf', name_fr: 'Genève', name_it: 'Ginevra', name_en: 'Geneva' },
  { code: 'GL', name_de: 'Glarus', name_fr: 'Glaris', name_it: 'Glarona', name_en: 'Glarus' },
  { code: 'GR', name_de: 'Graubünden', name_fr: 'Grisons', name_it: 'Grigioni', name_en: 'Graubünden' },
  { code: 'JU', name_de: 'Jura', name_fr: 'Jura', name_it: 'Giura', name_en: 'Jura' },
  { code: 'LU', name_de: 'Luzern', name_fr: 'Lucerne', name_it: 'Lucerna', name_en: 'Lucerne' },
  { code: 'NE', name_de: 'Neuenburg', name_fr: 'Neuchâtel', name_it: 'Neuchâtel', name_en: 'Neuchâtel' },
  { code: 'NW', name_de: 'Nidwalden', name_fr: 'Nidwald', name_it: 'Nidvaldo', name_en: 'Nidwalden' },
  { code: 'OW', name_de: 'Obwalden', name_fr: 'Obwald', name_it: 'Obvaldo', name_en: 'Obwalden' },
  { code: 'SG', name_de: 'St. Gallen', name_fr: 'Saint-Gall', name_it: 'San Gallo', name_en: 'St. Gallen' },
  { code: 'SH', name_de: 'Schaffhausen', name_fr: 'Schaffhouse', name_it: 'Sciaffusa', name_en: 'Schaffhausen' },
  { code: 'SO', name_de: 'Solothurn', name_fr: 'Soleure', name_it: 'Soletta', name_en: 'Solothurn' },
  { code: 'SZ', name_de: 'Schwyz', name_fr: 'Schwytz', name_it: 'Svitto', name_en: 'Schwyz' },
  { code: 'TG', name_de: 'Thurgau', name_fr: 'Thurgovie', name_it: 'Turgovia', name_en: 'Thurgau' },
  { code: 'TI', name_de: 'Tessin', name_fr: 'Tessin', name_it: 'Ticino', name_en: 'Ticino' },
  { code: 'UR', name_de: 'Uri', name_fr: 'Uri', name_it: 'Uri', name_en: 'Uri' },
  { code: 'VD', name_de: 'Waadt', name_fr: 'Vaud', name_it: 'Vaud', name_en: 'Vaud' },
  { code: 'VS', name_de: 'Wallis', name_fr: 'Valais', name_it: 'Vallese', name_en: 'Valais' },
  { code: 'ZG', name_de: 'Zug', name_fr: 'Zoug', name_it: 'Zugo', name_en: 'Zug' },
  { code: 'ZH', name_de: 'Zürich', name_fr: 'Zurich', name_it: 'Zurigo', name_en: 'Zurich' },
];

type CantonAbbreviation = typeof CANTON_CODES_FOR_POPULATION[number]['code'];


/**
 * Predefined list of data sources for all 26 Swiss cantons.
 * URLs are illustrative and would need to be verified and maintained.
 * Data formats are typical but may vary.
 */
export const PREDEFINED_DATA_SOURCES: DataSource[] = CANTON_CODES_FOR_POPULATION.map((cantonInfo) => {
  const cantonCode = cantonInfo.code as CantonAbbreviation;
  const cantonName = cantonInfo.name_de; // Using German name for default notes, adjust if needed
  let url = `https://www.${cantonCode.toLowerCase()}.ch/steuern/steuerfüsse`; // Common pattern
  let formats: DataFormatType[] = ['pdf', 'excel_xlsx', 'html_table'];
  let notes = `Municipal tax rates (Steuerfüsse/Centimes additionnels) for Canton ${cantonName}.`;
  let taxSystem: CantonTaxSystemType = 'MultiplierOfCantonalBase'; // Default assumption

  // Canton-specific adjustments
  switch (cantonCode) {
    case 'ZH':
      url = 'https://www.zh.ch/de/steuern-finanzen/steuern/steuerstatistiken/aktuelle-gemeinde-steuerfuesse.html';
      formats = ['excel_xlsx', 'csv', 'html_table'];
      notes += ' Uses percentage multipliers.';
      break;
    case 'BE':
      url = `https://www.taxinfo.sv.fin.be.ch/taxinfo/s/gemeinden/steueranlagen`; 
      formats = ['pdf', 'html_table'];
      notes += ' Uses decimal multipliers (Steueranlage). Church tax is % of cantonal tax.';
      break;
    case 'LU':
      url = `https://steuern.lu.ch/gemeinden/steuerfuess`;
      notes += ' Uses units of cantonal base tax.';
      break;
    case 'UR':
      url = `https://www.ur.ch/themen/2758`; 
      notes += ' Steuerfuss in % der einfachen Kantonssteuer.';
      break;
    case 'SZ':
      url = `https://www.sz.ch/public/upload/assets/45300/Steuerf%C3%BCsse%20Gemeinden%20def.pdf`; 
      formats = ['pdf'];
      notes += ' Steuerfuss in % des kantonalen Einheitssatzes.';
      break;
    case 'OW':
      url = `https://www.ow.ch/de/verwaltung/dienstleistungen/?dienst_id=4307`;
      notes += ' Einheitsansatz in %.';
      break;
    case 'NW':
      url = `https://www.nw.ch/steuerverwaltung/natuerlichepersonen/tarifeundsteuerfuesse`;
      notes += ' Steuerfuss in % der einfachen Kantonssteuer.';
      break;
    case 'GL':
      url = `https://www.gl.ch/verwaltung/finanzen-und-gesundheit/steuern/steuertarife-und-steuerfuesse.html/10585`;
      notes += ' Unified municipal tax rate for Glarus, Glarus Nord, Glarus Süd. Steuerfuss in % der einfachen Kantonssteuer.';
      break;
    case 'ZG':
      url = `https://www.zg.ch/behoerden/finanzdirektion/steuerverwaltung/steuern-natuerliche-personen/steuerfuss`;
      notes += ' Steuerfuss in % des Kantonssteuerbetrags.';
      break;
    case 'FR':
      url = `https://www.fr.ch/de/steuern/steuerpflichtige-personen/natuerliche-personen/steuersaetze-und-koeffizienten`;
      notes += ' Coefficient communal.';
      break;
    case 'SO':
      url = `https://so.ch/verwaltung/finanzdepartement/steueramt/dienstleistungen/steuersaetze-und-steuerfuesse/`;
      break;
    case 'BS':
      url = `https://www.steuerverwaltung.bs.ch/steuern-natuerliche-personen/steuertarife-und-rechner.html`;
      taxSystem = 'UnifiedCantonalTax';
      notes = ' Unified cantonal tax; municipal multiplier is effectively 1.0 or integrated.';
      break;
    case 'BL':
      url = `https://www.baselland.ch/politik-und-behorden/direktionen/finanz-und-kirchendirektion/steuerverwaltung/dienstleistungen/steuersatze-und-steuerfusse`;
      notes += ' Steuerfuss in % des Staatssteuerbetrags.';
      break;
    case 'SH':
      url = `https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Kantonale-Steuerverwaltung-1333684-DE.html`;
      notes += ' Steuerfuss in % des Kantonssteuerbetrags.';
      break;
    case 'AR':
      url = `https://www.ar.ch/verwaltung/departement-finanzen/steuerverwaltung/steuern-allgemein/steuerfuesse/`;
      notes += ' Steuerfuss in Promille der einfachen Kantonssteuer.';
      break;
    case 'AI':
      url = `https://www.ai.ch/verwaltung/volkswirtschaftsdepartement/kantonale-steuerverwaltung/steuerfuesse`;
      notes += ' Specific system, often lower multipliers.';
      break;
    case 'SG':
      url = `https://www.sg.ch/tools/informationen-tools/steuern-sg/steuerfuesse-und-hebesaetze.html`;
      break;
    case 'GR':
      url = `https://www.gr.ch/DE/institutionen/verwaltung/dfg/stv/steuerberechnung/Seiten/default.aspx`;
      break;
    case 'TG':
      url = `https://steuerverwaltung.tg.ch/natuerliche-personen/steuerfuesse.html/11081`;
      notes += ' Gemeindesteuerfuss (Total in % der einfachen Steuer).';
      break;
    case 'TI':
      url = `https://www4.ti.ch/dfe/dc/sportello/moltiplicatori/`;
      notes += ' Moltiplicatore comunale.';
      break;
    case 'VD':
      url = `https://www.vd.ch/themes/etat-droit-finances/impots/personnes-physiques/baremes-et-coefficients/`;
      notes += ' Taux d\\\'impôt communal en % de l\\\'impôt cantonal de base.';
      break;
    case 'VS':
      url = `https://www.vs.ch/web/scc/coefficients-et-baremes`;
      notes += ' Coefficient communal.';
      break;
    case 'NE':
      url = `https://www.ne.ch/autorites/DFS/SCCO/Pages/coefficients.aspx`;
      notes += ' Coefficient communal.';
      break;
    case 'GE':
      url = `https://www.ge.ch/document/coefficients-centimes-additionnels-impot-communal`;
      formats = ['pdf', 'html_table'];
      notes = `Centimes additionnels for Canton ${cantonName}. Multiplier applied to cantonal base tax.`;
      break;
    case 'JU':
      url = `https://www.jura.ch/dfi/SCC/Contributions-Directes/Personnes-physiques/Quotites-et-baremes.html`;
      break;
  }

  return {
    source_id: `canton_${cantonCode.toLowerCase()}_municipal_tax_rates`,
    name: `Canton ${cantonName} (${cantonCode}) Municipal Tax Rates`,
    type: 'cantonal_admin',
    url,
    specific_document_url_pattern: null, 
    data_format: formats,
    scraper_status: 'active', 
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 90, 
    notes,
  };
});

// Add federal sources
PREDEFINED_DATA_SOURCES.push(
  {
    source_id: 'federal_estv_tax_brackets',
    name: 'Federal Tax Administration (ESTV) - Federal Tax Brackets',
    type: 'federal_estv',
    url: 'https://www.estv.admin.ch/estv/de/home/direkte-bundessteuer/dbst-steuertarife.html', 
    specific_document_url_pattern: null,
    data_format: ['html_table', 'pdf'],
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 365, // Annually
    notes: 'Official federal income tax brackets.',
  },
  {
    source_id: 'federal_fso_municipalities',
    name: 'Federal Statistical Office (FSO) - Official Municipality List',
    type: 'federal_fso',
    url: 'https://www.bfs.admin.ch/bfs/de/home/grundlagen/agvch.html', 
    specific_document_url_pattern: null,
    data_format: ['excel_xlsx', 'csv', 'api_json'], 
    scraper_status: 'active',
    last_scrape_attempt: null,
    last_scrape_success: null,
    scrape_frequency_days: 90, // Quarterly for updates like mergers
    notes: 'Official list of Swiss municipalities, BFS numbers, canton affiliation, etc.',
  }
);


export class CollectorFactory {
  /**
   * Returns a list of all predefined data source configurations.
   */
  public static getAllDataSources(): DataSource[] {
    return [...PREDEFINED_DATA_SOURCES]; // Return a copy
  }

  /**
   * Creates a specific data collector instance based on the DataSource configuration.
   * This now includes more specialized collectors for cantons like Basel-Stadt.
   * @param dataSource The DataSource object for which to create a collector.
   * @returns An instance of a BaseCollector subclass, or null if no suitable collector is found.
   */
  public static createCollector(dataSource: DataSource): BaseCollector | null {
    const sourceIdParts = dataSource.source_id.split('_');
    let cantonCode: CantonAbbreviation | undefined;

    if (sourceIdParts.length >= 2 && sourceIdParts[0] === 'canton') {
      const potentialCode = sourceIdParts[1].toUpperCase();
      if (CANTON_CODES_FOR_POPULATION.find(c => c.code === potentialCode)) {
        cantonCode = potentialCode as CantonAbbreviation;
      }
    }
    
    if (dataSource.type === 'federal_estv' || dataSource.type === 'federal_fso') {
        console.warn(`Collector for federal source type '${dataSource.type}' (ID: ${dataSource.source_id}) not yet implemented. Returning null.`);
        // TODO: Implement FederalDataSourceCollector or FSOMunicipalityListCollector
        return null;
    }

    if (!cantonCode) {
      console.warn(`Could not determine canton code from source_id: ${dataSource.source_id}. Cannot create specific collector. Returning null.`);
      return null;
    }
    
    switch (cantonCode) {
      case 'ZH':
        return new ZurichCollector(dataSource);
      case 'BE':
        return new BernCollector(dataSource);
      case 'GE':
        return new GenevaCollector(dataSource);
      case 'VD':
        return new VaudCollector(dataSource);
      case 'AG':
        return new AargauCollector(dataSource);
      case 'SG':
        return new StGallenCollector(dataSource);
      case 'LU':
        return new LucerneCollector(dataSource);
      case 'TI':
        return new TicinoCollector(dataSource);
      case 'BL':
        return new BaselLandschaftCollector(dataSource);
      case 'VS':
        return new ValaisCollector(dataSource);
      case 'TG':
        return new ThurgauCollector(dataSource);
      case 'SO':
        return new SolothurnCollector(dataSource);
      case 'FR':
        return new FribourgCollector(dataSource);
      case 'BS': 
        return new BaselStadtCollector(dataSource);
      case 'ZG':
        return new ZugCollector(dataSource);
      case 'SH':
        return new SchaffhausenCollector(dataSource);
      case 'GR':
        return new GraubuendenCollector(dataSource);
      case 'JU':
        return new JuraCollector(dataSource);
      case 'NE': // Added Neuchâtel
        return new NeuchatelCollector(dataSource);
      case 'SZ':
        return new SchwyzCollector(dataSource);
      case 'GL':
        return new GlarusCollector(dataSource);
        return new NeuchatelCollector(dataSource);
      // Add cases for other implemented collectors:
      // case 'SZ':
      //   return new SchwyzCollector(dataSource);
      // case 'GL':
      //   return new GlarusCollector(dataSource);
      default:
        console.warn(`No specific collector implemented for Canton ${cantonCode} (Source ID: ${dataSource.source_id}). A generic approach might be attempted or this source will be skipped.`);
        return null; 
    }
  }
}
