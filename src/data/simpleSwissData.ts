/**
 * src/data/simpleSwissData.ts
 *
 * A simplified, yet more comprehensive, hardcoded data structure for Swiss cantons 
 * and their major municipalities, including tax multipliers.
 */

export interface MunicipalityWithRates {
  name: string;
  taxMultiplier2024: number; // Represented as decimal, e.g., 1.19 for 119%
  taxMultiplier2025: number; // Represented as decimal, e.g., 1.19 for 119%
}

export interface SimpleCantonDataWithRates {
  [cantonName: string]: MunicipalityWithRates[];
}

export const simpleSwissMunicipalities: SimpleCantonDataWithRates = {
  'Aargau': [
    { name: 'Aarau', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Baden', taxMultiplier2024: 0.95, taxMultiplier2025: 0.95 },
    { name: 'Brugg', taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Lenzburg', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Oftringen', taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Rheinfelden', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Wettingen', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Wohlen', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Zofingen', taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Suhr', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Möhlin', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Spreitenbach', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Frick', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Gränichen', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Küttigen', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Laufenburg', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Mellingen', taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Menziken', taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Muhen', taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Neuenhof', taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Niederrohrdorf', taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Oberentfelden', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Reinach (AG)', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Rothrist', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Seon', taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Siggenthal Station', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 }, // Part of Untersiggenthal
    { name: 'Staufen', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Strengelbach', taxMultiplier2024: 1.11, taxMultiplier2025: 1.11 },
    { name: 'Unterkulm', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Villmergen', taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Windisch', taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
  ],
  'Appenzell Ausserrhoden': [ // Note: AR uses a different system (Steuerfuss in Promille der einfachen Kantonssteuer)
    { name: 'Herisau', taxMultiplier2024: 3.4, taxMultiplier2025: 3.4 },
    { name: 'Heiden', taxMultiplier2024: 3.2, taxMultiplier2025: 3.2 },
    { name: 'Speicher', taxMultiplier2024: 2.9, taxMultiplier2025: 2.9 },
    { name: 'Teufen (AR)', taxMultiplier2024: 2.6, taxMultiplier2025: 2.6 },
    { name: 'Trogen', taxMultiplier2024: 3.1, taxMultiplier2025: 3.1 },
  ],
  'Appenzell Innerrhoden': [ // Note: AI also has a specific system
    { name: 'Appenzell', taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
    { name: 'Gonten', taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
    { name: 'Oberegg', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Schwende-Rüte', taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
  ],
  'Basel-Landschaft': [ // Note: BL Steuerfuss in % des Staatssteuerbetrags
    { name: 'Allschwil', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Arlesheim', taxMultiplier2024: 0.53, taxMultiplier2025: 0.53 },
    { name: 'Binningen', taxMultiplier2024: 0.48, taxMultiplier2025: 0.48 },
    { name: 'Liestal', taxMultiplier2024: 0.62, taxMultiplier2025: 0.62 },
    { name: 'Münchenstein', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Muttenz', taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Oberwil (BL)', taxMultiplier2024: 0.50, taxMultiplier2025: 0.50 },
    { name: 'Pratteln', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Reinach (BL)', taxMultiplier2024: 0.56, taxMultiplier2025: 0.56 },
  ],
  'Basel-Stadt': [ // BS has a unified cantonal tax, municipal multiplier is effectively 1.0 or integrated
    { name: 'Basel', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 },
    { name: 'Bettingen', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 },
    { name: 'Riehen', taxMultiplier2024: 1.0, taxMultiplier2025: 1.0 },
  ],
  'Bern': [
    { name: 'Bern', taxMultiplier2024: 1.54, taxMultiplier2025: 1.54 },
    { name: 'Biel/Bienne', taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Burgdorf', taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Interlaken', taxMultiplier2024: 1.75, taxMultiplier2025: 1.75 },
    { name: 'Ittigen', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Köniz', taxMultiplier2024: 1.49, taxMultiplier2025: 1.49 },
    { name: 'Langenthal', taxMultiplier2024: 1.59, taxMultiplier2025: 1.59 },
    { name: 'Muri bei Bern', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Thun', taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Aarberg', taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Belp', taxMultiplier2024: 1.52, taxMultiplier2025: 1.52 },
    { name: 'Bolligen', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Bremgarten bei Bern', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Herzogenbuchsee', taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 },
    { name: 'Huttwil', taxMultiplier2024: 1.78, taxMultiplier2025: 1.78 },
    { name: 'Ins', taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Kirchberg (BE)', taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Langnau im Emmental', taxMultiplier2024: 1.72, taxMultiplier2025: 1.72 },
    { name: 'Lyss', taxMultiplier2024: 1.58, taxMultiplier2025: 1.58 },
    { name: 'Meiringen', taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 },
    { name: 'Münsingen', taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
    { name: 'Nidau', taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Ostermundigen', taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Spiez', taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Steffisburg', taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Sumiswald', taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Urtenen-Schönbühl', taxMultiplier2024: 1.48, taxMultiplier2025: 1.48 },
    { name: 'Worb', taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
    { name: 'Zollikofen', taxMultiplier2024: 1.40, taxMultiplier2025: 1.40 },
    { name: 'Zweisimmen', taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
  ],
  'Fribourg': [
    { name: 'Bulle', taxMultiplier2024: 0.81, taxMultiplier2025: 0.81 },
    { name: 'Fribourg', taxMultiplier2024: 0.83, taxMultiplier2025: 0.83 },
    { name: 'Murten', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Villars-sur-Glâne', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Düdingen', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
  ],
  'Geneva': [ // Multiplicateur communal (centimes additionnels)
    { name: 'Genève', taxMultiplier2024: 0.455, taxMultiplier2025: 0.455 },
    { name: 'Carouge (GE)', taxMultiplier2024: 0.445, taxMultiplier2025: 0.445 },
    { name: 'Lancy', taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Meyrin', taxMultiplier2024: 0.440, taxMultiplier2025: 0.440 },
    { name: 'Vernier', taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Versoix', taxMultiplier2024: 0.450, taxMultiplier2025: 0.450 },
    { name: 'Chêne-Bougeries', taxMultiplier2024: 0.350, taxMultiplier2025: 0.350 },
    { name: 'Onex', taxMultiplier2024: 0.480, taxMultiplier2025: 0.480 },
    { name: 'Thônex', taxMultiplier2024: 0.460, taxMultiplier2025: 0.460 },
    { name: 'Plan-les-Ouates', taxMultiplier2024: 0.380, taxMultiplier2025: 0.380 },
    { name: 'Grand-Saconnex', taxMultiplier2024: 0.420, taxMultiplier2025: 0.420 },
    { name: 'Veyrier', taxMultiplier2024: 0.390, taxMultiplier2025: 0.390 },
    { name: 'Chêne-Bourg', taxMultiplier2024: 0.430, taxMultiplier2025: 0.430 },
    { name: 'Bernex', taxMultiplier2024: 0.450, taxMultiplier2025: 0.450 },
    { name: 'Collonge-Bellerive', taxMultiplier2024: 0.320, taxMultiplier2025: 0.320 },
    { name: 'Cologny', taxMultiplier2024: 0.300, taxMultiplier2025: 0.300 },
    { name: 'Confignon', taxMultiplier2024: 0.400, taxMultiplier2025: 0.400 },
    { name: 'Pregny-Chambésy', taxMultiplier2024: 0.330, taxMultiplier2025: 0.330 },
    { name: 'Satigny', taxMultiplier2024: 0.400, taxMultiplier2025: 0.400 },
    { name: 'Puplinge', taxMultiplier2024: 0.360, taxMultiplier2025: 0.360 },
  ],
  'Glarus': [ // Unified municipal tax rate for Glarus, Glarus Nord, Glarus Süd
    { name: 'Glarus', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 }, // Steuerfuss in % der einfachen Kantonssteuer
    { name: 'Glarus Nord', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Glarus Süd', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
  ],
  'Graubünden': [
    { name: 'Chur', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Davos', taxMultiplier2024: 0.80, taxMultiplier2025: 0.80 },
    { name: 'St. Moritz', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Domat/Ems', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Landquart', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
  ],
  'Jura': [
    { name: 'Delémont', taxMultiplier2024: 1.90, taxMultiplier2025: 1.90 },
    { name: 'Porrentruy', taxMultiplier2024: 1.95, taxMultiplier2025: 1.95 },
    { name: 'Haute-Sorne', taxMultiplier2024: 1.85, taxMultiplier2025: 1.85 },
  ],
  'Luzern': [ // Units of cantonal tax
    { name: 'Luzern', taxMultiplier2024: 1.75, taxMultiplier2025: 1.75 },
    { name: 'Emmen', taxMultiplier2024: 1.95, taxMultiplier2025: 1.95 },
    { name: 'Kriens', taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Horw', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Sursee', taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 },
  ],
  'Neuchâtel': [ // Coefficient communal
    { name: 'Neuchâtel', taxMultiplier2024: 0.65, taxMultiplier2025: 0.65 },
    { name: 'La Chaux-de-Fonds', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Le Locle', taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
  ],
  'Nidwalden': [ // Steuerfuss in % der einfachen Kantonssteuer
    { name: 'Stans', taxMultiplier2024: 0.87, taxMultiplier2025: 0.87 },
    { name: 'Hergiswil (NW)', taxMultiplier2024: 0.65, taxMultiplier2025: 0.65 },
    { name: 'Buochs', taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
  ],
  'Obwalden': [ // Einheitsansatz in %
    { name: 'Sarnen', taxMultiplier2024: 3.55, taxMultiplier2025: 3.55 },
    { name: 'Kerns', taxMultiplier2024: 3.60, taxMultiplier2025: 3.60 },
    { name: 'Engelberg', taxMultiplier2024: 3.20, taxMultiplier2025: 3.20 },
  ],
  'Schaffhausen': [ // Steuerfuss in % des Kantonssteuerbetrags
    { name: 'Schaffhausen', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Neuhausen am Rheinfall', taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Thayngen', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
  ],
  'Schwyz': [ // In % des kantonalen Einheitssatzes
    { name: 'Schwyz', taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Freienbach', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Einsiedeln', taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Küssnacht (SZ)', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Wollerau', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
  ],
  'Solothurn': [
    { name: 'Solothurn', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Olten', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Grenchen', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
  ],
  'St. Gallen': [
    { name: 'St. Gallen', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Rapperswil-Jona', taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Wil (SG)', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Gossau (SG)', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Altstätten', taxMultiplier2024: 1.38, taxMultiplier2025: 1.38 },
    { name: 'Buchs (SG)', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Flawil', taxMultiplier2024: 1.40, taxMultiplier2025: 1.40 },
    { name: 'Uzwil', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Wattwil', taxMultiplier2024: 1.50, taxMultiplier2025: 1.50 },
    { name: 'Rorschach', taxMultiplier2024: 1.42, taxMultiplier2025: 1.42 },
    { name: 'Sargans', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Bad Ragaz', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Goldach', taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Kirchberg (SG)', taxMultiplier2024: 1.48, taxMultiplier2025: 1.48 },
    { name: 'Oberuzwil', taxMultiplier2024: 1.33, taxMultiplier2025: 1.33 },
    { name: 'St. Margrethen', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Uznach', taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
    { name: 'Widnau', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Zuzwil (SG)', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Diepoldsau', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Ebnat-Kappel', taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
  ],
  'Thurgau': [ // Gemeindesteuerfuss (Total in % der einfachen Steuer)
    { name: 'Frauenfeld', taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Kreuzlingen', taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Arbon', taxMultiplier2024: 1.73, taxMultiplier2025: 1.73 },
  ],
  'Ticino': [ // Moltiplicatore comunale
    { name: 'Lugano', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Bellinzona', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Locarno', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
    { name: 'Chiasso', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Mendrisio', taxMultiplier2024: 0.80, taxMultiplier2025: 0.80 },
  ],
  'Uri': [ // Steuerfuss in % der einfachen Kantonssteuer
    { name: 'Altdorf (UR)', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Bürglen (UR)', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Erstfeld', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
  ],
  'Valais': [ // Coefficient communal
    { name: 'Sion', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Martigny', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Monthey', taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Sierre', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Brig-Glis', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
  ],
  'Vaud': [ // Taux d'impôt communal en % de l'impôt cantonal de base
    { name: 'Lausanne', taxMultiplier2024: 0.79, taxMultiplier2025: 0.79 },
    { name: 'Yverdon-les-Bains', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Montreux', taxMultiplier2024: 0.69, taxMultiplier2025: 0.69 },
    { name: 'Nyon', taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Vevey', taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Pully', taxMultiplier2024: 0.65, taxMultiplier2025: 0.65 },
    { name: 'Morges', taxMultiplier2024: 0.68, taxMultiplier2025: 0.68 },
    { name: 'Renens (VD)', taxMultiplier2024: 0.82, taxMultiplier2025: 0.82 },
    { name: 'Gland', taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Prilly', taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
    { name: 'Ecublens (VD)', taxMultiplier2024: 0.63, taxMultiplier2025: 0.63 },
    { name: 'Aigle', taxMultiplier2024: 0.72, taxMultiplier2025: 0.72 },
    { name: 'Bussigny', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Chavannes-près-Renens', taxMultiplier2024: 0.62, taxMultiplier2025: 0.62 },
    { name: 'Crissier', taxMultiplier2024: 0.68, taxMultiplier2025: 0.68 },
    { name: 'La Tour-de-Peilz', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Le Mont-sur-Lausanne', taxMultiplier2024: 0.64, taxMultiplier2025: 0.64 },
    { name: 'Ollon', taxMultiplier2024: 0.73, taxMultiplier2025: 0.73 },
    { name: 'Rolle', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Saint-Prex', taxMultiplier2024: 0.53, taxMultiplier2025: 0.53 },
    { name: 'Villeneuve (VD)', taxMultiplier2024: 0.74, taxMultiplier2025: 0.74 },
  ],
  'Zug': [ // Steuerfuss in % des Kantonssteuerbetrags
    { name: 'Zug', taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Baar', taxMultiplier2024: 0.52, taxMultiplier2025: 0.52 },
    { name: 'Cham', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Risch', taxMultiplier2024: 0.50, taxMultiplier2025: 0.50 },
    { name: 'Steinhausen', taxMultiplier2024: 0.54, taxMultiplier2025: 0.54 },
  ],
  'Zürich': [
    { name: 'Adliswil', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Affoltern am Albis', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Bachenbülach', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Bassersdorf', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Birmensdorf (ZH)', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Bonstetten', taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Bülach', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Dietikon', taxMultiplier2024: 1.23, taxMultiplier2025: 1.23 },
    { name: 'Dietlikon', taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
    { name: 'Dübendorf', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Egg', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Eglisau', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Embrach', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Erlenbach (ZH)', taxMultiplier2024: 0.76, taxMultiplier2025: 0.76 },
    { name: 'Fällanden', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Fehraltorf', taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Freienstein-Teufen', taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Geroldswil', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Glattfelden', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Gossau (ZH)', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Greifensee', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Herrliberg', taxMultiplier2024: 0.79, taxMultiplier2025: 0.79 },
    { name: 'Hinwil', taxMultiplier2024: 1.17, taxMultiplier2025: 1.17 },
    { name: 'Hombrechtikon', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Horgen', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Illnau-Effretikon', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Kilchberg (ZH)', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Kloten', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Küsnacht (ZH)', taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
    { name: 'Langnau am Albis', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Männedorf', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Maur', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Meilen', taxMultiplier2024: 0.87, taxMultiplier2025: 0.87 },
    { name: 'Niederhasli', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Oberengstringen', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Oberglatt', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Oetwil am See', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Opfikon', taxMultiplier2024: 0.96, taxMultiplier2025: 0.96 },
    { name: 'Pfäffikon', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Regensdorf', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Richterswil', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Rümlang', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Rüschlikon', taxMultiplier2024: 0.73, taxMultiplier2025: 0.73 },
    { name: 'Rüti (ZH)', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Schlieren', taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Seuzach', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Stäfa', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Steinmaur', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Thalwil', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Uitikon', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
    { name: 'Urdorf', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Uster', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Volketswil', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Wädenswil', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Wallisellen', taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Wangen-Brüttisellen', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Weisslingen', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Wetzikon (ZH)', taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Winterthur', taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
    { name: 'Zollikon', taxMultiplier2024: 0.82, taxMultiplier2025: 0.82 },
    { name: 'Zumikon', taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Zürich', taxMultiplier2024: 1.19, taxMultiplier2025: 1.19 },
  ]
};

export const simpleSwissCantons: string[] = Object.keys(simpleSwissMunicipalities).sort((a, b) =>
  a.localeCompare(b, 'de')
);

/**
 * Gets a list of municipality names for a given canton from the simple data structure.
 * @param cantonName The name of the canton.
 * @returns An array of municipality names, or an empty array if canton not found.
 */
export function getSimpleMunicipalitiesForCanton(cantonName: string): string[] {
  const municipalitiesWithRates = simpleSwissMunicipalities[cantonName] || [];
  return municipalitiesWithRates.map(m => m.name).sort((a,b) => a.localeCompare(b, 'de'));
}

/**
 * Gets the tax multiplier for a specific municipality and year.
 * @param cantonName The name of the canton.
 * @param municipalityName The name of the municipality.
 * @param year The tax year ('2024' or '2025').
 * @returns The tax multiplier as a decimal, or a default of 1.0 if not found.
 */
export function getSimpleMunicipalityTaxMultiplier(
  cantonName: string,
  municipalityName: string,
  year: '2024' | '2025'
): number {
  const municipalitiesInCanton = simpleSwissMunicipalities[cantonName];
  if (municipalitiesInCanton) {
    const municipality = municipalitiesInCanton.find(m => m.name === municipalityName);
    if (municipality) {
      return municipality[year === '2024' ? 'taxMultiplier2024' : 'taxMultiplier2025'];
    }
  }
  // Fallback if municipality or canton not found, or year data missing
  // This should ideally use a canton default if available, or a general default.
  // For simplicity here, returning 1.0, but a more robust fallback could be implemented.
  console.warn(`Tax multiplier not found for ${municipalityName}, ${cantonName}, ${year}. Defaulting to 1.0.`);
  return 1.0;
}
