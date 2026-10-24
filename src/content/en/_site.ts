import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Rent Indexer publisher and editorial rules: Radif Partners',
    description: 'Who publishes Rent Indexer, where the official indices come from, how pages are checked and corrected, and how to report a mistake: the company Radif Partners.',
    h1: 'Who runs Rent Indexer',
    body: (h) => `<p>Rent Indexer is published by the company Radif Partners. It does one job: it applies to a lease the official index that the law of the country names, with the rules that cap or block the increase, and it shows every figure with its source and date. It covers France, Belgium, Spain, Italy, Portugal and Austria, in each country’s language and in English for tenants and landlords who do not read it.</p>
<p>The site is not linked to any government, statistics office, letting agent or property portal. It sells nothing, collects no contact details and passes nothing to third parties: every calculation runs in your browser.</p>
<h2>Publisher</h2>
<!--identite-->
<h2 id="editorial">Editorial policy</h2>
<p>Every index is read at its source: Insee for France, Statbel for Belgium, INE for Spain, Istat for Italy, the Diário da República for Portugal and Statistik Austria. The data files are rebuilt by a script that queries those sources directly, and each page shows when the figures were last checked. A legal rule is only written after reading the official text that sets it (statute, decree, regional government page), and that text is linked at the foot of the page.</p>
<p>When a figure has not been published yet, the page says so and does not invent one: the calculator shows “not yet published” rather than an estimate dressed up as official. Worked examples are produced by the site’s calculation engine, which is tested automatically against the examples the authorities publish, never typed in by hand.</p>
<p>Pages are reviewed at least once a year, and the tables at every new index release. A material correction is dated at the foot of the page concerned.</p>
<h2 id="contact">Contact and corrections</h2>
<p>A wrong index, a rule misread or a case the calculator does not handle: write to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> with the page address and, if you can, the source that seems to contradict it. We do not answer questions about a particular dispute; a local tenants’ advice service or a lawyer in the country is the right contact for that.</p>
<p>How each country is calculated is set out on the ${h.a('method', 'method and sources')} page.</p>`,
  },
  method: {
    title: 'Rent indexation method: formulas, sources and limits',
    description: 'The formula used in each country, the official series, rounding rules, how the indices are refreshed and the known limits of the Rent Indexer calculators.',
    h1: 'How the calculations work',
    body: (h) => `<p>Each calculator applies the formula that the country’s law sets, with the series published by the competent statistics office, rounded the way the law asks.</p>
<h2>France</h2>
<p>Residential rent review: rent excluding charges × IRL for the reference quarter this year / IRL for the same quarter a year earlier, rounded to the cent (${h.src('loi1989', 'Law of 6 July 1989, art. 17-1')}). Mainland France, Corsica and the overseas departments have separate Insee series. Homes rated F or G cannot have their rent reviewed if the lease was signed, renewed or rolled over since 24 August 2022 (mainland) or 1 July 2024 (overseas). Commercial leases use the ILC or ILAT the same way; child support uses the consumer price index excluding tobacco.</p>
<h2>Belgium</h2>
<p>Base rent × new health index / starting index (base 2013, ${h.src('statbelSanteEn', 'Statbel')}). The starting index is the month before signing in Brussels and Wallonia, and the month before the lease took effect in Flanders; the new index is the month before the anniversary. The Brussels and Flemish correction factors and the Walloon cap of 2022-2023 follow the regional governments’ pages. The 2016 index skip is not modelled.</p>
<h2>Spain, Italy, Portugal, Austria</h2>
<p>Spain: annual change in the CPI or IRAV for the latest month published by INE, with the caps of the Urban Leases Act and Royal Decree-law 29/2026. Italy: annual change in the FOI index excluding tobacco, at 75% or 100% depending on the lease, with Istat’s base-linking coefficients. Portugal: coefficients published in the Diário da República, up to three years caught up, rounded up to the next cent. Austria: average CPI change of the previous year under the MieWeG, with half of the share above 3% counted.</p>
<h2>Updates and limits</h2>
<p>The series are refreshed by a script that queries the official interfaces (Insee, Statbel, INE, Istat, Statistik Austria). A calculation does not replace reading the lease: a specific clause (another index, a floor, its own date) overrides the general case, and a court may decide a disputed case differently.</p>`,
    faqs: (h) => [
      { q: 'Which statistics offices supply the figures used on this site?', a: 'Insee for the French IRL, ILC, ILAT and consumer prices; Statbel for the Belgian health index; INE for the Spanish CPI and IRAV; Istat for the Italian FOI index and its linking coefficients; Statistik Austria for the VPI. The Portuguese coefficients are read in the notices that INE publishes in the Diário da República. Each value carries the date it was last read.' },
      { q: 'Are the indices ever rounded before the rent is worked out?', a: 'No. The calculation always uses the index values exactly as published, and only the result is rounded: to the nearest cent in France, Belgium, Spain, Italy and Austria, and up to the next cent in Portugal, as its tenancy law requires. The percentage shown next to the result is rounded to two decimals for reading only.' },
      { q: 'What happens if I pick a month whose index is not out yet?', a: 'The calculator says the value is not yet published and tells you roughly when the statistics office usually releases it. It never fills the gap with a forecast, because a rent review based on a guess is worth nothing to either side. Come back after the release date, or use the latest published month if your lease allows it.' },
    ],
  },
};
export default s;
