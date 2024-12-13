import { MunicipalityData } from '../types/Municipality';

export const municipalities: Record<string, MunicipalityData[]> = {
  // Previous cantons remain the same...

  'Thurgau': [
    'Frauenfeld', 'Kreuzlingen', 'Arbon', 'Amriswil', 'Weinfelden', 'Romanshorn', 'Sirnach', 'Aadorf', 'Münchwilen',
    'Bischofszell', 'Diessenhofen', 'Steckborn', 'Eschlikon', 'Erlen', 'Wigoltingen', 'Bürglen', 'Sulgen', 'Rickenbach',
    'Wängi', 'Gachnang', 'Tägerwilen', 'Altnau', 'Bottighofen', 'Lengwil', 'Kemmental', 'Wuppenau', 'Schönholzerswilen',
    'Hauptwil-Gottshaus', 'Hohentannen', 'Kradolf-Schönenberg', 'Zihlschlacht-Sitterdorf', 'Affeltrangen', 'Bussnang',
    'Märstetten', 'Amlikon-Bissegg', 'Berg', 'Birwinken', 'Bettwiesen', 'Fischingen', 'Lommis', 'Wilen', 'Rickenbach',
    'Schönholzerswilen', 'Tobel-Tägerschen', 'Braunau', 'Eschlikon', 'Münchwilen', 'Sirnach', 'Wängi'
  ].map(name => ({
    name,
    canton: 'Thurgau',
    taxMultiplier: 117,
    type: 'municipality'
  })),

  'Ticino': [
    'Lugano', 'Bellinzona', 'Locarno', 'Mendrisio', 'Chiasso', 'Giubiasco', 'Minusio', 'Losone', 'Massagno', 'Paradiso',
    'Ascona', 'Biasca', 'Agno', 'Gordola', 'Caslano', 'Stabio', 'Tenero-Contra', 'Novazzano', 'Maggia', 'Riviera',
    'Arbedo-Castione', 'Balerna', 'Bissone', 'Bodio', 'Breggia', 'Brissago', 'Cademario', 'Cadempino', 'Cadenazzo',
    'Capriasca', 'Castel San Pietro', 'Centovalli', 'Cevio', 'Collina d\'Oro', 'Comano', 'Cugnasco-Gerra', 'Cureglia',
    'Faido', 'Gambarogno', 'Giornico', 'Gorduno', 'Grancia', 'Gravesano', 'Isone', 'Lamone', 'Lavizzara', 'Lumino',
    'Magliaso', 'Manno', 'Maroggia', 'Melano', 'Melide', 'Mezzovico-Vira', 'Monteceneri', 'Morbio Inferiore',
    'Morcote', 'Muralto', 'Neggio', 'Novaggio', 'Origlio', 'Orselina', 'Personico', 'Pollegio', 'Ponte Capriasca',
    'Ponte Tresa', 'Porza', 'Pura', 'Quinto', 'Riva San Vitale', 'Ronco sopra Ascona', 'Rovio', 'Sant\'Antonino',
    'Savosa', 'Sementina', 'Serravalle', 'Sorengo', 'Torricella-Taverne', 'Vacallo', 'Vernate', 'Vezia', 'Vico Morcote'
  ].map(name => ({
    name,
    canton: 'Ticino',
    taxMultiplier: 100,
    type: 'municipality'
  })),

  'Vaud': [
    'Lausanne', 'Yverdon-les-Bains', 'Montreux', 'Renens', 'Nyon', 'Vevey', 'Pully', 'Morges', 'Gland', 'Ecublens',
    'Prilly', 'La Tour-de-Peilz', 'Aigle', 'Payerne', 'Rolle', 'Crissier', 'Bussigny', 'Epalinges', 'Lutry', 'Chavannes',
    'Aubonne', 'Avenches', 'Belmont-sur-Lausanne', 'Bex', 'Blonay', 'Bottens', 'Bourg-en-Lavaux', 'Bremblens',
    'Buchillon', 'Chardonne', 'Château-d\'Oex', 'Chavornay', 'Cheseaux-sur-Lausanne', 'Chexbres', 'Commugny',
    'Coppet', 'Cossonay', 'Crans-près-Céligny', 'Cugy', 'Daillens', 'Denges', 'Echallens', 'Echandens', 'Etoy',
    'Founex', 'Gimel', 'Grandson', 'Gryon', 'Jongny', 'La Sarraz', 'Le Mont-sur-Lausanne', 'Leysin', 'Lonay',
    'Lucens', 'Mézières', 'Montagny-près-Yverdon', 'Mont-sur-Rolle', 'Moudon', 'Ollon', 'Orbe', 'Oron', 'Paudex',
    'Penthalaz', 'Prangins', 'Préverenges', 'Roche', 'Saint-Cergue', 'Saint-Légier-La Chiésaz', 'Saint-Prex',
    'Saint-Sulpice', 'Savigny', 'Tolochenaz', 'Vallorbe', 'Villars-sur-Ollon', 'Villeneuve'
  ].map(name => ({
    name,
    canton: 'Vaud',
    taxMultiplier: 154.5,
    type: 'municipality'
  })),

  'Valais': [
    'Sion', 'Monthey', 'Sierre', 'Martigny', 'Brig-Glis', 'Naters', 'Visp', 'Collombey-Muraz', 'Fully', 'Bagnes',
    'Saint-Maurice', 'Conthey', 'Zermatt', 'Savièse', 'Vétroz', 'Ayent', 'Grimisuat', 'Saas-Fee', 'Leuk', 'Lens',
    'Anniviers', 'Arbaz', 'Ardon', 'Ausserberg', 'Ayent', 'Baltschieder', 'Binn', 'Bister', 'Bitsch', 'Blatten',
    'Bourg-Saint-Pierre', 'Bovernier', 'Chalais', 'Chamoson', 'Champéry', 'Charrat', 'Chermignon', 'Chippis',
    'Collonges', 'Crans-Montana', 'Dorénaz', 'Eggerberg', 'Eischoll', 'Embd', 'Ergisch', 'Ernen', 'Evionnaz',
    'Evolène', 'Fiesch', 'Fieschertal', 'Finhaut', 'Gampel-Bratsch', 'Goms', 'Grône', 'Guttet-Feschel',
    'Hérémence', 'Icogne', 'Isérables', 'Kippel', 'La Tzoumaz', 'Lalden', 'Leytron', 'Liddes', 'Massongex',
    'Miège', 'Montana', 'Münster-Geschinen', 'Nendaz', 'Niedergesteln', 'Oberems', 'Orsières', 'Port-Valais',
    'Randa', 'Randogne', 'Raron', 'Riddes', 'Saas-Almagell', 'Saas-Balen', 'Saas-Grund', 'Saint-Gingolph',
    'Saint-Jean', 'Saint-Luc', 'Saint-Martin', 'Salgesch', 'Salvan', 'Saxon', 'Sembrancher', 'Stalden',
    'Steg-Hohtenn', 'Täsch', 'Termen', 'Troistorrents', 'Turtmann-Unterems', 'Val-d\'Illiez', 'Venthône',
    'Vernayaz', 'Vérossaz', 'Veyras', 'Vionnaz', 'Visperterminen', 'Vouvry', 'Zeneggen', 'Zinal'
  ].map(name => ({
    name,
    canton: 'Valais',
    taxMultiplier: 130,
    type: 'municipality'
  })),

  // Rest of the code remains the same...
};

// Existing utility functions remain the same...