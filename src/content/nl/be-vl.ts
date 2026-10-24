import type { PageText, Helpers } from '../../lib/types';

/** Huurindexatie in Vlaanderen : aanvangsindexcijfer van de maand vóór de inwerkingtreding en correctiefactor (« huurindexatie vlaanderen »). */
const MAANDEN = ['10', '11', '12', '01', '02', '03', '04', '05', '06', '07', '08', '09'];
const F = (h: Helpers) => h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire as Record<string, { D: number; EFsans: number }>;

const t: PageText = {
  slug: 'huurindexatie-vlaanderen',
  nav: 'Huurindexatie in Vlaanderen',
  card: 'De Vlaamse regels: aanvangsindexcijfer van de maand vóór de inwerkingtreding, correctiefactor voor EPC D, E, F of geen EPC, en laattijdige indexatie.',
  title: 'Huurindexatie Vlaanderen: correctiefactor en EPC in 2026',
  description: 'Huurindexatie in Vlaanderen: aanvangsindex van de maand vóór de start, correctiefactor per maand voor EPC D, E, F of geen EPC, officieel voorbeeld, late vraag.',
  h1: 'Huurindexatie in Vlaanderen: aanvangsindex en correctiefactor',
  intro: 'Het Gewest staat al op Vlaanderen: vul de basishuurprijs, de maand van inwerkingtreding en het EPC-label in voor de eisbare huurprijs.',
  resume: (h) => {
    const ex = h.E.indexerFlandre({ loyerBase: 600, indiceDepart: h.D.indiceSante('2019-10')!, nouvelIndice: h.D.indiceSante('2024-10')!, moisAnniversaire: '11', epc: 'D', entreeVigueur: '2019-11-01', facteurs: F(h) });
    return `In Vlaanderen mag de huurprijs één keer per jaar geïndexeerd worden, vanaf de verjaardag van het huurcontract, de datum waarop het inging, behalve als het contract indexatie uitdrukkelijk uitsluit. De berekening is basishuurprijs × nieuw indexcijfer / aanvangsindexcijfer, met als aanvangsindexcijfer de gezondheidsindex van de maand vóór de inwerkingtreding, niet vóór de ondertekening. Het voorbeeld van vlaanderen.be: een contract ondertekend op 15 oktober 2019, gestart op 1 november 2019, basishuurprijs 600 euro. Het aanvangsindexcijfer is dat van oktober 2019 (${h.num(h.D.indiceSante('2019-10')!)}), het nieuwe cijfer in november 2024 dat van oktober 2024 (${h.num(h.D.indiceSante('2024-10')!)}): volledig geïndexeerd ${h.eur(600 * h.D.indiceSante('2024-10')! / h.D.indiceSante('2019-10')!)}. Omdat de woning een EPC-label D heeft en het contract vóór 1 oktober 2022 in werking trad, geldt de correctiefactor voor november, ${h.num(F(h)['11'].D, 9)}: de eisbare huurprijs is ${h.eur(ex.nouveauLoyer)}. Die factor blijft gelden bij elke indexatie, tot er een beter EPC is of een nieuw contract start. De verhuurder moet de indexatie schriftelijk vragen.`;
  },
  faqs: (h) => [
    { q: 'Welke gezondheidsindex geldt als de verhuurder de indexatie maanden te laat vraagt?', a: 'Volgens vlaanderen.be geldt dan de gezondheidsindex van het moment van de schriftelijke melding, en mag de nieuwe huur hoogstens drie maanden terugwerken. Een contract dat op 1 maart 2025 startte en waarvoor de indexatie pas op 1 juli 2026 gevraagd wordt, geeft recht op de geïndexeerde huur vanaf 1 april 2026. De rekenhulp rekent standaard met de maand vóór de verjaardag; kies bij een late vraag zelf de index op de pagina van de gezondheidsindex.' },
    { q: 'Mijn verhuurder heeft net een nieuw EPC met label B: vanaf wanneer volledig indexeren?', a: 'Vanaf de dag dat hij over het nieuwe, gunstige EPC-attest beschikt. Voor de maand waarin hij het attest kreeg, wordt pro rata gerekend: tot die dag met de correctiefactor, daarna volledig. Hij mag de volledige indexatie niet drie maanden terug vragen voor een periode waarin het betere label er nog niet was. Volledige indexatie zonder correctie mag alleen bij A+, A, B of C.' },
    { q: 'Wat als mijn EPC-attest geen label vermeldt, alleen een kengetal?', a: 'Dan leidt u het label af uit het kengetal in kWh per vierkante meter en per jaar. Meer dan 500 komt overeen met F, van 401 tot 500 met E, van 301 tot 400 met D, van 201 tot 300 met C, van 101 tot 200 met B, van 1 tot 100 met A, en 0 of minder met A+. Met dat label kiest u de juiste correctiefactor.' },
  ],
  body: (h) => {
    const f = F(h);
    const rows = MAANDEN.map((m) => [h.mois(`2026-${m}`).replace(' 2026', ''), h.num(f[m].D, 9), h.num(f[m].EFsans, 9)]);
    return `<h2>Correctiefactoren per verjaardag</h2>
${h.table(['Verjaardag van het contract', 'EPC D', 'EPC E, F of geen'], rows, 'Bron: vlaanderen.be, „Huurprijsindexatie met correctiefactoren”, gelezen op 24 oktober 2026.', ['l', 'r', 'r'])}
<p>De regelgeving voorziet een decretale formule; Vlaanderen publiceert daarnaast deze vereenvoudigde factoren, die hetzelfde resultaat geven. U vermenigvuldigt het resultaat van de standaardformule met de factor van de maand waarin het contract verjaart. De rekenhulp doet dat automatisch en toont ook de volledig geïndexeerde huur, zodat u het verschil ziet.</p>
<h2>Wanneer de correctiefactor geldt</h2>
<ul>
<li>De woning wordt als hoofdverblijfplaats op de private huurmarkt verhuurd. Sociale woningen vallen erbuiten, maar het hoofdhuurcontract van een woning die via een woonmaatschappij verhuurd wordt, valt er wel onder.</li>
<li>Het contract trad in werking vóór 1 oktober 2022, onder de Woninghuurwet of het Vlaams Woninghuurdecreet. Een contract dat later inging, wordt normaal geïndexeerd.</li>
<li>De woning heeft een EPC-label D, E of F, of geen geldig EPC; een vervallen EPC telt als geen EPC. Alleen die woningen vielen ook onder de bevriezing van de huurprijzen tot en met 30 september 2023.</li>
</ul>
<p>Het Grondwettelijk Hof besliste op 21 maart 2024 dat de maatregel ook voor studentenhuurcontracten had moeten gelden; studenten met een contract van vóór 1 oktober 2022 voor een energieverslindend kot kunnen mogelijk een deel van de huur terugvorderen. Dat geval berekent de rekenhulp niet.</p>
<h2>Als de verhuurder toch volledig indexeert</h2>
<p>Vraagt de verhuurder de volledige indexatie terwijl de correctiefactor verplicht is, dan hoeft de huurder die niet te betalen en mag hij de vorige huurprijs blijven betalen. Het is dan aan de verhuurder om een correcte indexatie met correctiefactor te vragen, met hoogstens drie maanden terugwerkende kracht. Houdt hij voet bij stuk, dan moet hij naar de vrederechter. De officiële uitleg staat op ${h.src('vlCorrectie', 'vlaanderen.be')}; de indexcijfers op ${h.src('statbelSanteNl', 'de pagina gezondheidsindex van Statbel')}. Voor Brussel en Wallonië, zie ${h.a('be-home', 'huurindexatie in de drie Gewesten')}; voor het cijfer van een maand, ${h.a('be-sante', 'de gezondheidsindex')}.</p>`;
  },
};
export default t;
