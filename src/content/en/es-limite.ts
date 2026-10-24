import type { PageText } from '../../lib/types';

/** Spain: the caps on rent increases (IRAV, Royal Decree-law 29/2026, 2% until 31/12/2027). */
const t: PageText = {
  slug: 'spain-rent-cap',
  nav: 'Spanish rent cap until 2027',
  card: 'The legal limits on Spanish rent increases: the IRAV ceiling, the freeze above the reference price and the 2% cap until the end of 2027.',
  title: 'Rent cap in Spain: 2% limit and freeze until end of 2027',
  description: 'Rent cap in Spain: the 2% limit and the rent freeze of Royal Decree-law 29/2026 until 31 December 2027, the IRAV ceiling, who is covered and the decree status.',
  h1: 'The Spanish rent cap: 2%, the freeze and the IRAV ceiling',
  intro: 'Tick whether your rent is above the reference price index: the tool applies the ceiling that fits your anniversary date.',
  resume: (h) => {
    const d = h.D.dernierEs();
    return `Spanish residential rent increases currently face three ceilings, applied one after the other. The permanent one is in article 18 of the Urban Leases Act: for leases signed on or after 26 May 2023, the annual update can never exceed the IRAV index for the reference month (${h.pc(d.irav!)} for ${h.mois(d.p)}). The other two are temporary and come from the sixth final provision of Royal Decree-law 29/2026, published in the official gazette (BOE) on 7 October 2026 and in force since 8 October. For any annual update falling due between that date and 31 December 2027, a rent that is above the maximum price under the state reference price index system gets no increase at all. In every other case, the increase is whatever landlord and tenant newly agree and, without such an agreement, it cannot exceed 2%. A royal decree-law applies at once but must be confirmed by Congress. The BOE consolidated text showed no repeal on 24 October 2026; an identical earlier decree-law, 26/2026, was repealed on 2 October 2026.`;
  },
  faqs: () => [
    { q: 'How do I know if my Spanish rent is above the reference price?', a: 'The decree-law compares the rent with the maximum price that the state reference price index system gives for the property. That figure depends on the home and its location and must be looked up in the official system with the property details. This tool does not do the lookup; it asks you whether your rent is above that maximum.' },
    { q: 'Does the cap cover holiday lets or rooms?', a: 'The provision covers housing leases subject to the Urban Leases Act. Commercial leases, which follow what the contract says, are outside it. Whether a particular short let or room rental falls under the Act is a question about the contract itself; if you are unsure, a local lawyer or a tenants’ association can check the lease.' },
    { q: 'If the decree-law is repealed, do I get back the difference?', a: 'The decree-law says nothing about that case. If it were repealed, anniversaries after the repeal would go back to the article 18 rules: the lease’s index and, for recent leases, the IRAV ceiling. What happens to an update made while it was in force would depend on what is then published; in a dispute, take legal advice.' },
  ],
  body: (h) => {
    const ex = h.E.actualizarEs({ renta: 1400, fechaContrato: '2023-11-01', fechaActualizacion: '2026-11-01', ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: '2026-09', pacto: 'ipc', rdl29Vigente: true });
    const phases = [
      ['Up to 7 October 2026', 'Lease index; IRAV ceiling for leases from 26 May 2023'],
      ['8 October 2026 to 31 December 2027', 'Plus: no increase above the reference price; otherwise new agreement or 2% at most'],
      ['From 1 January 2028', 'Article 18 rules only, unless a new law says otherwise'],
    ];
    return `<h2>Three periods</h2>
${h.table(['Anniversary', 'Ceiling on the increase'], phases, `Sources: ${h.src('boeLau')}; ${h.src('boeRdl29')}.`, ['l', 'l'])}
<h2>Example</h2>
<p>A lease signed in November 2023 with a CPI clause and a rent of €1,400 has its anniversary on 1 November 2026. Reference month: ${h.mois('2026-09')}, CPI ${h.pc(h.D.IPC_ES['2026-09'], 1)}, IRAV ${h.pc(h.D.IRAV_ES['2026-09'])}. If the rent is within the reference price and there is no new agreement, the increase is ${h.pc(ex.taux)}: the new rent is ${h.eur(ex.nouveauLoyer)}. If the rent is above the reference price, it stays at €1,400.00.</p>
<h2>What the cap does not do</h2>
<p>It does not create an update where the lease has none, it does not make 2% compulsory, and it does not apply to shops or offices. The notice rule still applies: the updated rent is payable from the month after a written notice stating the percentage. For the general method, see ${h.a('es-home', 'the annual rent update in Spain')}; for the index values, ${h.a('es-irav', 'the IRAV series')}.</p>`;
  },
};
export default t;
