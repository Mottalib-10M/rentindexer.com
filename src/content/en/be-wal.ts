import type { PageText } from '../../lib/types';

/** Wallonia: registration, the 2022-2023 limitation and the adapted rent as new base. */
const t: PageText = {
  slug: 'wallonia-rent-indexation',
  nav: 'Wallonia rent indexation',
  card: 'Indexing a rent in Wallonia: registration, the 2022-2023 limit by EPB label and the adapted rent that became the new base.',
  title: 'Wallonia rent indexation: EPB limit and adapted base rent',
  description: 'Wallonia rent indexation: health index formula, the 2022-2023 limit for EPB D to G homes, the adapted rent used as base since November 2023, and your new rent.',
  h1: 'Rent indexation in Wallonia',
  intro: 'The tool is set to Wallonia: enter the base rent, the signing and start months, the year of indexation and the EPB label.',
  resume: (h) => {
    const p = h.D.regles.be.wallonie.limitation_2022_2023.part_indexation;
    return `In Wallonia the rent of a home can be indexed each year, at the earliest on the anniversary of the date the lease took effect, unless the lease expressly rules it out. Since 1 September 2018 a main-residence lease must be registered for any indexation to be possible, including leases already running on that date. The formula is base rent × new health index / starting index: the starting index is that of the month before signing, the new index that of the month before the anniversary. The request must be in writing, but ordinary mail, a text message or an email is enough as long as the landlord keeps proof, and arrears are limited to the three months before the request. The particular Walloon rule is the one-year limitation for anniversaries between 1 November 2022 and 31 October 2023: full indexation for EPB labels A to C, ${h.num(p.D * 100, 0)} % of the increase for D, ${h.num(p.E * 100, 0)} % for E and none for F, G or a home without certificate. The rent adapted in that year became the base rent for every later indexation.`;
  },
  faqs: () => [
    { q: 'Our lease was running in 2016: what about the index jump?', a: 'For main-residence leases running on 1 April 2016, the Walloon administration says the index jump of that year must be taken into account. This calculator does not model it, so its result for such a lease may be too high. Check the calculation with the regional calculator or with an Info-Conseils Logement office before sending a request.' },
    { q: 'Does the 2022-2023 limitation still matter if the home now has a better EPB label?', a: 'The limitation itself only applied to anniversaries during that one year, but its effect lasts: the adapted rent and the index of the 2022-2023 anniversary became the new starting point for the rest of the lease. The Walloon page says this adapted base applies for the whole duration of the lease; for a lease where the label has since changed, ask the regional housing service how it reads your case.' },
    { q: 'Who can help with a Walloon indexation dispute?', a: 'The regional Info-Conseils Logement offices inform tenants and landlords, and the housing department answers questions by email at its rental law address. If the parties still disagree, the justice of the peace decides. The calculator gives the figures, not an opinion on a particular lease.' },
  ],
  body: (h) => {
    const parts = h.D.regles.be.wallonie.limitation_2022_2023.part_indexation;
    const dep = h.D.indiceSante('2021-04')!, n = h.D.indiceSante('2026-05')!, a = h.D.indiceSante('2023-05')!, b = h.D.indiceSante('2022-05')!;
    const run = (peb: 'C' | 'D' | 'E' | 'F') => h.E.indexerWallonie({ loyerBase: 850, indiceDepart: dep, nouvelIndice: n, peb, entreeVigueur: '2021-06-01', indiceAnniv2223: a, indiceAnnivPrecedent: b }, parts).nouveauLoyer;
    return `<h2>Example: one flat, four labels</h2>
<p>Lease signed in May 2021, in force from 1 June 2021, base rent €850, indexed in June 2026. Starting index April 2021 (${h.num(dep)}), new index May 2026 (${h.num(n)}). The 2022-2023 anniversary fell on 1 June 2023, so the limited year used May 2023 (${h.num(a)}) against May 2022 (${h.num(b)}).</p>
${h.table(['EPB label', 'Share of the 2023 increase', 'Rent from June 2026'], [
      ['A, B or C', '100 %', h.eur(run('C'))],
      ['D', `${h.num(parts.D * 100, 0)} %`, h.eur(run('D'))],
      ['E', `${h.num(parts.E * 100, 0)} %`, h.eur(run('E'))],
      ['F, G or none', '0 %', h.eur(run('F'))],
    ], 'Calculation: limited 2023 rent = rent due + (indexed rent − rent due) × share; since November 2023, that rent × new index / May 2023 index.', ['l', 'r', 'r'])}
<p>The tool assumes the rent had been indexed at the anniversary before the limited year, as the official method defines the rent due as the indexed rent of the previous year even if indexation was not asked. The method is set out on ${h.src('walIndexer')}; index values come from ${h.src('statbelSante')}.</p>
<p>For the other regions, see ${h.a('be-bxl', 'Brussels rent indexation')}, or compare all three on ${h.a('be-home', 'rent indexation in Belgium')}. Monthly values are on ${h.a('be-sante', 'the health index page')}.</p>`;
  },
};
export default t;
