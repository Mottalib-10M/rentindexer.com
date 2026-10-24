import type { PageText, Helpers } from '../../lib/types';

/** Austria: residential rent indexation under the MieWeG (Wertsicherung), for foreign tenants and landlords. */
const avg = (h: Helpers, j: number) => h.D.vpiIn(2020, String(j));

const t: PageText = {
  slug: 'austria-rent-indexation',
  nav: 'Rent indexation in Austria',
  card: 'How Austrian flat rents are indexed since 2026 under the MieWeG: one date a year, annual CPI averages, half above 3% and caps for regulated rents.',
  title: 'MieWeG rent indexation in Austria: the 1 April adjustment',
  description: 'MieWeG rent indexation in Austria: one adjustment on 1 April from the annual CPI average, half above 3%, 1% and 2% caps on regulated rents, first year pro rata.',
  h1: 'Austrian rent indexation under the MieWeG',
  intro: 'Enter the rent, the year of adjustment and the reference month: the tool applies the MieWeG calculation model.',
  resume: (h) => {
    const a = avg(h, 2025)!, b = avg(h, 2024)!;
    const p = h.E.mieWegProzent(a, b, { jahr: 2025, mrgBeschraenkt: false }), pm = h.E.mieWegProzent(a, b, { jahr: 2025, mrgBeschraenkt: true });
    return `Since 1 January 2026, Austria’s Rent Value-Protection Act (Mieten-Wertsicherungsgesetz, MieWeG, Federal Law Gazette I 114/2025) limits every index clause (Wertsicherung) in leases of flats covered by the Tenancy Act (MRG). Whatever the clause says, the rent can only change once a year, on 1 April, by the average change in the consumer price index (VPI) over the previous calendar year, comparing annual averages. Any part of that change above 3% counts only by half. For 1 April 2026 the annual averages of the VPI 2020 were ${h.num(a, 1)} for 2025 and ${h.num(b, 1)} for 2024, a change of ${h.pc((a / b - 1) * 100)}, of which ${h.pc(p)} counts. Flats under MRG rent controls, such as reference-value (Richtwert) or category rents, are capped further: at most 1% for 2025 and 2% for 2026, so ${h.pc(pm)} in April 2026. The first adjustment after signing counts only the full months since signing, and the new rent is rounded to the cent. The April 2027 figure depends on the 2026 average, due from Statistik Austria in January 2027.`;
  },
  faqs: () => [
    { q: 'Does the MieWeG apply to my Vienna lease signed in 2020?', a: 'Yes, for increases from 1 January 2026 onwards. The transitional rule in section 4 applies the calculation model to older leases too. If the rent has already been indexed, the reference point becomes the month of the index value used for the last adjustment. From then on, the rent follows the 1 April rhythm.' },
    { q: 'My lease says the rent rises when the index moves by 5%: is that still valid?', a: 'The clause stays in the lease, but for flats covered by the MRG the Act caps its effect. An increase cannot come earlier or be larger than the model allows: only on 1 April, and only up to the model’s result. The Act also caps fixed yearly increases written as an amount or a percentage, unless they have a reason other than value protection.' },
    { q: 'Are business premises in Austria covered by the MieWeG?', a: 'No. The Act limits value protection in leases of flats (Wohnungsmietverträge) within the MRG. Shops, offices and other business premises keep the index clause as agreed, typically the VPI with a threshold. Non-profit housing under the WGG is also excluded, except where the rent follows section 13(4) WGG.' },
  ],
  body: (h) => {
    const a = avg(h, 2025)!, b = avg(h, 2024)!;
    const p = h.E.mieWegProzent(a, b, { jahr: 2025, mrgBeschraenkt: false }), pm = h.E.mieWegProzent(a, b, { jahr: 2025, mrgBeschraenkt: true });
    const p9 = h.E.mieWegProzent(a, b, { jahr: 2025, mrgBeschraenkt: false, ersteValorisierungMonate: 9 });
    const rows = [700, 1000, 1400].map((m) => [h.eur(m), h.eur(h.E.valorisierenAt(m, p).nouveauLoyer), h.eur(h.E.valorisierenAt(m, pm).nouveauLoyer)]);
    return `<h2>1 April 2026 in figures</h2>
${h.table(['Net main rent', 'Free rent', 'MRG rent control'], rows, `Counted change: ${h.pc(p)} without, ${h.pc(pm)} with rent control. VPI from ${h.src('statistikVpi', 'Statistik Austria')}.`, ['r', 'r', 'r'])}
<h2>The first adjustment</h2>
<p>A lease signed in March 2025 is first adjusted on 1 April 2026, the 1 April of the first full calendar year after signing. Nine full months of 2025 passed after signing, so only nine twelfths of the change count: ${h.pc(p9)}. For leases signed before 2026 that have already been indexed, the Act lets the first adjustment under the new model also count months of earlier years; the tool does not compute that case.</p>
<h2>Old clauses that were invalid</h2>
<p>For leases signed before 2026, section 4(3) limits claims to recover payments under an invalid index clause to the last five years before the lease ended or, if it is still running, before the tenant learned of the invalidity, with a three-year limitation period from that knowledge. It does not apply to claims filed in court before 2026 or to abusive clauses. Read the text in ${h.src('risMieWeG', 'the MieWeG')} and the ${h.src('risMrg', 'Tenancy Act')}; for a real case, a tenants’ advice centre or an Austrian lawyer can help.</p>
<p>For index clauses outside the MieWeG, see ${h.a('at-vpi', 'the Austrian CPI and value-clause calculator')}.</p>`;
  },
};
export default t;
