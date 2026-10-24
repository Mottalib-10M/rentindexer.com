import type { PageText, Helpers } from '../../lib/types';

/** Portugal: coefficients 2023-2027 and the catch-up of missed years (the 2026 coefficient, 1.0224). */
const c = (h: Helpers, a: number) => h.D.COEF_PT[String(a)];
const up = (h: Helpers, renda: number, ano: number, ultimo: number) => {
  const anos = h.E.anosCoeficientesPt(ano, ultimo).filter((x) => c(h, x));
  return { anos, r: h.E.atualizarPt(renda, anos.map((x) => c(h, x).valor)) };
};

const t: PageText = {
  slug: 'portugal-rent-coefficients',
  nav: 'Portuguese rent coefficients',
  card: 'Portugal’s rent coefficients from 2023 to 2027, the 2026 figure of 1.0224 and how up to three missed years can be caught up.',
  title: 'Rent coefficients in Portugal: 2026 at 1.0224 and catch-up',
  description: 'Rent coefficients in Portugal from 2023 to 2027, including 1.0224 for 2026: how up to three missed coefficients apply together, with examples and deadlines.',
  h1: 'Portuguese rent coefficients and catching up on missed years',
  intro: 'The tool is set to 2026: enter the rent and the year of the last increase to see which coefficients apply together.',
  resume: (h) => {
    const k = c(h, 2026);
    const a = up(h, 800, 2026, 2025), b = up(h, 800, 2026, 2023);
    return `The Portuguese rent coefficient for 2026 is ${h.num(k.valor, 4)}, published in ${k.aviso} in the Diário da República of ${h.date(k.data_dr)}: an increase of at most ${h.pc((k.valor - 1) * 100)}, rounded up to the next cent. A rent of €800 becomes ${h.eur(a.r.nouveauLoyer)}. By late October 2026 most 2026 increases have happened, but a lease whose anniversary falls in November or December can still use this coefficient, provided the written notice reaches the tenant at least 30 days before. Coefficients that were not used are not lost at once. When the rent goes up, the landlord can add the coefficients of years without an increase to the current year’s, with a ceiling of three coefficients in total. A landlord who has not raised the rent since 2023 can therefore apply 2024, 2025 and 2026 together this year: €800 becomes ${h.eur(b.r.nouveauLoyer)}. From January 2027, the 2027 coefficient takes over and the 2024 figure, the highest of the recent series, drops out of reach.`;
  },
  faqs: (h) => [
    { q: 'My Portuguese lease anniversary is 10 December 2026: which coefficient applies?', a: `The 2026 one, ${h.num(c(h, 2026).valor, 4)}, because the increase takes effect in the 2026 calendar year. The notice must reach the tenant by early November. If it can only be sent later, the increase moves into 2027 and the 2027 coefficient, ${h.num(c(h, 2027).valor, 4)}, applies instead.` },
    { q: 'Why can I not catch up on 2023 in a 2026 increase?', a: 'Because the total is limited to three coefficients, counting the current year. In 2026 that means 2024, 2025 and 2026 at most. The 2023 figure, fixed at 1.02 by Law 19/2022, is outside that window. The tool applies this limit automatically from the year of your last increase.' },
    { q: 'Do I multiply or add the coefficients when catching up?', a: 'Multiply. Applying 2024, 2025 and 2026 together means rent × 1.0694 × 1.0216 × 1.0224, then rounding up to the next cent. Adding the percentages gives a slightly lower figure and is not the method. The tool shows each coefficient used and the combined result.' },
  ],
  body: (h) => {
    const rows = h.D.anosPt().map((a) => [String(a), h.num(c(h, a).valor, 4), c(h, a).aviso, h.date(c(h, a).data_dr)]);
    const cases: Array<[string, number]> = [['2025 (or lease started 2025)', 2025], ['2024', 2024], ['2023 or earlier', 2023]];
    const ex = cases.map(([l, u]) => { const x = up(h, 800, 2026, u); return [l, x.anos.map((a) => h.num(c(h, a).valor, 4)).join(' × '), h.eur(x.r.nouveauLoyer)]; });
    return `<h2>All coefficients on record</h2>
${h.table(['Year', 'Coefficient', 'Source', 'Diário da República'], rows, `Notices read on 24 October 2026: ${h.src('drCoef2026', '2026')}, ${h.src('drCoef2025', '2025')}, ${h.src('drCoef2024', '2024')}.`, ['l', 'r', 'l', 'l'])}
<h2>Catch-up in a 2026 increase</h2>
${h.table(['Last increase', 'Coefficients applied in 2026', '€800 rent becomes'], ex, 'At most three coefficients in total, rounded up to the next cent.', ['l', 'l', 'r'])}
<h2>Deadlines</h2>
<p>The ceiling of three coefficients is a strong reason not to wait. A landlord who skips increases for several years loses the oldest coefficients for good, and the 2024 figure was unusually high.</p>
<p>For an increase on 1 December 2026, the letter must arrive by 1 November; for 31 December, by 1 December. Send it in a way that proves the delivery date. For increases from January 2027, see ${h.a('pt-home', 'the 2027 rent increase in Portugal')}.</p>`;
  },
};
export default t;
