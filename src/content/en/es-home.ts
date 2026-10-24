import type { PageText, Helpers } from '../../lib/types';

/** Spain, overview for foreign tenants and landlords: annual rent update by CPI (IPC) or IRAV, and the 2% cap. */
const act = (h: Helpers, firma: string, fecha: string, ref: string, pacto: 'ipc' | 'irav') =>
  h.E.actualizarEs({ renta: 1200, fechaContrato: firma, fechaActualizacion: fecha, ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: ref, pacto, rdl29Vigente: true });

const t: PageText = {
  slug: 'spain-rent-update',
  nav: 'Rent update in Spain',
  card: 'How a Spanish residential lease is updated each year: CPI (IPC) or IRAV, the lease date that decides, and the 2% cap until 2027.',
  title: 'IPC or IRAV rent update in Spain: rules and 2% cap to 2027',
  description: 'Annual rent update in Spain for expats: when the CPI (IPC) or the IRAV index applies, which month counts, the 2% cap of Decree-law 29/2026 and the notice.',
  h1: 'Annual rent update in Spain: CPI, IRAV and the 2% cap',
  intro: 'Enter the rent, the month and year the lease was signed and what its update clause says: the tool picks the INE index and applies the caps.',
  resume: (h) => {
    const d = h.D.dernierEs();
    return `In Spain a residential rent can only go up once a year, on the lease anniversary, and only if the lease has an update clause (actualización de la renta). The latest figures from the national statistics office, INE, are for ${h.mois(d.p)}: the general consumer price index (IPC) is up ${h.pc(d.ipc, 1)} on a year earlier and the IRAV, an index created specifically for housing leases, is up ${h.pc(d.irav!)}. Which one applies depends on the lease. With no clause at all, the rent stays the same. A clause that mentions an update but names no index means the IRAV. For leases signed on or after 26 May 2023, the increase can never exceed the IRAV, even if the clause says CPI. On top of that, Royal Decree-law 29/2026, in force since 8 October 2026, caps updates falling due until 31 December 2027: no increase at all if the rent is above the official reference price for the area, otherwise whatever the parties newly agree or, failing that, 2% at most. Parliament still has to confirm the decree-law.`;
  },
  faqs: (h) => {
    const d = h.D.dernierEs();
    return [
      { q: 'My Spanish landlord wants to raise my rent by the CPI in November 2026: is that allowed?', a: `Only up to 2%, unless you agree otherwise. A November 2026 anniversary falls inside the period of Royal Decree-law 29/2026, which limits any update without a new agreement to 2%. The CPI that would apply, ${h.mois('2026-09')}, is ${h.pc(h.D.IPC_ES['2026-09'], 1)}. If your rent is above the reference price index for the area, there is no increase at all.` },
      { q: 'How must a Spanish landlord tell me about the rent update?', a: 'In writing, stating the percentage applied. Article 18 of the Urban Leases Act makes the updated rent payable from the month after that notice, and a note on the previous month’s receipt is enough. You can ask for the INE certificate showing the index. A late notice does not allow the landlord to back-date the increase to the anniversary.' },
      { q: 'Which index month counts for an update on 1 January 2027?', a: `The last one published on that date. INE releases each month’s figures around the middle of the following month, so on 1 January 2027 the latest available month will be ${h.mois('2026-11')}, not yet published today. The tool shows “not out yet” until INE releases it, and never estimates a figure. Your update would still be capped at 2% under the decree-law.` },
    ];
  },
  body: (h) => {
    const d = h.D.dernierEs();
    const a = act(h, '2021-11-01', '2026-11-01', '2026-09', 'ipc');
    const b = act(h, '2023-09-01', '2026-09-01', '2026-07', 'ipc');
    const rows = [
      ['No update clause', 'Rent stays the same', 'Rent stays the same'],
      ['Clause, no index named', 'IRAV', 'IRAV, at most 2%'],
      ['CPI clause, signed before 26 May 2023', 'CPI', 'CPI, at most 2%'],
      ['CPI clause, signed from 26 May 2023', 'CPI, at most the IRAV', 'Lowest of CPI, IRAV and 2%'],
    ];
    return `<h2>What applies to your lease</h2>
${h.table(['Lease', 'Anniversary up to 7 Oct 2026', 'Anniversary 8 Oct 2026 to 31 Dec 2027'], rows, `Sources: ${h.src('boeLau')}; ${h.src('boeRdl29')}. Without a new agreement between the parties.`, ['l', 'l', 'l'])}
<p>A rent above the reference price set by the state reference index system gets no increase at all during the decree-law period. Commercial leases (shops, offices) are outside these rules: under the Act they follow what the contract says.</p>
<h2>Two worked examples</h2>
<p><strong>Lease signed November 2021, CPI clause, €1,200 a month, anniversary 1 November 2026.</strong> The latest index on that date is ${h.mois('2026-09')}: CPI ${h.pc(h.D.IPC_ES['2026-09'], 1)}. The lease predates May 2023, so the IRAV does not cap it, but the decree-law does: the rent becomes ${h.eur(a.nouveauLoyer)} (${h.pc(a.taux)}).</p>
<p><strong>Lease signed September 2023, CPI clause, €1,200, anniversary 1 September 2026.</strong> Reference month ${h.mois('2026-07')}: CPI ${h.pc(h.D.IPC_ES['2026-07'], 1)}, IRAV ${h.pc(h.D.IRAV_ES['2026-07'])}. The decree-law was not yet in force, but the IRAV cap applies because the lease is recent: ${h.eur(b.nouveauLoyer)}.</p>
<h2>The formula</h2>
<p>New rent = current rent × (1 + annual change of the index / 100), rounded to the cent. The annual change is the one INE publishes for the reference month; see the ${h.src('ineIpc', 'INE CPI release page')}. The latest month is ${h.mois(d.p)}.</p>
<p>More detail: ${h.a('es-irav', 'the IRAV index')}, ${h.a('es-ipc26', 'which CPI month applies in 2026')}, ${h.a('es-subida', 'CPI, IRAV and 2% side by side')} and ${h.a('es-limite', 'the 2% cap and the rent freeze')}. This page explains the law; for a dispute, a tenants’ or landlords’ association or a Spanish lawyer can read your lease.</p>`;
  },
};
export default t;
