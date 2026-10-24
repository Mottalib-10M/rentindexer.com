import type { PageText, Helpers } from '../../lib/types';

/** ILAT : indice des loyers des activités tertiaires, bureaux et professions libérales (« indice ilat »). */
const recul = (q: string, n: number) => `${Number(q.slice(0, 4)) - n}${q.slice(4)}`;
const der = (h: Helpers) => h.D.dernierFr('ilat');

const t: PageText = {
  slug: 'indice-ilat',
  nav: 'ILAT : bureaux et professions libérales',
  card: 'L’indice des loyers des activités tertiaires, sa dernière valeur, sa comparaison avec l’ILC et le calcul d’un loyer de bureaux.',
  title: 'Indice ILAT : loyer de bureaux et professions libérales',
  description: 'Indice ILAT de l’Insee pour les bureaux et professions libérales : dernière valeur, écart avec l’ILC sur un, trois et cinq ans, calcul du loyer annuel indexé.',
  h1: 'Indice ILAT : indexer un loyer de bureaux ou de cabinet',
  intro: 'Entrez le loyer annuel hors taxes et les deux trimestres de la clause : l’outil applique le rapport des deux ILAT.',
  resume: (h) => {
    const d = der(h);
    const a = h.D.valeurFr('ilat', recul(d.p, 1))!;
    const r = h.E.indexerSomme(36000, a, d.v);
    return `L’indice des loyers des activités tertiaires (ILAT) du ${h.trim(d.p)} s’établit à ${h.num(d.v)} ; il est paru au Journal officiel le ${h.date(d.jo!)}. Au ${h.trim(recul(d.p, 1))}, il valait ${h.num(a)}, soit ${h.pc(r.taux)} en un an. L’ILAT s’applique aux baux des locaux où s’exercent des activités tertiaires autres que le commerce et l’artisanat : bureaux d’entreprise, cabinets et locaux des professions libérales. Comme l’ILC, il a pris la place de l’indice du coût de la construction, qui n’est plus la référence de ces baux depuis septembre 2014. Le loyer indexé se calcule en multipliant le loyer annuel hors taxes par l’ILAT du trimestre de révision, puis en divisant par l’ILAT du trimestre de départ fixé dans le bail. Pour des bureaux loués 36 000 € par an, la variation sur un an porte le loyer à ${h.eur(r.nouveauLoyer)}, soit ${h.eur(r.nouveauLoyer / 12)} par mois. L’ILAT du trimestre suivant est à paraître, environ trois mois après la fin de ce trimestre, comme l’ILC.`;
  },
  faqs: (h) => {
    const d = der(h);
    return [
      { q: 'Un cabinet médical ou un cabinet d’avocat relève-t-il de l’ILAT ou de l’ILC ?', a: 'De l’ILAT : les professions libérales exercent une activité tertiaire, qui n’est ni commerciale ni artisanale. L’indice à retenir reste toutefois celui que désigne le bail ; s’il cite l’ILC pour un cabinet, c’est la clause qui s’applique tant qu’elle n’est pas modifiée ou contestée. En cas de doute sur la validité de cette clause, faites relire le bail par un professionnel du droit.' },
      { q: 'Pourquoi l’ILAT a-t-il moins varié que l’ILC ces dernières années ?', a: `Les deux indices n’ont pas la même composition et ne suivent pas les mêmes prix. Entre le ${h.trim(recul(d.p, 1))} et le ${h.trim(d.p)}, l’ILAT est passé de ${h.num(h.D.valeurFr('ilat', recul(d.p, 1))!)} à ${h.num(d.v)}, quand l’ILC passait de ${h.num(h.D.valeurFr('ilc', recul(d.p, 1))!)} à ${h.num(h.D.valeurFr('ilc', d.p)!)}. Le tableau de la page compare leurs écarts sur un, trois et cinq ans.` },
      { q: 'Le loyer de bureaux indexé se calcule-t-il sur le montant hors taxes ou toutes taxes ?', a: 'Sur le loyer hors taxes et hors charges inscrit au bail : c’est ce montant que la clause fait évoluer avec l’indice. La TVA, quand le bailleur y a opté, s’ajoute ensuite au loyer indexé, et les charges se règlent à part selon le bail. Le calculateur demande donc le loyer annuel hors taxes et donne aussi l’équivalent mensuel.' },
    ];
  },
  body: (h) => {
    const d = der(h);
    const comp = [1, 3, 5].map((n) => {
      const q = recul(d.p, n);
      const la = h.D.valeurFr('ilat', q)!, lc = h.D.valeurFr('ilc', q)!;
      return [`${n} an${n > 1 ? 's' : ''} (depuis le ${h.trim(q)})`, h.pc((d.v / la - 1) * 100), h.pc((h.D.valeurFr('ilc', d.p)! / lc - 1) * 100)];
    });
    const rows = h.D.serieFr('ilat').slice(-6).reverse().map((o) => [h.trim(o.p), h.num(o.v), o.jo ? h.date(o.jo) : '–']);
    const ex = h.E.indexerSomme(42000, h.D.valeurFr('ilat', recul(d.p, 3))!, d.v);
    return `<h2>Les six derniers ILAT</h2>
${h.table(['Trimestre', 'ILAT', 'Journal officiel'], rows, 'Source : Insee, série 001617112, relue le 24 octobre 2026.', ['l', 'r', 'l'])}
<h2>ILAT et ILC sur la même période</h2>
${h.table(['Période', 'Variation de l’ILAT', 'Variation de l’ILC'], comp, `Jusqu’au ${h.trim(d.p)}. Calcul à partir des séries 001617112 et 001532540 de l’Insee.`, ['l', 'r', 'r'])}
<p>L’écart entre les deux colonnes montre pourquoi le choix de l’indice n’est pas neutre : sur un bail de bureaux de plusieurs centaines de mètres carrés, quelques dixièmes de point représentent plusieurs centaines d’euros par an. Les valeurs de l’ILC et la révision triennale sont détaillées sur ${h.a('fr-ilc', 'la page de l’ILC')}.</p>
<h2>Un bail de bureaux révisé après trois ans</h2>
<p>Des bureaux loués 42 000 € par an hors taxes, trimestre de départ ${h.trim(recul(d.p, 3))}, arrivent à leur révision triennale. Le rapport ${h.num(d.v)} / ${h.num(h.D.valeurFr('ilat', recul(d.p, 3))!)} donne un loyer de ${h.eur(ex.nouveauLoyer)} par an, soit ${h.pc(ex.taux)} sur trois ans. Les conditions de la révision triennale sont fixées par les articles L145-37 et L145-38 du Code de commerce ; une clause d’échelle mobile, si le bail en prévoit une, fait jouer l’indice chaque année.</p>
<p>Les valeurs viennent de ${h.src('inseeIlat', 'la série ILAT de l’Insee')} ; pour un local mixte, où l’on exerce une activité commerciale et des bureaux, comparez avec ${h.src('inseeIlc', 'la série ILC')} et suivez l’indice que le bail désigne.</p>`;
  },
};
export default t;
