import type { PageText } from '../../lib/types';

/** Belgian health index: monthly values, bases, release timing. */
const t: PageText = {
  slug: 'belgium-health-index',
  nav: 'Health index: monthly values',
  card: 'Monthly values of the Belgian health index used for rents, in base 2013 and base 2025, with the change between any two months.',
  title: 'Health index (gezondheidsindex, indice santé) month by month',
  description: 'Health index values from Statbel for the last twelve months, base 2013 and base 2025, when the next month is released, and the change between two months.',
  h1: 'The Belgian health index, month by month',
  intro: 'Choose the month you need and a month to compare it with: the tool shows both values, the change and, if you wish, an indexed amount.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const y = h.D.indiceSante(`${Number(d.p.slice(0, 4)) - 1}${d.p.slice(4)}`)!;
    const b25 = h.D.santeBase2025[d.p];
    return `The health index (gezondheidsindex in Dutch, indice santé in French) is the version of the Belgian consumer price index that leaves out tobacco, alcoholic drinks and motor fuel other than LPG. It has been the index for residential rents since 1994, and it also drives many other contracts. Statbel, the Belgian statistics office, publishes each month’s value at the end of that same month. The latest is ${h.mois(d.p)}: ${h.num(d.v)} in base 2013${b25 !== undefined ? `, or ${h.num(b25)} in the newer base 2025` : ''}. Over twelve months the index rose by ${h.pc((d.v / y - 1) * 100)}. The value for the following month is not yet published and is expected at the end of that month. For a rent, the month you need is never the month of the anniversary itself but the month before it, and the starting month is the month before signing or, in Flanders, before the start date. Rent formulas use base 2013 here; a ratio between two months is almost the same in any base.`;
  },
  faqs: () => [
    { q: 'Base 2013 or base 2025: which one goes into my rent calculation?', a: 'Use the same base for both months of the ratio. The rent calculators of the regions and of this site use base 2013, which covers every month since 1994. A ratio between two months gives practically the same result whatever the base, so a lease that cites an older base does not need converting, provided both values come from one series.' },
    { q: 'Can a landlord use the ordinary consumer price index instead?', a: 'Not for a residential lease. The Brussels and Walloon administrations state that rent indexation is always based on the health index, which has replaced the ordinary consumer price index for rents since 1994. Statbel publishes both series, with different values, so check the series name before copying a figure into a letter or a spreadsheet.' },
    { q: 'Can I reuse these index values on my own website or spreadsheet?', a: 'Statbel publishes its open data under the Creative Commons Attribution 4.0 licence (CC BY 4.0), which allows reuse provided Statbel is credited as the source. This site uses the series on that basis. The licence covers the figures, not any interpretation of rent law built on them.' },
  ],
  body: (h) => {
    const m = h.D.moisSante().slice(0, 12);
    const rows = m.map((p) => {
      const prev = h.D.indiceSante(`${Number(p.slice(0, 4)) - 1}${p.slice(4)}`);
      return [h.mois(p), h.num(h.D.indiceSante(p)!), h.D.santeBase2025[p] !== undefined ? h.num(h.D.santeBase2025[p]) : '–', prev ? h.pc((h.D.indiceSante(p)! / prev - 1) * 100) : '–'];
    });
    const d = h.D.dernierSante();
    const r = h.E.indexerBe(1000, h.D.indiceSante(m[11])!, d.v);
    return `<h2>The last twelve months</h2>
${h.table(['Month', 'Base 2013', 'Base 2025', 'Over one year'], rows, 'Source: Statbel, health index, read on 24 October 2026.', ['l', 'r', 'r', 'r'])}
<p>An amount of €1,000 indexed from ${h.mois(m[11])} to ${h.mois(d.p)} becomes ${h.eur(h.E.centimes(r))}. The tool above does the same for any two months back to January 1994.</p>
<h2>Which month to look up</h2>
<ul>
<li>Starting index: the month before the lease was signed (Brussels, Wallonia) or before it took effect (Flanders).</li>
<li>New index: the month before the anniversary of the start date. A lease starting on 1 December is indexed with the November value.</li>
</ul>
<p>Statbel’s own pages: ${h.src('statbelSante')} and, in Dutch, ${h.src('statbelSanteNl')}. To turn the index into a rent with the regional rules, use ${h.a('be-home', 'rent indexation in Belgium')}; for Brussels or Flanders specifically, ${h.a('be-bxl', 'Brussels')} or ${h.a('be-vl', 'Flanders')}.</p>`;
  },
};
export default t;
