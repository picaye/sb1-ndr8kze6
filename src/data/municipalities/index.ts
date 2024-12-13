import { Municipality } from './types';
import { aargauMunicipalities } from './aargau';
import { zurichMunicipalities } from './zurich';
import { bernMunicipalities } from './bern';
import { baselMunicipalities } from './basel';
import { genevaMunicipalities } from './geneva';
import { vaudMunicipalities } from './vaud';
import { stGallenMunicipalities } from './stgallen';
import { lucerneMunicipalities } from './lucerne';
import { ticinoMunicipalities } from './ticino';
import { valaisMunicipalities } from './valais';
import { zugMunicipalities } from './zug';
import { thurgauMunicipalities } from './thurgau';
import { fribourgMunicipalities } from './fribourg';
import { solothurnMunicipalities } from './solothurn';
import { graubuendenMunicipalities } from './graubuenden';
import { uriMunicipalities } from './uri';
import { schwyzMunicipalities } from './schwyz';
import { obwaldenMunicipalities } from './obwalden';
import { nidwaldenMunicipalities } from './nidwalden';
import { glarusMunicipalities } from './glarus';
import { appenzellInnerrhodenMunicipalities } from './appenzell-innerrhoden';
import { appenzellAusserrhodenMunicipalities } from './appenzell-ausserrhoden';
import { schaffhausenMunicipalities } from './schaffhausen';
import { juraMunicipalities } from './jura';
import { neuchatelMunicipalities } from './neuchatel';
import { baselLandschaftMunicipalities } from './basel-landschaft';

export const municipalities: Record<string, Municipality[]> = {
  'Aargau': aargauMunicipalities,
  'Appenzell Ausserrhoden': appenzellAusserrhodenMunicipalities,
  'Appenzell Innerrhoden': appenzellInnerrhodenMunicipalities,
  'Basel-Stadt': baselMunicipalities.filter(m => m.canton === 'Basel-Stadt'),
  'Basel-Landschaft': baselLandschaftMunicipalities,
  'Bern': bernMunicipalities,
  'Fribourg': fribourgMunicipalities,
  'Geneva': genevaMunicipalities,
  'Glarus': glarusMunicipalities,
  'Graubünden': graubuendenMunicipalities,
  'Jura': juraMunicipalities,
  'Luzern': lucerneMunicipalities,
  'Neuchâtel': neuchatelMunicipalities,
  'Nidwalden': nidwaldenMunicipalities,
  'Obwalden': obwaldenMunicipalities,
  'Schaffhausen': schaffhausenMunicipalities,
  'Schwyz': schwyzMunicipalities,
  'Solothurn': solothurnMunicipalities,
  'St. Gallen': stGallenMunicipalities,
  'Thurgau': thurgauMunicipalities,
  'Ticino': ticinoMunicipalities,
  'Uri': uriMunicipalities,
  'Valais': valaisMunicipalities,
  'Vaud': vaudMunicipalities,
  'Zug': zugMunicipalities,
  'Zürich': zurichMunicipalities
};