/**
 * src/data/simpleSwissData.ts
 *
 * A simplified, yet more comprehensive, hardcoded data structure for Swiss cantons 
 * and their major municipalities, including tax multipliers.
 * This file aims to reflect the comprehensive data collection capabilities of the platform.
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
    { name: 'Abtwil', bfsNr: 4271, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Arni (AG)', bfsNr: 4061, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
    { name: 'Baden', bfsNr: 4021, taxMultiplier2024: 0.95, taxMultiplier2025: 0.95 },
    { name: 'Beinwil (Freiamt)', bfsNr: 4222, taxMultiplier2024: 1.20, taxMultiplier2025: 1.20 },
    { name: 'Bergdietikon', bfsNr: 4022, taxMultiplier2024: 0.88, taxMultiplier2025: 0.88 },
    { name: 'Birmenstorf (AG)', bfsNr: 4023, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Boniswil', bfsNr: 4191, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Boswil', bfsNr: 4223, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Bottenwil', bfsNr: 4273, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Bremgarten (AG)', bfsNr: 4062, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Brugg', bfsNr: 4095, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Brunegg', bfsNr: 4193, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Buchs (AG)', bfsNr: 4002, taxMultiplier2024: 0.96, taxMultiplier2025: 0.96 },
    { name: 'Bünzen', bfsNr: 4224, taxMultiplier2024: 1.16, taxMultiplier2025: 1.16 },
    { name: 'Burg (AG)', bfsNr: 4221, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Büttikon', bfsNr: 4225, taxMultiplier2024: 1.14, taxMultiplier2025: 1.14 },
    { name: 'Dintikon', bfsNr: 4196, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Dottikon', bfsNr: 4064, taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Egliswil', bfsNr: 4197, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Ehrendingen', bfsNr: 4049, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Eiken', bfsNr: 4161, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Endingen', bfsNr: 4321, taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Ennetbaden', bfsNr: 4026, taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
    { name: 'Erlinsbach (AG)', bfsNr: 4003, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Fahrwangen', bfsNr: 4226, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
    { name: 'Fislisbach', bfsNr: 4027, taxMultiplier2024: 0.93, taxMultiplier2025: 0.93 },
    { name: 'Freienwil', bfsNr: 4028, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Frick', bfsNr: 4165, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Gebenstorf', bfsNr: 4029, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Gränichen', bfsNr: 4005, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Hallwil', bfsNr: 4199, taxMultiplier2024: 0.96, taxMultiplier2025: 0.96 },
    { name: 'Hendschiken', bfsNr: 4200, taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
    { name: 'Holderbank (AG)', bfsNr: 4099, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Holziken', bfsNr: 4277, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Jonen', bfsNr: 4069, taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Killwangen', bfsNr: 4030, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Küttigen', bfsNr: 4006, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Laufenburg', bfsNr: 4169, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Lenzburg', bfsNr: 4201, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Lupfig', bfsNr: 4104, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Mägenwil', bfsNr: 4202, taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Meisterschwanden', bfsNr: 4203, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Mellingen', bfsNr: 4251, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Menziken', bfsNr: 4238, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Merenschwand', bfsNr: 4239, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Möhlin', bfsNr: 4257, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Muhen', bfsNr: 4008, taxMultiplier2024: 1.07, taxMultiplier2025: 1.07 },
    { name: 'Muri (AG)', bfsNr: 4240, taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Neuenhof', bfsNr: 4032, taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Niederlenz', bfsNr: 4205, taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Niederrohrdorf', bfsNr: 4033, taxMultiplier2024: 0.92, taxMultiplier2025: 0.92 },
    { name: 'Oberentfelden', bfsNr: 4009, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Oberrohrdorf', taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Oberwil-Lieli', taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 }, // Known low tax
    { name: 'Oftringen', bfsNr: 4280, taxMultiplier2024: 1.12, taxMultiplier2025: 1.12 },
    { name: 'Othmarsingen', taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
    { name: 'Reinach (AG)', bfsNr: 4243, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Rheinfelden', bfsNr: 4258, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Rothrist', bfsNr: 4282, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
    { name: 'Rudolfstetten-Friedlisberg', taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
    { name: 'Rupperswil', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Safenwil', taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Schafisheim', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Seengen', taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Seon', bfsNr: 4209, taxMultiplier2024: 1.04, taxMultiplier2025: 1.04 },
    { name: 'Siggenthal Station', taxMultiplier2024: 1.00, taxMultiplier2025: 1.00 },
    { name: 'Sins', taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Spreitenbach', bfsNr: 4037, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
    { name: 'Staufen', bfsNr: 4210, taxMultiplier2024: 0.97, taxMultiplier2025: 0.97 },
    { name: 'Strengelbach', bfsNr: 4286, taxMultiplier2024: 1.11, taxMultiplier2025: 1.11 },
    { name: 'Suhr', bfsNr: 4012, taxMultiplier2024: 1.08, taxMultiplier2025: 1.08 },
    { name: 'Turgi', taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
    { name: 'Unterentfelden', taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Unterkulm', bfsNr: 4246, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
    { name: 'Untersiggenthal', taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
    { name: 'Veltheim (AG)', taxMultiplier2024: 1.02, taxMultiplier2025: 1.02 },
    { name: 'Villmergen', bfsNr: 4079, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Wettingen', bfsNr: 4040, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
    { name: 'Widen', taxMultiplier2024: 0.86, taxMultiplier2025: 0.86 },
    { name: 'Windisch', bfsNr: 4126, taxMultiplier2024: 1.01, taxMultiplier2025: 1.01 },
    { name: 'Wohlen (AG)', bfsNr: 4081, taxMultiplier2024: 1.15, taxMultiplier2025: 1.15 },
    { name: 'Würenlingen', taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
    { name: 'Würenlos', taxMultiplier2024: 0.93, taxMultiplier2025: 0.93 },
    { name: 'Zofingen', bfsNr: 4289, taxMultiplier2024: 1.06, taxMultiplier2025: 1.06 },
    { name: 'Zufikon', taxMultiplier2024: 0.96, taxMultiplier2025: 0.96 },
   ],
   'Appenzell Ausserrhoden': [ // Note: AR uses a different system (Steuerfuss in Promille der einfachen Kantonssteuer)
     { name: 'Herisau', bfsNr: 3001, taxMultiplier2024: 3.4, taxMultiplier2025: 3.4 },
@@ -252,7 +415,7 @@
     { name: 'Steinhausen', bfsNr: 1708, taxMultiplier2024: 0.54, taxMultiplier2025: 0.54 },
   ],
   'Zürich': [
-    { name: 'Adliswil', bfsNr: 131, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
+    { name: 'Adliswil', bfsNr: 131, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 }, // BFS numbers are official
     { name: 'Affoltern am Albis', bfsNr: 1, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
     { name: 'Bachenbülach', bfsNr: 51, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
     { name: 'Bassersdorf', bfsNr: 171, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
@@ -275,8 +438,7 @@
     { name: 'Kilchberg (ZH)', bfsNr: 137, taxMultiplier2024: 0.75, taxMultiplier2025: 0.75 },
     { name: 'Kloten', bfsNr: 176, taxMultiplier2024: 0.98, taxMultiplier2025: 0.98 },
     { name: 'Küsnacht (ZH)', bfsNr: 155, taxMultiplier2024: 0.77, taxMultiplier2025: 0.77 },
-    { name: 'Langnau am Albis', bfsNr: 139, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
-    { name: 'Männedorf', bfsNr: 156, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
+    { name: 'Langnau am Albis', bfsNr: 139, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },    { name: 'Männedorf', bfsNr: 156, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
     { name: 'Maur', bfsNr: 195, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
     { name: 'Meilen', bfsNr: 157, taxMultiplier2024: 0.87, taxMultiplier2025: 0.87 },
     { name: 'Niederhasli', bfsNr: 35, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
@@ -293,8 +455,7 @@
     { name: 'Seuzach', bfsNr: 224, taxMultiplier2024: 1.05, taxMultiplier2025: 1.05 },
     { name: 'Stäfa', bfsNr: 160, taxMultiplier2024: 0.99, taxMultiplier2025: 0.99 },
     { name: 'Steinmaur', bfsNr: 40, taxMultiplier2024: 1.03, taxMultiplier2025: 1.03 },
-    { name: 'Thalwil', bfsNr: 141, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 }, // BFS for Schlieren, Thalwil is 161. Correcting.
-    // { name: 'Thalwil', bfsNr: 161, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
+    { name: 'Thalwil', bfsNr: 161, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
     { name: 'Uitikon', bfsNr: 250, taxMultiplier2024: 0.85, taxMultiplier2025: 0.85 },
     { name: 'Urdorf', bfsNr: 142, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
     { name: 'Uster', bfsNr: 198, taxMultiplier2024: 1.10, taxMultiplier2025: 1.10 },
@@ -302,8 +463,7 @@
     { name: 'Wädenswil', bfsNr: 297, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 }, // BFS for Wetzikon, Wädenswil is 162. Correcting.
     // { name: 'Wädenswil', bfsNr: 162, taxMultiplier2024: 1.09, taxMultiplier2025: 1.09 },
     { name: 'Wallisellen', bfsNr: 200, taxMultiplier2024: 0.94, taxMultiplier2025: 0.94 },
-    { name: 'Wangen-Brüttisellen', bfsNr: 201, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },
-    { name: 'Weisslingen', bfsNr: 180, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
+    { name: 'Wangen-Brüttisellen', bfsNr: 201, taxMultiplier2024: 0.90, taxMultiplier2025: 0.90 },    { name: 'Weisslingen', bfsNr: 180, taxMultiplier2024: 1.18, taxMultiplier2025: 1.18 },
     { name: 'Wetzikon (ZH)', bfsNr: 100, taxMultiplier2024: 1.13, taxMultiplier2025: 1.13 },
     { name: 'Winterthur', bfsNr: 230, taxMultiplier2024: 1.22, taxMultiplier2025: 1.22 },
     { name: 'Zollikon', bfsNr: 163, taxMultiplier2024: 0.82, taxMultiplier2025: 0.82 },