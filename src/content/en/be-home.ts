import type { PageText } from '../../lib/types';

/** Belgium overview for English readers: one formula, three regional rule sets. */
const t: PageText = {
  slug: 'belgium-rent-indexation',
  nav: 'Belgium: rent indexation',
  card: 'How a Belgian residential rent is indexed with the health index, and what changes between Brussels, Wallonia and Flanders.',
  title: 'Rent indexation in Belgium: health index and regional rules',
  description: 'Rent indexation in Belgium: the health index formula, the starting month in Brussels, Wallonia and Flanders, energy-label cuts and the new rent worked out.',
  h1: 'Indexing a residential rent in Belgium',
  intro: 'Pick the region, the base rent from the lease, the signing and start months and the energy label: the tool applies the formula and the regional correction.',
  resume: (h) => {
    const d = h.D.dernierSante();
    return `Belgian residential rents are not reviewed by a national index of rents but indexed once a year on the health index (indice santé, gezondheidsindex), the consumer price index without tobacco, alcoholic drinks and motor fuel except LPG. The latest value published by Statbel is ${h.num(d.v)} for ${h.mois(d.p)} (base 2013). The formula is the same in the three regions: base rent written in the lease, multiplied by the new index and divided by the starting index. What differs is the detail. In Brussels and Wallonia the starting index is that of the month before the lease was signed; in Flanders it is the month before the lease took effect. The new index is that of the month before the anniversary of the start date. Indexation is never automatic: the landlord must ask in writing, and can claim it for at most three months before the request. Each region also cuts the indexation of homes with a poor energy label for leases that started before autumn 2022, and those cuts still apply today.`;
  },
  faqs: () => [
    { q: 'I rent out a flat in Belgium from abroad: which region’s rules apply?', a: 'Those of the region where the home is, not where you or the tenant live. A flat in Ixelles follows Brussels rules, one in Liège the Walloon decree and one in Ghent the Flemish decree. The base rent and dates come from the lease, so keep a copy at hand when you use the calculator.' },
    { q: 'Can a Belgian lease rule out indexation?', a: 'Yes. Indexation is allowed each year unless the lease expressly excludes it. A lease that says nothing about indexation still allows it in the three regions, provided the other conditions are met, such as registration of the lease and, in Brussels, delivery of a valid energy certificate to the tenant.' },
    { q: 'Is the base rent the rent I pay today?', a: 'No, and this is the most common mistake. The base rent is the amount written in the lease when it was signed, before any indexation. Each year the calculation starts again from that amount and from the original starting index, so indexing last year’s indexed rent would count the same price rise twice.' },
  ],
  body: (h) => {
    const dep = h.D.indiceSante('2021-04')!, depVl = h.D.indiceSante('2021-05')!, nouv = h.D.indiceSante('2026-05')!;
    const bw = h.E.centimes(h.E.indexerBe(850, dep, nouv)), vl = h.E.centimes(h.E.indexerBe(850, depVl, nouv));
    return `<h2>The three regions compared</h2>
${h.table(['', 'Brussels', 'Wallonia', 'Flanders'], [
      ['Starting index', 'Month before signing', 'Month before signing', 'Month before the start date'],
      ['New index', 'Month before the anniversary', 'Month before the anniversary', 'Month before the anniversary (or of a late written request)'],
      ['Energy-label correction', 'EPB E, F, G; lease in force before 14 October 2022', 'EPB D to G or none; anniversary between 1 November 2022 and 31 October 2023', 'EPC D, E, F or none; lease in force before 1 October 2022'],
      ['Other condition', 'Lease registered, valid EPB given to the tenant', 'Main-residence lease registered', 'Oral lease: only if the indexation was agreed and can be proven'],
    ], 'Sources: be.brussels, wallonie.be, vlaanderen.be, read on 24 October 2026.', ['l', 'l', 'l', 'l'])}
<h2>Same lease, two answers</h2>
<p>A lease signed in May 2021, in force from 1 June 2021, base rent €850, energy label C, indexed in June 2026. In Brussels or Wallonia the starting index is April 2021 (${h.num(dep)}) and the indexed rent ${h.eur(bw)}. In Flanders it is May 2021 (${h.num(depVl)}) and the result ${h.eur(vl)}. Both use May 2026 (${h.num(nouv)}) as new index.</p>
<h2>Regional details and sources</h2>
<p>Brussels: ${h.a('be-bxl', 'Brussels rent indexation')} and ${h.src('bxlCorrection')}. Wallonia: ${h.a('be-wal', 'Wallonia rent indexation')} and ${h.src('walIndexer')}. Flanders: ${h.a('be-vl', 'Flanders rent indexation')} and ${h.src('vlCorrectie')}. Index values: ${h.a('be-sante', 'the health index page')}, ${h.src('statbelSante')} and ${h.src('statbelSanteNl')}.</p>`;
  },
};
export default t;
