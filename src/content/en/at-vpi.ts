import type { PageText, Helpers } from '../../lib/types';

/** Austria: the VPI consumer price index, chaining of bases and index-linking an amount. */
const ws = (h: Helpers, b: number, von: string, bis: string) => h.E.wertsichernAt(b, h.D.vpi(von)!.wert, h.D.vpi(bis)!.wert, h.D.verkettungZwischen(von, bis));

const t: PageText = {
  slug: 'austria-cpi-vpi',
  nav: 'Austrian CPI (VPI)',
  card: 'Austria’s consumer price index (VPI 2020 and VPI 2025), the factors that chain older bases and an index-linked amount with a threshold.',
  title: 'VPI index Austria: CPI values, chaining and value clauses',
  description: 'VPI, the Austrian consumer price index from Statistik Austria: latest monthly values, chain factors between the 2010, 2015, 2020 and 2025 bases, value clauses.',
  h1: 'The Austrian consumer price index (VPI) and value clauses',
  intro: 'Pick the starting month from the contract and the comparison month: the tool chains the bases and checks the threshold.',
  resume: (h) => {
    const l = h.D.letzterVpi();
    const w = ws(h, 5000, '2018-01', l.m);
    return `Most Austrian value-protection clauses (Wertsicherungsklauseln) in leases, ground rents, maintenance agreements or instalment prices are linked to the consumer price index, the Verbraucherpreisindex or VPI, published by Statistik Austria. The latest monthly value is for ${h.mois(l.m)}: ${h.num(l.wert, 1)} on the ${l.basis} base. Since the January 2026 data, a VPI 2025 base exists; the VPI 2020 series used here runs to December 2025 and its 2025 annual average is ${h.num(h.D.vpiIn(2020, '2025')!, 1)}. When a contract names an older base, values are chained with factors: ${h.num(h.D.VERKETTUNG[2025], 3)} from VPI 2020 to VPI 2025, ${h.num(h.D.VERKETTUNG[2020], 3)} from VPI 2015 to VPI 2020 and ${h.num(h.D.VERKETTUNG[2015], 3)} from VPI 2010 to VPI 2015. As an example, €5,000 with January 2018 as the starting month equals ${h.eur(w.betrag)} in ${h.mois(l.m)}, up ${h.pc(w.prozent)}. Many clauses add a threshold, often 5%, and adjust only once it is crossed. For flats covered by the Tenancy Act, the 2026 MieWeG caps the result further.`;
  },
  faqs: (h) => [
    { q: 'How does a 5% threshold in an Austrian value clause work?', a: 'The amount stays the same until the index has risen by more than the threshold compared with the starting value. It is then adjusted by the whole change, and the new index value usually becomes the next starting point. The exact mechanics are in the clause itself; enter the threshold in the tool to see whether it has been reached.' },
    { q: 'My contract refers to the VPI 2015: can I still use it?', a: `Yes, by chaining. For months from 2021 the tool multiplies by ${h.num(h.D.VERKETTUNG[2020], 3)} to reach the 2020 base and, from 2026, by ${h.num(h.D.VERKETTUNG[2025], 3)} to reach the 2025 base. The factors used appear in the result, so the calculation can be checked line by line.` },
    { q: 'Should I use this tool for my flat’s rent?', a: 'Only to see what the clause alone would give. For flats covered by the MRG, the MieWeG has limited value clauses since 1 January 2026: adjustment only on 1 April, based on annual averages, with half of any part above 3%. Use the MieWeG tool for that; this one is for business leases, maintenance and other amounts.' },
  ],
  body: (h) => {
    const l = h.D.letzterVpi();
    const m26 = h.D.monateVpi().filter((m) => m.startsWith('2026')).sort().reverse().map((m) => [h.mois(m), h.num(h.D.vpiIn(2025, m)!, 1)]);
    const ex = ['2015-01', '2020-01', '2023-01'].map((m) => { const w = ws(h, 1000, m, l.m); return [h.mois(m), `VPI ${h.D.vpi(m)!.basis}`, h.num(w.faktor, 4), h.eur(w.betrag)]; });
    return `<h2>VPI 2025 monthly values in 2026</h2>
${h.table(['Month', 'VPI 2025'], m26, `Source: ${h.src('statistikVpi', 'Statistik Austria')}, read on 24 October 2026, licence CC BY 4.0.`, ['l', 'r'])}
<h2>€1,000 index-linked to ${h.mois(l.m)}</h2>
${h.table(['Starting month', 'Base', 'Factor', 'Amount'], ex, 'Comparison index / starting index × chain factors, rounded to the cent.', ['l', 'l', 'r', 'r'])}
<h2>Reading a value clause</h2>
<p>Before calculating, find four things in the contract: the index named (VPI 2010, 2015, 2020 or simply “the VPI”), the starting month or base value, any threshold, and whether the new index value becomes the next starting point after each adjustment. Some clauses use the index “published for” a month, others the month of signing. If the clause is silent on a point, the contract as a whole or local practice decides, and a notary or lawyer can help.</p>
<p>Flat rents follow the ${h.src('risMieWeG', 'Rent Value-Protection Act')} since 2026: see ${h.a('at-home', 'rent indexation in Austria')}. For a comparable linking method in Italy, see ${h.a('it-rival', 'monetary revaluation in Italy')}.</p>`;
  },
};
export default t;
