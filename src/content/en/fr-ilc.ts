import type { PageText } from '../../lib/types';

/** ILC: commercial lease indexation, three-year review and sliding-scale clauses. */
const t: PageText = {
  slug: 'france-ilc-commercial-rent',
  nav: 'ILC commercial rent index',
  card: 'The ILC index for French shop and craft leases, the three-year review and annual indexation clauses.',
  title: 'ILC index (indice des loyers commerciaux) for shop leases',
  description: 'ILC index for commercial leases in France: latest Insee values, the three-year statutory review, annual sliding-scale clauses and the indexed rent of a shop.',
  h1: 'The ILC and the indexation of a French commercial lease',
  intro: 'Enter the annual rent before VAT and the two quarters in your lease, or switch on the three-year review to compare with twelve quarters earlier.',
  resume: (h) => {
    const d = h.D.dernierFr('ilc');
    const a = h.D.valeurFr('ilc', h.E.trimestreN1(d.p))!;
    const t3 = h.D.valeurFr('ilc', `${Number(d.p.slice(0, 4)) - 3}${d.p.slice(4)}`)!;
    return `The commercial rent index (indice des loyers commerciaux, ILC) is the Insee index used to adjust the rent of premises let for commercial or craft activities under a French commercial lease (bail commercial). Its latest value is ${h.num(d.v)} for ${h.trim(d.p)}, published in the Journal officiel on ${h.date(d.jo!)}. That is ${h.pc((d.v / a - 1) * 100)} above the same quarter a year earlier and ${h.pc((d.v / t3 - 1) * 100)} above the same quarter three years earlier. The two figures matter because a commercial lease can move in two ways. By law, either party may ask for a review every three years, under articles L145-37 and L145-38 of the Commercial Code, and the variation of the index over those three years is the usual reference. Many leases also contain a sliding-scale clause (clause d’échelle mobile) that indexes the rent automatically every year on the quarter they name. The calculator applies the ratio of two ILC values to the annual rent before VAT and shows the monthly equivalent.`;
  },
  faqs: (h) => {
    const d = h.D.dernierFr('ilc');
    return [
      { q: 'My old shop lease still refers to the construction cost index (ICC): what now?', a: 'The construction cost index stopped being a legal reference for commercial rent adjustments in September 2014, when the ILC and ILAT took over. A lease still citing the ICC should be read with a lawyer, as the outcome depends on its wording and dates. The calculator only offers the ILC and ILAT series.' },
      { q: 'When will the next ILC be published?', a: `The latest available is ${h.trim(d.p)}, in the Journal officiel since ${h.date(d.jo!)}. Insee releases the ILC roughly one quarter later than the IRL, so the following quarter is not yet published; in 2025 the equivalent release came out in December. Until it appears, the calculator does not list it.` },
      { q: 'Can a commercial rent go down with the ILC?', a: 'Yes, if the index of the new quarter is lower than the starting one and the clause works both ways. The ILC has been lower than a year earlier in some recent quarters, so a downward result is not a calculator error. A clause that only allows increases raises its own legal questions, which a lawyer specialised in commercial leases can answer.' },
    ];
  },
  body: (h) => {
    const q = h.D.dernierFr('ilc').p;
    const deb3 = `${Number(q.slice(0, 4)) - 3}${q.slice(4)}`, deb1 = h.E.trimestreN1(q);
    const n = h.D.valeurFr('ilc', q)!, v3 = h.D.valeurFr('ilc', deb3)!, v1 = h.D.valeurFr('ilc', deb1)!;
    const r3 = h.E.indexerSomme(36000, v3, n), r1 = h.E.indexerSomme(36000, v1, n);
    const rows = h.D.serieFr('ilc').slice(-6).reverse().map((o) => [h.trim(o.p), h.num(o.v), o.jo ? h.date(o.jo) : '–']);
    return `<h2>Latest ILC values</h2>
${h.table(['Quarter', 'ILC', 'Journal officiel'], rows, 'Source: Insee, series 001532540.', ['l', 'r', 'l'])}
<p>Full series: ${h.src('inseeIlc')}.</p>
<h2>Annual clause or three-year review: same shop, two results</h2>
<p>A shop let at €36,000 a year before VAT, reference quarter ${h.trim(q)}. With an annual sliding-scale clause starting from ${h.trim(deb1)} (${h.num(v1)}), the rent becomes ${h.eur(r1.nouveauLoyer)}. With a three-year review starting from ${h.trim(deb3)} (${h.num(v3)}), it becomes ${h.eur(r3.nouveauLoyer)}, or ${h.eur(r3.nouveauLoyer / 12)} a month. Switching on “three-year review” in the tool makes this second comparison for you.</p>
<h2>What the tool does not settle</h2>
<p>A commercial lease may also contain caps, floors or a rent set at market value on renewal; those follow the lease and the Commercial Code, not the index alone. Office and professional premises use the ${h.a('fr-ilat', 'ILAT')} instead. For a home, the index is the ${h.a('fr-irl', 'IRL')}, whose values are on ${h.src('inseeIrl', 'the Insee IRL series')}. The general overview is on ${h.a('fr-home', 'rent review in France')}.</p>`;
  },
};
export default t;
