/** Menus : un groupe par pays traité dans la langue, puis le site ; le pied de page mène aussi aux six pays. */
import { route, HOME_ID, type Locale } from './routes';
import { PAGES, pageById } from '../lib/pages';
import type { Pays } from '../lib/types';
export interface NavLink { href: string; label: string; hreflang?: string }
export interface NavCategory { label: string; links: NavLink[] }

const CORE: Record<Locale, Record<string, string>> = {
  fr: { method: 'Méthode et sources', about: 'À propos', terms: 'Mentions légales', privacy: 'Confidentialité', cookies: 'Cookies' },
  nl: { method: 'Methode en bronnen', about: 'Over ons', terms: 'Colofon', privacy: 'Privacy', cookies: 'Cookies' },
  es: { method: 'Método y fuentes', about: 'Quiénes somos', terms: 'Aviso legal', privacy: 'Privacidad', cookies: 'Cookies' },
  it: { method: 'Metodo e fonti', about: 'Chi siamo', terms: 'Note legali', privacy: 'Privacy', cookies: 'Cookie' },
  pt: { method: 'Método e fontes', about: 'Quem somos', terms: 'Aviso legal', privacy: 'Privacidade', cookies: 'Cookies' },
  de: { method: 'Methode und Quellen', about: 'Über uns', terms: 'Impressum', privacy: 'Datenschutz', cookies: 'Cookies' },
  en: { method: 'Method and sources', about: 'About', terms: 'Legal notice', privacy: 'Privacy', cookies: 'Cookies', widget: 'Embed the calculator' },
};
export const PAYS_LABEL: Record<Locale, Record<Pays, string>> = {
  fr: { fr: 'France', be: 'Belgique', es: 'Espagne', it: 'Italie', pt: 'Portugal', at: 'Autriche', eu: 'Six pays' },
  nl: { fr: 'Frankrijk', be: 'België', es: 'Spanje', it: 'Italië', pt: 'Portugal', at: 'Oostenrijk', eu: 'Zes landen' },
  es: { fr: 'Francia', be: 'Bélgica', es: 'España', it: 'Italia', pt: 'Portugal', at: 'Austria', eu: 'Seis países' },
  it: { fr: 'Francia', be: 'Belgio', es: 'Spagna', it: 'Italia', pt: 'Portogallo', at: 'Austria', eu: 'Sei paesi' },
  pt: { fr: 'França', be: 'Bélgica', es: 'Espanha', it: 'Itália', pt: 'Portugal', at: 'Áustria', eu: 'Seis países' },
  de: { fr: 'Frankreich', be: 'Belgien', es: 'Spanien', it: 'Italien', pt: 'Portugal', at: 'Österreich', eu: 'Sechs Länder' },
  en: { fr: 'France', be: 'Belgium', es: 'Spain', it: 'Italy', pt: 'Portugal', at: 'Austria', eu: 'All six countries' },
};
const SITE_COL: Record<Locale, string> = { fr: 'Le site', nl: 'De site', es: 'El sitio', it: 'Il sito', pt: 'O site', de: 'Die Seite', en: 'Site' };
const AUTRES: Record<Locale, string> = { fr: 'Autres pays', nl: 'Andere landen', es: 'Otros países', it: 'Altri paesi', pt: 'Outros países', de: 'Andere Länder', en: 'Each country' };
/** Langue d'origine de chaque pays (lien du pied de page « Autres pays »). */
const LANGUE_PAYS: Record<Exclude<Pays, 'eu'>, Locale> = { fr: 'fr', be: 'nl', es: 'es', it: 'it', pt: 'pt', at: 'de' };

export const label = (id: string, lang: Locale): string => CORE[lang][id] ?? pageById(id)?.texts[lang]?.nav ?? pageById(id)?.texts.en?.nav ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });

export function navCategories(lang: Locale): NavCategory[] {
  const pays = [...new Set(PAGES.filter((p) => p.texts[lang] && p.pays !== 'eu').map((p) => p.pays))];
  return pays.map((c) => ({ label: PAYS_LABEL[lang][c], links: PAGES.filter((p) => p.pays === c && p.texts[lang]).map((p) => link(p.id, lang)) }));
}
export const navDirect = (lang: Locale): NavLink[] => (lang === 'en' || !pageById('hub') ? [link('method', lang)] : [{ href: route('hub', 'en'), label: AUTRES[lang], hreflang: 'en' }, link('method', lang)]);
export function footerColumns(lang: Locale): NavCategory[] {
  const autres = (Object.keys(LANGUE_PAYS) as Array<Exclude<Pays, 'eu'>>).flatMap((c) => {
    const id = PAGES.find((p) => p.pays === c && p.texts[lang])?.id ?? HOME_ID[LANGUE_PAYS[c]];
    return pageById(id) ? [{ href: route(id, lang), label: PAYS_LABEL[lang][c] }] : [];
  });
  const site = ['method', 'about', 'terms', 'privacy', 'cookies', ...(lang === 'en' ? ['widget'] : [])].map((i) => link(i, lang));
  return [...(lang === 'en' ? [] : navCategories(lang)), { label: AUTRES[lang], links: autres }, { label: SITE_COL[lang], links: site }];
}
export const popularLinks = (_lang: Locale): NavLink[] => [];
