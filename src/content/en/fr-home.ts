import type { PageText } from '../../lib/types';

/** France, annual rent review of a home for an English-speaking landlord or tenant. */
const t: PageText = {
  slug: 'france-rent-revision',
  nav: 'France: annual rent review',
  card: 'How a French residential rent is reviewed once a year with the IRL, and the cases where no increase is allowed.',
  title: 'Rent review in France (révision du loyer) with the IRL',
  description: 'Rent review for a home let in France: the IRL formula, the quarter your lease uses, the one-year window, the F and G energy freeze, and the new rent worked out.',
  h1: 'Reviewing a residential rent in France',
  intro: 'Enter the current rent, where the home is and the quarter named in the lease: the tool applies the official IRL ratio and the energy-rating freeze.',
  resume: (h) => {
    const d = h.D.dernierFr('irl');
    return `In France the rent of a home let as a main residence, furnished or unfurnished, can go up once a year only if the lease contains a review clause (clause de révision), and never by more than the change in the rent reference index (indice de référence des loyers, IRL) published by Insee, the national statistics office. The latest figure is for ${h.trim(d.p)}: ${h.num(d.v)} in mainland France, published in the Journal officiel on ${h.date(d.jo!)}, up ${h.pc(d.var!)} on a year earlier. The new rent is the current rent excluding service charges, multiplied by the IRL of the reference quarter this year and divided by the IRL of the same quarter last year, rounded to the cent. If the lease names no quarter, the reference is the last IRL published on the day it was signed. The landlord has one year from the review date to ask, and the increase only runs from the request, never backwards. Homes rated F or G on the energy certificate (DPE) cannot be reviewed at all when the lease was signed, renewed or rolled over since the freeze date.`;
  },
  faqs: () => [
    { q: 'I own a flat in France but live abroad: does the review happen automatically?', a: 'No. Nothing changes unless the landlord, or the letting agent acting for them, asks the tenant for the reviewed rent. A short letter or email stating the old rent, the two IRL values used and the new amount is enough. Living outside France changes nothing to the rule, but missing the one-year window means losing that year’s increase for good.' },
    { q: 'Does the review apply to the service charges as well?', a: 'Not to the monthly provisions for service charges (provisions pour charges), which are settled once a year against actual costs. The rule is different for a furnished home where the charges are a fixed lump sum (forfait): that lump sum may be reviewed each year in the same way as the rent. Where a rent supplement applies in a rent-controlled city, the review covers base rent plus supplement.' },
    { q: 'Which homes are outside this calculation?', a: 'Commercial and office premises, which follow the ILC or ILAT indices; social housing, reviewed every 1 January with the second-quarter IRL of the previous year; homes still under the 1948 rent law, which has its own rules; and mobility leases (bail mobilité), whose rent cannot be reviewed during the lease. For those cases the result of this tool does not apply.' },
  ],
  body: (h) => {
    const q = h.D.dernierFr('irl').p;
    const n = h.D.valeurFr('irl', q)!, a = h.D.valeurFr('irl', h.E.trimestreN1(q))!;
    const ex = h.E.reviserFr({ loyer: 1100, trimestre: q, irl: Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v])), zone: 'metropole', dateBail: '2021-11-01' });
    return `<h2>Three things to read in the lease first</h2>
<ol>
<li>The review clause. Without it the rent stays fixed for the whole lease, whatever the IRL does.</li>
<li>The reference quarter. Most leases name one (for example the third quarter). If yours does not, take the last IRL published in the Journal officiel on the signing date.</li>
<li>The review date: usually the lease anniversary, sometimes another agreed date.</li>
</ol>
<p>Then check the energy rating (DPE). For an F or G home, the freeze applies from 24 August 2022 in mainland France and from 1 July 2024 in Guadeloupe, French Guiana, Martinique, La Réunion and Mayotte, as set out on ${h.src('spIrl')}.</p>
<h2>A worked example</h2>
<p>A flat in Lyon is let for €1,100 a month excluding charges and the lease names the ${h.trim(q)} as reference quarter. The IRL for that quarter is ${h.num(n)}; a year earlier it was ${h.num(a)}. The reviewed rent is 1,100 × ${h.num(n)} / ${h.num(a)} = ${h.eur(ex.nouveauLoyer)}, which is ${h.eur(ex.hausse)} more a month. The formula comes from article 17-1 of the ${h.src('loi1989', 'law of 6 July 1989')}.</p>
<h2>Mainland France, Corsica and the overseas departments</h2>
<p>Insee publishes three IRL series with different levels: ${h.src('inseeIrl', 'mainland France')}, ${h.src('inseeIrlCorse', 'Corsica')} and ${h.src('inseeIrlDom', 'overseas departments')}. Use the series of the area where the home is for both quarters of the ratio. The calculator switches series when you change the location. The index values may be reused under ${h.src('inseeLicence', 'Insee’s open licence')}.</p>
<h2>Where to go next</h2>
<p>The values of each quarter are on ${h.a('fr-irl', 'the IRL page')}, the quarter to use for a 2026 review month on ${h.a('fr-irl-2026', 'IRL quarters in 2026')}, and what a landlord may ask this year on ${h.a('fr-augm', 'rent increases in 2026')}. For a commercial lease, see ${h.a('fr-ilc', 'the ILC page')}. In a dispute, the departmental housing information office (ADIL) or a lawyer can look at your lease.</p>`;
  },
};
export default t;
