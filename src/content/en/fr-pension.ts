import type { PageText } from '../../lib/types';

/** Child support / maintenance (pension alimentaire) uprating with the CPI excluding tobacco. */
const t: PageText = {
  slug: 'france-child-support-indexation',
  nav: 'Child support indexation',
  card: 'How a French child support or maintenance payment is uprated each year with the consumer price index excluding tobacco.',
  title: 'Child support indexation in France (pension alimentaire)',
  description: 'Child support indexation in France: the price index to use, the index month on the ruling date and on the uprating date, the formula, and the sum due in 2026.',
  h1: 'Uprating a French child support payment',
  intro: 'Enter the current monthly amount, the index month in force at the ruling and the latest index month: the tool applies the ratio.',
  resume: (h) => {
    const jan = h.D.ipcFr.obs.filter((o) => o.jo && o.jo <= '2026-01-01').pop()!;
    const last = h.D.dernierIpcFr();
    return `A child support or maintenance payment set by a French court or agreement (pension alimentaire) is normally indexed on consumer prices and must be uprated every year by the parent who pays, without waiting to be asked and without a new hearing. Unless the ruling says otherwise, the new amount is the current amount multiplied by the last index published on the uprating date and divided by the last index published on the date of the ruling. The default index is Insee’s consumer price index excluding tobacco for all households (base 2025). For an uprating on 1 January 2026, the last index published was that of ${h.mois(jan.p)}: ${h.num(jan.v)}. The latest month now available is ${h.mois(last.p)} at ${h.num(last.v)}, published on ${h.date(last.jo!)}. The uprating date is the one in the ruling, often 1 January, 1 July or the anniversary of the judgment. Where the Caf manages the payment through financial intermediation, it applies the uprating itself.`;
  },
  faqs: () => [
    { q: 'The other parent never uprated the payment: how far back can I claim?', a: 'The official guidance says arrears from missed uprating can be claimed for the last five years, under the general limitation rule of article 2224 of the Civil Code. Each year’s arrears are the difference between what was paid and what should have been paid. A commissaire de justice can recover them if the paying parent refuses.' },
    { q: 'The ruling names the urban blue- and white-collar index: does that change the result?', a: 'Yes, slightly. That is a different Insee series, and if the ruling names it you must use its values for both months. This calculator uses the all-households series excluding tobacco, the default one; for another series, take its two values from Insee and apply the same ratio, or ask the family court to interpret an unclear ruling.' },
    { q: 'Should the uprated amount be rounded to the euro?', a: 'Only if the ruling or agreement asks for it. Otherwise keep the amount to the cent, as the calculator does. Some rulings ask for rounding to the nearest euro or the euro above; follow their wording exactly, since that is what a court would apply in a dispute about the amount due.' },
  ],
  body: (h) => {
    const at = (d: string) => h.D.ipcFr.obs.filter((o) => o.jo && o.jo <= d).pop()!;
    const base = at('2023-03-01'), jan = at('2026-01-01');
    const r = h.E.indexerSomme(350, base.v, jan.v);
    const rows = h.D.ipcFr.obs.slice(-6).reverse().map((o) => [h.mois(o.p), h.num(o.v), o.jo ? h.date(o.jo) : '–']);
    return `<h2>Example: a ruling of March 2023, uprated on 1 January 2026</h2>
<p>A judgment of 1 March 2023 set the payment at €350 a month. On that day the last index in the Journal officiel was ${h.mois(base.p)} (${h.num(base.v)}). On 1 January 2026 it was ${h.mois(jan.p)} (${h.num(jan.v)}). The uprated amount is 350 × ${h.num(jan.v)} / ${h.num(base.v)} = ${h.eur(r.nouveauLoyer)} a month. Select those two months in the calculator to reproduce it.</p>
<h2>Latest monthly index values</h2>
${h.table(['Month', 'Index (base 2025)', 'Journal officiel'], rows, 'Source: Insee, CPI excluding tobacco, all households, series 011814056.', ['l', 'r', 'l'])}
<p>Insee extended the base 2025 series backwards, so a ruling from 2010 or 2015 can be uprated with it directly; the calculator goes back to 1996. The series is on ${h.src('inseeIpc', 'Insee series 011814056')}, the rules of the uprating on ${h.src('spPension')}, and the choice of index months on ${h.src('inseePension')}.</p>
<h2>When the ruling is unclear</h2>
<p>If the ruling lacks an element of the formula, the official guidance points to a request for interpretation to the family judge (juge aux affaires familiales) of the court that ruled. The calculator does not replace that step. For a rent rather than a payment, see ${h.a('fr-augm', 'rent increases in 2026')}; for the Italian equivalent, ${h.a('it-assegno', 'maintenance indexation in Italy')}.</p>`;
  },
};
export default t;
