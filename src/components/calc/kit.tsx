/**
 * Pièces communes des calculateurs d'indexation.
 * - `tr` : texte dans la langue de la page, l'anglais en repli (chaque outil ne parle que les langues
 *   de son pays plus l'anglais).
 * - `useParams` : état ; premier rendu = valeurs par défaut du build (RECETTE §17.5), le lien partagé
 *   s'applique ensuite (useEffect) et l'URL ne change qu'après une interaction (url-state.ts).
 * - `ResultPanel` : carte de résultat avec la fraction loyer × nouvel indice / ancien indice.
 */
import { useEffect, useState, type ReactNode } from 'react';
import { readParams, num, updateURL } from '../../lib/url-state';
import { formatMoney, formatNumber, formatPct, monthName, quarterName } from '../../lib/format';

export type L = 'fr' | 'nl' | 'es' | 'it' | 'pt' | 'de' | 'en';
export type Dict<A = string> = Partial<Record<L, A>> & { en: A };
export const tr = <A,>(l: L, d: Dict<A>): A => (d[l] ?? d.en) as A;
export const eur = (x: number, l: L, d = 2) => formatMoney(x, d, l);
export const nr = (x: number, l: L, d = 2) => formatNumber(x, d, l);
export const pc = (x: number, l: L, d = 2) => formatPct(x, d, l);
export const mois = (ym: string, l: L) => monthName(ym, l);
export const trim = (q: string, l: L) => quarterName(q, l);
export const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
export const monthLabel = (m: string, l: L) => new Date(`2026-${m}-15T00:00:00Z`).toLocaleDateString(l === 'en' ? 'en-IE' : l, { month: 'long', timeZone: 'UTC' });
export const yearRange = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => to - i);

export function useParams<K extends string>(defs: Record<K, number>): [Record<K, number>, (k: K) => (x: number) => void] {
  const [v, setV] = useState<Record<K, number>>(defs);
  useEffect(() => {
    const u = readParams(window.location.search);
    if (![...u.keys()].length) return;
    setV((o) => Object.fromEntries(Object.keys(o).map((k) => [k, num(u, k, (o as Record<string, number>)[k])])) as Record<K, number>);
  }, []);
  useEffect(() => { updateURL(v as Record<string, number>); }, [v]);
  const set = (k: K) => (x: number) => setV((o) => ({ ...o, [k]: x }));
  return [v, set];
}

export interface Row { label: string; value: string; strong?: boolean }
interface PanelProps {
  lang: L; head: string; value: string; sub?: string; rows: Row[]; notes?: ReactNode[];
  fraction?: { base: string; top: string; bottom: string };
  warn?: ReactNode; methodHref?: string; hyp?: string; copyText: string; children?: ReactNode;
}
export function ResultPanel({ lang, head, value, sub, rows, notes = [], fraction, warn, methodHref, hyp, copyText, children }: PanelProps) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard?.writeText(`${copyText} · ${window.location.href}`).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };
  const btn = 'rounded-lg border border-navy-300 bg-white px-3 py-2 font-medium text-navy-800 hover:bg-navy-50';
  return (
    <div aria-live="polite" data-resultat className="ticket mt-6 rounded-lg p-4 sm:p-5 lg:sticky lg:top-20 lg:mt-0">
      <p className="text-sm font-medium text-navy-700">{head}</p>
      <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{value}</p>
      {sub && <p className="tabular-nums mt-1 text-navy-700">{sub}</p>}
      {warn && <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">{warn}</div>}
      {fraction && (
        <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-navy-800" aria-label={`${fraction.base} × ${fraction.top} / ${fraction.bottom}`}>
          <span className="tabular-nums font-semibold">{fraction.base}</span><span aria-hidden="true">×</span>
          <span className="fraction" aria-hidden="true"><span>{fraction.top}</span><span>{fraction.bottom}</span></span>
        </p>
      )}
      <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
        {rows.map((r, i) => <tr key={i} className={r.strong ? 'font-semibold' : ''}><td className="py-1.5 pr-3 text-navy-700">{r.label}</td><td className="tabular-nums py-1.5 text-right text-navy-900">{r.value}</td></tr>)}
      </tbody></table>
      {notes.length > 0 && <ul className="mt-3 space-y-1 text-sm text-navy-700">{notes.map((n, i) => <li key={i}>{n}</li>)}</ul>}
      {children}
      {hyp && <details className="mt-3 text-sm text-navy-700"><summary className="cursor-pointer font-medium">{tr(lang, { fr: 'Hypothèses du calcul', nl: 'Uitgangspunten', es: 'Hipótesis del cálculo', it: 'Ipotesi del calcolo', pt: 'Pressupostos do cálculo', de: 'Annahmen', en: 'Assumptions' })}</summary><p className="mt-2">{hyp} {methodHref && <a href={methodHref} className="underline">{tr(lang, { fr: 'Méthode et sources', nl: 'Methode en bronnen', es: 'Método y fuentes', it: 'Metodo e fonti', pt: 'Método e fontes', de: 'Methode und Quellen', en: 'Method and sources' })}</a>}</p></details>}
      <div className="no-print mt-4 flex flex-wrap gap-2 text-sm">
        <button type="button" onClick={copy} className={btn}>{copied ? tr(lang, { fr: 'Copié', nl: 'Gekopieerd', es: 'Copiado', it: 'Copiato', pt: 'Copiado', de: 'Kopiert', en: 'Copied' }) : tr(lang, { fr: 'Copier le résultat', nl: 'Resultaat kopiëren', es: 'Copiar el resultado', it: 'Copia il risultato', pt: 'Copiar o resultado', de: 'Ergebnis kopieren', en: 'Copy result' })}</button>
        <button type="button" onClick={() => window.print()} className={btn}>{tr(lang, { fr: 'Imprimer', nl: 'Afdrukken', es: 'Imprimir', it: 'Stampa', pt: 'Imprimir', de: 'Drucken', en: 'Print' })}</button>
      </div>
    </div>
  );
}

/** Cadre : formulaire à gauche, résultat à droite (empilés sur téléphone). */
export function Frame({ form, result, after }: { form: ReactNode; result: ReactNode; after?: ReactNode }) {
  return (
    <div className="rechner not-prose rounded-lg border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-start lg:gap-6">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-5">{form}</form>
        {result}
      </div>
      {after}
    </div>
  );
}

/** Rangée de deux champs alignés (même haut, même hauteur, RECETTE §10.3). */
export const Row2 = ({ children }: { children: ReactNode }) => <div className="grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>;

/** Lettre générée dans le navigateur (rien n'est envoyé) : texte à copier. */
export function Letter({ lang, title, text }: { lang: L; title: string; text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <div className="mt-6 rounded-lg border border-navy-200 bg-navy-50 p-4">
      <p className="text-sm font-semibold text-navy-900">{title}</p>
      <pre className="mt-2 whitespace-pre-wrap font-sans text-sm text-navy-800">{text}</pre>
      <button type="button" className="no-print mt-3 rounded-lg border border-navy-300 bg-white px-3 py-2 text-sm font-medium text-navy-800 hover:bg-navy-50" onClick={() => navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1500); })}>
        {ok ? tr(lang, { pt: 'Copiada', fr: 'Copiée', en: 'Copied' }) : tr(lang, { pt: 'Copiar a carta', fr: 'Copier la lettre', en: 'Copy the letter' })}
      </button>
    </div>
  );
}
