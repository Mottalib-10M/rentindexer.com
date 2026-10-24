import type { PageText, Helpers } from '../../lib/types';

/** Italy: Istat update of a maintenance allowance. */
const riv = (h: Helpers, imp: number, da: string, a: string) => h.E.rivalutaIt(imp, h.D.foi(da)!.indice, h.D.foi(a)!.indice, h.D.raccordiTra(da, a));

const t: PageText = {
  slug: 'italy-maintenance-allowance',
  nav: 'Maintenance allowance update (Italy)',
  card: 'An Italian maintenance allowance brought up to date with Istat indices from the month of the court order.',
  title: 'Maintenance allowance Istat update in Italy: new amount',
  description: 'Istat update of an Italian maintenance allowance (assegno di mantenimento): the FOI index from the month of the court order, year by year, and what to check.',
  h1: 'Updating an Italian maintenance allowance with Istat indices',
  intro: 'Enter the allowance set by the court and the month of the order: the tool brings it to the month you choose with Istat’s FOI index.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const r = riv(h, 600, '2022-03', u.m);
    return `Italian court orders and separation agreements that set a maintenance allowance for a child or a spouse (assegno di mantenimento) commonly provide that it is adjusted to Istat indices. That means the FOI index excluding tobacco, the series Istat publishes for revaluing money, applied in full, not at the 75% some leases use. The starting point is the month of the order, or the month the order itself names, and the adjustment is usually made once a year, on the anniversary. The calculation is the allowance × target month index / starting month index, with the linking coefficient ${h.num(h.D.RACCORDI[2025], 3)} if the period crosses the January 2026 change of base. An allowance of €600 a month set in March 2022, brought to ${h.mois(u.m)}, becomes ${h.eur(r.rivalutato)}: coefficient ${h.num(r.coefficiente, 3)}, ${h.pc(r.variazione, 1)}. For parents living abroad and paying or receiving in euros, the same rule applies; if the order names another index, frequency or amount, the order prevails.`;
  },
  faqs: () => [
    { q: 'Does the receiving parent have to ask for the Istat adjustment each year?', a: 'It depends on the order. Where it provides for automatic adjustment to Istat indices, the updated amount is due without a new court decision, but it is sensible to send the paying parent the calculation and the months used, in writing. If the order says nothing about indexation, check with a lawyer before claiming a different amount.' },
    { q: 'Can past years of missed adjustments be claimed?', a: 'The tool lets you rebuild them: for each year, bring the allowance from the month of the order to that year’s anniversary month and compare it with what was paid. Whether, and how far back, the differences can still be claimed is a legal question that involves limitation periods; an Italian family lawyer should assess it.' },
    { q: 'I pay from abroad in another currency: which amount is indexed?', a: 'The euro amount set in the order. The Istat adjustment is calculated in euros, and the currency conversion of each payment is a separate matter, governed by the order or by how payments have been made. Enter the euro allowance in the tool; it does not handle exchange rates.' },
  ],
  body: (h) => {
    const rows = ['2023-03', '2024-03', '2025-03', '2026-03'].map((m) => { const r = riv(h, 600, '2022-03', m); return [h.mois(m), h.num(r.coefficiente, 3), h.pc(r.variazione, 1), h.eur(r.rivalutato)]; });
    return `<h2>A €600 allowance, year by year</h2>
${h.table(['Adjustment in', 'Coefficient from March 2022', 'Change', 'Allowance due'], rows, `FOI excluding tobacco (${h.src('istatFoi', 'Istat')}); 2015 to 2025 base link ${h.num(h.D.RACCORDI[2025], 3)}.`, ['l', 'r', 'r', 'r'])}
<p>Each row starts again from the original allowance and the month of the order, not from the previous year’s figure, so rounding does not build up. The result matches, within a few cents, an allowance updated every year with the twelve-month change.</p>
<h2>Check the order first</h2>
<ul>
<li>The starting month: usually the month of the order, sometimes a different date it sets.</li>
<li>The frequency: annual is the norm; another frequency changes the target month.</li>
<li>The index: unless the order says otherwise, the FOI excluding tobacco, see ${h.src('istatRivaluta', 'Istat Rivaluta')}.</li>
<li>Extraordinary expenses: not indexed with the allowance; they are shared as the order provides.</li>
</ul>
<p>The method is set out in ${h.a('it-home', 'the Istat revaluation')}. For the French equivalent, see ${h.a('fr-pension', 'child support indexation in France')}. This page explains a calculation, not your rights in a specific case.</p>`;
  },
};
export default t;
