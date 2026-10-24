import type { PageText } from '../../lib/types';

/** /en/ : the six countries in one place (expatriates, foreign landlords, cross-border tenants). */
const t: PageText = {
  slug: '',
  nav: 'All six countries',
  card: 'Pick the country of the property: the calculator applies the index its law names, with its caps.',
  title: 'Rent indexation 2026: official index in six EU countries',
  description: 'Rent indexation with the official index of France, Belgium, Spain, Italy, Portugal and Austria: latest values, legal caps and your new rent, in your browser.',
  h1: 'Rent indexation in France, Belgium, Spain, Italy, Portugal and Austria',
  intro: 'Choose the country where the property is: the calculator uses the index that country’s law applies, and shows the rule that limits it.',
  resume: (h) => {
    const irl = h.D.dernierFr('irl');
    const be = h.D.dernierSante();
    const es = h.D.dernierEs();
    const pt = h.D.COEF_PT['2027'];
    return `Every country in this guide lets a landlord raise the rent once a year in line with an official index, but none uses the same one. France applies the rent reference index (IRL) published each quarter by Insee: ${h.num(irl.v)} for the ${h.trim(irl.p)}, ${h.pc(irl.var!)} over a year. Belgium uses Statbel’s health index, ${h.num(be.v)} in ${h.mois(be.p)}, with regional rules for homes with a poor energy rating. Spain uses the CPI or the IRAV published monthly by INE (for ${h.mois(es.p)}: ${h.pc(es.ipc, 1)} and ${h.pc(es.irav!)}), and a temporary 2% cap applies to anniversaries until the end of 2027. Italy applies the Istat FOI index, at 75% or 100% depending on the lease. Portugal sets one coefficient a year, ${h.num(pt.valor, 4)} for 2027. Austria has adjusted rents on 1 April since 2026 under the MieWeG, counting only half of inflation above 3%. Pick the country above and the calculator applies the right index and caps.`;
  },
  faqs: (h) => [
    { q: 'Can a landlord index the rent if the lease says nothing about it?', a: 'In most of these countries, no. France, Spain and Italy require an indexation clause in the lease; without one the rent stays as agreed until a new contract. Belgium is the exception: a written residential lease can be indexed by law unless it rules indexation out, on a written request. In Portugal the annual coefficient applies unless the lease sets another regime, and in Austria the MieWeG governs the value-protection clause the lease contains.' },
    { q: 'How far back can a landlord claim an indexation that was forgotten?', a: 'It depends on the country. In France a review not requested within a year of its date is lost, and it never applies backwards. In Belgium the claim goes back at most three months before the written request. In Portugal coefficients not applied in earlier years can be caught up, within three years. In Spain and Italy the lease and general limitation rules decide.' },
    { q: 'Does the energy rating of the home change the indexation?', a: 'Yes in France and Belgium. A French home rated F or G cannot have its rent reviewed if the lease was signed, renewed or rolled over since 24 August 2022 on the mainland, or 1 July 2024 overseas. Brussels and Flanders apply correction factors to older leases of poorly rated homes, and Wallonia limited the 2022-2023 increase by energy label.' },
    { q: 'Which index should I use for a shop or an office rather than a home?', a: 'France uses the commercial rent index (ILC) for shops and craft businesses and the ILAT for offices and the professions. In Italy a commercial lease may pass on at most 75% of the FOI change. In Spain commercial leases are free to set their own clause. The calculators for those cases are linked from each country’s page.' },
    { q: 'Is the result valid as proof in a dispute with my landlord or tenant?', a: 'It is an estimate based on the official indices as published, with the formula the law sets, so it is a sound starting point for a letter or a discussion. It does not replace the lease, which may contain its own clause, nor the advice of a tenants’ association, a notary or a lawyer if the amount is contested.' },
    { q: 'Why are Germany and the Netherlands not covered?', a: 'Both countries work differently. German index-linked leases follow their own rules under the Civil Code, and Dutch rent increases are capped each year by a maximum percentage set by law rather than by an index applied to the lease. Covering them properly would need separate calculators; this site stays with the six countries where an official index is applied to the lease.' },
  ],
  body: (h) => {
    const irl = h.D.dernierFr('irl');
    const be = h.D.dernierSante();
    const es = h.D.dernierEs();
    const it = h.D.ultimoFoi();
    const pt = h.D.COEF_PT['2027'];
    const at25 = h.D.vpiIn(2020, '2025')!, at24 = h.D.vpiIn(2020, '2024')!;
    const atP = h.E.mieWegProzent(at25, at24, { jahr: 2025, mrgBeschraenkt: false });
    const atMrg = h.E.mieWegProzent(at25, at24, { jahr: 2025, mrgBeschraenkt: true });
    const rows = [
      [h.a('fr-home', 'France'), 'IRL (rent reference index)', 'Insee, quarterly', `${h.num(irl.v)} (${h.trim(irl.p)}, ${h.pc(irl.var!)})`, 'No review for F/G homes on leases since Aug. 2022'],
      [h.a('be-home', 'Belgium'), 'Health index', 'Statbel, monthly', `${h.num(be.v)} (${h.mois(be.p)}, base 2013)`, 'Correction factors for weak energy labels'],
      [h.a('es-home', 'Spain'), 'CPI or IRAV', 'INE, monthly', `CPI ${h.pc(es.ipc, 1)} · IRAV ${h.pc(es.irav!)} (${h.mois(es.p)})`, '2% cap until 31 Dec. 2027 (RDL 29/2026)'],
      [h.a('it-home', 'Italy'), 'FOI excluding tobacco', 'Istat, monthly', `${h.num(it.indice, 1)} (${h.mois(it.m)}, base 2025), ${h.pc(it.varAnno!, 1)} a year`, '75% for commercial leases; none under cedolare secca'],
      [h.a('pt-home', 'Portugal'), 'Annual coefficient', 'INE, in the Diário da República', `${h.num(pt.valor, 4)} for 2027`, 'Rounded up to the cent; 30 days’ notice'],
      [h.a('at-home', 'Austria'), 'CPI (VPI), annual average', 'Statistik Austria', `${h.pc(atP)} from 1 April 2026`, 'Half above 3%; 1% for rent-controlled flats'],
    ];
    return `<h2>The six systems side by side</h2>
${h.table(['Country', 'Index', 'Published by', 'Latest figure', 'Main limit'], rows, 'Figures read at their source on 24 October 2026.', ['l', 'l', 'l', 'l', 'l'])}
<p>The same idea, a rent that follows prices, gives six very different calculations. Some countries compare two index values (France, Belgium, Italy for a revaluation), others apply a published percentage (Spain, Italy for the annual update, Portugal, Austria). Some cap the result by law, some by the lease, and two of them now make the energy rating of the home part of the rule. Mixing up the systems is the most common source of wrong letters: a Belgian landlord dividing by the index of the wrong month, or a Spanish tenant applying the CPI to a lease that falls under the IRAV.</p>
<h2>France: the IRL, quarter by quarter</h2>
<p>For a home rented empty or furnished as a main residence, the rent can rise once a year, on the date set in the lease, by the change in the IRL between the same quarter of two consecutive years. The landlord has a year to ask, and the review never applies backwards. Insee publishes the index around the middle of the month after the quarter ends: the ${h.trim(irl.p)} came out in the Journal officiel on ${h.date(irl.jo!)}. Mainland France, Corsica and the overseas departments each have their own series. Since 24 August 2022, homes rated F or G on the energy performance certificate cannot have their rent reviewed on a lease signed, renewed or rolled over after that date (1 July 2024 overseas), as set out by ${h.src('spIrl', 'the official service-public.fr page')}. Shops use the ${h.a('fr-ilc', 'ILC')}, offices the ${h.a('fr-ilat', 'ILAT')}.</p>
<h2>Belgium: one index, three regions</h2>
<p>All three regions use the same health index from Statbel, published at the end of each month, and the same base formula: base rent × new index / starting index. The details are regional. In Brussels and Wallonia the starting index is the one for the month before the lease was signed; in Flanders it is the month before the lease took effect. The new index is always the month before the anniversary. A landlord may claim indexation for at most three months before a written request. Brussels refuses indexation without a valid energy certificate and applies a correction factor to homes rated E, F or G on leases that began before 14 October 2022; Flanders does the same for labels D, E, F or no label on leases that began before 1 October 2022 (${h.src('vlCorrectie', 'Flemish government page')}); Wallonia limited the increase between November 2022 and October 2023 by label. The ${h.a('be-bxl', 'Brussels')}, ${h.a('be-wal', 'Wallonia')} and ${h.a('be-vl', 'Flanders')} pages apply each rule.</p>
<h2>Spain: CPI, IRAV and a temporary cap</h2>
<p>A Spanish residential lease is only updated if it contains a clause. For leases signed since 26 May 2023 the increase can never exceed the IRAV, an index INE created for this purpose and publishes monthly since late 2024; a clause that names no index means the IRAV. Royal Decree-law 29/2026, in force since 8 October 2026, adds an extraordinary rule for anniversaries falling between that date and 31 December 2027: no increase at all if the rent is above the state reference-price system, otherwise a new agreement or, failing one, 2% at most (${h.src('boeRdl29', 'BOE')}). The decree still has to be confirmed by Congress: an identical earlier decree lapsed on 2 October 2026 without confirmation, so the cap may change again.</p>
<h2>Italy: the FOI index and the Istat method</h2>
<p>Italian rents follow the FOI index excluding tobacco, published monthly by ${h.src('istatFoi', 'Istat')}. The annual update applies the change over twelve months for the month named in the lease: up to 100% if agreed in an open-market residential lease, usually 75% under an agreed-rent lease, and 75% at most for commercial property under Law 392/1978. A landlord who opted for the flat-rate tax on rent (cedolare secca) gives up the Istat update for as long as the option runs. To revalue a sum between two months, such as an old rent or a maintenance allowance, Istat multiplies the ratio of the two indices by the coefficients linking its bases (1.373, 1.071 and 1.214, the last since the move to base 2025 in January 2026).</p>
<h2>Portugal: one coefficient a year</h2>
<p>Each year INE works out a single coefficient from the average change in consumer prices excluding housing over the twelve months to August, and publishes it in the Diário da República by 30 October. It applies to rents from the following January, a year after the lease began or after the last increase, with 30 days’ written notice. The coefficient for 2027 is ${h.num(pt.valor, 4)}, set by ${h.src('drCoef2027', pt.aviso)}. Coefficients not applied in earlier years can be added up to three years back, and the new rent is rounded up to the next cent.</p>
<h2>Austria: the MieWeG since 2026</h2>
<p>Since 1 January 2026 the ${h.src('risMieWeG', 'Rent Value-Protection Act (MieWeG)')} sets how index clauses in residential leases work. Rents change once a year, on 1 April, by the average change in Statistik Austria’s consumer price index over the previous calendar year; the part above 3% only counts by half. With 2025 averaging ${h.num(at25, 1)} against ${h.num(at24, 1)} in 2024 (CPI 2020), the April 2026 adjustment is ${h.pc(atP)}, or ${h.pc(atMrg)} for flats under rent control (Richtwert, category or reasonable rent). The April 2027 figure depends on the 2026 average, which Statistik Austria publishes in January 2027.</p>
<h2>When you rent abroad: what changes from home</h2>
<p>Tenants and landlords who move between these countries tend to carry their home habits with them, and the habits do not travel well. Someone used to the Belgian system expects indexation to be automatic; in France, Spain or Italy it only exists if the lease says so. Someone used to the French IRL expects a quarterly index; in Belgium the month matters, and picking the month of signing instead of the month before costs or gains a few euros every year for the life of the lease. A Portuguese landlord applies a single national coefficient, while an Austrian one now has to wait for the annual average and the first of April.</p>
<p>The timing rules differ just as much. A French review can be asked for at any point in the year after its date but only counts from the request, so a landlord who waits six months loses six months of increase for good. A Belgian landlord can still claim three months back. A Portuguese landlord must warn the tenant thirty days ahead. A Spanish update applies from the anniversary, with the index known at that date. Before agreeing to any figure, check which of these rules your contract falls under, and keep a copy of the official index values used: every calculator on this site lists them with a link to the statistics office that published them.</p>
<p>Language is the last trap. The lease is written in the country’s language and uses its legal terms: révision, indexation, actualización, aggiornamento, atualização, Wertsicherung. Each country page keeps those terms next to the English explanation, so you can match the clause in your contract with the rule it refers to.</p>
<h2>Before you send a letter</h2>
<ul>
<li>Read the clause: it names the index, the reference period and the date. A clause can be stricter than the law, never looser.</li>
<li>Use the index of the right zone or region and of the right month or quarter: the calculators show both values used.</li>
<li>Check the date: in France and Belgium a late request loses money that cannot be claimed back.</li>
<li>Keep the result with its sources: every calculator lists the official values and links to them.</li>
</ul>`;
  },
};
export default t;
