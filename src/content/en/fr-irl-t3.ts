import type { PageText } from '../../lib/types';

/** The Q3 2026 IRL release and the leases it affects. */
const t: PageText = {
  slug: 'france-irl-third-quarter',
  nav: 'IRL Q3 2026',
  card: 'The third-quarter 2026 IRL, published in October 2026, and the French leases whose rent it now reviews.',
  title: 'IRL Q3 2026: value, annual change and the leases it reviews',
  description: 'IRL for Q3 2026 in mainland France, Corsica and overseas, its annual change, its Journal officiel release and the leases reviewed with it from October 2026.',
  h1: 'The third-quarter 2026 IRL and the leases it affects',
  intro: 'The tool is set to the third quarter of 2026: enter the rent and the area, and it divides by the third quarter of 2025.',
  resume: (h) => {
    const q = h.D.serieFr('irl').find((o) => o.p === '2026-Q3')!;
    const c = h.D.valeurFr('irl_corse', '2026-Q3')!, d = h.D.valeurFr('irl_dom', '2026-Q3')!;
    const a = h.D.valeurFr('irl', '2025-Q3')!;
    return `Insee’s rent reference index (IRL) for the third quarter of 2026 is ${h.num(q.v)} for mainland France, against ${h.num(a)} a year earlier, so ${h.pc(q.var!)} over twelve months. The notice was published in the Journal officiel on ${h.date(q.jo!)}. Corsica stands at ${h.num(c)} and the overseas departments at ${h.num(d)}, with the same annual change. Two groups of leases now use it. First, every lease whose review clause names the third quarter as reference, whatever its anniversary month. Second, leases that name no quarter and were signed while the third quarter of 2025 was the latest published, that is from its release on ${h.date(h.D.serieFr('irl').find((o) => o.p === '2025-Q3')!.jo!)} until the next release in January 2026. For them, anniversaries falling between the third-quarter 2026 release and mid-January 2027 use this value. The figure is slightly below the second-quarter IRL in level, but the annual change is higher, and the annual change is what decides the increase.`;
  },
  faqs: (h) => [
    { q: 'The Q3 2026 value is lower than Q2 2026: does that mean rents fall?', a: `No. A review never compares two neighbouring quarters; it compares a quarter with the same quarter a year before. The third quarter of 2026 is ${h.pc(h.D.serieFr('irl').find((o) => o.p === '2026-Q3')!.var!)} above the third quarter of 2025, so rents reviewed with it rise by that much at most. Comparing the level with the second quarter tells you nothing about your own review.` },
    { q: 'My review date was 1 October 2026: can my landlord use the Q3 2026 value?', a: 'Only if the lease names the third quarter as reference. In that case the landlord simply has to wait until the value is published and can then ask for the review, which runs from the request and not from 1 October. If the lease names another quarter, the third quarter is irrelevant to it.' },
    { q: 'Does the Q3 2026 IRL apply to a furnished let as well?', a: 'Yes. The same index and the same ratio apply to homes let furnished as a main residence, through article 25-9 of the 1989 law. Where the furnished let has fixed lump-sum charges, that lump sum can be reviewed with the same quarter.' },
  ],
  body: (h) => {
    const serie = Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v]));
    const rows = [600, 850, 1200, 1800].map((l) => {
      const r = h.E.reviserFr({ loyer: l, trimestre: '2026-Q3', irl: serie, zone: 'metropole', dateBail: '2021-01-01' });
      return [h.eur(l), h.eur(r.nouveauLoyer), h.eur(r.hausse), h.eur(r.hausse * 12)];
    });
    return `<h2>What the Q3 2026 value means for a monthly rent</h2>
${h.table(['Current rent', 'Reviewed rent', 'Extra each month', 'Extra over a year'], rows, 'Mainland France, ratio IRL Q3 2026 / IRL Q3 2025, rounded to the cent.', ['r', 'r', 'r', 'r'])}
<p>An F or G rated home gets nothing from this release if its lease was signed, renewed or rolled over since 24 August 2022 in mainland France, or since 1 July 2024 overseas: the calculator shows a zero increase when you select those ratings and answer yes to the date question. These limits are listed on ${h.src('spIrl')}.</p>
<h2>Where the figure comes from</h2>
<p>The value is read from ${h.src('inseeIrl', 'Insee series 001515333')}. The next quarter, the fourth of 2026, is not yet published and is expected in mid-January 2027. A review requested before that date for a lease referring to the fourth quarter cannot be calculated yet. To see every 2026 review month at once, go to ${h.a('fr-irl-2026', 'IRL quarters in 2026')}; the longer history is on ${h.a('fr-irl', 'the IRL page')}, and the full procedure on ${h.a('fr-home', 'rent review in France')}.</p>`;
  },
};
export default t;
