import type { PageText } from '../../lib/types';

/** Italy: the FOI index series, base 2025, how to read it. */
const t: PageText = {
  slug: 'italy-foi-index',
  nav: 'FOI index (Italy)',
  card: 'Italy’s FOI index excluding tobacco month by month, its twelve-month change and the switch to the 2025 base.',
  title: 'FOI index Istat: monthly values and the new 2025 base',
  description: 'FOI index excluding tobacco from Istat, month by month: index level, twelve-month change, the January 2026 switch to the 2025 base and how leases use it.',
  h1: 'The FOI index: Italy’s reference for rents and revaluations',
  intro: 'Choose the Istat month named in your lease: the tool reads that month’s FOI change and applies it to the rent.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    return `The FOI (indice dei prezzi al consumo per le famiglie di operai e impiegati) is the consumer price index Istat publishes for adjusting money values in Italy: rents, maintenance payments, revalued claims. It is used in its version excluding tobacco. The latest figure, for ${h.mois(u.m)}, is ${h.num(u.indice, 1)}, a change of ${h.pc(u.varAnno!, 1)} on the same month a year earlier. Two numbers are published for each month and they serve different purposes. The index level is what you divide when revaluing a sum between two dates. The twelve-month change is what a lease applies, in full or at 75%, on its anniversary. Since January 2026 the index is on a new base, 2025 = 100, and follows the new European classification of household spending (ECOICOP version 2). Istat rebuilt the historical series from 1996, stating that the general FOI indices remain unchanged; earlier months stay on their old bases and are linked with a coefficient of ${h.num(h.D.RACCORDI[2025], 3)} between the 2015 and 2025 bases.`;
  },
  faqs: (h) => [
    { q: 'Is the FOI the same as Italian inflation in the news?', a: 'Not exactly. Headline inflation usually refers to the NIC index or the harmonised HICP. The FOI covers households of blue- and white-collar workers and, in the version used for money values, excludes tobacco. The figures are close but can differ by a few tenths, which matters on a rent or a large sum.' },
    { q: 'Can I use the twelve-month change across the base switch?', a: `Yes. Istat publishes the twelve-month change consistently: for January 2026 it is ${h.pc(h.D.foi('2026-01')!.varAnno!, 1)}, and a lease with a January reference month applies it directly. The base switch only matters when you divide two index levels from different bases, as in a revaluation over several years.` },
    { q: 'When will the next FOI figure be published?', a: `Istat releases each month’s final figure around the middle of the following month. The month after ${h.mois(h.D.ultimoFoi().m)} is not out yet. The tool adds it once Istat publishes it and never shows an estimate in the meantime, because an estimated index has no value for a lease or a court calculation.` },
  ],
  body: (h) => {
    const rows = h.D.mesiFoi().slice(0, 18).map((m) => { const f = h.D.foi(m)!; return [h.mois(m), h.num(f.indice, 1), String(f.base), f.varAnno !== undefined ? h.pc(f.varAnno, 1) : '–']; });
    return `<h2>Recent FOI values</h2>
${h.table(['Month', 'Index', 'Base', 'Twelve-month change'], rows, `Source: ${h.src('istatFoi', 'Istat, FOI excluding tobacco')}, read on 24 October 2026, licence CC BY 4.0.`, ['l', 'r', 'r', 'r'])}
<p>Both the index and the change are published with one decimal. The bases used since 1996 are 1995, 2010, 2015 and 2025, linked by coefficients of ${h.num(h.D.RACCORDI[2010], 3)}, ${h.num(h.D.RACCORDI[2015], 3)} and ${h.num(h.D.RACCORDI[2025], 3)} (${h.src('istatRivaluta', 'Istat Rivaluta')}). For the rent update see ${h.a('it-affitto', 'the Istat rent update')}; for revaluing a sum, ${h.a('it-home', 'the Istat revaluation')}.</p>`;
  },
};
export default t;
