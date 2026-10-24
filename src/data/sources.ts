/**
 * Registre des sources officielles citées par les pages (une clé = un texte ou une série).
 * Chaque adresse a été ouverte le 2026-10-24 (sources/lus-phase2-2026-10-24.md) ; check-sources.mjs
 * vérifie qu'elle répond encore. Le libellé est le nom officiel, traduit seulement quand le nom
 * officiel n'aide pas un lecteur d'une autre langue.
 */
import type { L } from '../components/calc/kit';
type Lbl = Partial<Record<L, string>> & { en: string };
export interface Source { url: string; label: Lbl }

export const SOURCES = {
  inseeIrl: { url: 'https://www.insee.fr/fr/statistiques/serie/001515333', label: { fr: 'Insee, série de l’indice de référence des loyers (IRL), identifiant 001515333', en: 'Insee, rent reference index (IRL) series 001515333' } },
  inseeIrlCorse: { url: 'https://www.insee.fr/fr/statistiques/serie/010760507', label: { fr: 'Insee, IRL de la Corse, série 010760507', en: 'Insee, IRL for Corsica, series 010760507' } },
  inseeIrlDom: { url: 'https://www.insee.fr/fr/statistiques/serie/010760509', label: { fr: 'Insee, IRL des départements d’outre-mer, série 010760509', en: 'Insee, IRL for the overseas departments, series 010760509' } },
  inseeIlc: { url: 'https://www.insee.fr/fr/statistiques/serie/001532540', label: { fr: 'Insee, indice des loyers commerciaux (ILC), série 001532540', en: 'Insee, commercial rent index (ILC), series 001532540' } },
  inseeIlat: { url: 'https://www.insee.fr/fr/statistiques/serie/001617112', label: { fr: 'Insee, indice des loyers des activités tertiaires (ILAT), série 001617112', en: 'Insee, office rent index (ILAT), series 001617112' } },
  inseeIpc: { url: 'https://www.insee.fr/fr/statistiques/serie/011814056', label: { fr: 'Insee, indice des prix à la consommation hors tabac, ensemble des ménages, base 2025, série 011814056', en: 'Insee, consumer price index excluding tobacco, all households, base 2025, series 011814056' } },
  inseePension: { url: 'https://www.insee.fr/fr/information/1300608', label: { fr: 'Insee, « Réviser une pension alimentaire »', en: 'Insee, revising child support (Réviser une pension alimentaire)' } },
  inseeLicence: { url: 'https://www.insee.fr/fr/information/2008466', label: { fr: 'Insee, conditions de réutilisation (Licence Ouverte 2.0)', en: 'Insee, reuse terms (Licence Ouverte 2.0)' } },
  spIrl: { url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F13723', label: { fr: 'Service-public.fr, « Révision du loyer d’un logement » (F13723)', en: 'Service-public.fr, revision of a home’s rent (F13723)' } },
  spPension: { url: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F2010', label: { fr: 'Service-public.fr, « Revalorisation annuelle de la pension alimentaire » (F2010)', en: 'Service-public.fr, annual uprating of child support (F2010)' } },
  loi1989: { url: 'https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000509310', label: { fr: 'Loi n° 89-462 du 6 juillet 1989, articles 17-1 et 17 (Légifrance)', en: 'French Law 89-462 of 6 July 1989, articles 17-1 and 17 (Légifrance)' } },
  statbelSante: { url: 'https://statbel.fgov.be/fr/themes/prix-a-la-consommation/indice-sante', label: { fr: 'Statbel, indice santé', nl: 'Statbel, gezondheidsindex', en: 'Statbel, health index' } },
  statbelSanteNl: { url: 'https://statbel.fgov.be/nl/themas/consumptieprijsindex/gezondheidsindex', label: { fr: 'Statbel, gezondheidsindex (page en néerlandais)', nl: 'Statbel, gezondheidsindex', en: 'Statbel, gezondheidsindex (Dutch page)' } },
  statbelSanteEn: { url: 'https://statbel.fgov.be/en/themes/consumer-prices/health-index', label: { fr: 'Statbel, health index (page en anglais)', nl: 'Statbel, health index (Engelstalige pagina)', en: 'Statbel, health index' } },
  bxlCorrection: { url: 'https://be.brussels/fr/logement/location/bail-dhabitation/indexation-des-loyers/indexation-des-loyers-avec-facteur-de-correction', label: { fr: 'be.brussels, « Indexation des loyers avec facteur de correction »', nl: 'be.brussels, indexatie van de huurprijzen met correctiefactor (Franstalige pagina)', en: 'be.brussels, rent indexation with a correction factor' } },
  walIndexer: { url: 'https://www.wallonie.be/fr/demarches/indexer-un-loyer', label: { fr: 'Wallonie.be, « Indexer un loyer »', nl: 'Wallonie.be, een huurprijs indexeren (Franstalige pagina)', en: 'Wallonie.be, indexing a rent' } },
  vlCorrectie: { url: 'https://www.vlaanderen.be/bouwen-wonen-en-energie/huren-en-verhuren/een-huis-of-appartement-huren/een-huis-of-appartement-huren-op-de-privemarkt-0/tijdens-de-huurovereenkomst/huurprijsindexatie-met-correctiefactoren', label: { fr: 'Vlaanderen.be, « Huurprijsindexatie met correctiefactoren »', nl: 'Vlaanderen.be, huurprijsindexatie met correctiefactoren', en: 'Vlaanderen.be, rent indexation with correction factors' } },
  boeLau: { url: 'https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003', label: { es: 'Ley 29/1994, de Arrendamientos Urbanos, texto consolidado (BOE)', en: 'Spanish Urban Leases Act 29/1994, consolidated text (BOE)' } },
  boeRdl29: { url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2026-20823', label: { es: 'Real Decreto-ley 29/2026, de 6 de octubre (BOE-A-2026-20823)', en: 'Royal Decree-law 29/2026 of 6 October (BOE-A-2026-20823)' } },
  ineIpc: { url: 'https://www.ine.es/dyngs/INEbase/es/operacion.htm?c=Estadistica_C&cid=1254736176802&menu=ultiDatos&idp=1254735976607', label: { es: 'INE, Índice de Precios de Consumo (IPC), últimos datos', en: 'INE, consumer price index (IPC), latest figures' } },
  ineIrav: { url: 'https://www.ine.es/daco/daco42/irav/meto_IRAV.pdf', label: { es: 'INE, metodología del Índice de Referencia para la Actualización Anual de los Contratos de Arrendamiento de Vivienda (IRAV)', en: 'INE, methodology of the housing lease update index (IRAV)' } },
  istatFoi: { url: 'https://www.istat.it/it/archivio/30440', label: { it: 'Istat, indice dei prezzi al consumo per le rivalutazioni monetarie (FOI)', en: 'Istat, consumer price index for monetary revaluations (FOI)' } },
  istatRivaluta: { url: 'https://rivaluta.istat.it/', label: { it: 'Istat, servizio Rivaluta (coefficienti di raccordo tra basi)', en: 'Istat, Rivaluta service (base-linking coefficients)' } },
  l392: { url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1978-07-27;392', label: { it: 'Legge 27 luglio 1978, n. 392, art. 32 (Normattiva)', en: 'Italian Law 392 of 27 July 1978, art. 32 (Normattiva)' } },
  l431: { url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1998-12-09;431', label: { it: 'Legge 9 dicembre 1998, n. 431 (Normattiva)', en: 'Italian Law 431 of 9 December 1998 (Normattiva)' } },
  dlgs23: { url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2011-03-14;23', label: { it: 'Decreto legislativo 14 marzo 2011, n. 23, art. 3, comma 11 (cedolare secca, Normattiva)', en: 'Italian Legislative Decree 23 of 14 March 2011, art. 3(11) (cedolare secca, Normattiva)' } },
  drCoef2027: { url: 'https://diariodarepublica.pt/dr/detalhe/aviso/24199-2026-1175645456', label: { pt: 'Diário da República, Aviso n.º 24199/2026/2 (coeficiente de 2027)', en: 'Diário da República, Notice 24199/2026/2 (2027 coefficient)' } },
  drCoef2026: { url: 'https://diariodarepublica.pt/dr/detalhe/aviso/23174-2025-935742337', label: { pt: 'Diário da República, Aviso n.º 23174/2025/2 (coeficiente de 2026)', en: 'Diário da República, Notice 23174/2025/2 (2026 coefficient)' } },
  drCoef2025: { url: 'https://files.diariodarepublica.pt/2s/2024/10/203000000/0005900059.pdf', label: { pt: 'Diário da República, Aviso n.º 23099/2024/2 (coeficiente de 2025)', en: 'Diário da República, Notice 23099/2024/2 (2025 coefficient)' } },
  drCoef2024: { url: 'https://diariodarepublica.pt/dr/detalhe/aviso/20980-a-2023-223473619', label: { pt: 'Diário da República, Aviso n.º 20980-A/2023 (coeficiente de 2024)', en: 'Diário da República, Notice 20980-A/2023 (2024 coefficient)' } },
  drLei19: { url: 'https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2022-202436963', label: { pt: 'Lei n.º 19/2022, de 21 de outubro (coeficiente de 2023 fixado em 1,02)', en: 'Portuguese Law 19/2022 of 21 October (2023 coefficient set at 1.02)' } },
  inePt: { url: 'https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques', label: { pt: 'INE, destaques (índice de preços no consumidor)', en: 'Statistics Portugal (INE), releases' } },
  risMieWeG: { url: 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20013068', label: { de: 'Mieten-Wertsicherungsgesetz (MieWeG), BGBl. I Nr. 114/2025, geltende Fassung (RIS)', en: 'Austrian Rent Value-Protection Act (MieWeG), Federal Law Gazette I 114/2025 (RIS)' } },
  risMrg: { url: 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10002531', label: { de: 'Mietrechtsgesetz (MRG), geltende Fassung (RIS)', en: 'Austrian Tenancy Act (MRG), current version (RIS)' } },
  statistikVpi: { url: 'https://www.statistik.at/statistiken/volkswirtschaft-und-oeffentliche-finanzen/preise-und-preisindizes/verbraucherpreisindex-vpi/hvpi', label: { de: 'Statistik Austria, Verbraucherpreisindex (VPI/HVPI)', en: 'Statistik Austria, consumer price index (VPI/HVPI)' } },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;
export const sourceLabel = (k: SourceKey, l: L): string => (SOURCES[k].label as Lbl)[l] ?? SOURCES[k].label.en;
