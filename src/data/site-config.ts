/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://eu-rent-indexation.example";
export const SITE_NAMES: Record<string, string> = {"fr": "Loyer indexé", "es": "Renta actualizada", "it": "Canone aggiornato", "pt": "Renda atualizada", "en": "Rent Indexer", "nl": "Huur geïndexeerd", "de": "Miete wertgesichert"};
export const LANG_TAGS: Record<string, string> = {"fr": "fr-FR", "es": "es-ES", "it": "it-IT", "pt": "pt-PT", "en": "en", "nl": "nl-BE", "de": "de-AT"};
export const OG_LOCALES: Record<string, string> = {"fr": "fr_FR", "es": "es_ES", "it": "it_IT", "pt": "pt_PT", "en": "en_GB", "nl": "nl_BE", "de": "de_AT"};
export const LOCALE_TAG = 'fr-FR';
export const CURRENCY = 'EUR';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-24';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"fr": "Éditeur de calculateurs d'indexation des loyers · IRL en France, indice santé en Belgique", "es": "Editor de calculadoras de actualización de la renta · IPC, IRAV y límites legales en España", "it": "Editore di calcolatori per l'aggiornamento del canone · indice FOI Istat in Italia", "pt": "Editor de simuladores de atualização de rendas · coeficiente anual do INE em Portugal", "en": "Publisher of rent indexation calculators for France, Belgium, Spain, Italy, Portugal and Austria", "nl": "Uitgever van rekenhulpen voor huurindexatie · gezondheidsindex en correctiefactoren in België", "de": "Herausgeber von Rechnern zur Wertsicherung von Mieten · VPI und Mieten-Wertsicherungsgesetz in Österreich"};
export const AUTHOR_DESC: Record<string, string> = {"fr": "Radif Partners publie un calculateur gratuit qui applique à votre bail l'indice officiel de votre pays : l'IRL publié par l'Insee chaque trimestre, ou l'indice santé de Statbel pour Bruxelles, la Wallonie et la Flandre, avec les règles propres aux logements classés F ou G et aux facteurs de correction régionaux. Les indices sont relus à leur source et datés ; le calcul se fait dans votre navigateur.", "es": "Radif Partners publica una calculadora gratuita que aplica a tu contrato el índice que le corresponde según su fecha de firma: el IPC o el IRAV que publica el INE cada mes, con los topes de la Ley de Arrendamientos Urbanos y del Real Decreto-ley 29/2026 indicados junto al resultado. Cada dato lleva su fecha y su fuente.", "it": "Radif Partners pubblica un calcolatore gratuito che applica al tuo contratto la variazione dell'indice FOI senza tabacchi pubblicata dall'Istat, al 75 % o al 100 % secondo il tipo di locazione, ed esclude l'aggiornamento quando c'è la cedolare secca. Ogni indice riporta il mese e la fonte; il calcolo avviene nel tuo browser.", "pt": "A Radif Partners publica um simulador gratuito que aplica à sua renda o coeficiente anual de atualização publicado pelo INE no Diário da República, incluindo a recuperação de coeficientes de anos anteriores e a carta ao inquilino. Cada coeficiente vem com o aviso que o publicou.", "en": "Radif Partners publishes a free calculator for tenants and landlords who rent in France, Belgium, Spain, Italy, Portugal or Austria. It picks the index the law applies to your lease (IRL, health index, IPC or IRAV, FOI, the Portuguese coefficient or the Austrian CPI), applies the legal caps, and shows each figure with its official source and date.", "nl": "Radif Partners publiceert een gratis rekenhulp die de gezondheidsindex van Statbel op uw huurcontract toepast, met de regels van het Vlaamse, Brusselse en Waalse Gewest: correctiefactoren voor woningen met een zwak EPC-label, het indexcijfer van de juiste maand en de terugwerkende kracht van drie maanden. Elk indexcijfer staat er met zijn bron en maand bij; de berekening gebeurt in uw browser.", "de": "Radif Partners veröffentlicht einen kostenlosen Rechner, der die Wertsicherung Ihres Mietvertrags nach dem Mieten-Wertsicherungsgesetz berechnet: durchschnittliche Veränderung des Verbraucherpreisindex der Statistik Austria, Halbierung über drei Prozent, Deckel für MRG-Wohnungen und anteilige erste Anpassung. Jeder Indexwert steht mit Quelle und Datum daneben; gerechnet wird in Ihrem Browser."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"fr": ["Indice de référence des loyers (IRL)", "Révision annuelle du loyer (loi du 6 juillet 1989, art. 17-1)", "Indice des loyers commerciaux (ILC) et ILAT", "Indice santé belge et indexation régionale", "Gel des loyers des logements classés F et G"], "es": ["Índice de Referencia de Arrendamientos de Vivienda (IRAV)", "Actualización de la renta por IPC", "Artículo 18 de la Ley de Arrendamientos Urbanos", "Real Decreto-ley 29/2026", "Arrendamiento de local comercial"], "it": ["Indice FOI senza tabacchi", "Aggiornamento ISTAT del canone", "Legge 392/1978, art. 32", "Cedolare secca", "Rivalutazione monetaria"], "pt": ["Coeficiente de atualização anual das rendas", "NRAU, art. 24.º", "Aumento das rendas em 2027", "Comunicação de aumento ao inquilino", "Recuperação de coeficientes não aplicados"], "en": ["Rent indexation in the EU", "French IRL", "Belgian health index", "Spanish IRAV", "Austrian Mieten-Wertsicherungsgesetz"], "nl": ["Gezondheidsindex (Statbel)", "Huurindexatie in Vlaanderen", "Correctiefactoren voor EPC-labels D, E en F", "Vlaams Woninghuurdecreet", "Huurindexatie in Brussel en Wallonië"], "de": ["Mieten-Wertsicherungsgesetz (MieWeG)", "Verbraucherpreisindex Österreich (VPI 2020 und VPI 2025)", "Wertsicherungsklausel im Mietvertrag", "Richtwert- und Kategoriemieten nach dem MRG", "Wertsicherung von Geldbeträgen"]};
export const CONTACT_EMAIL = "contact@eu-rent-indexation.example";
export const THEME_COLOR = '#1F3A93';
export const LOGO_SYMBOL = 'IDX';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime : 'none' pour tous les sites (RECETTE §15.6, décision de l'éditeur du 2026-10-06) :
 *  aucun bandeau ; Clarity chargé en mode sans cookie (consentv2 denied) ; GA4 avec cookies si GA4_ID.
 *  'opt-in' / 'notice' ne servent plus qu'aux sites anciens qui les portent encore. */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
/** Propriété Google Analytics 4 (décision de l'éditeur du 2026-10-17, RECETTE §15.6) : GA4 normal,
 *  avec cookies _ga / _ga_<ID> (390 jours), sans bandeau, publicité refusée. Créée par
 *  `seo-platform/scripts/create-ga4.ts accounts/372759688` (RECETTE §15.3, étape 15), puis
 *  pages légales régénérées : `python3 scripts/gen-legal-pages.py .`. Vide = pas de GA4. */
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif), chargé sans cookie. Vide = aucune mesure. */
export const CLARITY_ID = '';
export const INDEXNOW_KEY = 'cec79ee51c6a2ae8f639e4fa7798206d';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',             // ex. entreprise individuelle, SASU, GmbH, eenmanszaak
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "TVA",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
/** Forme juridique de Radif Partners non communiquée à la construction : à compléter par l'éditeur (réserve du compte rendu). */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
