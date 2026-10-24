import type { PageText } from '../../lib/types';

/** Which IRL quarter applies to a review falling in each month of 2026. */
const t: PageText = {
  slug: 'france-irl-quarters',
  nav: 'IRL 2026 by review month',
  card: 'The IRL quarter that applies to a French rent review in each month of 2026, with its value and annual change.',
  title: 'IRL 2026 quarters: which one applies to your review month',
  description: 'IRL 2026 month by month: the quarter that applies when a French lease is reviewed in January, May or November 2026, its value and the maximum rise it allows.',
  h1: 'IRL in 2026: the quarter for each review month',
  intro: 'Choose the month in which your lease is reviewed in 2026: the tool picks the last IRL already published on the first of that month.',
  resume: (h) => {
    const jan = h.D.trimestreParuLe('irl', '2026-01-01')!, nov = h.D.trimestreParuLe('irl', '2026-11-01')!;
    return `French leases do not all use the same IRL quarter, which is why landlords and tenants often get the figure wrong. The quarter is the one written in the lease; when the lease is silent, it is the last quarter published in the Journal officiel on the day it was signed, and because Insee releases on almost the same dates each year, that is in practice the last quarter out on the review anniversary. In 2026 this gives four answers. A review between 1 January and mid-January used ${h.trim(jan.p)} (${h.num(jan.v)}, ${h.pc(jan.var!)} over a year). From mid-January to mid-April the reference was the fourth quarter of 2025, then the first quarter of 2026 until mid-July, and the second quarter until mid-October. A review falling on 1 November or 1 December 2026 uses ${h.trim(nov.p)}: ${h.num(nov.v)}, up ${h.pc(nov.var!)}, published on ${h.date(nov.jo!)}. The fourth quarter of 2026 is not yet published; Insee normally releases it in mid-January 2027.`;
  },
  faqs: () => [
    { q: 'My lease was signed a few days before an IRL release: which quarter is mine?', a: 'The one that was already in the Journal officiel on the signing day, not the one released a week later. A lease signed on 10 October 2025, before the third-quarter 2025 release, has the second quarter as its reference for its whole life. The month selector in the calculator works on the first day of the month, so check your signing date against the release dates in the table.' },
    { q: 'Can the landlord switch to a more favourable quarter in 2026?', a: 'No. The reference quarter is fixed by the lease, or by the signing date when the lease names none, and it stays the same every year. Choosing whichever quarter shows the highest change would be a review outside the terms of the contract, which the tenant can refuse.' },
    { q: 'What happens to reviews due after mid-January 2027?', a: 'They will use the fourth-quarter 2026 IRL for leases referring to that quarter, once Insee has published it. Until then no one can calculate the reviewed rent for those leases, and a figure quoted before release is only an estimate with no legal value.' },
  ],
  body: (h) => {
    const mois = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const rows = mois.map((m) => {
      const o = h.D.trimestreParuLe('irl', `2026-${m}-01`)!;
      return [h.mois(`2026-${m}`), h.trim(o.p), h.num(o.v), h.pc(o.var!), h.date(o.jo!)];
    });
    const nov = h.D.trimestreParuLe('irl', '2026-11-01')!;
    const serie = Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v]));
    const ex = h.E.reviserFr({ loyer: 925, trimestre: nov.p, irl: serie, zone: 'metropole', dateBail: '2024-11-01' });
    return `<h2>Review month and IRL quarter in 2026</h2>
${h.table(['Review on the 1st of', 'Quarter', 'IRL', 'Change over a year', 'In the Journal officiel since'], rows, 'Mainland France. Last quarter published in the Journal officiel on the first day of each month (Insee, series 001515333).', ['l', 'l', 'r', 'r', 'l'])}
<p>Reviews dated later in a month can fall after a release: a review on 20 October 2026 already has the third quarter available, one on 10 October does not. The rule for leases that name no quarter is on ${h.src('spIrl')}, and the review clause itself is governed by article 17-1 of the ${h.src('loi1989', 'law of 6 July 1989')}.</p>
<h2>Example for a November 2026 anniversary</h2>
<p>A lease signed on 1 November 2024 at €925 a month, no quarter named: the last IRL in the Journal officiel that day was the third quarter of 2024, so every review uses the third quarter. On 1 November 2026 the ratio is ${h.num(nov.v)} / ${h.num(h.D.valeurFr('irl', h.E.trimestreN1(nov.p))!)} and the rent becomes ${h.eur(ex.nouveauLoyer)}, ${h.eur(ex.hausse)} more each month. The series figures are listed on ${h.src('inseeIrl', 'the Insee IRL series page')}.</p>
<p>For the values behind each quarter see ${h.a('fr-irl', 'the IRL page')}; for the third-quarter release in detail, ${h.a('fr-irl-t3', 'the Q3 2026 IRL')}; for the conditions a landlord must meet this year, ${h.a('fr-augm', 'rent increases in 2026')}.</p>`;
  },
};
export default t;
