import type { PageText } from '../../lib/types';

/** IRL values (mainland, Corsica, overseas) and the ratio they feed, for English readers. */
const t: PageText = {
  slug: 'france-irl',
  nav: 'IRL: latest values',
  card: 'The latest IRL values published by Insee for mainland France, Corsica and the overseas departments.',
  title: 'IRL index (indice de référence des loyers): latest values',
  description: 'IRL values from Insee for the last eight quarters, the separate series for Corsica and overseas, release dates and the ratio used to review a French rent.',
  h1: 'The IRL: France’s rent reference index',
  intro: 'Pick the reference quarter of your lease: the tool takes that quarter’s IRL and the one a year before.',
  resume: (h) => {
    const d = h.D.dernierFr('irl'), c = h.D.dernierFr('irl_corse'), o = h.D.dernierFr('irl_dom');
    return `The IRL (indice de référence des loyers) is the only index a French residential lease may use to raise the rent during the tenancy. Insee calculates it as the twelve-month average of the change in consumer prices excluding tobacco and rents, so it moves slowly and rarely jumps. The most recent value is for ${h.trim(d.p)}: ${h.num(d.v)} for mainland France, published in the Journal officiel on ${h.date(d.jo!)}, a change of ${h.pc(d.var!)} over one year. Corsica (${h.num(c.v)}) and the overseas departments (${h.num(o.v)}) have their own levels but the same annual change. An index value on its own does not tell you the new rent: you need two values, the quarter named in the lease for this year and the same quarter a year earlier, and their ratio is applied to the rent excluding charges. A ratio above one is the maximum increase the landlord can ask; it is not a rent the tenant owes until it has been requested.`;
  },
  faqs: (h) => {
    const d = h.D.dernierFr('irl');
    return [
      { q: 'When is the next IRL released?', a: `Insee publishes each quarter around the middle of the following month, and the notice appears in the Journal officiel a day or so later: mid-January, mid-April, mid-July and mid-October. The figure for ${h.trim(d.p)} came out in the Journal officiel on ${h.date(d.jo!)}. Until the next quarter is out, the calculator does not offer it and shows it as not yet published.` },
      { q: 'Why do Corsica and the overseas departments show different numbers?', a: 'Separate series were created in 2022 when the law capped the rise of the index at different rates by area, until early 2024. Since then the three series move by the same percentage, but their levels stay apart. Never mix them: a Corsican lease uses the Corsican value for both quarters of the ratio.' },
      { q: 'Can I just apply the published percentage instead of the two values?', a: 'In most cases you will land on the same rent to the cent, because the published change is the same ratio rounded to two decimals. When the two methods differ by a cent, the ratio of the two index values is what the law describes, so that is the figure to put in the letter to the tenant.' },
    ];
  },
  body: (h) => {
    const rows = h.D.serieFr('irl').slice(-8).reverse().map((o) => [h.trim(o.p), h.num(o.v), o.var !== undefined ? h.pc(o.var) : '–', o.jo ? h.date(o.jo) : '–']);
    const last = h.D.serieFr('irl').slice(-1)[0];
    const lc = h.D.dernierFr('irl_corse'), ld = h.D.dernierFr('irl_dom');
    return `<h2>Mainland IRL, last eight quarters</h2>
${h.table(['Quarter', 'IRL', 'Change over one year', 'Journal officiel'], rows, 'Source: Insee, series 001515333, read on 24 October 2026.', ['l', 'r', 'r', 'l'])}
<h2>Same quarter, three areas</h2>
${h.table(['Area', h.trim(last.p), 'Insee series'], [['Mainland France', h.num(last.v), h.src('inseeIrl', '001515333')], ['Corsica', h.num(lc.v), h.src('inseeIrlCorse', '010760507')], ['Overseas departments', h.num(ld.v), h.src('inseeIrlDom', '010760509')]], undefined, ['l', 'r', 'l'])}
<p>The overseas series covers Guadeloupe, French Guiana, Martinique, La Réunion and Mayotte. The full history, back to 2008 for mainland France, is on each Insee series page; the calculator above lists the last forty quarters.</p>
<h2>Reading the table correctly</h2>
<p>A quarter’s IRL is published after the quarter ends, so a review in April normally uses the first-quarter value only if it is already out on the review date. The official explanation of the rules, with an example, is on ${h.src('spIrl')}. For the quarter that applies to each 2026 review month, see ${h.a('fr-irl-2026', 'IRL quarters in 2026')}; for the latest release in detail, ${h.a('fr-irl-t3', 'the third-quarter 2026 IRL')}; for the whole procedure, ${h.a('fr-home', 'the French rent review page')}.</p>`;
  },
};
export default t;
