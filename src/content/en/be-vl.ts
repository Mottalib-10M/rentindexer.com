import type { PageText } from '../../lib/types';

/** Flanders: start-date index, late requests, EPC correctiefactor. */
const t: PageText = {
  slug: 'flanders-rent-indexation',
  nav: 'Flanders rent indexation',
  card: 'Indexing a rent in Flanders: the start-date index, late requests and the correction factor (correctiefactor) for EPC D, E, F or none.',
  title: 'Flanders rent indexation: EPC correctiefactor and timing',
  description: 'Flanders rent indexation: the start-date health index, what changes with a late request, the correctiefactor for EPC D, E, F or no EPC, and the rent due.',
  h1: 'Rent indexation in Flanders',
  intro: 'The tool is set to Flanders: enter the base rent, the start month and year, the year of indexation and the EPC label.',
  resume: (h) => {
    const f = h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire;
    return `In Flanders the rent may be indexed once a year from the anniversary of the date the lease took effect, unless the lease expressly excludes it, and only after a written request or notice from the landlord. Unlike Brussels and Wallonia, the starting index (aanvangsindexcijfer) is the health index of the month before the lease took effect, not the month before it was signed. The new index is in principle that of the month before the anniversary; the Flemish government adds that when the request comes later, the health index at the time of the written notice applies, with arrears limited to three months. For homes on the private market let as a main residence, with an EPC label D, E or F or no valid EPC, and a lease in force before 1 October 2022, the fully indexed rent must be multiplied by a correction factor (correctiefactor) that depends on the anniversary month: for November, ${h.num(f['11'].D, 6)} for label D and ${h.num(f['11'].EFsans, 6)} for E, F or no EPC. The factor applies to every indexation until a better EPC or a new lease.`;
  },
  faqs: () => [
    { q: 'The landlord sends the indexation request months late: which index counts?', a: 'The Flemish page says the health index at the moment of the written request applies, and the increase can go back three months at most. The calculator uses the month before the anniversary, the right figure for a timely request. For a late one, select the request month in the health index tool and recompute with that index.' },
    { q: 'Does an expired EPC count as no EPC?', a: 'Yes. Vlaanderen.be states that an expired EPC label is treated as having no label, so the correction factor for E, F or no EPC applies. Once a new certificate with label A, B or C is obtained, full indexation is allowed from that day, worked out pro rata for the month in which it arrives.' },
    { q: 'Do student rooms fall under the Flemish correction?', a: 'The Constitutional Court decided on 21 March 2024 that the indexation limit should also have applied to student leases. Students who rented an energy-inefficient room under a lease from before 1 October 2022 may be able to reclaim part of the rent. The calculator is built for main-residence leases and does not compute that refund.' },
  ],
  body: (h) => {
    const ex = h.D.regles.be.flandre.correctiefactor.exemple_officiel;
    const facteurs = h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire;
    const dep = h.D.indiceSante('2019-10')!, n = h.D.indiceSante('2024-10')!;
    const r = h.E.indexerFlandre({ loyerBase: ex.loyer_base, indiceDepart: dep, nouvelIndice: n, moisAnniversaire: '11', epc: 'D', entreeVigueur: '2019-11-01', facteurs });
    const plein = h.E.centimes(h.E.indexerBe(ex.loyer_base, dep, n));
    const rows = ['10', '01', '04', '07'].map((m) => [h.mois(`2026-${m}`).replace(/\s\d{4}$/, ''), h.num(facteurs[m].D, 6), h.num(facteurs[m].EFsans, 6)]);
    return `<h2>The official example, reproduced</h2>
<p>Lease signed on 15 October 2019, in force from 1 November 2019, base rent ${h.eur(ex.loyer_base)}, EPC label D. Starting index October 2019 (${h.num(dep)}), new index October 2024 (${h.num(n)}). Fully indexed rent ${h.eur(plein)}; with the November factor for label D the rent that can be charged (eisbare huurprijs) is ${h.eur(r.nouveauLoyer)}, as on ${h.src('vlCorrectie')}.</p>
<h2>Correction factors for a few anniversary months</h2>
${h.table(['Anniversary month', 'EPC D', 'EPC E, F or none'], rows, 'Full table of twelve months on vlaanderen.be; the calculator uses all of them.', ['l', 'r', 'r'])}
<h2>Timing example</h2>
<p>A lease started on 1 March 2025 can be indexed from 1 March 2026. If the landlord only writes on 1 July 2026, the indexed rent is due for July and the three months before, so from 1 April 2026; March is lost. Leases signed before 1 January 2019 still follow the federal rental law on some points, so check older leases carefully. Index values in Dutch: ${h.src('statbelSanteNl')}.</p>
<p>Compare with ${h.a('be-bxl', 'Brussels rent indexation')}, see the month-by-month values on ${h.a('be-sante', 'the health index page')}, or go back to ${h.a('be-home', 'rent indexation in Belgium')}.</p>`;
  },
};
export default t;
