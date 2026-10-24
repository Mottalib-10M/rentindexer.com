/** Formatage des nombres et des dates, une locale par langue de page (RECETTE §4 : jamais une locale par site). */
import { LOCALE_TAG, CURRENCY, LANG_TAGS } from '../data/site-config';

/** Locale d'affichage d'une langue : l'anglais du site s'écrit à l'irlandaise (€1,250.50, zone euro). */
export const tagOf = (lang?: string): string => (!lang ? LOCALE_TAG : lang === 'en' ? 'en-IE' : LANG_TAGS[lang] ?? LOCALE_TAG);

const cache = new Map<string, Intl.NumberFormat>();
function nf(opts: Intl.NumberFormatOptions, lang?: string): Intl.NumberFormat {
  const k = `${tagOf(lang)}|${JSON.stringify(opts)}`;
  if (!cache.has(k)) cache.set(k, new Intl.NumberFormat(tagOf(lang), opts));
  return cache.get(k)!;
}
export function formatMoney(value: number, decimals = 0, lang?: string): string {
  return nf({ style: 'currency', currency: CURRENCY, minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value);
}
export function formatNumber(value: number, decimals = 0, lang?: string): string {
  return nf({ minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value);
}
/** Nombre tiré des paramètres et inséré dans un texte : décimales utiles seulement, au format de la langue. */
export function formatDecimal(value: number, max = 2, lang?: string): string {
  return nf({ maximumFractionDigits: max }, lang).format(value);
}
/** Valeur déjà exprimée en % (1,57 → « 1,57 % ») ; espace insécable avant % dans toutes les langues. */
export function formatPct(value: number, decimals = 2, lang?: string): string {
  // Anglais, italien, portugais : signe collé (« 1.57% ») ; l'anglais affichait « +1.57 % » jusqu'au 2026-10-24.
  const colle = /^(en|it|pt)/.test(tagOf(lang));
  return `${nf({ minimumFractionDigits: decimals, maximumFractionDigits: decimals }, lang).format(value)}${colle ? '' : '\u00a0'}%`;
}
export function formatPercent(value: number, decimals = 1, lang?: string): string {
  return formatPct(value * 100, decimals, lang);
}
export function parseLocaleNumber(input: string): number {
  const cleaned = input.replace(/[^\d.,-]/g, '');
  const lastComma = cleaned.lastIndexOf(','), lastDot = cleaned.lastIndexOf('.');
  let s = cleaned;
  if (lastComma > lastDot) s = cleaned.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(cleaned)) s = cleaned.replace(/\./g, '');
  else s = cleaned.replace(/,/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

/** Date en toutes lettres dans la langue de la page (fuseau UTC forcé). */
export function displayDate(iso: string, langTag: string): string {
  const s = new Date(`${iso}T00:00:00Z`).toLocaleDateString(langTag, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  return langTag.startsWith('fr') ? s.replace(/^1 /, '1er ') : s;
}
/** Mois « AAAA-MM » en toutes lettres (« septembre 2026 », « settembre 2026 », « September 2026 »). */
export function monthName(ym: string, lang: string): string {
  const s = new Date(`${ym}-15T00:00:00Z`).toLocaleDateString(tagOf(lang), { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return lang === 'es' || lang === 'pt' ? s.replace(/ de (\d{4})$/, ' de $1') : s;
}
/** Trimestre « AAAA-Qn » écrit dans la langue (« 3e trimestre 2026 », « Q3 2026 »). */
export function quarterName(q: string, lang: string): string {
  const y = q.slice(0, 4), n = Number(q.slice(6));
  if (lang === 'fr') return `${n === 1 ? '1er' : `${n}e`} trimestre ${y}`;
  return `Q${n} ${y}`;
}
