import type { PageText, Helpers } from '../../lib/types';

/** Portugal: 2027 rent increase with the 1.0256 coefficient, for foreign landlords and tenants. */
const c = (h: Helpers, a: number) => h.D.COEF_PT[String(a)];

const t: PageText = {
  slug: 'portugal-rent-increase',
  nav: 'Rent increase in Portugal 2027',
  card: 'The 2027 rent coefficient in Portugal, the new rent rounded up to the cent, catch-up years and the 30-day letter.',
  title: 'Rent increase in Portugal 2027: the 1.0256 coefficient',
  description: 'Rent increase in Portugal for 2027 with the official 1.0256 coefficient: the new rent rounded up to the cent, catch-up years and the 30-day written notice.',
  h1: 'Portuguese rent increase in 2027: coefficient and new rent',
  intro: 'Enter the current rent and the year of the last increase: the tool applies the 2027 coefficient and, where allowed, those of missed years.',
  resume: (h) => {
    const k = c(h, 2027);
    const x = h.E.atualizarPt(1100, [k.valor]);
    return `Under Portugal’s legal regime there is no index to pick: every year Statistics Portugal (INE) works out a single rent update coefficient (coeficiente de atualização), published in the official journal, the Diário da República, by 30 October for the following calendar year. For 2027 it is ${h.num(k.valor, 4)}, set by ${k.aviso} of ${h.date(k.data_dr)}: a maximum increase of ${h.pc((k.valor - 1) * 100)}. A rent of €1,100 a month becomes ${h.eur(x.nouveauLoyer)}. The rules come from articles 24 and 25 of the urban lease regime (NRAU). The new rent is always rounded up to the next cent. The first increase can only come one year after the lease began, and each later one a year after the previous increase. The landlord must give written notice of the coefficient and the new rent at least 30 days in advance. A landlord who skipped earlier increases can still apply those years’ coefficients, up to three coefficients in total including the current year’s. The increase is a ceiling: applying less, or nothing, is always allowed.`;
  },
  faqs: (h) => [
    { q: 'I signed a lease in Lisbon in May 2026: when can the rent first go up?', a: `Not before May 2027, one year after the lease began. In May 2027 the landlord can apply the 2027 coefficient, ${h.num(c(h, 2027).valor, 4)}, with written notice at least 30 days earlier. The 2026 coefficient cannot be added, because the lease was not a year old during 2026. The tool shows no coefficient when the year is too early.` },
    { q: 'What should a Portuguese rent increase letter contain?', a: 'The parties, the address of the property, the current rent, the coefficient or coefficients applied with the notice that published them, the new rent and the date it starts, at least 30 days after the letter is received. The tool writes the letter in Portuguese with your figures, in your browser; nothing is sent anywhere.' },
    { q: 'Is the coefficient the same for houses and shops?', a: 'INE publishes one coefficient for the various types of lease, and the official notice says so. A shop or office whose rent follows the legal regime therefore uses the same 2027 figure. If a commercial lease contains its own update clause, have a Portuguese lawyer confirm which rule governs it before you apply anything.' },
  ],
  body: (h) => {
    const rows = h.D.anosPt().map((a) => [String(a), h.num(c(h, a).valor, 4), h.pc((c(h, a).valor - 1) * 100), c(h, a).aviso]);
    const rents = [600, 900, 1300, 2000].map((v) => { const x = h.E.atualizarPt(v, [c(h, 2027).valor]); return [h.eur(v), h.eur(x.nouveauLoyer), h.eur(x.hausse * 12)]; });
    return `<h2>Coefficients by year</h2>
${h.table(['Year', 'Coefficient', 'Maximum increase', 'Published in'], rows, `Read in the Diário da República: ${h.src('drCoef2027', '2027 notice')}, ${h.src('drCoef2026', '2026 notice')}; 2023 set by ${h.src('drLei19', 'Law 19/2022')}.`, ['l', 'r', 'r', 'l'])}
<p>In 2023 the coefficient INE had calculated was not used: Law 19/2022 fixed it at 1.02 instead.</p>
<h2>What 2027 means for your rent</h2>
${h.table(['Current rent', 'New rent in 2027', 'Extra per year'], rents, `Coefficient ${h.num(c(h, 2027).valor, 4)}, rounded up to the next cent.`, ['r', 'r', 'r'])}
<h2>Rounding up, not to the nearest cent</h2>
<p>Article 25 of the NRAU requires rounding to the next higher cent. €900 × ${h.num(c(h, 2027).valor, 4)} gives exactly ${h.eur(900 * c(h, 2027).valor)}, but a figure such as €517.921 becomes €517.93, not €517.92. Ordinary calculators round the other way, which is why tenants and landlords sometimes disagree by a cent.</p>
<p>For catching up on missed years, see ${h.a('pt-2026', 'the Portuguese rent coefficients and catch-up rule')}. To compare with Spain, where updates are capped at 2% until the end of 2027, see ${h.a('es-home', 'the Spanish rent update')}. For a dispute, a Portuguese lawyer or a tenants’ or landlords’ association can review the lease.</p>`;
  },
};
export default t;
