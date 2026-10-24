import type { PageText } from '../../lib/types';

/** ILAT: office and tertiary premises, how it differs from the ILC. */
const t: PageText = {
  slug: 'france-ilat-office-rent',
  nav: 'ILAT office rent index',
  card: 'The ILAT index for French office and professional premises, its latest value and how it compares with the ILC.',
  title: 'ILAT index (loyers des activités tertiaires) for offices',
  description: 'ILAT index for office leases in France: latest Insee value, who must use it rather than the ILC, how it moved over one and three years, and the indexed rent.',
  h1: 'The ILAT: indexing the rent of offices and professional premises',
  intro: 'Choose the two ILAT quarters set by the lease and enter the annual rent before VAT: the tool gives the indexed yearly and monthly rent.',
  resume: (h) => {
    const d = h.D.dernierFr('ilat');
    const a = h.D.valeurFr('ilat', h.E.trimestreN1(d.p))!;
    const c = h.D.dernierFr('ilc');
    return `The office rent index (indice des loyers des activités tertiaires, ILAT) is the Insee index for French leases of premises used for tertiary activities other than commerce and crafts: offices and the premises of the liberal professions. A company renting an office in Paris or Lyon will usually find it named in the indexation clause. Its latest value is ${h.num(d.v)} for ${h.trim(d.p)}, published in the Journal officiel on ${h.date(d.jo!)}, which is ${h.pc((d.v / a - 1) * 100)} above a year earlier. For the same quarter the commercial index (ILC) stood at ${h.num(c.v)}. The two series have different values and do not move in step, so using the wrong one changes the rent. As with shop leases, the Commercial Code allows a review every three years, and many leases add an annual indexation clause naming a reference quarter. The adjusted rent is the current annual rent multiplied by the new ILAT and divided by the starting ILAT.`;
  },
  faqs: (h) => [
    { q: 'I run a consultancy from a ground-floor unit: ILC or ILAT?', a: 'The activity carried out decides, not the look of the premises. Commercial and craft activities use the ILC; tertiary activities such as consulting, offices and liberal professions use the ILAT. If the lease names one index explicitly, that choice applies, and a disagreement about it is a question for a lawyer rather than for a calculator.' },
    { q: 'How has the ILAT moved compared with three years ago?', a: `For ${h.trim(h.D.dernierFr('ilat').p)} the ILAT is ${h.pc((h.D.dernierFr('ilat').v / h.D.valeurFr('ilat', `${Number(h.D.dernierFr('ilat').p.slice(0, 4)) - 3}${h.D.dernierFr('ilat').p.slice(4)}`)! - 1) * 100)} above the same quarter three years earlier. That is the variation a three-year review starting from that quarter would apply. Switch on the three-year option in the tool to see it on your own rent.` },
    { q: 'Does the ILAT apply to warehouses or storage?', a: 'The calculator does not decide which premises fall under which index; it only applies the series you choose. For storage, logistics or mixed-use buildings, read the indexation clause of the lease and, if it is unclear, ask the lawyer or notary who drafted it. The calculation itself works the same way for any Insee quarterly index offered here.' },
  ],
  body: (h) => {
    const rows = h.D.serieFr('ilat').slice(-6).reverse().map((o) => [h.trim(o.p), h.num(o.v), h.num(h.D.valeurFr('ilc', o.p) ?? 0), o.jo ? h.date(o.jo) : '–']);
    const q = h.D.dernierFr('ilat').p, d1 = h.E.trimestreN1(q);
    const r = h.E.indexerSomme(54000, h.D.valeurFr('ilat', d1)!, h.D.valeurFr('ilat', q)!);
    return `<h2>ILAT and ILC side by side</h2>
${h.table(['Quarter', 'ILAT', 'ILC', 'Journal officiel'], rows, 'Source: Insee, series 001617112 (ILAT) and 001532540 (ILC).', ['l', 'r', 'r', 'l'])}
<p>Both series are published by Insee on the same day: ${h.src('inseeIlat')} and ${h.src('inseeIlc')}.</p>
<h2>Example: a 120 m² office</h2>
<p>Annual rent €54,000 before VAT, yearly indexation clause on the ${h.trim(q)}. The ratio is ${h.num(h.D.valeurFr('ilat', q)!)} / ${h.num(h.D.valeurFr('ilat', d1)!)} and the new annual rent ${h.eur(r.nouveauLoyer)}, which is ${h.eur(r.nouveauLoyer / 12)} a month, a change of ${h.eur(r.hausse)} over the year. VAT, service charges and property tax rebilled under the lease are added separately and are not indexed by this calculation.</p>
<h2>Related pages</h2>
<p>Shops and craft premises: ${h.a('fr-ilc', 'the ILC page')}. Homes: ${h.a('fr-irl', 'the IRL page')} and ${h.a('fr-home', 'rent review in France')}.</p>`;
  },
};
export default t;
