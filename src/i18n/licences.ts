/**
 * Attributions exigées par les licences des données (audit données et droits du 2026-10-24) :
 * pied de page de toutes les pages, page pour iframe comprise, et section des mentions légales.
 * Formule INE (Espagne) imposée par son aviso legal, reprise mot pour mot dans toutes les langues.
 */
import type { Locale } from './routes';

const L = {
  lo: 'https://www.etalab.gouv.fr/licence-ouverte-open-licence/',
  ccby: 'https://creativecommons.org/licenses/by/4.0/',
  ine: 'https://www.ine.es/ss/Satellite?L=es_ES&c=Page&cid=1254735849170&p=1254735849170&pagename=Ayuda%2FINELayout',
  bxl: 'https://admin.be.brussels/en/bhg/document/download/7414',
  statbel: 'https://statbel.fgov.be/fr/open-data',
  istat: 'https://www.istat.it/note-legali/',
  stat: 'https://data.statistik.gv.at',
};
const a = (href: string, t: string) => `<a href="${href}" rel="noopener" target="_blank">${t}</a>`;
export const INE_ES_FORMULE = 'Elaboración propia con datos extraídos del sitio web del INE: www.ine.es';

interface Txt { h: string; calc: string; items: string[] }

const T: Record<Locale, Txt> = {
  fr: {
    h: 'Données et licences',
    calc: 'Données adaptées : calculs Radif Partners.',
    items: [
      `Insee, séries IRL, ILC, ILAT et indice des prix hors tabac, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel, indice santé (13 derniers mois, be.STAT), ${a(L.ccby, 'CC BY 4.0')} ; historique antérieur : tableau « indices » du ${a(L.bxl, 'calculateur de Bruxelles Logement')}.`,
      `INE (Espagne), IPC et IRAV : « ${INE_ES_FORMULE} » (${a(L.ine, 'aviso legal')}).`,
      `Istat, indice FOI hors tabac et coefficients de raccordement, ${a(L.ccby, 'CC BY 4.0')}.`,
      `Statistik Austria, indice des prix à la consommation (VPI), ${a(L.stat, 'data.statistik.gv.at')}, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portugal : coefficients des avis de l’INE au Diário da República ; Espagne : textes du BOE ; Flandre : facteurs de correction publiés sur vlaanderen.be.',
    ],
  },
  en: {
    h: 'Data and licences',
    calc: 'Adapted data: calculations by Radif Partners.',
    items: [
      `Insee, IRL, ILC, ILAT and consumer prices excluding tobacco, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel, health index (last 13 months, be.STAT), ${a(L.ccby, 'CC BY 4.0')}; earlier history: “indices” table of the ${a(L.bxl, 'Brussels Housing calculator')}.`,
      `INE (Spain), CPI and IRAV: “${INE_ES_FORMULE}” (${a(L.ine, 'aviso legal')}).`,
      `Istat, FOI index excluding tobacco and linking coefficients, ${a(L.ccby, 'CC BY 4.0')}.`,
      `Statistik Austria, consumer price index (VPI), ${a(L.stat, 'data.statistik.gv.at')}, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portugal: coefficients from the INE notices in the Diário da República; Spain: BOE texts; Flanders: correction factors published on vlaanderen.be.',
    ],
  },
  de: {
    h: 'Daten und Lizenzen',
    calc: 'Bearbeitete Daten, Berechnung: Radif Partners.',
    items: [
      `Datenquelle: Statistik Austria, Verbraucherpreisindex (VPI 2010, 2015, 2020, 2025), ${a(L.stat, 'data.statistik.gv.at')}, ${a(L.ccby, 'CC BY 4.0')}.`,
      `Insee (Frankreich), IRL, ILC, ILAT und Verbraucherpreise ohne Tabak, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel (Belgien), Gesundheitsindex (letzte 13 Monate), ${a(L.ccby, 'CC BY 4.0')}; ältere Werte: Tabelle „indices“ des ${a(L.bxl, 'Rechners von Bruxelles Logement')}.`,
      `INE (Spanien), VPI und IRAV: „${INE_ES_FORMULE}“ (${a(L.ine, 'aviso legal')}).`,
      `Istat (Italien), FOI-Index ohne Tabak und Verkettungskoeffizienten, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portugal: Koeffizienten aus den Bekanntmachungen des INE im Diário da República; Spanien: Texte des BOE; Flandern: Korrekturfaktoren von vlaanderen.be.',
    ],
  },
  es: {
    h: 'Datos y licencias',
    calc: 'Datos adaptados: cálculos de Radif Partners.',
    items: [
      `INE, IPC (variación anual) e IRAV: «${INE_ES_FORMULE}» (${a(L.ine, 'aviso legal')}).`,
      'BOE: textos del Real Decreto-ley 29/2026 y de la Ley de Arrendamientos Urbanos (Agencia Estatal Boletín Oficial del Estado).',
      `Insee (Francia), IRL, ILC, ILAT e IPC sin tabaco, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel (Bélgica), índice de salud (últimos 13 meses), ${a(L.ccby, 'CC BY 4.0')}; serie anterior: tabla «indices» de la ${a(L.bxl, 'calculadora de Bruxelles Logement')}.`,
      `Istat (Italia), índice FOI sin tabaco, ${a(L.ccby, 'CC BY 4.0')}; Statistik Austria, VPI, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portugal: coeficientes de los avisos del INE en el Diário da República; Flandes: factores de corrección de vlaanderen.be.',
    ],
  },
  it: {
    h: 'Dati e licenze',
    calc: 'Dati adattati: elaborazioni di Radif Partners.',
    items: [
      `Istat, indice FOI senza tabacchi e coefficienti di raccordo, ${a(L.istat, 'note legali')}, licenza ${a(L.ccby, 'CC BY 4.0')}.`,
      `Insee (Francia), IRL, ILC, ILAT e prezzi senza tabacchi, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel (Belgio), indice salute (ultimi 13 mesi), ${a(L.ccby, 'CC BY 4.0')}; serie precedente: tabella «indices» del ${a(L.bxl, 'calcolatore di Bruxelles Logement')}.`,
      `INE (Spagna), IPC e IRAV: «${INE_ES_FORMULE}» (${a(L.ine, 'aviso legal')}).`,
      `Statistik Austria, VPI, ${a(L.stat, 'data.statistik.gv.at')}, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portogallo: coefficienti degli avvisi dell’INE nel Diário da República; Spagna: testi del BOE; Fiandre: fattori di correzione di vlaanderen.be.',
    ],
  },
  nl: {
    h: 'Gegevens en licenties',
    calc: 'Bewerkte gegevens: berekeningen van Radif Partners.',
    items: [
      `Statbel, gezondheidsindex (laatste 13 maanden, be.STAT), ${a(L.statbel, 'open data')}, ${a(L.ccby, 'CC BY 4.0')}; oudere reeks: tabel „indices” van de ${a(L.bxl, 'rekenmodule van Brussel Huisvesting')}.`,
      'Vlaanderen: correctiefactoren zoals gepubliceerd op vlaanderen.be.',
      `Insee (Frankrijk), IRL, ILC, ILAT en prijzen zonder tabak, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `INE (Spanje), CPI en IRAV: „${INE_ES_FORMULE}” (${a(L.ine, 'aviso legal')}).`,
      `Istat (Italië), FOI-index zonder tabak, ${a(L.ccby, 'CC BY 4.0')}; Statistik Austria, VPI, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Portugal: coëfficiënten uit de berichten van het INE in het Diário da República; Spanje: teksten van het BOE.',
    ],
  },
  pt: {
    h: 'Dados e licenças',
    calc: 'Dados adaptados: cálculos da Radif Partners.',
    items: [
      'INE (Portugal): coeficientes de atualização das rendas publicados em aviso no Diário da República (atos oficiais).',
      `Insee (França), IRL, ILC, ILAT e preços sem tabaco, ${a(L.lo, 'Licence Ouverte 2.0 (Etalab)')}.`,
      `Statbel (Bélgica), índice de saúde (últimos 13 meses), ${a(L.ccby, 'CC BY 4.0')}; série anterior: tabela «indices» da ${a(L.bxl, 'calculadora de Bruxelles Logement')}.`,
      `INE (Espanha), IPC e IRAV: «${INE_ES_FORMULE}» (${a(L.ine, 'aviso legal')}).`,
      `Istat (Itália), índice FOI sem tabaco, ${a(L.ccby, 'CC BY 4.0')}; Statistik Austria, VPI, ${a(L.stat, 'data.statistik.gv.at')}, ${a(L.ccby, 'CC BY 4.0')}.`,
      'Espanha: textos do BOE; Flandres: fatores de correção de vlaanderen.be.',
    ],
  },
};

/** Bloc HTML (titre, liste, mention de calcul). `tag` = niveau du titre. */
export function licencesHtml(lang: Locale, tag: 'h2' | 'p' = 'p'): string {
  const t = T[lang] ?? T.en;
  const head = tag === 'h2' ? `<h2>${t.h}</h2>` : `<p class="font-semibold text-navy-700">${t.h}</p>`;
  return `${head}<ul>${t.items.map((i) => `<li>${i}</li>`).join('')}</ul><p>${t.calc}</p>`;
}
