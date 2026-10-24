import type { PageText } from '../../lib/types';

/** Spain: which CPI month applies to each 2026 anniversary. */
const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
const ref = (m: number) => (m <= 2 ? ym(2025, m + 10) : ym(2026, m - 2));

const t: PageText = {
  slug: 'spain-cpi-rent',
  nav: 'CPI for Spanish rents in 2026',
  card: 'The CPI and IRAV month that applies to each lease anniversary in 2026, and when the 2% cap starts.',
  title: 'CPI for rent in Spain 2026: the month for each anniversary',
  description: 'CPI (IPC) for Spanish rents in 2026: the index month that applies to each anniversary, the IPC and IRAV values, and the 2% cap from 8 October 2026 onwards.',
  h1: 'Spanish rent and the CPI in 2026: which month applies',
  intro: 'Pick the month your lease has its anniversary in 2026: the tool takes the last CPI published on that day and applies the caps.',
  resume: (h) => {
    const d = h.D.dernierEs();
    return `A Spanish rent update does not use the CPI of the anniversary month. The Urban Leases Act points to the latest index published on the update date, and INE publishes each month around the middle of the next one. An update on the first of the month therefore uses the figure from two months earlier: a January 2026 anniversary used the November 2025 CPI (${h.pc(h.D.IPC_ES['2025-11'], 1)}), a May anniversary the March figure (${h.pc(h.D.IPC_ES['2026-03'], 1)}), and a November anniversary the September figure (${h.pc(h.D.IPC_ES['2026-09'], 1)}). The most recent month published is ${h.mois(d.p)}. 2026 splits into two parts. Until 7 October, only the lease’s own index applied, capped by the IRAV for leases signed from 26 May 2023. From 8 October 2026, Royal Decree-law 29/2026 adds a 2% ceiling without a new agreement, and a full freeze where the rent is above the area’s reference price. An anniversary on 1 October missed the cap by a week.`;
  },
  faqs: () => [
    { q: 'My anniversary is mid-month: does a different CPI month apply?', a: 'Possibly. The rule is the latest index published on the update date. If your lease runs from the 20th and INE released the previous month’s figure around mid-month, before your date, that month is already available, so the reference is one month later than in the table. Check the INE release date for your month before writing the notice.' },
    { q: 'Is a December 2026 update already calculable?', a: 'Not yet. A 1 December anniversary uses the October 2026 figures, which INE publishes around mid-November 2026. Until then the tool says the figure is not out. What is already known is the ceiling: without a new agreement, a December 2026 update cannot exceed 2% under the decree-law, and it is zero if the rent is above the reference price.' },
    { q: 'I missed my landlord’s update notice in spring: can it be applied now?', a: 'The updated rent is only payable from the month after a written notice, so a spring update notified in the autumn does not make the past months payable. Which index month should then be used is a point lawyers can argue about; if the amount at stake matters to you, get advice before paying or claiming arrears.' },
  ],
  body: (h) => {
    const rows = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
      const r = ref(m);
      const ok = h.D.IPC_ES[r] !== undefined && h.D.IRAV_ES[r] !== undefined;
      const x = ok ? h.E.actualizarEs({ renta: 1000, fechaContrato: '2024-06-01', fechaActualizacion: `${ym(2026, m)}-01`, ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: r, pacto: 'ipc', rdl29Vigente: true }) : null;
      return [h.mois(ym(2026, m)), h.mois(r), ok ? h.pc(h.D.IPC_ES[r], 1) : 'not out yet', ok ? h.pc(h.D.IRAV_ES[r]) : 'not out yet', x ? h.pc(x.taux) : 'not out yet'];
    });
    return `<h2>The twelve anniversaries of 2026</h2>
${h.table(['Anniversary on the 1st', 'Reference month', 'CPI', 'IRAV', 'Increase, 2024 lease with CPI clause'], rows, 'INE data read on 24 October 2026. No new agreement; rent not above the reference price.', ['l', 'l', 'r', 'r', 'r'])}
<p>The last column is a lease signed in June 2024 with a CPI clause: capped by the IRAV all year, and by 2% from the November anniversary. A lease signed before 26 May 2023 would take the full CPI up to October, then 2%.</p>
<h2>Sources and next steps</h2>
<p>The rule on the reference month is in ${h.src('boeLau', 'article 18 of the Urban Leases Act')}; the CPI figures are on the ${h.src('ineIpc', 'INE latest-data page')}. For the cap and its legal status, see ${h.a('es-limite', 'the 2% cap until 2027')}; for the index itself, ${h.a('es-irav', 'the IRAV series')}.</p>`;
  },
};
export default t;
