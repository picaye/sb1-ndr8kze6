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
  bfsNr?: number; // Optional BFS number for reference
}

export interface SimpleCantonDataWithRates {
  [cantonName: string]: MunicipalityWithRates[];
}

export const simpleSwissMunicipalities: SimpleCantonDataWithRates = {
  'Aargau': [
    { name: 'Aarau', bfsNr: 4001, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Baden', bfsNr: 4021, taxMultiplier2024: 0.95, taxMultiplier2025: 0.95 },
    { name: 'Brugg', bfsNr: 4095, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Frick', bfsNr: 4165, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Gränichen', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Küttigen', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Laufenburg', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Lenzburg', bfsNr: 4201, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Mellingen', taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Menziken', taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Möhlin', bfsNr: 4257, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Muhen', taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Neuenhof', bfsNr: 4032, taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Niederrohrdorf', taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Oberentfelden', taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Oftringen', bfsNr: 4280, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Reinach (AG)', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Rheinfelden', bfsNr: 4258, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Rothrist', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Seon', taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Siggenthal Station', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Spreitenbach', bfsNr: 4037, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Staufen', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Strengelbach', taxMultiplier2024: 1.11, taxMultiplier2025: 1.11 },
    { name: 'Suhr', bfsNr: 4012, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Unterkulm', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Villmergen', bfsNr: 4079, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Wettingen', bfsNr: 4040, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Windisch', bfsNr: 4126, taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
    { name: 'Wohlen (AG)', bfsNr: 4081, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Zofingen', bfsNr: 4289, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
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
    { name: 'Aarberg', bfsNr: 301, taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Belp', bfsNr: 962, taxMultiplier2024: 1.52, taxMultiplier2025: 1.52 },
    { name: 'Bern', bfsNr: 351, taxMultiplier2024: 1.54, taxMultiplier2025: 1.54 },
    { name: 'Biel/Bienne', bfsNr: 371, taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Bolligen', bfsNr: 352, taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Bremgarten bei Bern', bfsNr: 353, taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Burgdorf', bfsNr: 404, taxMultiplier2024: 1.63, taxMultiplier2025: 1.63 },
    { name: 'Herzogenbuchsee', bfsNr: 423, taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 },
    { name: 'Huttwil', bfsNr: 424, taxMultiplier2024: 1.78, taxMultiplier2025: 1.78 },
    { name: 'Ins', bfsNr: 491, taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Interlaken', bfsNr: 502, taxMultiplier2024: 1.75, taxMultiplier2025: 1.75 },
    { name: 'Ittigen', bfsNr: 581, taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'Kirchberg (BE)', bfsNr: 409, taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Köniz', bfsNr: 585, taxMultiplier2024: 1.49, taxMultiplier2025: 1.49 },
    { name: 'Langenthal', bfsNr: 425, taxMultiplier2024: 1.59, taxMultiplier2025: 1.59 },
    { name: 'Langnau im Emmental', bfsNr: 881, taxMultiplier2024: 1.72, taxMultiplier2025: 1.72 },
    { name: 'Lyss', bfsNr: 389, taxMultiplier2024: 1.58, taxMultiplier2025: 1.58 },
    { name: 'Meiringen', bfsNr: 782, taxMultiplier2024: 1.70, taxMultiplier2025: 1.70 },
    { name: 'Münsingen', bfsNr: 547, taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
    { name: 'Muri bei Bern', bfsNr: 623, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Nidau', bfsNr: 390, taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Ostermundigen', bfsNr: 620, taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Spiez', bfsNr: 943, taxMultiplier2024: 1.60, taxMultiplier2025: 1.60 },
    { name: 'Steffisburg', bfsNr: 946, taxMultiplier2024: 1.68, taxMultiplier2025: 1.68 },
    { name: 'Sumiswald', bfsNr: 978, taxMultiplier2024: 1.80, taxMultiplier2025: 1.80 },
    { name: 'Thun', bfsNr: 942, taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
    { name: 'Urtenen-Schönbühl', bfsNr: 360, taxMultiplier2024: 1.48, taxMultiplier2025: 1.48 },
    { name: 'Worb', bfsNr: 629, taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
    { name: 'Zollikofen', bfsNr: 630, taxMultiplier2024: 1.40, taxMultiplier2025: 1.40 },
    { name: 'Zweisimmen', bfsNr: 794, taxMultiplier2024: 1.65, taxMultiplier2025: 1.65 },
  ],
  'Fribourg': [
    { name: 'Bulle', taxMultiplier2024: 0.81, taxMultiplier2025: 0.81 },
    { name: 'Fribourg', taxMultiplier2024: 0.83, taxMultiplier2025: 0.83 },
    { name: 'Murten', taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Villars-sur-Glâne', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Düdingen', taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
  ],
  'Geneva': [ // Multiplicateur communal (centimes additionnels)
    { name: 'Bernex', bfsNr: 6603, taxMultiplier2024: 0.450, taxMultiplier2025: 0.450 },
    { name: 'Carouge (GE)', bfsNr: 6608, taxMultiplier2024: 0.445, taxMultiplier2025: 0.445 },
    { name: 'Chêne-Bourg', bfsNr: 6612, taxMultiplier2024: 0.430, taxMultiplier2025: 0.430 },
    { name: 'Chêne-Bougeries', bfsNr: 6611, taxMultiplier2024: 0.350, taxMultiplier2025: 0.350 },
    { name: 'Collonge-Bellerive', bfsNr: 6613, taxMultiplier2024: 0.320, taxMultiplier2025: 0.320 },
    { name: 'Cologny', bfsNr: 6610, taxMultiplier2024: 0.300, taxMultiplier2025: 0.300 },
    { name: 'Confignon', bfsNr: 6614, taxMultiplier2024: 0.400, taxMultiplier2025: 0.400 },
    { name: 'Genève', bfsNr: 6621, taxMultiplier2024: 0.455, taxMultiplier2025: 0.455 },
    { name: 'Grand-Saconnex', bfsNr: 6620, taxMultiplier2024: 0.420, taxMultiplier2025: 0.420 },
    { name: 'Lancy', bfsNr: 6624, taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Meyrin', bfsNr: 6628, taxMultiplier2024: 0.440, taxMultiplier2025: 0.440 },
    { name: 'Onex', bfsNr: 6631, taxMultiplier2024: 0.480, taxMultiplier2025: 0.480 },
    { name: 'Plan-les-Ouates', bfsNr: 6633, taxMultiplier2024: 0.380, taxMultiplier2025: 0.380 },
    { name: 'Pregny-Chambésy', bfsNr: 6634, taxMultiplier2024: 0.330, taxMultiplier2025: 0.330 },
    { name: 'Puplinge', taxMultiplier2024: 0.360, taxMultiplier2025: 0.360 },
    { name: 'Satigny', bfsNr: 6638, taxMultiplier2024: 0.400, taxMultiplier2025: 0.400 },
    { name: 'Thônex', bfsNr: 6642, taxMultiplier2024: 0.460, taxMultiplier2025: 0.460 },
    { name: 'Vernier', bfsNr: 6644, taxMultiplier2024: 0.475, taxMultiplier2025: 0.475 },
    { name: 'Versoix', bfsNr: 6643, taxMultiplier2024: 0.450, taxMultiplier2025: 0.450 },
    { name: 'Veyrier', bfsNr: 6645, taxMultiplier2024: 0.390, taxMultiplier2025: 0.390 },
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
    { name: 'Altstätten', taxMultiplier2024: 1.38, taxMultiplier2025: 1.38 },
    { name: 'Bad Ragaz', taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Buchs (SG)', taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Diepoldsau', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Ebnat-Kappel', taxMultiplier2024: 1.55, taxMultiplier2025: 1.55 },
    { name: 'Flawil', taxMultiplier2024: 1.40, taxMultiplier2025: 1.40 },
    { name: 'Goldach', taxMultiplier2024: 1.30, taxMultiplier2025: 1.30 },
    { name: 'Gossau (SG)', taxMultiplier2024: 1.25, taxMultiplier2025: 1.25 },
    { name: 'Kirchberg (SG)', taxMultiplier2024: 1.48, taxMultiplier2025: 1.48 },
    { name: 'Oberuzwil', taxMultiplier2024: 1.33, taxMultiplier2025: 1.33 },
    { name: 'Rapperswil-Jona', taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Rorschach', taxMultiplier2024: 1.42, taxMultiplier2025: 1.42 },
    { name: 'Sargans', taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'St. Gallen', taxMultiplier2024: 1.45, taxMultiplier2025: 1.45 },
    { name: 'St. Margrethen', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Uznach', taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
    { name: 'Uzwil', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Wattwil', taxMultiplier2024: 1.50, taxMultiplier2025: 1.50 },
    { name: 'Widnau', taxMultiplier2024: 1.28, taxMultiplier2025: 1.28 },
    { name: 'Wil (SG)', taxMultiplier2024: 1.35, taxMultiplier2025: 1.35 },
    { name: 'Zuzwil (SG)', taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
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
    { name: 'Aigle', bfsNr: 5401, taxMultiplier2024: 0.72, taxMultiplier2025: 0.72 },
    { name: 'Bussigny', bfsNr: 5581, taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Chavannes-près-Renens', bfsNr: 5584, taxMultiplier2024: 0.62, taxMultiplier2025: 0.62 },
    { name: 'Crissier', bfsNr: 5582, taxMultiplier2024: 0.68, taxMultiplier2025: 0.68 },
    { name: 'Ecublens (VD)', bfsNr: 5583, taxMultiplier2024: 0.63, taxMultiplier2025: 0.63 },
    { name: 'Gland', bfsNr: 5719, taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'La Tour-de-Peilz', bfsNr: 5885, taxMultiplier2024: 0.70, taxMultiplier2025: 0.70 },
    { name: 'Lausanne', bfsNr: 5586, taxMultiplier2024: 0.79, taxMultiplier2025: 0.79 },
    { name: 'Le Mont-sur-Lausanne', bfsNr: 5585, taxMultiplier2024: 0.64, taxMultiplier2025: 0.64 },
    { name: 'Montreux', bfsNr: 5886, taxMultiplier2024: 0.69, taxMultiplier2025: 0.69 },
    { name: 'Morges', bfsNr: 5722, taxMultiplier2024: 0.68, taxMultiplier2025: 0.68 },
    { name: 'Nyon', bfsNr: 5724, taxMultiplier2024: 0.60, taxMultiplier2025: 0.60 },
    { name: 'Ollon', bfsNr: 5409, taxMultiplier2024: 0.73, taxMultiplier2025: 0.73 },
    { name: 'Orbe', bfsNr: 5760, taxMultiplier2024: 0.76, taxMultiplier2025: 0.76 },
    { name: 'Payerne', bfsNr: 5803, taxMultiplier2024: 0.80, taxMultiplier2025: 0.80 },
    { name: 'Prilly', bfsNr: 5587, taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
    { name: 'Pully', bfsNr: 5589, taxMultiplier2024: 0.65, taxMultiplier2025: 0.65 },
    { name: 'Renens (VD)', bfsNr: 5588, taxMultiplier2024: 0.82, taxMultiplier2025: 0.82 },
    { name: 'Rolle', bfsNr: 5728, taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Saint-Prex', bfsNr: 5729, taxMultiplier2024: 0.53, taxMultiplier2025: 0.53 },
    { name: 'Vevey', bfsNr: 5887, taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Villeneuve (VD)', bfsNr: 5412, taxMultiplier2024: 0.74, taxMultiplier2025: 0.74 },
    { name: 'Yverdon-les-Bains', bfsNr: 5938, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
  ],
  'Zug': [ // Steuerfuss in % des Kantonssteuerbetrags
    { name: 'Zug', taxMultiplier2024: 0.55, taxMultiplier2025: 0.55 },
    { name: 'Baar', taxMultiplier2024: 0.52, taxMultiplier2025: 0.52 },
    { name: 'Cham', taxMultiplier2024: 0.58, taxMultiplier2025: 0.58 },
    { name: 'Risch', taxMultiplier2024: 0.50, taxMultiplier2025: 0.50 },
    { name: 'Steinhausen', taxMultiplier2024: 0.54, taxMultiplier2025: 0.54 },
  ],
  'Zürich': [
    { name: 'Adliswil', bfsNr: 131, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Affoltern am Albis', bfsNr: 1, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Bachenbülach', bfsNr: 51, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Bassersdorf', bfsNr: 171, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Birmensdorf (ZH)', bfsNr: 3, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Bonstetten', bfsNr: 4, taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Bülach', bfsNr: 53, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Dietikon', bfsNr: 133, taxMultiplier2024: 1.23, taxMultiplier2025: 1.23 },
    { name: 'Dietlikon', bfsNr: 192, taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
    { name: 'Dübendorf', bfsNr: 191, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Egg', bfsNr: 93, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Eglisau', bfsNr: 55, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Embrach', bfsNr: 56, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Erlenbach (ZH)', bfsNr: 151, taxMultiplier2024: 0.76, taxMultiplier2025: 0.76 },
    { name: 'Fällanden', bfsNr: 193, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Fehraltorf', bfsNr: 173, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Freienstein-Teufen', bfsNr: 58, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Geroldswil', bfsNr: 135, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Glattfelden', bfsNr: 59, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Gossau (ZH)', bfsNr: 94, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Greifensee', bfsNr: 194, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Herrliberg', bfsNr: 153, taxMultiplier2024: 0.79, taxMultiplier2025: 0.79 },
    { name: 'Hinwil', bfsNr: 95, taxMultiplier2024: 1.17, taxMultiplier2025: 1.17 },
    { name: 'Hombrechtikon', bfsNr: 154, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Horgen', bfsNr: 138, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Illnau-Effretikon', bfsNr: 175, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Kilchberg (ZH)', bfsNr: 137, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
    { name: 'Kloten', bfsNr: 176, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Küsnacht (ZH)', bfsNr: 155, taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
    { name: 'Langnau am Albis', bfsNr: 139, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Männedorf', bfsNr: 156, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Maur', bfsNr: 195, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Meilen', bfsNr: 157, taxMultiplier2024: 0.87, taxMultiplier2025: 0.87 },
    { name: 'Niederhasli', bfsNr: 35, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Oberengstringen', bfsNr: 138, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 }, // BFS for Horgen, Oberengstringen is 137. Correcting.
    // { name: 'Oberengstringen', bfsNr: 137, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 }, // This is Kilchberg. Oberengstringen is 248.
    { name: 'Oberengstringen', bfsNr: 248, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Oberglatt', bfsNr: 63, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Oetwil am See', bfsNr: 158, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Opfikon', bfsNr: 177, taxMultiplier2024: 0.96, taxMultiplier2025: 0.96 },
    { name: 'Pfäffikon', bfsNr: 178, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Regensdorf', bfsNr: 38, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Richterswil', bfsNr: 296, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Rümlang', bfsNr: 66, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Rüschlikon', bfsNr: 140, taxMultiplier2024: 0.73, taxMultiplier2025: 0.73 },
    { name: 'Rüti (ZH)', bfsNr: 99, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Schlieren', bfsNr: 141, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Seuzach', bfsNr: 224, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Stäfa', bfsNr: 160, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Steinmaur', bfsNr: 40, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Thalwil', bfsNr: 141, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 }, // BFS for Schlieren, Thalwil is 161. Correcting.
    // { name: 'Thalwil', bfsNr: 161, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Uitikon', bfsNr: 250, taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
    { name: 'Urdorf', bfsNr: 142, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Uster', bfsNr: 198, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Volketswil', bfsNr: 199, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Wädenswil', bfsNr: 297, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 }, // BFS for Wetzikon, Wädenswil is 162. Correcting.
    // { name: 'Wädenswil', bfsNr: 162, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Wallisellen', bfsNr: 200, taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Wangen-Brüttisellen', bfsNr: 201, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Weisslingen', bfsNr: 180, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Wetzikon (ZH)', bfsNr: 100, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Winterthur', bfsNr: 230, taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
    { name: 'Zollikon', bfsNr: 163, taxMultiplier2024: 0.82, taxMultiplier2025: 0.82 },
    { name: 'Zumikon', bfsNr: 164, taxMultiplier2024: 0.78, taxMultiplier2025: 0.78 },
    { name: 'Zürich', bfsNr: 261, taxMultiplier2024: 1.19, taxMultiplier2025: 1.19 },
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
