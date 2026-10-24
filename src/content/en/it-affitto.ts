import type { PageText } from '../../lib/types';

/** Italy: annual Istat update of a lease rent (75% or 100%, cedolare secca). */
const t: PageText = {
  slug: 'italy-istat-rent-update',
  nav: 'Istat rent update (Italy)',
  card: 'The yearly Istat update of an Italian rent: 100% or 75% of the FOI change depending on the lease, and none under the cedolare secca.',
  title: 'Istat rent update in Italy: 75% or 100% of the FOI change',
  description: 'Istat rent update (aggiornamento Istat) for Italian leases: the FOI change for the month in the lease, 75% or 100% by lease type, none under cedolare secca.',
  h1: 'The Istat rent update: what an Italian landlord can add each year',
  intro: 'Enter the rent, the Istat month named in the lease and the type of lease: the tool applies the right share of the FOI change.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const a = h.E.aggiornaIt(1000, u.varAnno!, 'libero', 1), b = h.E.aggiornaIt(1000, u.varAnno!, 'commerciale', 0.75);
    return `Most Italian leases let the landlord update the rent once a year in line with Istat’s FOI index excluding tobacco: the aggiornamento Istat. What is applied is the index’s twelve-month change for the month named in the lease, in full or in part. The latest published change is for ${h.mois(u.m)}: ${h.pc(u.varAnno!, 1)}. On a rent of €1,000 a month, a 100% update gives ${h.eur(a.nouveauLoyer)} and a 75% update ${h.eur(b.nouveauLoyer)}. The share depends on the lease. For premises not used as a home, such as shops and offices, article 32 of Law 392/1978 caps the increase at 75% of the change recorded by Istat. For homes let at an open-market rent (the 4+4 contract under Law 431/1998), the parties can agree up to 100%; agreed-rent contracts (3+2) follow the local territorial agreement, usually 75%. If the landlord has opted for the flat-rate tax on rental income, the cedolare secca, the right to ask for the Istat update is suspended for as long as the option runs, even if the lease provides for it.`;
  },
  faqs: (h) => {
    const u = h.D.ultimoFoi();
    return [
      { q: 'Is the Istat update automatic on an Italian lease?', a: 'No. Law 392/1978 frames it as an annual update at the landlord’s request, and most leases repeat that wording. If the landlord does not ask, the rent stays as it is. Whether a missed year can be claimed later depends on the wording of your lease, which is worth reading carefully or having checked locally.' },
      { q: 'My landlord uses the cedolare secca: can the rent still go up?', a: 'Not through the Istat clause. Legislative Decree 23/2011, article 3(11), suspends the landlord’s right to ask for any rent update, including the Istat change, for the whole period of the option. The landlord can only apply the clause again once the option ends. The tool shows no increase when you select the cedolare secca.' },
      { q: `How much does a €1,800 shop rent rise with the ${h.mois(u.m)} change?`, a: `At 75% of the ${h.pc(u.varAnno!, 1)} FOI change, the legal maximum for a commercial lease, the rent becomes ${h.eur(h.E.aggiornaIt(1800, u.varAnno!, 'commerciale', 0.75).nouveauLoyer)} a month. A clause allowing 100% would not be valid for a shop: the 75% cap in Law 392/1978 applies to premises not used as a home.` },
    ];
  },
  body: (h) => {
    const regimes = [
      ['Home, open-market rent (4+4)', 'Law 431/1998', 'Up to 100% if agreed'],
      ['Home, agreed rent (3+2)', 'Territorial agreement', 'Usually 75%'],
      ['Shop, office, other non-residential', 'Law 392/1978, art. 32', '75% at most'],
      ['Any lease under cedolare secca', 'Leg. Decree 23/2011, art. 3(11)', 'No update'],
    ];
    const months = h.D.mesiFoi().filter((m) => h.D.foi(m)!.varAnno !== undefined).slice(0, 6).map((m) => { const v = h.D.foi(m)!.varAnno!; return [h.mois(m), h.pc(v, 1), h.eur(h.E.aggiornaIt(1000, v, 'libero', 1).nouveauLoyer), h.eur(h.E.aggiornaIt(1000, v, 'commerciale', 0.75).nouveauLoyer)]; });
    return `<h2>Which share for which lease</h2>
${h.table(['Lease', 'Rule', 'Share of the FOI change'], regimes, `Sources: ${h.src('l392')}; ${h.src('l431')}.`, ['l', 'l', 'l'])}
<h2>A €1,000 rent with recent months</h2>
${h.table(['Istat month in the lease', 'FOI change', 'New rent at 100%', 'New rent at 75%'], months, 'Twelve-month change of the FOI excluding tobacco (Istat). Rent rounded to the cent.', ['l', 'r', 'r', 'r'])}
<p>The month is the one stated in the lease, often the month before the anniversary. Ask for the update in writing, giving the month, the published change, the share applied and the new rent. The full series is in ${h.a('it-foi', 'the FOI index')}; revaluing a sum between any two months is in ${h.a('it-home', 'the Istat revaluation')}.</p>`;
  },
};
export default t;
