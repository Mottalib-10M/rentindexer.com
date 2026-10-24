/**
 * Une page de contenu = une fiche dans `src/content/pages.ts` (pays, outil, pages liées, sources)
 * et un texte par langue où elle existe : `src/content/<langue>/<id>.ts`.
 * Une page n'existe que dans les langues où son fichier de texte existe : le hreflang, le
 * sélecteur de langue et le sitemap suivent (i18n/routes.ts).
 * Notice d'écriture : CONTRIBUTING-CONTENU.md à la racine.
 */
import type { L } from '../components/calc/kit';
import type { SourceKey } from '../data/sources';
import type * as D from './engine/donnees';
import type * as E from './engine/indexation';

export type Lang = L;
export type Pays = 'fr' | 'be' | 'es' | 'it' | 'pt' | 'at' | 'eu';
export interface FAQ { q: string; a: string }

/** Outils passés au texte : liens internes, nombres au format de la langue, données officielles. */
export interface Helpers {
  lang: Lang;
  /** Lien interne vers une autre page du site, par son identifiant (texte seul si la page n'existe pas dans la langue). */
  a: (id: string, text: string) => string;
  /** Montant en euros, 2 décimales par défaut. */
  eur: (n: number, decimals?: number) => string;
  /** Nombre au format de la langue (2 décimales par défaut). */
  num: (n: number, decimals?: number) => string;
  /** Valeur déjà en % (1,57 → « 1,57 % »), 2 décimales par défaut. */
  pc: (x: number, decimals?: number) => string;
  /** Date ISO en toutes lettres. */
  date: (iso: string) => string;
  /** Mois AAAA-MM en toutes lettres. */
  mois: (ym: string) => string;
  /** Trimestre AAAA-Qn (« 3e trimestre 2026 », « Q3 2026 »). */
  trim: (q: string) => string;
  /** Tableau de style journal. */
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  /** Lien vers une source officielle du registre `data/sources.ts`. */
  src: (key: SourceKey, text?: string) => string;
  /** Données officielles (indices, coefficients) : jamais un chiffre recopié à la main. */
  D: typeof D;
  /** Moteur de calcul, pour les exemples chiffrés. */
  E: typeof E;
}

export interface PageText {
  /** Segment d'URL sans barre ; vide pour la page racine d'une langue (/fr/, /nl/…). */
  slug: string;
  /** Libellé court pour les menus et le fil d'Ariane. */
  nav: string;
  /** Une phrase pour les cartes « pages liées ». */
  card: string;
  /** 50 à 60 caractères, terme-clé en tête ; jamais le pays, un mot d'outil, une rubrique ni une question en tête. */
  title: string;
  /** 150 à 160 caractères, terme-clé en tête. */
  description: string;
  h1: string;
  /** Chapeau d'une phrase sous le H1. */
  intro: string;
  /** Bloc citable : UN paragraphe d'au moins 120 mots, sans HTML de bloc. */
  resume: (h: Helpers) => string;
  /** Questions propres à la page, réponses de 40 à 90 mots, jamais reprises ailleurs sur le site. */
  faqs: (h: Helpers) => FAQ[];
  /** Corps HTML (h2, h3, p, ul, ol, tableaux via h.table). */
  body: (h: Helpers) => string;
}

export type ToolKind = 'fr-irl' | 'fr-somme' | 'be' | 'be-indice' | 'es' | 'it' | 'pt' | 'at' | 'hub';

export interface PageMeta {
  id: string;
  pays: Pays;
  order: number;
  tool: ToolKind;
  /** Réglages de l'outil propres à la page (mode, série, région…). */
  toolProps?: Record<string, string | number>;
  /** Pages liées en fin de page (3 à 6). */
  related: string[];
  /** Clés de `data/sources.ts` citées par la page (2 au moins, 3 pour une racine de langue). */
  sources: SourceKey[];
}

export interface PageDef extends PageMeta { texts: Partial<Record<Lang, PageText>> }

/** Pages de confiance d'une langue : `src/content/<langue>/_site.ts`. */
export interface SiteText {
  about: { title: string; description: string; h1: string; body: (h: Helpers) => string };
  method: { title: string; description: string; h1: string; body: (h: Helpers) => string; faqs: (h: Helpers) => FAQ[] };
}
