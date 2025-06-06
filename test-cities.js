
console.log('Testing 10 random municipalities...');

// Test cities from different cantons
const testCities = [
  { canton: 'Zürich', city: 'Zumikon' },
  { canton: 'Zürich', city: 'Zürich' },
  { canton: 'Bern', city: 'Bern' },
  { canton: 'Basel-Stadt', city: 'Basel' },
  { canton: 'Geneva', city: 'Genève' },
  { canton: 'Vaud', city: 'Lausanne' },
  { canton: 'Ticino', city: 'Lugano' },
  { canton: 'Zug', city: 'Zug' },
  { canton: 'Luzern', city: 'Luzern' },
  { canton: 'St. Gallen', city: 'St. Gallen' }
];

testCities.forEach((test, i) => {
  console.log(`${i+1}. Testing ${test.canton} -> ${test.city}`);
});

