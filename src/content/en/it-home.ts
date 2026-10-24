import type { PageText, Helpers } from '../../lib/types';

/** Italy: Istat revaluation of a sum between two months with the FOI index. */
const riv = (h: Helpers, imp: number, da: string, a: string) => ({ ...h.E.rivalutaIt(imp, h.D.foi(da)!.indice, h.D.foi(a)!.indice, h.D.raccordiTra(da, a)), fd: h.D.foi(da)!, fa: h.D.foi(a)! });

const t: PageText = {
  slug: 'italy-istat-revaluation',
  nav: 'Istat revaluation (Italy)',
  card: 'Revalue an amount between two months with Italy’s FOI index, using Istat’s base-linking coefficients and official rounding.',
  title: 'Istat revaluation in Italy: FOI index between two months',
  description: 'Istat revaluation (rivalutazione Istat) of an amount between two months with the FOI index excluding tobacco: base-linking coefficients, method and examples.',
  h1: 'Istat revaluation: bringing an amount up to date with the FOI index',
  intro: 'Choose the amount, the starting month and the target month: the tool applies the FOI indices and the linking coefficients Istat prescribes.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const e = riv(h, 1000, '2009-01', '2026-01');
    return `In Italy, sums of money are brought up to date (rivalutazione) with one index: the consumer price index for blue- and white-collar households excluding tobacco, known as FOI senza tabacchi, published monthly by the statistics office Istat. It is the index behind rent updates, maintenance allowances and court-ordered revaluations. The latest value is for ${h.mois(u.m)}: ${h.num(u.indice, 1)} on the 2025 base, ${h.pc(u.varAnno!, 1)} up on a year earlier. The revaluation coefficient is the target month’s index divided by the starting month’s, multiplied by a linking coefficient for each change of base in between: ${h.num(h.D.RACCORDI[2010], 3)} (1995 to 2010 base), ${h.num(h.D.RACCORDI[2015], 3)} (2010 to 2015) and ${h.num(h.D.RACCORDI[2025], 3)} (2015 to the new 2025 base used since January 2026). The result is rounded to three decimals. Istat’s own example: January 2009 to January 2026 gives a coefficient of ${h.num(e.coefficiente, 3)}, an increase of ${h.pc(e.variazione, 1)}. Rents use the same index, but often only 75% of its change.`;
  },
  faqs: (h) => [
    { q: 'Why does the January 2026 FOI look lower than December 2025?', a: `Because the base changed. From January 2026 Istat publishes the index with 2025 = 100, so January 2026 reads ${h.num(h.D.foi('2026-01')!.indice, 1)} while December 2025, on the 2015 base, reads ${h.num(h.D.foi('2025-12')!.indice, 1)}. Prices did not fall. Comparing the two requires the linking coefficient ${h.num(h.D.RACCORDI[2025], 3)}, which the tool applies for you.` },
    { q: 'Does an Istat revaluation include interest?', a: 'No. It only measures the loss of purchasing power of money between two months. Interest, where due, is calculated separately according to the contract, the court decision or the applicable rules. This page does not calculate interest and does not say whether it should be added to a revalued sum, as that depends on the type of claim.' },
    { q: 'Which Istat index should I use if my contract just says “Istat”?', a: 'For revaluing money, Istat itself points to the FOI excluding tobacco, published in the Official Gazette under article 81 of Law 392/1978. Other Istat price indices, such as the NIC or the HICP, serve other purposes. If your contract names a different index, a different month or a share of the change, follow the contract.' },
  ],
  body: (h) => {
    const u = h.D.ultimoFoi();
    const rows = ['2010-01', '2015-01', '2020-01', '2023-01', '2025-01'].map((m) => { const r = riv(h, 1000, m, u.m); return [h.mois(m), h.num(r.fd.indice, 1), `base ${r.fd.base}`, h.num(r.coefficiente, 3), h.eur(r.rivalutato)]; });
    return `<h2>€1,000 revalued to ${h.mois(u.m)}</h2>
${h.table(['Starting month', 'FOI index', 'Base', 'Coefficient', 'Revalued'], rows, `FOI excluding tobacco and linking coefficients from ${h.src('istatFoi', 'Istat')}; ${h.src('istatRivaluta', 'Istat Rivaluta service')}.`, ['l', 'r', 'l', 'r', 'r'])}
<h2>The method in four steps</h2>
<ol>
<li>Read the FOI excluding tobacco for the starting month and the target month, each on its own base.</li>
<li>Divide the target index by the starting index.</li>
<li>Multiply by one linking coefficient per change of base in the period.</li>
<li>Round to three decimals, then multiply the amount by that coefficient.</li>
</ol>
<p>Istat asks for the calculation to be done in one go, without intermediate rounding; the tool follows that rule and covers months from January 1996 onwards.</p>
<h2>Where this is used</h2>
<p>Annual rent updates use the twelve-month change of the same index, at 75% or 100% depending on the lease: see ${h.a('it-affitto', 'the Istat rent update')}. Child or spousal maintenance set by a court is usually adjusted to Istat indices from the month of the ruling: see ${h.a('it-assegno', 'the maintenance allowance update')}. For a debt or damages award, see ${h.a('it-rival', 'monetary revaluation of a claim')}; the monthly series is in ${h.a('it-foi', 'the FOI index')}.</p>`;
  },
};
export default t;
