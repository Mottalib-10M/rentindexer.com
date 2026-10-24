/** Fabrique les outils d'écriture (`Helpers`) passés aux textes. */
import { route, ROUTES, type Locale } from '../i18n/routes';
import * as D from './engine/donnees';
import * as E from './engine/indexation';
import { SOURCES, sourceLabel, type SourceKey } from '../data/sources';
import type { Helpers } from './types';
import { formatMoney, formatNumber, formatPct, displayDate, monthName, quarterName, tagOf } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');

export function helpers(lang: Locale): Helpers {
  return {
    lang, D, E,
    a: (id, text) => { const r = ROUTES.find((x) => x.id === id); return r && (r.paths[lang] || r.paths.en) ? `<a href="${route(id, lang)}"${r.paths[lang] ? '' : ' hreflang="en"'}>${text}</a>` : text; },
    eur: (n, d = 2) => formatMoney(n, d, lang),
    num: (n, d = 2) => formatNumber(n, d, lang),
    pc: (x, d = 2) => formatPct(x, d, lang),
    date: (iso) => displayDate(iso, tagOf(lang)),
    mois: (ym) => monthName(ym, lang),
    trim: (q) => quarterName(q, lang),
    src: (key: SourceKey, text?: string) => `<a href="${SOURCES[key].url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? sourceLabel(key, lang)}</a>`,
    table: (headers, rows, caption, align = []) => {
      const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
      return `<div class="not-prose my-6 overflow-x-auto"><table class="journal w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-700">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, ri) => `<tr class="${ri % 2 ? 'bg-navy-50/40' : ''}">${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 2, lang)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    },
  };
}
