/**
 * Accès aux séries officielles (data/*.json, régénérés par scripts/update-data.py) : un seul endroit
 * où les pages, les calculateurs et les tests lisent un indice. Aucune valeur n'est recopiée ailleurs.
 */
import fr from '../../../data/fr-indices.json';
import be from '../../../data/be-indice-sante.json';
import es from '../../../data/es-indices.json';
import it from '../../../data/it-foi.json';
import pt from '../../../data/pt-coeficientes.json';
import at from '../../../data/at-vpi.json';
import regles from '../../../data/params-regles-2026.json';

export { regles };
export type Obs = { p: string; v: number; jo?: string | null; var?: number };

// ---------------------------------------------------------------- France (Insee)
export type SerieFr = 'irl' | 'irl_corse' | 'irl_dom' | 'ilc' | 'ilat';
const FR = fr as unknown as Record<SerieFr, { obs: Obs[]; last_update: string; source_url: string; idbank: string; title: string }> & {
  ipc_hors_tabac: { base2025: { obs: Obs[]; last_update: string; source_url: string; idbank: string } };
};
export const serieFr = (s: SerieFr): Obs[] => FR[s].obs;
export const metaFr = (s: SerieFr) => FR[s];
export const valeurFr = (s: SerieFr, t: string): number | undefined => FR[s].obs.find((o) => o.p === t)?.v;
export const dernierFr = (s: SerieFr): Obs => FR[s].obs[FR[s].obs.length - 1];
/** Dernier trimestre paru au Journal officiel à une date (AAAA-MM-JJ). */
export const trimestreParuLe = (s: SerieFr, date: string): Obs | undefined =>
  [...FR[s].obs].reverse().find((o) => o.jo && o.jo <= date);
/** Trimestres disponibles, du plus récent au plus ancien. */
export const trimestresFr = (s: SerieFr): string[] => FR[s].obs.map((o) => o.p).reverse();
export const ipcFr = FR.ipc_hors_tabac.base2025;
export const valeurIpcFr = (m: string) => ipcFr.obs.find((o) => o.p === m)?.v;
export const dernierIpcFr = (): Obs => ipcFr.obs[ipcFr.obs.length - 1];
export const moisIpcFr = (): string[] => ipcFr.obs.map((o) => o.p).reverse();

// ---------------------------------------------------------------- Belgique (Statbel, base 2013)
const BE13 = be.base2013 as Record<string, number>;
export const indiceSante = (m: string): number | undefined => BE13[m];
export const moisSante = (): string[] => Object.keys(BE13).sort().reverse();
export const dernierSante = (): { p: string; v: number } => { const p = moisSante()[0]; return { p, v: BE13[p] }; };
export const santeBase2025 = be.base2025 as Record<string, number>;
export const sourceSante = { history: be.history_source, monthly: be.monthly_source };

// ---------------------------------------------------------------- Espagne (INE)
const ipcEs = Object.fromEntries(es.ipc_variacion_anual.obs.map((o) => [o.p, o.v])) as Record<string, number>;
const iravEs = Object.fromEntries(es.irav_variacion_anual.obs.map((o) => [o.p, o.v])) as Record<string, number>;
export const IPC_ES = ipcEs;
export const IRAV_ES = iravEs;
export const moisEs = (): string[] => Object.keys(ipcEs).sort().reverse();
export const dernierEs = (): { p: string; ipc: number; irav?: number } => { const p = moisEs()[0]; return { p, ipc: ipcEs[p], irav: iravEs[p] }; };
export const serieIravEs = (): Array<{ p: string; v: number }> => es.irav_variacion_anual.obs;

// ---------------------------------------------------------------- Italie (Istat, FOI senza tabacchi)
type FoiPt = { indice: number; var_mese?: number; var_anno?: number };
/** Basi in ordine cronologico : 1995 (1996-2010), 2010 (2011-2015), 2015 (2016-2025), 2025 (dal 2026). */
const BASI: Array<{ base: number; dati: Record<string, FoiPt> }> = [
  { base: 1995, dati: (it.fino_2025 as Record<string, Record<string, FoiPt>>)['4'] },
  { base: 2010, dati: (it.fino_2025 as Record<string, Record<string, FoiPt>>)['11'] },
  { base: 2015, dati: (it.fino_2025 as Record<string, Record<string, FoiPt>>)['55'] },
  { base: 2025, dati: (it.dal_2026_base2025 as Record<string, Record<string, FoiPt>>)['101'] },
];
/** Coefficienti di raccordo Istat tra basi contigue (nota « Indice dei prezzi per le rivalutazioni monetarie », 2026). */
export const RACCORDI: Record<number, number> = { 2010: 1.373, 2015: 1.071, 2025: 1.214 };
export function foi(m: string): { base: number; indice: number; varAnno?: number } | undefined {
  for (const b of BASI) { const x = b.dati[m]; if (x) return { base: b.base, indice: x.indice, varAnno: x.var_anno }; }
  return undefined;
}
export const mesiFoi = (): string[] => BASI.flatMap((b) => Object.keys(b.dati)).sort().reverse();
export const ultimoFoi = () => { const m = mesiFoi()[0]; return { m, ...foi(m)! }; };
/** Coefficienti di raccordo da applicare tra due mesi (uno per ogni cambio di base nell'intervallo). */
export function raccordiTra(da: string, a: string): number[] {
  const bd = foi(da)?.base, ba = foi(a)?.base;
  if (bd === undefined || ba === undefined) return [];
  return Object.entries(RACCORDI).filter(([b]) => Number(b) > bd && Number(b) <= ba).map(([, c]) => c);
}

// ---------------------------------------------------------------- Portugal (INE / Diário da República)
export type CoefPt = { valor: number; aviso: string; data_dr: string };
export const COEF_PT = pt.coeficientes as unknown as Record<string, CoefPt>;
export const URL_PT = (pt as unknown as { urls: Record<string, string> }).urls;
export const anosPt = (): number[] => Object.keys(COEF_PT).map(Number).sort((a, b) => b - a);

// ---------------------------------------------------------------- Autriche (Statistik Austria)
type Vpi = Record<string, number>;
const VPI: Array<{ basis: number; d: Vpi }> = [
  { basis: 2010, d: (at as unknown as { vpi2010: Vpi }).vpi2010 },
  { basis: 2015, d: (at as unknown as { vpi2015: Vpi }).vpi2015 },
  { basis: 2020, d: at.vpi2020 as Vpi },
  { basis: 2025, d: at.vpi2025 as Vpi },
];
const atx = at as unknown as Record<string, number>;
export const VERKETTUNG: Record<number, number> = { 2015: atx.verkettung_2010_2015, 2020: atx.verkettung_2015_2020, 2025: atx.verkettung_2020_2025 };
/** Monatswert des VPI in seiner jeweils aktuellen Basis (Jahresdurchschnitte : Schlüssel « AAAA »). */
export function vpi(k: string): { basis: number; wert: number } | undefined {
  for (let i = VPI.length - 1; i >= 0; i--) { const w = VPI[i].d[k]; if (w !== undefined) return { basis: VPI[i].basis, wert: w }; }
  return undefined;
}
/** Wert in einer bestimmten Basis (für Jahresdurchschnitte nach MieWeG). */
export const vpiIn = (basis: number, k: string): number | undefined => VPI.find((b) => b.basis === basis)?.d[k];
export const monateVpi = (): string[] => [...new Set(VPI.flatMap((b) => Object.keys(b.d).filter((k) => k.length === 7)))].sort().reverse();
export const letzterVpi = () => { const m = monateVpi()[0]; return { m, ...vpi(m)! }; };
export function verkettungZwischen(von: string, bis: string): number[] {
  const bv = vpi(von)?.basis, bb = vpi(bis)?.basis;
  if (bv === undefined || bb === undefined) return [];
  return Object.entries(VERKETTUNG).filter(([b]) => Number(b) > bv && Number(b) <= bb).map(([, f]) => f);
}

/** Dates de récupération des séries (pied de page, méthode). */
export const RECUPERE = { fr: fr.retrieved_at, be: be.retrieved_at, es: es.retrieved_at, it: it.retrieved_at, pt: pt.retrieved_at, at: at.retrieved_at };
