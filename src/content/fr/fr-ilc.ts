import type { PageText, Helpers } from '../../lib/types';

/** ILC : indice des loyers commerciaux, révision annuelle ou triennale d’un bail commercial (« indice ilc »). */
const der = (h: Helpers) => h.D.dernierFr('ilc');
const il = (q: string) => `${Number(q.slice(0, 4)) - 1}${q.slice(4)}`;
const il3 = (q: string) => `${Number(q.slice(0, 4)) - 3}${q.slice(4)}`;

const t: PageText = {
  slug: 'indice-ilc',
  nav: 'ILC et bail commercial',
  card: 'L’indice des loyers commerciaux de l’Insee, son dernier trimestre et le calcul d’un loyer commercial révisé sur un an ou sur trois ans.',
  title: 'Indice ILC : loyer commercial révisé sur un an ou trois ans',
  description: 'Indice ILC de l’Insee : dernière valeur publiée, variation sur un an et sur trois ans, et calcul du loyer d’un bail commercial révisé ou indexé selon sa clause.',
  h1: 'Indice ILC : réviser le loyer d’un bail commercial',
  intro: 'Saisissez le loyer annuel hors taxes et le trimestre de référence du bail ; cochez la révision triennale pour comparer sur trois ans.',
  resume: (h) => {
    const d = der(h);
    const a = h.D.valeurFr('ilc', il(d.p))!, b = h.D.valeurFr('ilc', il3(d.p))!;
    const r1 = h.E.indexerSomme(24000, a, d.v), r3 = h.E.indexerSomme(24000, b, d.v);
    return `L’indice des loyers commerciaux (ILC) du ${h.trim(d.p)} vaut ${h.num(d.v)}, publié au Journal officiel le ${h.date(d.jo!)}. Un an plus tôt, au ${h.trim(il(d.p))}, il valait ${h.num(a)}, soit une variation de ${h.pc(r1.taux)} ; sur trois ans, depuis le ${h.trim(il3(d.p))} (${h.num(b)}), la variation est de ${h.pc(r3.taux)}. L’ILC sert de référence aux baux commerciaux des activités commerciales et artisanales ; les bureaux et les professions libérales relèvent de l’ILAT. Il a remplacé l’indice du coût de la construction, abandonné pour ces baux depuis septembre 2014. Le calcul est une simple proportion : loyer annuel hors taxes × ILC du trimestre de révision / ILC du trimestre de départ. Pour un loyer de 24 000 € par an, la révision sur un an donne ${h.eur(r1.nouveauLoyer)} et la révision sur trois ans ${h.eur(r3.nouveauLoyer)}. L’indice du trimestre suivant est à paraître : l’Insee publie l’ILC environ trois mois après la fin du trimestre, soit vers la fin décembre 2026 pour le 3e trimestre.`;
  },
  faqs: (h) => {
    const d = der(h);
    return [
      { q: 'Révision triennale ou clause d’échelle mobile : quelle différence pour le calcul ?', a: 'La révision triennale est prévue par le Code de commerce (articles L145-37 et L145-38) : tous les trois ans, on compare l’ILC du trimestre de révision à celui d’il y a trois ans. La clause d’échelle mobile, si le bail en contient une, indexe le loyer chaque année, en général à date fixe, sur l’ILC d’un trimestre précis. Dans les deux cas, la formule est la même ; seul l’écart entre les deux trimestres change.' },
      { q: 'Mon bail commercial cite encore l’indice du coût de la construction : que faire ?', a: 'L’indice du coût de la construction n’est plus la référence légale des baux commerciaux depuis septembre 2014, remplacé par l’ILC pour le commerce et l’artisanat et par l’ILAT pour les activités tertiaires. Un bail ancien peut toutefois le citer encore ; la manière de traiter cette clause dépend de sa rédaction et de la date du bail. Faites-la lire par un avocat ou un notaire avant de calculer quoi que ce soit.' },
      { q: `L’ILC a baissé à certains trimestres : le loyer commercial peut-il diminuer ?`, a: `Oui, si la clause du bail joue dans les deux sens, à la hausse comme à la baisse. L’ILC a déjà reculé d’un trimestre à l’autre, par exemple au ${h.trim('2025-Q4')} (${h.num(h.D.valeurFr('ilc', '2025-Q4')!)}) après le ${h.trim('2025-Q3')} (${h.num(h.D.valeurFr('ilc', '2025-Q3')!)}). Le calculateur affiche alors une variation négative. Le dernier indice paru, celui du ${h.trim(d.p)}, est en hausse sur un an.` },
    ];
  },
  body: (h) => {
    const obs = h.D.serieFr('ilc');
    const rows = obs.slice(-8).reverse().map((o) => {
      const a = h.D.valeurFr('ilc', il(o.p));
      return [h.trim(o.p), h.num(o.v), a ? h.pc((o.v / a - 1) * 100) : '–', o.jo ? h.date(o.jo) : '–'];
    });
    const d = der(h);
    const m = h.E.indexerSomme(18000, h.D.valeurFr('ilc', il3(d.p))!, d.v);
    return `<h2>Les huit derniers ILC</h2>
${h.table(['Trimestre', 'ILC', 'Sur un an', 'Journal officiel'], rows, 'Source : Insee, série 001532540 (base 100 au 1er trimestre 2008), relue le 24 octobre 2026. Variation sur un an calculée à partir des indices.', ['l', 'r', 'r', 'l'])}
<p>La série complète remonte au 1er trimestre 2005 sur ${h.src('inseeIlc', 'la page de l’Insee')}. Le calculateur propose les quatre-vingts derniers trimestres, ce qui couvre un bail de neuf ans et ses renouvellements récents.</p>
<h2>Révision triennale : un exemple</h2>
<p>Un local commercial loué 18 000 € par an hors taxes, avec le ${h.trim(il3(d.p))} comme trimestre de départ, arrive à sa révision triennale. Le rapport des deux indices, ${h.num(d.v)} / ${h.num(h.D.valeurFr('ilc', il3(d.p))!)}, porte le loyer à ${h.eur(m.nouveauLoyer)} par an, soit ${h.eur(m.nouveauLoyer / 12)} par mois. Dans le calculateur, le bouton « Révision triennale » place automatiquement le trimestre de départ trois ans avant le trimestre choisi.</p>
<p>Le Code de commerce fixe les conditions de cette révision, notamment le délai à respecter et les limites de la hausse. Le calcul ci-dessus ne dit pas si ces conditions sont remplies dans votre cas ; il donne le montant que produit l’indice. Pour une demande contestée ou un renouvellement, le bail et un professionnel du droit restent la référence.</p>
<h2>ILC, ILAT ou IRL</h2>
<p>Le choix de l’indice suit l’activité exercée dans les lieux, pas la forme du bail. Commerce et artisanat : ILC. Bureaux, activités tertiaires et professions libérales : ${h.a('fr-ilat', 'ILAT')}. Logement, même loué à un commerçant pour y habiter : ${h.a('fr-irl', 'IRL')}, avec ses propres règles d’un an et de non-rétroactivité, et la série ${h.src('inseeIrl', 'publiée par l’Insee')}.</p>`;
  },
};
export default t;
