/**
 * Routes du site. Une page de contenu n'existe que dans les langues où son texte existe ; le
 * hreflang, le sélecteur de langue et le sitemap ne citent que ces langues. x-default : l'anglais,
 * présent pour chaque page.
 * Pages de service (`R`) : dans les sept langues. « editorial » et « contact » renvoient aux
 * sections de la page À propos (une seule page de confiance par langue).
 */
import { makeRouter, type RouteDef } from './routes-core';
import { PAGES, pagePath } from '../lib/pages';
export const LOCALES = ['fr', 'nl', 'es', 'it', 'pt', 'de', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';
const R = (id: string, fr: string, nl: string, es: string, it: string, pt: string, de: string, en: string, noindex = false): RouteDef<Locale> => ({ id, paths: { fr: `/fr/${fr}/`, nl: `/nl/${nl}/`, es: `/es/${es}/`, it: `/it/${it}/`, pt: `/pt/${pt}/`, de: `/de/${de}/`, en: `/en/${en}/` }, ...(noindex ? { noindex } : {}) });
const SERVICE: RouteDef<Locale>[] = [
  R('about', 'a-propos', 'over-ons', 'sobre-nosotros', 'chi-siamo', 'sobre', 'ueber-uns', 'about'),
  R('method', 'methode', 'methode', 'metodologia', 'metodologia', 'metodologia', 'methodik', 'method'),
  R('terms', 'mentions-legales', 'colofon', 'aviso-legal', 'note-legali', 'aviso-legal', 'impressum', 'legal-notice', true),
  R('privacy', 'confidentialite', 'privacy', 'privacidad', 'privacy', 'privacidade', 'datenschutz', 'privacy', true),
  R('cookies', 'cookies', 'cookies', 'cookies', 'cookies', 'cookies', 'cookies', 'cookies', true),
  { id: 'widget', paths: { en: '/en/widget/' }, noindex: true },
];
export const ROUTES: RouteDef<Locale>[] = [
  ...PAGES.map((p) => ({ id: p.id, paths: Object.fromEntries(Object.entries(p.texts).map(([l, t]) => [l, pagePath(l as Locale, t!.slug)])) as RouteDef<Locale>['paths'] })),
  ...SERVICE,
];
const core = makeRouter(LOCALES, ROUTES);
export const { NOINDEX_PATHS, altPaths, hasRoute } = core;
/** Racine de chaque langue : la page du pays de la langue (l'anglais : la page des six pays). */
export const HOME_ID: Record<Locale, string> = { fr: 'fr-home', nl: 'be-home', es: 'es-home', it: 'it-home', pt: 'pt-home', de: 'at-home', en: 'hub' };
const ANCRE: Record<string, string> = { editorial: '#editorial', contact: '#contact' };
/** Chemin d'une route ; une page absente de la langue retombe sur sa version anglaise. */
export function route(id: string, lang: Locale): string {
  if (id === 'home') return `/${lang}/`;
  if (ANCRE[id]) return `${core.route('about', lang)}${ANCRE[id]}`;
  const r = ROUTES.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown route id: ${id}`);
  return r.paths[lang] ?? r.paths.en ?? Object.values(r.paths)[0]!;
}
