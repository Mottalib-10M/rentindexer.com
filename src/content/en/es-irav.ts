import type { PageText } from '../../lib/types';

/** Spain: the IRAV housing lease index, its monthly values and what it caps. */
const t: PageText = {
  slug: 'spain-irav-index',
  nav: 'IRAV index (Spain)',
  card: 'Every published value of Spain’s IRAV housing lease index, compared with the CPI, and the leases it applies to.',
  title: 'IRAV index for Spanish leases: monthly values since 2024',
  description: 'IRAV, the INE index for updating Spanish housing leases: every monthly value since it began, how it compares with the CPI, and when it replaces or caps the CPI.',
  h1: 'The IRAV index: Spain’s benchmark for housing lease updates',
  intro: 'The tool starts from a clause that refers to the IRAV; switch the option if your lease names the CPI or says nothing.',
  resume: (h) => {
    const s = h.D.serieIravEs();
    const u = s[s.length - 1];
    return `The IRAV (Índice de Referencia para la Actualización Anual de los Contratos de Arrendamiento de Vivienda) is an index published by Spain’s statistics office, INE, for one purpose only: updating residential leases. Its latest value, for ${h.mois(u.p)}, is an annual change of ${h.pc(u.v)}, against ${h.pc(h.D.IPC_ES[u.p], 1)} for the general consumer price index (IPC) the same month. The series starts in ${h.mois(s[0].p)}, at ${h.pc(s[0].v)}, and has stayed in a narrow band since. Article 18 of the Urban Leases Act gives it two roles. If a lease provides for an annual update without naming an index, the IRAV is the index. And for leases signed on or after 26 May 2023, whatever index the clause names, the increase cannot exceed the IRAV for the reference month, which is the latest month published on the update date. For a foreign landlord with a recent lease and a CPI clause, the IRAV is therefore the real ceiling, now combined with the temporary 2% cap.`;
  },
  faqs: (h) => {
    const s = h.D.serieIravEs();
    return [
      { q: 'Can a lease signed in 2022 be updated with the IRAV?', a: `Only if its clause provides for an update without naming an index, or names the IRAV. A lease from before 26 May 2023 with a CPI clause keeps the CPI and is not capped by the IRAV. Note that the IRAV only exists from ${h.mois(s[0].p)}: an update referring to an earlier month cannot use it.` },
      { q: 'Does the IRAV ever exceed the CPI?', a: 'The table on this page shows both figures month by month. In any month where the IRAV is higher, a recent lease with a CPI clause simply goes up by the CPI, because the IRAV is a ceiling, not a target. Check which of the two was lower for the reference month of your anniversary before accepting a notice.' },
      { q: 'Where can I check the IRAV figure my landlord used?', a: 'On the INE website, which publishes the IRAV with its monthly consumer price release, around the middle of the following month. The tenant can also ask for an INE certificate with the notice of increase. This page uses INE series IRAV1, national total, annual change, read on 24 October 2026.' },
    ];
  },
  body: (h) => {
    const s = h.D.serieIravEs();
    const rows = [...s].reverse().map((o) => [h.mois(o.p), h.pc(o.v), h.pc(h.D.IPC_ES[o.p], 1)]);
    return `<h2>All published IRAV values</h2>
${h.table(['Month', 'IRAV', 'CPI (IPC)'], rows, `Source: INE, series IRAV1 and IPC290750, read on 24 October 2026. Method: ${h.src('ineIrav')}.`, ['l', 'r', 'r'])}
<h2>The IRAV and the 2% cap together</h2>
<p>Royal Decree-law 29/2026 did not replace the IRAV; it added a second ceiling. For anniversaries between 8 October 2026 and 31 December 2027, a lease signed from 26 May 2023 goes up by the lowest of three figures: its own index, the IRAV and 2% (or a newly agreed rate). If the rent is above the area’s reference price, nothing at all. See ${h.a('es-limite', 'the 2% cap and the freeze')} and the legal text in ${h.src('boeLau', 'the Urban Leases Act, article 18')}.</p>
<p>Back to ${h.a('es-home', 'the annual rent update in Spain')}, or compare ${h.a('es-subida', 'CPI, IRAV and 2% for your rent')}.</p>`;
  },
};
export default t;
