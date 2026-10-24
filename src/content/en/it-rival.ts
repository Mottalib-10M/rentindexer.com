import type { PageText, Helpers } from '../../lib/types';

/** Italy: monetary revaluation of a claim (debt, damages, price). */
const riv = (h: Helpers, imp: number, da: string, a: string) => h.E.rivalutaIt(imp, h.D.foi(da)!.indice, h.D.foi(a)!.indice, h.D.raccordiTra(da, a));

const t: PageText = {
  slug: 'italy-monetary-revaluation',
  nav: 'Monetary revaluation (Italy)',
  card: 'Revalue an Italian debt, damages award or price from the month it was due to today with the Istat coefficient.',
  title: 'Monetary revaluation of a claim in Italy with the FOI',
  description: 'Monetary revaluation (rivalutazione monetaria) of an Italian debt, damages award or price: the Istat coefficient between two months, examples and its limits.',
  h1: 'Monetary revaluation of an Italian claim',
  intro: 'Enter the amount, the month it was due and the target month: the result is the same sum in money of that month.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const r = riv(h, 20000, '2019-06', u.m);
    return `Foreign creditors, heirs and buyers dealing with Italy often meet the phrase rivalutazione monetaria: a sum fixed in one month, restated in the money of a later month. It applies, for example, to unpaid debts, damages assessed long before payment, a price or penalty to bring up to date, or a deposit to return. The calculation follows Istat’s method: divide the FOI index excluding tobacco of the target month by that of the starting month, multiply by the base-linking coefficients if the period crosses a base change, and round to three decimals. With current data, €20,000 from June 2019 is worth ${h.eur(r.rivalutato)} in ${h.mois(u.m)}, a coefficient of ${h.num(r.coefficiente, 3)} (${h.pc(r.variazione, 1)}). This is only the purchasing-power adjustment. Whether revaluation is due at all, from which date and whether interest is added on top are legal questions that depend on the contract, the judgment or the rule behind the claim, and this tool does not answer them.`;
  },
  faqs: (h) => [
    { q: 'Which starting month should I pick for an unpaid invoice?', a: 'Usually the month the payment fell due, or a date set in the contract or judgment. For damages it is often the date of the event or the date the court valued the loss. The tool accepts any month from January 1996. If the amount is disputed in court, the judge’s instructions on dates prevail over any general rule.' },
    { q: 'How do I revalue an old amount in lire?', a: 'Convert it to euros at the fixed rate of 1,936.27 lire per euro, then revalue the euro amount, as in Istat’s own worked example. The order does not change the result, since both are multiplications. For months before January 1996 the tool does not apply; Istat’s methodological note gives the extra coefficients needed for earlier bases.' },
    { q: 'Why is the coefficient more precise than the percentage?', a: `Istat rounds the coefficient to three decimals and the percentage change to one. On large sums the difference shows: the coefficient for June 2019 to ${h.mois(h.D.ultimoFoi().m)} is ${h.num(riv(h, 1, '2019-06', h.D.ultimoFoi().m).coefficiente, 3)}, while the rounded percentage loses a digit. Istat accepts both routes, and the tool uses the coefficient.` },
  ],
  body: (h) => {
    const u = h.D.ultimoFoi();
    const rows = ['2000-01', '2008-01', '2012-01', '2018-01', '2021-01', '2024-01'].map((m) => { const r = riv(h, 10000, m, u.m); return [h.mois(m), h.D.raccordiTra(m, u.m).map((c) => h.num(c, 3)).join(' × ') || '–', h.num(r.coefficiente, 3), h.eur(r.rivalutato)]; });
    return `<h2>€10,000 from different months, revalued to ${h.mois(u.m)}</h2>
${h.table(['Starting month', 'Linking coefficients', 'Coefficient', 'Revalued amount'], rows, `FOI excluding tobacco; coefficients from the ${h.src('istatRivaluta', 'Istat Rivaluta service')}.`, ['l', 'l', 'r', 'r'])}
<h2>What the calculation leaves out</h2>
<ul>
<li>Interest of any kind, which follows its own rules.</li>
<li>Whether the claim is revaluable at all: some debts are by law or judgment, others are not.</li>
<li>Reduced shares: a commercial rent at 75% is updated year by year, see ${h.a('it-affitto', 'the Istat rent update')}.</li>
</ul>
<p>The method and the base-linking coefficients are explained in ${h.a('it-home', 'the Istat revaluation')}, based on the ${h.src('istatFoi', 'Istat methodological note')}. For a maintenance allowance, see ${h.a('it-assegno', 'the allowance update')}. For a real dispute, an Italian lawyer is the right person to fix the dates.</p>`;
  },
};
export default t;
