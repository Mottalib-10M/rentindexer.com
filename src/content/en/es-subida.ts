import type { PageText } from '../../lib/types';

/** Spain: the same rent with CPI, IRAV and the 2% cap. */
const t: PageText = {
  slug: 'spain-rent-increase-cpi',
  nav: 'Rent increase: CPI vs IRAV vs 2%',
  card: 'Your Spanish rent with the CPI, with the IRAV and with the 2% cap, in euros a month and a year, and which one your lease gets.',
  title: 'Rent increase by CPI in Spain: CPI, IRAV or 2% compared',
  description: 'Rent increase by CPI in Spain compared with the IRAV and the 2% cap: the three figures for the same rent, in euros a month and a year, and which applies to you.',
  h1: 'Spanish rent increase: CPI, IRAV or 2%, side by side',
  intro: 'Enter your rent and the date the lease was signed: you get the increase under each index and, on the last line, the one that applies.',
  resume: (h) => {
    const d = h.D.dernierEs();
    const r = (p: number) => Math.round(1500 * p) / 100;
    return `For the same Spanish rent there are, right now, three possible annual increases. With INE’s latest month, ${h.mois(d.p)}, a rent of €1,500 a month would rise by ${h.eur(r(d.ipc))} with the general CPI (${h.pc(d.ipc, 1)}), by ${h.eur(r(d.irav!))} with the IRAV (${h.pc(d.irav!)}) and by €30.00 with the 2% cap. Over a year, the gap between the CPI and the cap is ${h.eur(Math.round(1500 * 12 * (d.ipc - 2)) / 100)}. Two dates decide which figure is yours. The signing date decides whether the IRAV caps a CPI clause: it does for leases signed on or after 26 May 2023. The anniversary date decides whether Royal Decree-law 29/2026 applies: between 8 October 2026 and 31 December 2027, without a new agreement, no update exceeds 2%, and a rent above the area’s reference price does not rise at all. Outside that window, an older lease with a CPI clause takes the full CPI. The comparison tool runs these checks with your own figures.`;
  },
  faqs: () => [
    { q: 'Can my landlord switch my lease from the IRAV to the CPI because it is higher?', a: 'No. The index is the one in the lease; a clause without a named index means the IRAV by law. Changing it needs both parties’ agreement. During the decree-law period the parties may agree a new increase, but for a lease signed from 26 May 2023 any such agreement is still capped by the IRAV.' },
    { q: 'Does the 2% cap mean my rent must go up 2%?', a: 'No. It is a maximum. If your lease index for the reference month is below 2%, you pay the lower figure. If your lease has no update clause at all, there is no increase whatever the cap says. And if your landlord does not send a written notice, the updated rent is not payable.' },
    { q: 'Is the 2% applied to service charges and utilities too?', a: 'The update applies to the rent agreed in the lease. Community fees, utilities or other costs passed on separately follow their own clauses and actual bills. When you compare the three figures, enter only the rent itself, not the total you transfer each month, or the result will overstate the increase.' },
  ],
  body: (h) => {
    const d = h.D.dernierEs();
    const rows = [700, 1000, 1500, 2200].map((r) => [h.eur(r, 0), h.eur(Math.round(r * d.ipc) / 100), h.eur(Math.round(r * d.irav!) / 100), h.eur(Math.round(r * 2) / 100), h.eur(Math.round(r * 12 * (d.ipc - 2)) / 100)]);
    return `<h2>Monthly increase with ${h.mois(d.p)} figures</h2>
${h.table(['Current rent', `CPI (${h.pc(d.ipc, 1)})`, `IRAV (${h.pc(d.irav!)})`, '2% cap', 'CPI minus cap, per year'], rows, `Increase in euros a month, rounded to the cent. Indices: ${h.src('ineIpc', 'INE CPI')}, ${h.src('ineIrav', 'INE IRAV')}.`, ['r', 'r', 'r', 'r', 'r'])}
<p>The last column shows what the decree-law is worth to a tenant with an older CPI lease, or what it costs the landlord, over twelve months.</p>
<h2>A cap that may not last</h2>
<p>The 2% comes from ${h.src('boeRdl29', 'Royal Decree-law 29/2026')}, in force since 8 October 2026 and awaiting confirmation by the Spanish Congress. If it is not confirmed, the third column would no longer apply to later anniversaries. Details in ${h.a('es-limite', 'the 2% cap and the rent freeze')}; month by month in ${h.a('es-ipc26', 'the CPI for 2026 anniversaries')}.</p>`;
  },
};
export default t;
