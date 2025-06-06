// municipality-audit.js
// To run: node municipality-audit.js (ensure "type": "module" in package.json and files are compiled to .js)
// Or: npx tsx municipality-audit.js (if you have tsx setup and this file is in the project root, can import .ts directly)

import {
  simpleSwissCantons,
  simpleSwissMunicipalities,
  // getSimpleMunicipalityTaxMultiplier // Not needed for this audit, direct access is fine
} from './src/data/simpleSwissData.ts'; // Corrected import path for tsx execution

console.log("🚀 Starting Municipality Data Audit...\n");

const LOW_COVERAGE_THRESHOLD = 10; // Cantons with fewer municipalities than this will be flagged
let totalMunicipalitiesInSystem = 0;
const cantonsWithLowCoverage = [];
const cantonMunicipalityCounts = {};

console.log("==================================================");
console.log("          MUNICIPALITY COVERAGE AUDIT             ");
console.log("==================================================\n");

simpleSwissCantons.forEach((cantonName) => {
  const municipalitiesInCanton = simpleSwissMunicipalities[cantonName] || [];
  const count = municipalitiesInCanton.length;
  totalMunicipalitiesInSystem += count;
  cantonMunicipalityCounts[cantonName] = count;

  console.log(`--------------------------------------------------`);
  console.log(`🏛️ Canton: ${cantonName} (${count} municipalities)`);
  console.log(`--------------------------------------------------`);

  if (count === 0) {
    console.log("  ⚠️ No municipalities listed for this canton.");
    cantonsWithLowCoverage.push({ canton: cantonName, count });
  } else {
    municipalitiesInCanton.forEach((municipality, index) => {
      console.log(
        `  ${(index + 1).toString().padStart(2, '0')}. ${municipality.name.padEnd(30)} ` +
        `| 2024 Rate: ${municipality.taxMultiplier2024.toFixed(2)} ` +
        `| 2025 Rate: ${municipality.taxMultiplier2025.toFixed(2)}`
      );
    });
    if (count < LOW_COVERAGE_THRESHOLD) {
      cantonsWithLowCoverage.push({ canton: cantonName, count });
      console.log(`\n  ⚠️ Low coverage: This canton has only ${count} municipalities (threshold: ${LOW_COVERAGE_THRESHOLD}).`);
    }
  }
  console.log("\n"); // Add a blank line for readability
});

console.log("==================================================");
console.log("                 AUDIT SUMMARY                    ");
console.log("==================================================\n");

const numberOfCantons = simpleSwissCantons.length;
console.log(`📊 Total Cantons Processed: ${numberOfCantons}`);
console.log(`🏘️ Total Municipalities in System: ${totalMunicipalitiesInSystem}`);

if (numberOfCantons > 0) {
  const averageMunicipalitiesPerCanton = (totalMunicipalitiesInSystem / numberOfCantons).toFixed(2);
  console.log(`📈 Average Municipalities per Canton: ${averageMunicipalitiesPerCanton}`);
}

if (cantonsWithLowCoverage.length > 0) {
  console.log(`\n📉 Cantons with Low Coverage (less than ${LOW_COVERAGE_THRESHOLD} municipalities):`);
  cantonsWithLowCoverage.forEach(item => {
    console.log(`  - ${item.canton}: ${item.count} municipalities`);
  });
} else {
  console.log(`\n✅ All cantons meet or exceed the coverage threshold of ${LOW_COVERAGE_THRESHOLD} municipalities.`);
}

console.log("\n📋 Canton-wise Municipality Counts:");
Object.entries(cantonMunicipalityCounts)
  .sort(([, countA], [, countB]) => countA - countB) // Removed "as number" type assertion
  .forEach(([canton, count]) => {
    console.log(`  - ${canton.padEnd(25)}: ${count} municipalities`);
  });


console.log("\n\nAudit finished. Review the output above for coverage details.");

// Instructions to run this script:
// 1. Make sure you are in the root directory of the project (where package.json is).
// 2. Ensure your package.json has "type": "module" to support ES module syntax in .js files if running with `node`.
//    If using `tsx`, it can handle .ts imports directly.
// 3. Run the script using: npx tsx municipality-audit.js
//    (This assumes simpleSwissData.ts is the source file)
