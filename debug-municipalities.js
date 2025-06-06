// debug-municipalities.js
// To run: node debug-municipalities.js (ensure "type": "module" in package.json)
// Or: npx tsx debug-municipalities.js (if you rename to .ts or have tsx setup)

import {
  simpleSwissCantons,
  simpleSwissMunicipalities,
  getSimpleMunicipalityTaxMultiplier,
  // getSimpleMunicipalitiesForCanton // Not strictly needed if we access simpleSwissMunicipalities directly
} from './src/data/simpleSwissData.js';

console.log("Starting Municipality Validation Script...\n");

/**
 * Gets a random element from an array.
 * @param {Array<T>} arr - The array to pick from.
 * @returns {T} A random element from the array.
 */
function getRandomElement(arr) {
  if (!arr || arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

const cantonsWithMunicipalities = simpleSwissCantons.filter(
  (cantonName) => simpleSwissMunicipalities[cantonName] && simpleSwissMunicipalities[cantonName].length > 0
);

if (cantonsWithMunicipalities.length === 0) {
  console.error("Error: No cantons with municipalities found in simpleSwissMunicipalities. Check data source.");
  process.exit(1);
}

const numberOfTests = 10;
const testedMunicipalities = new Set(); // To try and get unique municipalities
const validationResults = [];

console.log(`Attempting to validate ${numberOfTests} random municipalities...\n`);

for (let i = 0; i < numberOfTests; i++) {
  let randomCantonName;
  let randomMunicipalityData;
  let attempts = 0;
  const maxAttemptsPerSelection = 20; // Prevent infinite loop if data is very sparse

  // Try to pick a unique municipality
  do {
    randomCantonName = getRandomElement(cantonsWithMunicipalities);
    const municipalitiesInCanton = simpleSwissMunicipalities[randomCantonName];
    if (!municipalitiesInCanton || municipalitiesInCanton.length === 0) {
      // This should not happen due to cantonsWithMunicipalities filter, but as a safeguard:
      console.warn(`Warning: Canton "${randomCantonName}" selected but has no municipalities. Skipping.`);
      attempts++;
      continue;
    }
    randomMunicipalityData = getRandomElement(municipalitiesInCanton);
    attempts++;
  } while (randomMunicipalityData && testedMunicipalities.has(`${randomCantonName}-${randomMunicipalityData.name}`) && attempts < maxAttemptsPerSelection);

  if (!randomMunicipalityData) {
    console.warn(`Could not select a valid new municipality after ${attempts} attempts for test ${i + 1}.`);
    continue;
  }
  
  testedMunicipalities.add(`${randomCantonName}-${randomMunicipalityData.name}`);

  const municipalityName = randomMunicipalityData.name;
  
  // Retrieve from the main data structure to confirm existence and get rates
  const cantonData = simpleSwissMunicipalities[randomCantonName];
  const foundMunicipality = cantonData ? cantonData.find(m => m.name === municipalityName) : undefined;

  if (foundMunicipality) {
    // Cross-verify with getSimpleMunicipalityTaxMultiplier for 2024 as an example
    const multiplier2024FromFunc = getSimpleMunicipalityTaxMultiplier(randomCantonName, municipalityName, '2024');
    const multiplier2025FromFunc = getSimpleMunicipalityTaxMultiplier(randomCantonName, municipalityName, '2025');
    
    validationResults.push({
      testNumber: i + 1,
      canton: randomCantonName,
      municipality: municipalityName,
      status: "Found",
      taxMultiplier2024_direct: foundMunicipality.taxMultiplier2024,
      taxMultiplier2025_direct: foundMunicipality.taxMultiplier2025,
      taxMultiplier2024_func: multiplier2024FromFunc,
      taxMultiplier2025_func: multiplier2025FromFunc,
      match: foundMunicipality.taxMultiplier2024 === multiplier2024FromFunc && foundMunicipality.taxMultiplier2025 === multiplier2025FromFunc
    });
  } else {
    // This case should ideally not be reached if selection logic is correct
    validationResults.push({
      testNumber: i + 1,
      canton: randomCantonName,
      municipality: municipalityName,
      status: "NOT FOUND in simpleSwissMunicipalities (Error in script logic)",
      taxMultiplier2024_direct: "N/A",
      taxMultiplier2025_direct: "N/A",
      taxMultiplier2024_func: "N/A",
      taxMultiplier2025_func: "N/A",
      match: false
    });
  }
}

console.log("--- Validation Results ---");
validationResults.forEach(result => {
  console.log(`\nTest #${result.testNumber}:`);
  console.log(`  Canton:         ${result.canton}`);
  console.log(`  Municipality:   ${result.municipality}`);
  console.log(`  Status:         ${result.status}`);
  if (result.status === "Found") {
    console.log(`  Tax Multiplier 2024 (Direct): ${result.taxMultiplier2024_direct}`);
    console.log(`  Tax Multiplier 2025 (Direct): ${result.taxMultiplier2025_direct}`);
    console.log(`  Tax Multiplier 2024 (Func):   ${result.taxMultiplier2024_func}`);
    console.log(`  Tax Multiplier 2025 (Func):   ${result.taxMultiplier2025_func}`);
    console.log(`  Multipliers Match:            ${result.match ? '✅ Yes' : '❌ NO'}`);
  }
});

console.log("\n--- Summary ---");
const foundCount = validationResults.filter(r => r.status === "Found").length;
const matchCount = validationResults.filter(r => r.match).length;
console.log(`Total municipalities tested: ${validationResults.length}`);
console.log(`Successfully found and retrieved data for: ${foundCount}/${validationResults.length}`);
if (foundCount > 0) {
    console.log(`Tax multipliers matched between direct access and function call: ${matchCount}/${foundCount}`);
}

if (foundCount < numberOfTests || matchCount < foundCount) {
    console.error("\n⚠️ Some validations failed or data inconsistencies found. Please review.");
} else {
    console.log("\n✅ All selected municipalities validated successfully with consistent tax rates!");
}

console.log("\nDebug script finished.");

// Instructions to run this script:
// 1. Make sure you are in the root directory of the project (sb1-ndr8kze6).
// 2. Ensure your package.json has "type": "module" to support ES module syntax in .js files.
// 3. Run the script using: node debug-municipalities.js
// 4. If you encounter issues with ESM/CJS, you might need to use a tool like tsx:
//    (If this file is .ts) Run: npx tsx debug-municipalities.ts
//    (If this file is .js and you have tsx) Run: npx tsx debug-municipalities.js
