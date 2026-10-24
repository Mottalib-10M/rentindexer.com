import type { PageText } from '../../lib/types';

/** IRL : la valeur du trimestre et le calcul de révision (« irl », « irl insee », « calcul irl »). */
const t: PageText = {
  slug: 'irl',
  nav: 'IRL : valeurs et calcul',
  card: 'Les valeurs de l’IRL publiées par l’Insee, en métropole, en Corse et outre-mer, et la révision qui en découle.',
  title: 'IRL Insee : valeurs du trimestre et calcul de la révision',
  description: 'IRL du dernier trimestre publié par l’Insee, ses valeurs en Corse et outre-mer, et la révision du loyer calculée à partir de l’indice prévu par votre bail.',
  h1: 'IRL : la valeur publiée par l’Insee et la révision de votre loyer',
  intro: 'Choisissez le trimestre de référence inscrit dans le bail : le calcul prend l’IRL de ce trimestre et celui de l’année d’avant.',
  resume: (h) => {
    const d = h.D.dernierFr('irl');
    const c = h.D.dernierFr('irl_corse');
    const o = h.D.dernierFr('irl_dom');
    return `Le dernier indice de référence des loyers publié par l’Insee est celui du ${h.trim(d.p)} : ${h.num(d.v)} en métropole, paru au Journal officiel le ${h.date(d.jo!)}, soit ${h.pc(d.var!)} sur un an. Le même trimestre vaut ${h.num(c.v)} en Corse et ${h.num(o.v)} dans les départements d’outre-mer, avec la même variation annuelle. L’IRL est la moyenne, sur les douze derniers mois, de l’évolution des prix à la consommation hors tabac et hors loyers ; il plafonne la hausse annuelle d’un loyer d’habitation, vide ou meublé, quand le bail contient une clause de révision. Le calcul est toujours le même : loyer hors charges actuel multiplié par l’IRL du trimestre de référence de l’année, divisé par l’IRL du même trimestre de l’année précédente, puis arrondi au centime. Le trimestre est celui que fixe le bail ; à défaut, c’est le dernier indice publié à la date de signature. Un logement classé F ou G ne peut plus voir son loyer révisé si le bail a été signé, renouvelé ou reconduit depuis le 24 août 2022 en métropole.`;
  },
  faqs: (h) => {
    const d = h.D.dernierFr('irl');
    return [
      { q: 'Quand l’Insee publie-t-il l’IRL de chaque trimestre ?', a: `L’Insee publie l’IRL vers le milieu du mois qui suit la fin du trimestre : mi-janvier pour le quatrième trimestre, mi-avril pour le premier, mi-juillet pour le deuxième, mi-octobre pour le troisième. L’avis paraît ensuite au Journal officiel, en général le lendemain. Le ${h.trim(d.p)} est paru au Journal officiel le ${h.date(d.jo!)}. Le trimestre suivant n’est pas encore publié : le calculateur ne le propose qu’une fois sorti.` },
      { q: 'Pourquoi l’IRL de la Corse et des DOM a-t-il une autre valeur ?', a: 'Depuis 2022, la Corse et les départements d’outre-mer ont leur propre série d’IRL, créée quand la loi a plafonné la hausse de l’indice à des niveaux différents selon la zone, jusqu’au début de 2024. Les niveaux diffèrent, mais l’Insee publie désormais la même variation annuelle pour les trois zones. Il faut donc utiliser la série de la zone du logement pour les deux trimestres du calcul, sans mélanger une valeur de métropole et une valeur de Corse.' },
      { q: 'Faut-il prendre l’IRL en valeur ou en variation pour le calcul ?', a: 'On utilise les deux valeurs d’indice, celle du trimestre de l’année en cours et celle du même trimestre de l’année précédente, et on fait leur rapport. Appliquer la variation publiée, arrondie à deux décimales, donne presque toujours le même loyer à un centime près. En cas d’écart, c’est le rapport des valeurs qui fait foi, puisque c’est la formule de l’article 17-1 de la loi du 6 juillet 1989.' },
      { q: 'L’IRL baisse parfois : mon loyer doit-il baisser aussi ?', a: 'Si l’IRL du trimestre de référence est inférieur à celui de l’année précédente, la formule donne un loyer plus bas. La clause de révision joue alors dans les deux sens, sauf rédaction contraire du bail, et le locataire peut demander l’application de la baisse. Depuis 2008, les variations annuelles négatives sont restées rares et minimes : le 4e trimestre 2009 et le 4e trimestre 2015 n’ont reculé que de quelques centièmes de point.' },
    ];
  },
  body: (h) => {
    const rows = h.D.serieFr('irl').slice(-8).reverse().map((o) => [h.trim(o.p), h.num(o.v), o.var !== undefined ? h.pc(o.var) : '–', o.jo ? h.date(o.jo) : '–']);
    const q2 = h.D.valeurFr('irl', '2026-Q2')!, q2a = h.D.valeurFr('irl', '2025-Q2')!;
    const ex = h.E.reviserFr({ loyer: 600, trimestre: '2026-Q2', irl: Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v])), zone: 'metropole', dateBail: '2025-07-20' });
    return `<h2>Les huit derniers IRL en métropole</h2>
${h.table(['Trimestre', 'IRL', 'Variation sur un an', 'Journal officiel'], rows, 'Source : Insee, série 001515333, relue le 24 octobre 2026.', ['l', 'r', 'r', 'l'])}
<p>Les séries complètes, depuis le premier trimestre 2008 pour la métropole, se trouvent sur la page de chaque série de l’Insee : ${h.src('inseeIrl', 'métropole')}, ${h.src('inseeIrlCorse', 'Corse')} et ${h.src('inseeIrlDom', 'outre-mer')}. Le calculateur ci-dessus reprend les quarante derniers trimestres.</p>
<h2>Un exemple chiffré avec le deuxième trimestre</h2>
<p>Un bail signé le 20 juillet 2025 en métropole, pour 600 € par mois hors charges, ne cite aucun trimestre : on retient le dernier IRL publié à la signature, celui du ${h.trim('2025-Q2')} (${h.num(q2a)}). Au 20 juillet 2026, l’IRL du ${h.trim('2026-Q2')} est paru (${h.num(q2)}). Le loyer révisé vaut 600 × ${h.num(q2)} / ${h.num(q2a)}, soit ${h.eur(ex.nouveauLoyer)}, une hausse de ${h.eur(ex.hausse)} par mois. C’est l’exemple que donne aussi ${h.src('spIrl', 'la fiche officielle de service-public.fr')}.</p>
<h2>Ce que l’IRL ne règle pas</h2>
<p>L’indice ne s’applique qu’aux charges exclues : les provisions pour charges se régularisent à part, sur justificatifs. Il ne fixe pas non plus le loyer d’un nouveau bail en zone tendue, encadré par d’autres règles, ni la hausse lors du renouvellement d’un loyer manifestement sous-évalué. Pour les locaux commerciaux, l’indice est l’${h.a('fr-ilc', 'ILC')} ou l’${h.a('fr-ilat', 'ILAT')}. Pour savoir quel mois appliquer la révision et ce que le bailleur peut réclamer en 2026, voir ${h.a('fr-irl-2026', 'l’IRL 2026 trimestre par trimestre')}.</p>`;
  },
};
export default t;
