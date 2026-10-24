/** Registre des pages : fiches de `content/pages.ts` + textes `content/<langue>/<id>.ts` (ceux qui existent). */
import type { PageDef, PageText, Lang, SiteText } from './types';
import { META } from '../content/pages';

export const LANGS: Lang[] = ['fr', 'nl', 'es', 'it', 'pt', 'de', 'en'];
const textes = import.meta.glob<{ default: PageText }>(['../content/*/*.ts', '!../content/*/_*.ts'], { eager: true });
const texte = (l: Lang, id: string): PageText | undefined => textes[`../content/${l}/${id}.ts`]?.default;

export const PAGES: PageDef[] = META
  .map((m) => ({ ...m, texts: Object.fromEntries(LANGS.map((l) => [l, texte(l, m.id)]).filter(([, t]) => t)) as PageDef['texts'] }))
  .filter((p) => Object.keys(p.texts).length > 0)
  .sort((a, b) => a.order - b.order);

export const pageById = (id: string) => PAGES.find((p) => p.id === id);
/** Chemin d'une page dans une langue : racine de langue si le slug est vide. */
export const pagePath = (l: Lang, slug: string) => (slug ? `/${l}/${slug}/` : `/${l}/`);

const sites = import.meta.glob<{ default: SiteText }>('../content/*/_site.ts', { eager: true });
export const siteText = (l: Lang): SiteText => {
  const m = sites[`../content/${l}/_site.ts`];
  if (!m) throw new Error(`Texte manquant : src/content/${l}/_site.ts`);
  return m.default;
};
