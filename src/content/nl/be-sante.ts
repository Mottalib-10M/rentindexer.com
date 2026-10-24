import type { PageText } from '../../lib/types';

/** Gezondheidsindex : maandwaarden van Statbel in basis 2013 en 2025 (« gezondheidsindex », « gezondheidsindex huur »). */
const t: PageText = {
  slug: 'gezondheidsindex',
  nav: 'Gezondheidsindex per maand',
  card: 'De laatste gezondheidsindexen van Statbel in basis 2013 en basis 2025, en het verschil tussen twee maanden om een bedrag te indexeren.',
  title: 'Gezondheidsindex van Statbel: maandcijfers in basis 2013',
  description: 'Gezondheidsindex van Statbel: laatste maand in basis 2013 en 2025, de twaalf vorige maanden, publicatiedatum en verschil tussen twee maanden voor uw huur.',
  h1: 'Gezondheidsindex: het cijfer van de maand en het verschil tussen twee maanden',
  intro: 'Kies de gezochte maand en een vergelijkingsmaand: de rekenhulp toont beide indexcijfers, het verschil en het geïndexeerde bedrag.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const nx = ((y: number, m: number) => (m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`))(Number(d.p.slice(0, 4)), Number(d.p.slice(5)));
    const vorig = `${Number(d.p.slice(0, 4)) - 1}${d.p.slice(4)}`;
    const v = (d.v / h.D.indiceSante(vorig)! - 1) * 100;
    return `De meest recente gezondheidsindex van Statbel, het Belgische statistiekbureau, is die van ${h.mois(d.p)}: ${h.num(d.v)} in basis 2013 en ${h.num(h.D.santeBase2025[d.p])} in basis 2025. Tegenover ${h.mois(vorig)} (${h.num(h.D.indiceSante(vorig)!)}) is dat een stijging met ${h.pc(v)} op een jaar. De gezondheidsindex is de consumptieprijsindex zonder tabak, alcoholische dranken en brandstoffen, behalve LPG, en is sinds 1994 de index voor de indexatie van woninghuurprijzen. Statbel publiceert het cijfer van een maand op het einde van die maand: de index van ${h.mois(nx)} is nog niet gepubliceerd en verschijnt eind ${h.mois(nx)}. Bij een huurindexatie hebt u nooit de index van de maand van de indexatie zelf nodig, maar die van de maand ervoor: wie de huur op 1 november 2026 indexeert, gebruikt de index van oktober 2026. De reeks in basis 2013, die de rekenhulpen van de Gewesten gebruiken, gaat in deze rekenhulp terug tot januari 1994, zodat ook oude huurcontracten berekend kunnen worden.`;
  },
  faqs: (h) => [
    { q: 'Welke basis van de gezondheidsindex moet ik nemen voor mijn huurcontract?', a: 'Neem voor beide maanden van de berekening dezelfde basis. De rekenhulpen van de Gewesten en deze pagina werken in basis 2013, wat een reeks vanaf 1994 oplevert. Staat er in een brief een cijfer in een andere basis, zoek dan ook het tweede cijfer in die basis op: de verhouding tussen twee maanden blijft dan vrijwel gelijk, op een afronding na.' },
    { q: 'Mag ik de cijfers van Statbel overnemen in een brief aan mijn huurder?', a: 'Ja. Statbel verspreidt zijn open data onder de licentie Creative Commons Naamsvermelding 4.0 (CC BY 4.0): u mag de cijfers overnemen, ook in een brief of tabel, als u de bron vermeldt. Noteer bijvoorbeeld „Statbel, gezondheidsindex, basis 2013” met de maand erbij, zodat de huurder de berekening zelf kan nagaan.' },
    { q: 'Wanneer verschijnt de volgende gezondheidsindex?', a: (() => { const d = h.D.dernierSante(); const nx = ((y: number, m: number) => (m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`))(Number(d.p.slice(0, 4)), Number(d.p.slice(5))); return `Statbel publiceert de index van een maand op het einde van die maand. Het laatste beschikbare cijfer is dat van ${h.mois(d.p)}, ${h.num(d.v)}; de index van ${h.mois(nx)} verschijnt eind ${h.mois(nx)}. De rekenhulp neemt het nieuwe cijfer over zodra het gepubliceerd is en geeft tot dan een melding in plaats van een geschatte waarde.`; })() },
  ],
  body: (h) => {
    const mois = h.D.moisSante().slice(0, 12);
    const rows = mois.map((m) => {
      const a = `${Number(m.slice(0, 4)) - 1}${m.slice(4)}`;
      return [h.mois(m), h.num(h.D.indiceSante(m)!), h.D.santeBase2025[m] !== undefined ? h.num(h.D.santeBase2025[m]) : '–', h.pc((h.D.indiceSante(m)! / h.D.indiceSante(a)! - 1) * 100)];
    });
    const d = h.D.dernierSante();
    const vijf = `${Number(d.p.slice(0, 4)) - 5}${d.p.slice(4)}`;
    return `<h2>De twaalf laatste gezondheidsindexen</h2>
${h.table(['Maand', 'Basis 2013', 'Basis 2025', 'Op een jaar'], rows, 'Bron: Statbel (open data, CC BY 4.0), nagekeken op 24 oktober 2026. Jaarverschil berekend in basis 2013.', ['l', 'r', 'r', 'r'])}
<p>Over vijf jaar, van ${h.mois(vijf)} (${h.num(h.D.indiceSante(vijf)!)}) tot ${h.mois(d.p)}, steeg de index met ${h.pc((d.v / h.D.indiceSante(vijf)! - 1) * 100)}. Dat verklaart waarom een huur die sinds 2021 niet meer geïndexeerd werd, bij een nieuwe indexatie in één keer fors stijgt: de formule vertrekt altijd van de basishuurprijs en het aanvangsindexcijfer, niet van de huur van vorig jaar.</p>
<h2>Welke maand opzoeken</h2>
<p>Voor een huurindexatie tellen twee maanden. Het nieuwe indexcijfer is overal dat van de maand vóór de verjaardag van de inwerkingtreding. Het aanvangsindexcijfer is in Vlaanderen dat van de maand vóór de inwerkingtreding, in Brussel en Wallonië dat van de maand vóór de ondertekening. Een contract dat op 20 maart ondertekend werd en op 1 april inging, vertrekt in Vlaanderen dus van de index van maart, in Brussel en Wallonië van die van februari.</p>
<p>De officiële cijfers staan op ${h.src('statbelSanteNl', 'de pagina gezondheidsindex van Statbel')} en in het Frans op ${h.src('statbelSante')}. Voor een huur gebruikt u beter ${h.a('be-home', 'de berekening van de huurindexatie')}, die de maanden zelf kiest en de correctie van het Gewest toepast, of voor Vlaanderen ${h.a('be-vl', 'de pagina over huurindexatie in Vlaanderen')}. Deze rekenhulp dient ook voor andere bedragen die aan de gezondheidsindex gekoppeld zijn: vul het bedrag en de twee maanden in.</p>`;
  },
};
export default t;
