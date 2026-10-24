import type { PageText, Helpers } from '../../lib/types';

/** Indexation du loyer à Bruxelles : facteur de correction PEB E, F, G (« indexation loyer bruxelles »). */
const MOIS = ['10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
/** Exemple officiel de be.brussels : bail du 1er février 2020, 1 000 €, PEB E, indexation de février 2024. */
const officiel = (h: Helpers, peb: 'E' | 'F') => {
  const s = (m: string) => h.D.indiceSante(m)!;
  return h.E.indexerBruxelles({ loyerBase: 1000, indiceDepart: s('2020-01'), nouvelIndice: s('2024-01'), peb, entreeVigueur: '2020-02-01', indicesCorrection: [s('2022-01'), s('2023-01')] });
};

const t: PageText = {
  slug: 'indexation-loyer-bruxelles',
  nav: 'Indexation du loyer à Bruxelles',
  card: 'Le calcul bruxellois : indice santé, certificat PEB obligatoire et facteur de correction pour les PEB E, F et G des baux entrés en vigueur avant le 14 octobre 2022.',
  title: 'Indexation loyer Bruxelles : facteur de correction PEB',
  description: 'Indexation du loyer à Bruxelles : indice santé, certificat PEB et bail enregistré obligatoires, facteur de correction E, F, G par mois anniversaire, exemple.',
  h1: 'Indexation du loyer à Bruxelles : PEB et facteur de correction',
  intro: 'La Région est déjà réglée sur Bruxelles-Capitale : indiquez les dates du bail et le certificat PEB pour obtenir le loyer exigible.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const e = officiel(h, 'E');
    return `À Bruxelles, le loyer d’habitation s’indexe chaque année, au plus tôt à l’anniversaire de l’entrée en vigueur du bail, avec la formule de l’article 1728bis de l’ancien Code civil : loyer de base × nouvel indice santé / indice de départ. L’indice de départ est celui du mois qui précède la conclusion du bail, le nouvel indice celui du mois qui précède l’anniversaire ; le dernier publié est celui de ${h.mois(d.p)}, ${h.num(d.v)}. Deux conditions préalables s’imposent au bailleur : avoir enregistré le bail et avoir remis au locataire un certificat PEB valide au moment de la demande. Sans l’un ou l’autre, aucune indexation n’est possible. Si le bail est entré en vigueur avant le 14 octobre 2022 et que le PEB est E, F ou G, le résultat se multiplie en outre par un facteur de correction, à chaque indexation, jusqu’à un meilleur certificat ou un nouveau bail. Dans l’exemple officiel, un loyer de 1 000 € entré en vigueur le 1er février 2020 avec un PEB E donne ${h.eur(e.nouveauLoyer)} à partir de février 2024 au lieu de ${h.eur(1000 * h.D.indiceSante('2024-01')! / h.D.indiceSante('2020-01')!)}.`;
  },
  faqs: (h) => [
    { q: 'Mon certificat PEB a expiré : le bailleur bruxellois peut-il encore indexer ?', a: 'Pas tant qu’un nouveau certificat n’a pas été transmis au locataire. Be.brussels précise que le certificat doit être valide au moment de la demande d’indexation ; s’il est expiré, un nouveau doit avoir été communiqué avant toute indexation. Le calculateur traite le cas « aucun ou périmé » comme un blocage et n’affiche aucune hausse.' },
    { q: 'Le facteur de correction bruxellois disparaît-il un jour ?', a: 'Oui, dans deux cas seulement : quand le logement obtient un meilleur certificat PEB, ou quand un nouveau bail entre en vigueur. Jusque-là, il s’applique à chaque indexation annuelle, pas seulement en 2023 ou 2024. Un bail entré en vigueur à partir du 14 octobre 2022 n’est jamais concerné, quel que soit son PEB.' },
    { q: 'Les logements d’une agence immobilière sociale suivent-ils la même règle ?', a: 'Oui. Le facteur s’applique aux logements loués sur le marché privé comme sur le marché public : logements mis en location par un CPAS, une commune, une agence immobilière sociale ou la Régie foncière. Seuls les logements des Sociétés immobilières de service public et du Fonds du Logement en sont exclus, selon la page de be.brussels.' },
    { q: 'Que peut faire le locataire si le bailleur applique l’indexation complète malgré un PEB F ?', a: 'Il peut contester la hausse auprès de son bailleur, en lui montrant le calcul avec le facteur de correction. Si le désaccord persiste, chacune des parties peut porter l’affaire devant le juge de paix. En attendant, garder une trace écrite des échanges et des montants payés facilite le règlement du litige, dans un sens comme dans l’autre.' },
  ],
  body: (h) => {
    // Les facteurs bruxellois E et F-G du 14 octobre au 30 septembre sont identiques aux correctiefactoren flamands D et E-F-sans (tableaux officiels comparés le 24 octobre 2026).
    const f = h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire as Record<string, { D: number; EFsans: number }>;
    const rows = MOIS.map((m) => [m === '10' ? 'du 14 au 31 octobre' : h.mois(`2026-${m}`).replace(' 2026', ''), h.num(f[m].D, 9), h.num(f[m].EFsans, 9)]);
    rows.push(['du 1er au 13 octobre', h.num(0.989805521, 9), h.num(0.979611041, 9)]);
    const e = officiel(h, 'E'), g = officiel(h, 'F');
    return `<h2>Les facteurs de correction par anniversaire</h2>
${h.table(['Anniversaire du bail', 'PEB E', 'PEB F ou G'], rows, 'Source : be.brussels, « Indexation des loyers avec facteur de correction », lu le 24 octobre 2026.', ['l', 'r', 'r'])}
<p>Le facteur vient de l’écart entre les indices des anniversaires 2022 et 2023, ou 2021 et 2022 pour un anniversaire entre le 14 octobre et le 31 décembre. Pour un PEB E, il vaut la moitié de la somme des deux indices divisée par le second ; pour un PEB F ou G, le premier indice divisé par le second. Le calculateur le recalcule à partir des indices de Statbel.</p>
<h2>L’exemple officiel refait</h2>
<p>Bail signé et entré en vigueur le 1er février 2020, loyer de base 1 000 €, indice de départ de janvier 2020 (${h.num(h.D.indiceSante('2020-01')!)}), nouvel indice de janvier 2024 (${h.num(h.D.indiceSante('2024-01')!)}). Avec un PEB E, le loyer indexé à partir de février 2024 est de ${h.eur(e.nouveauLoyer)} ; avec un PEB F ou G, de ${h.eur(g.nouveauLoyer)}. Ce sont les montants publiés par ${h.src('bxlCorrection', 'be.brussels')}.</p>
<h2>Une limite de l’outil pour octobre</h2>
<p>Le calculateur raisonne au mois d’entrée en vigueur et traite tout anniversaire d’octobre comme tombant avant le 14. Si votre bail est entré en vigueur entre le 14 et le 31 octobre, prenez la ligne correspondante du tableau ci-dessus et multipliez-la par le loyer pleinement indexé que l’outil affiche. Base légale : article 224/2 du Code bruxellois du Logement, modifié par l’ordonnance du 13 octobre 2023. Pour la Wallonie et la Flandre, voir ${h.a('be-wal', 'l’indexation en Wallonie')} ; l’indice du mois est sur ${h.src('statbelSante', 'la page de Statbel')}.</p>`;
  },
};
export default t;
