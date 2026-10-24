import type { PageText } from '../../lib/types';

/** Brussels: conditions, EPB correction factor, the October split. */
const t: PageText = {
  slug: 'brussels-rent-indexation',
  nav: 'Brussels rent indexation',
  card: 'Indexing a rent in the Brussels-Capital Region: registration, EPB certificate and the correction factor for E, F and G homes.',
  title: 'Brussels rent indexation: EPB rules and correction factor',
  description: 'Brussels rent indexation: health index formula, registration and EPB conditions, the correction factor for E, F and G homes, and the rent that can be charged.',
  h1: 'Rent indexation in the Brussels-Capital Region',
  intro: 'The tool is set to Brussels: enter the base rent, the signing and start months, the year of indexation and the EPB label.',
  resume: (h) => {
    const d = h.D.dernierSante();
    return `In the Brussels-Capital Region a landlord may index the rent once a year, from the anniversary of the date the lease took effect, by sending a written request; the request reaches back at most three months before the month in which it is sent. Two conditions come first: the lease must be registered, and the tenant must have received a valid energy performance certificate (certificat PEB, EPB-certificaat). Without them, no indexation at all is possible. The formula is base rent × new health index / starting index, where the starting index is the month before the lease was signed and the new index the month before the anniversary; the latest published value is ${h.num(d.v)} for ${h.mois(d.p)}. On top of that, a home rated E, F or G whose lease took effect before 14 October 2022 must have the result multiplied by a correction factor, permanently, until a better certificate is obtained or a new lease starts. Homes let by public housing companies (SISP) and the Fonds du Logement are outside the correction.`;
  },
  faqs: () => [
    { q: 'My lease started in October: why does the tool show a different factor from the official table?', a: 'The Brussels table splits October in two: anniversaries from 1 to 13 October and from 14 to 31 October have different factors. The calculator works by month and treats every October start as falling between 1 and 13 October. If your lease started between 14 and 31 October, take the factor from the official table instead and multiply the fully indexed rent by it.' },
    { q: 'The certificate was missing but has now been given to the tenant: can the landlord index?', a: 'Yes, from the moment a valid certificate has been passed to the tenant, provided the lease is registered. An expired certificate counts as no certificate, so a new one must be handed over before any indexation request. Until then the rent stays at its current amount, whatever the health index does.' },
    { q: 'What can a tenant do about a full indexation on an F-rated flat?', a: 'The Brussels administration says the tenant may contest an indexation that is too high with the landlord, and either party can take the matter to the justice of the peace (juge de paix) if they cannot agree. A calculation showing the corrected amount, with the indices used, is the usual starting point for that discussion.' },
  ],
  body: (h) => {
    const dep = h.D.indiceSante('2020-01')!, a = h.D.indiceSante('2022-01')!, b = h.D.indiceSante('2023-01')!, n = h.D.indiceSante('2026-01')!;
    const base = { loyerBase: 1000, indiceDepart: dep, nouvelIndice: n, entreeVigueur: '2020-02-01', indicesCorrection: [a, b] as [number, number] };
    const c = h.E.indexerBruxelles({ ...base, peb: 'C' }), e = h.E.indexerBruxelles({ ...base, peb: 'E' }), g = h.E.indexerBruxelles({ ...base, peb: 'G' });
    return `<h2>Example: the same flat with three EPB labels</h2>
<p>This follows the official Brussels example, updated to February 2026: lease signed and in force on 1 February 2020, base rent €1,000, starting index January 2020 (${h.num(dep)}), new index January 2026 (${h.num(n)}). The correction uses the January 2022 (${h.num(a)}) and January 2023 (${h.num(b)}) indices.</p>
${h.table(['EPB label', 'Correction factor', 'Rent from February 2026'], [
      ['A to D', 'none', h.eur(c.nouveauLoyer)],
      ['E', h.num((0.5 * (a + b)) / b, 6), h.eur(e.nouveauLoyer)],
      ['F or G', h.num(a / b, 6), h.eur(g.nouveauLoyer)],
    ], 'Factor E = 50 % × (index 2022 + index 2023) / index 2023; F and G = index 2022 / index 2023.', ['l', 'r', 'r'])}
<p>For anniversaries between 14 October and 31 December, the two indices are those of 2021 and 2022 rather than 2022 and 2023. The rules and the full factor table are on ${h.src('bxlCorrection')}; index values on ${h.src('statbelSante')}.</p>
<h2>Elsewhere in Belgium</h2>
<p>Wallonia and Flanders use other dates and other labels: see ${h.a('be-wal', 'Wallonia rent indexation')} and ${h.a('be-vl', 'Flanders rent indexation')}, or the comparison on ${h.a('be-home', 'rent indexation in Belgium')}.</p>`;
  },
};
export default t;
