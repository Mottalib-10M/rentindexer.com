import type { Locale } from './routes';
const fr = {
  updatedOn: 'Mis à jour le', editorialPolicy: 'Politique éditoriale', contactLabel: 'Contact', reviewedBy: 'Vérifié par',
  skipToContent: 'Aller au contenu', mainNav: 'Menu principal', breadcrumbLabel: 'Fil d’Ariane', breadcrumbHome: 'Accueil', menuOpen: 'Ouvrir le menu',
  faqTitle: 'Questions fréquentes', relatedCalculators: 'Pages et calculs liés', sourcesTitle: 'Sources officielles', writtenBy: 'Rédigé par',
  asOf: 'Indices officiels relus en', lastUpdated: 'site vérifié le',
  footerValidated: 'Sources : Insee, Statbel, INE (Espagne), Istat, INE (Portugal), Statistik Austria',
  footerBrowser: 'Calculé dans votre navigateur · aucune donnée envoyée · gratuit · ni formulaire ni téléphone',
  footerDisclaimer: 'Site indépendant publié par Radif Partners, sans lien avec l’Insee, Statbel, les Régions belges ni aucun organisme public. Les résultats sont des estimations à partir des indices officiels publiés, cités avec leur date ; ils ne remplacent ni le bail, ni un avis juridique.',
  footerPopular: '', notFound: 'Cette page n’existe pas.', readMore: 'Lire la suite', allPages: 'Toutes les pages',
};
const nl: typeof fr = {
  updatedOn: 'Bijgewerkt op', editorialPolicy: 'Redactiebeleid', contactLabel: 'Contact', reviewedBy: 'Nagekeken door',
  skipToContent: 'Naar de inhoud', mainNav: 'Hoofdmenu', breadcrumbLabel: 'Kruimelpad', breadcrumbHome: 'Start', menuOpen: 'Menu openen',
  faqTitle: 'Veelgestelde vragen', relatedCalculators: 'Verwante pagina’s en berekeningen', sourcesTitle: 'Officiële bronnen', writtenBy: 'Geschreven door',
  asOf: 'Officiële indexcijfers nagekeken in', lastUpdated: 'site gecontroleerd op',
  footerValidated: 'Bronnen: Statbel, Vlaamse overheid, Brussels Hoofdstedelijk Gewest, Waals Gewest',
  footerBrowser: 'Berekend in uw browser · er worden geen gegevens verstuurd · gratis · geen formulier of telefoon',
  footerDisclaimer: 'Onafhankelijke site van Radif Partners, zonder band met Statbel, de Gewesten of een andere overheid. De resultaten zijn schattingen op basis van de gepubliceerde officiële indexcijfers, met hun maand; ze vervangen het huurcontract noch juridisch advies.',
  footerPopular: '', notFound: 'Deze pagina bestaat niet.', readMore: 'Verder lezen', allPages: 'Alle pagina’s',
};
const es: typeof fr = {
  updatedOn: 'Actualizado el', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Revisado por',
  skipToContent: 'Ir al contenido', mainNav: 'Menú principal', breadcrumbLabel: 'Ruta de navegación', breadcrumbHome: 'Inicio', menuOpen: 'Abrir el menú',
  faqTitle: 'Preguntas frecuentes', relatedCalculators: 'Páginas y cálculos relacionados', sourcesTitle: 'Fuentes oficiales', writtenBy: 'Escrito por',
  asOf: 'Índices oficiales revisados en', lastUpdated: 'web revisada el',
  footerValidated: 'Fuentes: INE (IPC e IRAV), BOE (Ley de Arrendamientos Urbanos y Real Decreto-ley 29/2026)',
  footerBrowser: 'Se calcula en tu navegador · no se envía ningún dato · gratis · sin formularios ni teléfonos',
  footerDisclaimer: 'Sitio independiente publicado por Radif Partners, sin relación con el INE, el Ministerio de Vivienda ni ningún organismo público. Los resultados son estimaciones con los índices oficiales publicados, citados con su mes; no sustituyen al contrato ni a un asesoramiento jurídico.',
  footerPopular: '', notFound: 'Esta página no existe.', readMore: 'Leer más', allPages: 'Todas las páginas',
};
const it: typeof fr = {
  updatedOn: 'Aggiornato il', editorialPolicy: 'Politica editoriale', contactLabel: 'Contatti', reviewedBy: 'Verificato da',
  skipToContent: 'Vai al contenuto', mainNav: 'Menu principale', breadcrumbLabel: 'Percorso', breadcrumbHome: 'Home', menuOpen: 'Apri il menu',
  faqTitle: 'Domande frequenti', relatedCalculators: 'Pagine e calcoli collegati', sourcesTitle: 'Fonti ufficiali', writtenBy: 'Scritto da',
  asOf: 'Indici ufficiali verificati nel', lastUpdated: 'sito controllato il',
  footerValidated: 'Fonti: Istat (indice FOI senza tabacchi), Normattiva (legge 392/1978, legge 431/1998, D.Lgs. 23/2011)',
  footerBrowser: 'Calcolato nel tuo browser · nessun dato inviato · gratuito · nessun modulo né telefono',
  footerDisclaimer: 'Sito indipendente pubblicato da Radif Partners, senza legami con l’Istat né con alcun ente pubblico. I risultati sono stime a titolo indicativo, basate sugli indici ufficiali pubblicati e citati con il loro mese; non sostituiscono il contratto né una consulenza legale.',
  footerPopular: '', notFound: 'Questa pagina non esiste.', readMore: 'Continua a leggere', allPages: 'Tutte le pagine',
};
const pt: typeof fr = {
  updatedOn: 'Atualizado em', editorialPolicy: 'Política editorial', contactLabel: 'Contacto', reviewedBy: 'Revisto por',
  skipToContent: 'Ir para o conteúdo', mainNav: 'Menu principal', breadcrumbLabel: 'Caminho de navegação', breadcrumbHome: 'Início', menuOpen: 'Abrir o menu',
  faqTitle: 'Perguntas frequentes', relatedCalculators: 'Páginas e cálculos relacionados', sourcesTitle: 'Fontes oficiais', writtenBy: 'Escrito por',
  asOf: 'Coeficientes oficiais revistos em', lastUpdated: 'site revisto em',
  footerValidated: 'Fontes: Diário da República (avisos do INE), Lei n.º 6/2006 (NRAU)',
  footerBrowser: 'Calculado no seu navegador · nenhum dado enviado · gratuito · sem formulários nem telefones',
  footerDisclaimer: 'Site independente publicado pela Radif Partners, sem qualquer ligação ao INE nem a qualquer entidade pública. Os resultados são estimativas orientativas, feitas com os coeficientes oficiais publicados e citados com o respetivo aviso; não substituem o contrato nem um aconselhamento jurídico.',
  footerPopular: '', notFound: 'Esta página não existe.', readMore: 'Ler mais', allPages: 'Todas as páginas',
};
const de: typeof fr = {
  updatedOn: 'Aktualisiert am', editorialPolicy: 'Redaktionelle Grundsätze', contactLabel: 'Kontakt', reviewedBy: 'Geprüft von',
  skipToContent: 'Zum Inhalt', mainNav: 'Hauptmenü', breadcrumbLabel: 'Brotkrumen', breadcrumbHome: 'Start', menuOpen: 'Menü öffnen',
  faqTitle: 'Häufige Fragen', relatedCalculators: 'Verwandte Seiten und Rechnungen', sourcesTitle: 'Amtliche Quellen', writtenBy: 'Verfasst von',
  asOf: 'Amtliche Indexwerte geprüft im', lastUpdated: 'Seite geprüft am',
  footerValidated: 'Quellen: Statistik Austria (VPI), RIS (Mieten-Wertsicherungsgesetz, Mietrechtsgesetz)',
  footerBrowser: 'Gerechnet in Ihrem Browser · keine Daten übertragen · kostenlos · kein Formular, kein Telefon',
  footerDisclaimer: 'Unabhängige Seite von Radif Partners, ohne Verbindung zur Statistik Austria oder zu einer Behörde. Die Ergebnisse sind Schätzungen auf Grundlage der veröffentlichten amtlichen Indexwerte, mit Monat angegeben; sie ersetzen weder den Mietvertrag noch eine Rechtsberatung.',
  footerPopular: '', notFound: 'Diese Seite gibt es nicht.', readMore: 'Weiterlesen', allPages: 'Alle Seiten',
};
const en: typeof fr = {
  updatedOn: 'Updated', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main menu', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related pages and calculations', sourcesTitle: 'Official sources', writtenBy: 'Written by',
  asOf: 'Official indices checked in', lastUpdated: 'site checked on',
  footerValidated: 'Sources: Insee, Statbel, INE Spain, Istat, INE Portugal, Statistik Austria',
  footerBrowser: 'Calculated in your browser · no data sent · free · no forms or phone numbers',
  footerDisclaimer: 'Independent website published by Radif Partners, with no link to any statistics office, government or public body. Results are estimates only, based on the official indices as published and quoted with their date; the site does not replace your lease or legal advice.',
  footerPopular: '', notFound: 'This page does not exist.', readMore: 'Read more', allPages: 'Every page',
};
const ALL = { fr, nl, es, it, pt, de, en };
export function t(lang: Locale) { return ALL[lang] ?? en; }
