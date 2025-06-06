// debug-municipalities.js
// To run: node debug-municipalities.js (ensure "type": "module" in package.json)
// Or: npx tsx debug-municipalities.js (if you rename to .ts or have tsx setup)

import { getMunicipalitiesForCanton, cantons as allCantonNames, getCantonCode } from './src/utils/swissData.js'; // Assuming .js extension after build or if running as ES module

console.log("Starting Municipality Debug Script...\n");

const testCantons = [
  "Zürich",          // Exact German name
  "Zurich",          // Common English spelling
  "ZH",              // Canton Code
  "Bern",
  "BE",
  "Genève",          // Exact French name with accent
  "Geneva",          // Common English spelling
  "GE",
  "Vaud",
  "VD",
  "Ticino",
  "TI",
  "Fribourg",        // Name with diacritic
  "FR",
  "Aargau",
  "AG",
  "Invalid Canton Name", // Should return empty
  "",                    // Empty string
  "be",                  // Lowercase code
  "  Zürich  ",        // With whitespace
];

console.log("All available canton names from swissData.ts:", allCantonNames);
console.log(`Total available canton names: ${allCantonNames.length}\n`);

testCantons.forEach(testCantonInput => {
  console.log(`----------------------------------------------------`);
  console.log(`Testing with input: "${testCantonInput}"`);

  const resolvedCode = getCantonCode(testCantonInput);
  console.log(`  Resolved Canton Code: ${resolvedCode || 'Not Resolved'}`);
  
  const municipalities = getMunicipalitiesForCanton(testCantonInput);
  
  console.log(`  Number of municipalities found: ${municipalities.length}`);
  
  if (municipalities.length > 0) {
    const sampleSize = Math.min(5, municipalities.length);
    console.log(`  Sample of municipalities (${sampleSize} of ${municipalities.length}):`);
    for (let i = 0; i < sampleSize; i++) {
      console.log(`    - ${municipalities[i]}`);
    }
    if (municipalities.length > sampleSize) {
      console.log(`    ... and ${municipalities.length - sampleSize} more.`);
    }
  } else {
    console.log(`  No municipalities returned for this input.`);
  }
  console.log(`----------------------------------------------------\n`);
});

console.log("Testing a specific known case: getMunicipalitiesForCanton('Zürich')");
const zurichMunicipalities = getMunicipalitiesForCanton('Zürich');
if (zurichMunicipalities.includes('Zürich') && zurichMunicipalities.includes('Winterthur')) {
    console.log("  ✅ Test for 'Zürich' passed: Found 'Zürich' and 'Winterthur'. Total: " + zurichMunicipalities.length);
} else {
    console.log("  ❌ Test for 'Zürich' FAILED or data is unexpected.");
    console.log("     Returned Zurich municipalities:", zurichMunicipalities.slice(0,10));
}


console.log("\nDebug script finished.");

// Instructions to run this script:
// 1. Make sure you are in the root directory of the project (sb1-ndr8kze6).
// 2. Ensure your package.json has "type": "module" to support ES module syntax in .js files.
// 3. Run the script using: node debug-municipalities.js
// 4. If you encounter issues with ESM/CJS, you might need to use a tool like tsx:
//    Rename this file to debug-municipalities.ts
//    Run: npx tsx debug-municipalities.ts
