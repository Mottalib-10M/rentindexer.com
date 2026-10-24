/**
 * Moteur d'indexation des loyers : fonctions pures, sans réseau. Les séries d'indices viennent
 * des JSON de data/ (régénérés par scripts/update-data.py) et les règles de
 * data/params-regles-2026.json. Aucun chiffre réglementaire n'est écrit ici en dur, sauf les
 * seuils de date et de taux recopiés des textes et rappelés en commentaire avec leur source.
 */

export type Pays = 'fr' | 'be' | 'es' | 'it' | 'pt' | 'at';

/** Arrondi commercial au centime (MieWeG § 1 Abs. 2 Z 3 ; pratique partout ailleurs). */
export const centimes = (x: number): number => Math.round((x + Number.EPSILON) * 100) / 100;

export interface Resultat {
  nouveauLoyer: number;
  hausse: number; // en monnaie
  taux: number; // en %, deux décimales
  indiceAncien?: number;
  indiceNouveau?: number;
  plafond?: string; // règle qui a limité ou bloqué la hausse
  bloque?: boolean;
}

const res = (ancien: number, nouveau: number, extra: Partial<Resultat> = {}): Resultat => {
  const n = centimes(nouveau);
  return { nouveauLoyer: n, hausse: centimes(n - ancien), taux: centimes(((n - ancien) / ancien) * 100), ...extra };
};

// ---------------------------------------------------------------- France
export type ZoneFr = 'metropole' | 'corse' | 'dom';
export type Dpe = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

/** Trimestre « AAAA-Qn » précédent de quatre trimestres. */
export const trimestreN1 = (t: string): string => `${Number(t.slice(0, 4)) - 1}${t.slice(4)}`;

export interface EntreeFr {
  loyer: number; // loyer hors charges actuel
  trimestre: string; // trimestre de référence de la révision, ex. « 2026-Q3 »
  irl: Record<string, number>; // série de la zone
  zone: ZoneFr;
  dpe?: Dpe;
  dateBail: string; // signature, renouvellement ou reconduction tacite (AAAA-MM-JJ)
}

/** Révision annuelle par l'IRL (loi du 6 juillet 1989, art. 17-1) avec le gel des passoires F et G. */
export function reviserFr(e: EntreeFr): Resultat {
  const nouv = e.irl[e.trimestre];
  const anc = e.irl[trimestreN1(e.trimestre)];
  if (nouv === undefined || anc === undefined) throw new Error(`IRL ${e.trimestre} ou ${trimestreN1(e.trimestre)} non publié`);
  // service-public F13723 : métropole depuis le 24/08/2022, DOM depuis le 01/07/2024
  const gelDepuis = e.zone === 'dom' ? '2024-07-01' : '2022-08-24';
  if ((e.dpe === 'F' || e.dpe === 'G') && e.dateBail >= gelDepuis) {
    return res(e.loyer, e.loyer, { indiceAncien: anc, indiceNouveau: nouv, bloque: true, plafond: 'fr-gel-dpe-fg' });
  }
  return res(e.loyer, (e.loyer * nouv) / anc, { indiceAncien: anc, indiceNouveau: nouv });
}

// ---------------------------------------------------------------- Belgique
export type RegionBe = 'bruxelles' | 'wallonie' | 'flandre';

/** Mois « AAAA-MM » précédant une date « AAAA-MM-JJ ». */
export const moisPrecedent = (d: string): string => {
  let y = Number(d.slice(0, 4)); let m = Number(d.slice(5, 7)) - 1;
  if (m === 0) { m = 12; y -= 1; }
  return `${y}-${String(m).padStart(2, '0')}`;
};

/** Formule de base : loyer de base × nouvel indice / indice de départ (ancien Code civil, art. 1728bis). */
export function indexerBe(loyerBase: number, indiceDepart: number, nouvelIndice: number): number {
  return (loyerBase * nouvelIndice) / indiceDepart;
}

export interface EntreeFlandre {
  loyerBase: number; indiceDepart: number; nouvelIndice: number;
  moisAnniversaire: string; // « 01 » … « 12 »
  epc: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'sans';
  entreeVigueur: string; // AAAA-MM-JJ
  facteurs: Record<string, { D: number; EFsans: number }>; // params-regles-2026.json
}

/** Flandre : correctiefactor pour les baux entrés en vigueur avant le 01/10/2022 et un EPC D, E, F ou sans. */
export function indexerFlandre(e: EntreeFlandre): Resultat {
  const plein = indexerBe(e.loyerBase, e.indiceDepart, e.nouvelIndice);
  const concerne = e.entreeVigueur < '2022-10-01' && ['D', 'E', 'F', 'sans'].includes(e.epc);
  if (!concerne) return res(e.loyerBase, plein, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice });
  const f = e.facteurs[e.moisAnniversaire];
  if (!f) throw new Error(`mois anniversaire inconnu : ${e.moisAnniversaire}`);
  const k = e.epc === 'D' ? f.D : f.EFsans;
  return res(e.loyerBase, plein * k, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice, plafond: 'be-vl-correctiefactor' });
}

export interface EntreeBruxelles {
  loyerBase: number; indiceDepart: number; nouvelIndice: number;
  peb: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  entreeVigueur: string;
  /** Indices santé des mois précédant les anniversaires utiles : [année N-1, année N] (2022/2023 ou 2021/2022). */
  indicesCorrection?: [number, number];
}

/** Bruxelles : facteur de correction pour les baux entrés en vigueur avant le 14/10/2022, PEB E, F ou G. */
export function indexerBruxelles(e: EntreeBruxelles): Resultat {
  const plein = indexerBe(e.loyerBase, e.indiceDepart, e.nouvelIndice);
  const concerne = e.entreeVigueur < '2022-10-14' && ['E', 'F', 'G'].includes(e.peb);
  if (!concerne) return res(e.loyerBase, plein, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice });
  if (!e.indicesCorrection) throw new Error('indices de correction requis');
  const [a, b] = e.indicesCorrection;
  const k = e.peb === 'E' ? (0.5 * (a + b)) / b : a / b;
  return res(e.loyerBase, plein * k, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice, plafond: 'be-bxl-facteur-correction' });
}

/** Choix de l'anniversaire de référence du facteur bruxellois (avant ou à partir du 14 octobre). */
export function anniversairesCorrectionBxl(entreeVigueur: string): [number, number] {
  const md = entreeVigueur.slice(5);
  return md >= '10-14' ? [2021, 2022] : [2022, 2023];
}

export interface EntreeWallonie {
  loyerBase: number; indiceDepart: number; nouvelIndice: number;
  peb: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'sans';
  entreeVigueur: string;
  /** Indices santé des mois précédant l'anniversaire tombé entre le 01/11/2022 et le 31/10/2023
   *  (A) et l'anniversaire précédent (B) : base du « loyer adapté ». */
  indiceAnniv2223?: number; indiceAnnivPrecedent?: number;
}

/** Wallonie : limitation de l'indexation entre le 01/11/2022 et le 31/10/2023 (D 75 %, E 50 %, F, G et
 *  sans PEB 0 %), puis, depuis le 01/11/2023, loyer adapté comme nouvelle base et indice de l'anniversaire
 *  2022-2023 comme indice de départ (wallonie.be, « Indexer un loyer »). Hypothèse : le loyer avait été
 *  indexé à l'anniversaire précédent. */
export function indexerWallonie(e: EntreeWallonie, parts: Record<string, number>): Resultat {
  const plein = indexerBe(e.loyerBase, e.indiceDepart, e.nouvelIndice);
  const part = parts[e.peb] ?? 1;
  const concerne = part < 1 && e.entreeVigueur < '2022-11-01';
  if (!concerne) return res(e.loyerBase, plein, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice });
  if (e.indiceAnniv2223 === undefined || e.indiceAnnivPrecedent === undefined) throw new Error('indices 2022-2023 requis');
  const indexe2223 = indexerBe(e.loyerBase, e.indiceDepart, e.indiceAnniv2223);
  const du = indexerBe(e.loyerBase, e.indiceDepart, e.indiceAnnivPrecedent);
  const adapte = du + (indexe2223 - du) * part;
  return res(e.loyerBase, (adapte * e.nouvelIndice) / e.indiceAnniv2223, { indiceAncien: e.indiceDepart, indiceNouveau: e.nouvelIndice, plafond: 'be-wal-loyer-adapte' });
}

/** Année de l'anniversaire tombé entre le 01/11/2022 et le 31/10/2023, pour une entrée en vigueur donnée. */
export const anniversaire2223 = (entreeVigueur: string): string => {
  const md = entreeVigueur.slice(5);
  return `${md >= '11-01' ? 2022 : 2023}-${md}`;
};

// ---------------------------------------------------------------- Espagne
export interface EntreeEs {
  renta: number;
  fechaContrato: string; // firma (AAAA-MM-JJ)
  fechaActualizacion: string; // anualidad (AAAA-MM-JJ)
  ipc: Record<string, number>; // variación anual por mes
  irav: Record<string, number>;
  /** Mes del último índice publicado en la fecha de actualización (AAAA-MM). */
  mesReferencia: string;
  pacto: 'ipc' | 'irav' | 'sin-indice' | 'ninguno';
  rentaSobreIndiceReferencia?: boolean; // supuesto a) de la DF 6.ª del RDL 29/2026
  nuevoPactoPct?: number; // supuesto b), si las partes han pactado
  rdl29Vigente: boolean; // convalidación pendiente : bandera de params
}

/** Actualización anual de la renta (LAU art. 18, redacción RDL 29/2026, y su DF 6.ª). */
export function actualizarEs(e: EntreeEs): Resultat {
  if (e.pacto === 'ninguno') return res(e.renta, e.renta, { bloque: true, plafond: 'es-sin-pacto' });
  const irav = e.irav[e.mesReferencia];
  const ipc = e.ipc[e.mesReferencia];
  const posterior = e.fechaContrato >= '2023-05-26';
  let pct = e.pacto === 'ipc' ? ipc : irav; // « sin-indice » : IRAV por defecto (art. 18.1)
  if (pct === undefined) throw new Error(`índice ${e.mesReferencia} no publicado`);
  let plafond: string | undefined;
  if (posterior && irav !== undefined && pct > irav) { pct = irav; plafond = 'es-tope-irav'; }
  const enPeriodo = e.fechaActualizacion >= '2026-10-08' && e.fechaActualizacion <= '2027-12-31';
  if (e.rdl29Vigente && enPeriodo) {
    if (e.rentaSobreIndiceReferencia) return res(e.renta, e.renta, { bloque: true, plafond: 'es-rdl29-sobre-indice' });
    const tope = e.nuevoPactoPct ?? 2;
    const techo = posterior && irav !== undefined ? Math.min(tope, irav) : tope;
    if (pct > techo) { pct = techo; plafond = e.nuevoPactoPct !== undefined ? 'es-rdl29-pacto' : 'es-rdl29-2pct'; }
  }
  return res(e.renta, e.renta * (1 + pct / 100), { plafond });
}

// ---------------------------------------------------------------- Italie
export type RegimeIt = 'libero' | 'concordato' | 'commerciale' | 'cedolare';

/** Aggiornamento ISTAT : canone × (1 + variazione FOI × quota). */
export function aggiornaIt(canone: number, variazioneFoi: number, regime: RegimeIt, quotaPattuita = 1): Resultat {
  if (regime === 'cedolare') return res(canone, canone, { bloque: true, plafond: 'it-cedolare-secca' });
  const max = regime === 'commerciale' ? 0.75 : 1; // L. 392/1978, art. 32
  const quota = Math.min(quotaPattuita, max);
  return res(canone, canone * (1 + (variazioneFoi * quota) / 100), quota < quotaPattuita ? { plafond: 'it-75' } : {});
}

// ---------------------------------------------------------------- Portugal
/** Arredondamento para a unidade cêntimo imediatamente superior (NRAU, art. 25.º, redação da Lei n.º 31/2012). */
export const centimoSuperior = (x: number): number => Math.ceil(Math.round(x * 1e6) / 1e4) / 100;

/** Atualização anual : renda × coeficiente(s) ; acumulação de coeficientes não aplicados (≤ 3 coeficientes). */
export function atualizarPt(renda: number, coeficientes: number[]): Resultat {
  if (coeficientes.length > 3) throw new Error('no máximo três coeficientes acumulados');
  const k = coeficientes.reduce((a, c) => a * c, 1);
  const n = centimoSuperior(renda * k);
  return { nouveauLoyer: n, hausse: centimes(n - renda), taux: centimes(((n - renda) / renda) * 100) };
}

/** Anos cujos coeficientes se aplicam numa atualização feita no ano `ano`, sabendo que a última
 *  atualização (ou o início do contrato) foi no ano `ultimo` : o do próprio ano e os dos anos não
 *  aplicados, no máximo três coeficientes ao todo. Nada antes de um ano completo de contrato. */
export function anosCoeficientesPt(ano: number, ultimo: number): number[] {
  if (ultimo >= ano) return [];
  const desde = Math.max(ultimo + 1, ano - 2);
  const anos: number[] = [];
  for (let a = desde; a <= ano; a++) anos.push(a);
  return anos;
}

/** Istat, « Indice dei prezzi per le rivalutazioni monetarie » (2026) : rapporto degli indici per i
 *  coefficienti di raccordo tra basi contigue ; coefficiente arrotondato a 3 decimali, variazione a 1. */
export interface RivalutazioneIt { coefficiente: number; variazione: number; importo: number; rivalutato: number }
export function rivalutaIt(importo: number, indiceDa: number, indiceA: number, raccordi: number[]): RivalutazioneIt {
  const r = (indiceA / indiceDa) * raccordi.reduce((a, c) => a * c, 1);
  const coefficiente = Math.round(r * 1000) / 1000;
  const variazione = Math.round((r * 100 - 100) * 10) / 10;
  return { coefficiente, variazione, importo, rivalutato: centimes(importo * coefficiente) };
}

// ---------------------------------------------------------------- France, autres indices
/** Indexation d'une somme (pension alimentaire, loyer commercial) : montant × nouvel indice / ancien indice. */
export function indexerSomme(montant: number, ancien: number, nouveau: number): Resultat {
  return res(montant, (montant * nouveau) / ancien, { indiceAncien: ancien, indiceNouveau: nouveau });
}

// ---------------------------------------------------------------- Autriche
/** Prozent der durchschnittlichen VPI-Veränderung im Vorjahr, gedämpft (MieWeG § 1 Abs. 2 und 3). */
export function mieWegProzent(vpiJahr: number, vpiVorjahr: number, opts: { jahr: number; mrgBeschraenkt: boolean; ersteValorisierungMonate?: number }): number {
  let p = (vpiJahr / vpiVorjahr - 1) * 100;
  if (p > 3) p = 3 + (p - 3) / 2; // Anteil über drei Prozentpunkte nur zur Hälfte
  if (opts.mrgBeschraenkt) {
    if (opts.jahr === 2025) p = Math.min(p, 1);
    if (opts.jahr === 2026) p = Math.min(p, 2);
  }
  if (opts.ersteValorisierungMonate !== undefined) p = (p * opts.ersteValorisierungMonate) / 12;
  return p;
}

export function valorisierenAt(miete: number, prozent: number): Resultat {
  return res(miete, miete * (1 + prozent / 100));
}

/** Wertsicherung eines Betrags zwischen zwei Monaten, über die Verkettung der VPI-Basen. */
export function wertsichernAt(betrag: number, indexVon: number, indexBis: number, verkettung: number[]): { faktor: number; prozent: number; betrag: number } {
  const f = (indexBis / indexVon) * verkettung.reduce((a, c) => a * c, 1);
  return { faktor: f, prozent: (f - 1) * 100, betrag: centimes(betrag * f) };
}
