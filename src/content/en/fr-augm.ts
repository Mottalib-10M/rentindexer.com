import type { PageText } from '../../lib/types';

/** What a French landlord may ask in 2026: conditions, timing, the letter. */
const t: PageText = {
  slug: 'france-rent-increase',
  nav: 'Rent increase 2026',
  card: 'What a landlord in France may ask for in 2026, by when, from what date, and what to put in the request.',
  title: 'Rent increase 2026 in France: what a landlord may ask',
  description: 'Rent increase in France in 2026: the maximum a landlord may ask, the one-year deadline, no backdating, the F and G freeze, and a request letter for the tenant.',
  h1: 'How much can a French landlord raise the rent in 2026?',
  intro: 'Select the month of your 2026 review: the tool uses the last IRL published on the first of that month and gives the ceiling for the increase.',
  resume: (h) => {
    const d = h.D.dernierFr('irl');
    const serie = Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v]));
    const ex = h.E.reviserFr({ loyer: 1000, trimestre: d.p, irl: serie, zone: 'metropole', dateBail: '2021-06-01' });
    return `During a residential tenancy in France the landlord cannot set a new rent at will. The only increase allowed while the lease runs is the annual review, and only if the lease has a review clause. Its ceiling is the change in the rent reference index (IRL): with the latest quarter, ${h.trim(d.p)}, that change is ${h.pc(d.var!)}, so a rent of €1,000 can rise to ${h.eur(ex.nouveauLoyer)} at most for a lease using that quarter. Earlier 2026 quarters gave smaller rises, which is why the review month matters. Three timing rules apply. The landlord has one year from the review date in the lease to ask; after that, the increase for that year is lost. The new rent applies from the date of the request, never retroactively. And a home rated F or G on its energy certificate cannot be reviewed at all if the lease was signed, renewed or tacitly rolled over since 24 August 2022 in mainland France, or since 1 July 2024 in the overseas departments.`;
  },
  faqs: () => [
    { q: 'The landlord forgot last year’s review: can both years be added together now?', a: 'No. Each year’s review must be requested within one year of its review date, otherwise it lapses. A landlord who skipped a year can only apply the current year’s review, calculated from the rent actually being paid. There is no catching up of lost increases and no back payment for the months before the request.' },
    { q: 'Is the tenant obliged to accept the reviewed rent?', a: 'When the lease contains a review clause and the calculation follows the IRL of the right quarter, yes: the tenant owes the new amount from the date of the request. The tenant can refuse an increase above the IRL ratio, one based on the wrong quarter, or any increase on an F or G home covered by the freeze.' },
    { q: 'What should the request to the tenant contain?', a: 'The current rent excluding charges, the reference quarter named in the lease, the two IRL values used with their quarters, the new rent rounded to the cent and the date from which it applies. Sending it by email or registered letter keeps proof of the date, which is the date from which the higher rent is due.' },
    { q: 'Can the rent go up more when the lease is renewed?', a: 'Only through a separate procedure for a rent that is clearly undervalued compared with similar homes nearby, with its own notice and limits, and in rent-controlled areas other ceilings apply. That procedure is not an IRL review and this calculator does not handle it; a housing information office (ADIL) can explain it.' },
  ],
  body: (h) => {
    const serie = Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v]));
    const mois = ['02', '05', '08', '11'];
    const rows = mois.map((m) => {
      const o = h.D.trimestreParuLe('irl', `2026-${m}-01`)!;
      const r = h.E.reviserFr({ loyer: 1000, trimestre: o.p, irl: serie, zone: 'metropole', dateBail: '2021-06-01' });
      return [h.mois(`2026-${m}`), h.trim(o.p), h.pc(o.var!), h.eur(r.nouveauLoyer)];
    });
    return `<h2>The ceiling depends on the review month</h2>
${h.table(['Review month', 'IRL quarter', 'Annual change', 'Rent of €1,000 becomes'], rows, 'Mainland France, lease naming no quarter, review on the first of the month.', ['l', 'l', 'r', 'r'])}
<h2>Timing: the one-year window and no backdating</h2>
<p>The official guidance gives this example: with a review date of 13 March 2026, the landlord may ask until 12 March 2027; if the request is only made on 13 June 2026, the higher rent is due from that day, not from March. The rule is set by article 7-1 and article 17-1 of the ${h.src('loi1989', 'law of 6 July 1989')} and explained on ${h.src('spIrl')}.</p>
<h2>A request in plain terms</h2>
<p>“Under the review clause of our lease, the rent of €1,000 excluding charges is reviewed with the IRL of the [quarter]: [new value] against [value a year earlier]. From [date of this letter], the rent is [new amount] a month.” The calculator gives the exact figures to fill in; the values themselves are on ${h.src('inseeIrl', 'the Insee IRL series')}.</p>
<p>See also ${h.a('fr-irl-2026', 'which quarter applies to each 2026 month')}, ${h.a('fr-home', 'the full rent review procedure')} and, for a court-ordered payment indexed on prices, ${h.a('fr-pension', 'child support indexation')}.</p>`;
  },
};
export default t;
