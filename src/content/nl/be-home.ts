import type { PageText, Helpers } from '../../lib/types';

/** Root /nl/ : huurindexatie in de drie Gewesten (« huurindexatie », « indexatie huur berekenen », « huur indexeren »). */
type Reg = 'bruxelles' | 'wallonie' | 'flandre';
/** Zelfde stappen als de rekenhulp BeCalc : aanvangsindexcijfer, nieuw indexcijfer, regionale correctie. */
function calc(h: Helpers, reg: Reg, loyer: number, sign: string, entree: string, an: number, label: string) {
  const ed = `${entree}-01`, em = entree.slice(5);
  const mDep = h.E.moisPrecedent(reg === 'flandre' ? ed : `${sign}-01`), mNew = h.E.moisPrecedent(`${an}-${em}-01`);
  const dep = h.D.indiceSante(mDep)!, nouv = h.D.indiceSante(mNew)!;
  const s = (m: string) => h.D.indiceSante(m)!;
  let r;
  if (reg === 'bruxelles') {
    if (label === 'sans') return { r: null, dep, nouv, mDep, mNew };
    const [y1, y2] = h.E.anniversairesCorrectionBxl(ed);
    r = h.E.indexerBruxelles({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label as 'A', entreeVigueur: ed, indicesCorrection: [s(h.E.moisPrecedent(`${y1}-${em}-01`)), s(h.E.moisPrecedent(`${y2}-${em}-01`))] });
  } else if (reg === 'wallonie') {
    const a = h.E.anniversaire2223(ed);
    r = h.E.indexerWallonie({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label as 'A', entreeVigueur: ed, indiceAnniv2223: s(h.E.moisPrecedent(a)), indiceAnnivPrecedent: s(h.E.moisPrecedent(`${Number(a.slice(0, 4)) - 1}${a.slice(4)}`)) }, h.D.regles.be.wallonie.limitation_2022_2023.part_indexation);
  } else {
    r = h.E.indexerFlandre({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, moisAnniversaire: em, epc: (label === 'G' ? 'F' : label) as 'A', entreeVigueur: ed, facteurs: h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire });
  }
  return { r, dep, nouv, mDep, mNew };
}

const t: PageText = {
  slug: '',
  nav: 'Huurindexatie',
  card: 'De indexatie van de huurprijs berekenen in Vlaanderen, Brussel en Wallonië, met de gezondheidsindex en de correctie voor energiezuinige en -verslindende woningen.',
  title: 'Huurindexatie 2026: huur indexeren in de drie Gewesten',
  description: 'Huurindexatie in 2026 berekenen: formule met de gezondheidsindex, aanvangsindexcijfer per Gewest, correctiefactor voor EPC D, E, F, Brusselse en Waalse regels.',
  h1: 'Huurindexatie: zo berekent u de geïndexeerde huurprijs',
  intro: 'Kies het Gewest, vul de basishuurprijs en de data van het contract in: de rekenhulp neemt de juiste gezondheidsindexen en past de regionale correctie toe.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const nx = ((y: number, m: number) => (m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`))(Number(d.p.slice(0, 4)), Number(d.p.slice(5)));
    const v = calc(h, 'flandre', 850, '2021-05', '2021-06', 2026, 'C');
    return `Een woninghuurprijs mag in België één keer per jaar geïndexeerd worden, ten vroegste op de verjaardag van de inwerkingtreding van het huurcontract, tenzij het contract indexatie uitdrukkelijk uitsluit. De formule is in de drie Gewesten dezelfde: basishuurprijs × nieuw indexcijfer / aanvangsindexcijfer. De basishuurprijs is de huur uit het contract, zonder kosten en lasten; het nieuwe indexcijfer is de gezondheidsindex van de maand vóór de verjaardag. Het aanvangsindexcijfer verschilt: in Vlaanderen is het de index van de maand vóór de inwerkingtreding van het contract, in Brussel en Wallonië die van de maand vóór de ondertekening. De laatste gezondheidsindex van Statbel is die van ${h.mois(d.p)}: ${h.num(d.v)} in basis 2013; de index van ${h.mois(nx)} verschijnt eind ${h.mois(nx)}. Een Vlaams contract van 850 euro dat in juni 2021 inging, komt met een EPC-label C in juni 2026 op ${h.eur(v.r!.nouveauLoyer)}. Indexeren gebeurt nooit automatisch: de verhuurder moet het schriftelijk vragen en kan hoogstens drie maanden terugwerken. Voor woningen met een zwak energielabel gelden extra correcties per Gewest.`;
  },
  faqs: (h) => [
    { q: 'Wat is het verschil tussen de gezondheidsindex en de gewone consumptieprijsindex?', a: 'De gezondheidsindex is de consumptieprijsindex zonder tabak, alcoholische dranken en brandstoffen, met uitzondering van LPG. Hij wordt sinds 1994 gebruikt om woninghuurprijzen te indexeren, en Statbel publiceert hem elke maand samen met de gewone index. Voor een woninghuur zijn de formule en de rekenhulpen van de Gewesten op de gezondheidsindex gebouwd, niet op de gewone index.' },
    { q: 'Mag de verhuurder de huur indexeren als het huurcontract mondeling werd afgesloten?', a: 'In Vlaanderen is indexatie bij een mondelinge huurovereenkomst alleen mogelijk als bewezen is dat beide partijen ze overeengekomen zijn, wat volgens vlaanderen.be in de praktijk erg moeilijk is. Zonder geschreven contract ontbreken bovendien de basishuurprijs en de data die de formule nodig heeft. Een schriftelijk contract maakt de berekening en het bewijs veel eenvoudiger, voor beide partijen.' },
    { q: 'Kan de huurprijs ook dalen bij een huurindexatie?', a: 'Ja, in theorie. De formule vergelijkt het nieuwe indexcijfer met het aanvangsindexcijfer: als de gezondheidsindex lager zou liggen dan bij de start van het contract, levert de berekening een lagere huur op. In de praktijk is dat zeldzaam, omdat de index op lange termijn stijgt. Een daling ten opzichte van vorig jaar verlaagt de huur alleen tot het bedrag dat de formule met de basishuurprijs geeft.' },
    { q: 'Moet ik als huurder de geïndexeerde huur betalen zodra de verhuurder ze vraagt?', a: 'Ja, als de berekening klopt en aan de regels van het Gewest voldaan is. Vraagt de verhuurder te veel, bijvoorbeeld zonder de verplichte correctiefactor, dan mag u volgens vlaanderen.be de vorige huurprijs blijven betalen tot hij een correcte berekening stuurt. Blijft hij bij zijn eis, dan moet hij naar de vrederechter stappen.' },
    { q: 'Hoe vaak mag de huur geïndexeerd worden als het contract verlengd wordt?', a: 'Nog altijd één keer per jaar, op de verjaardag van de inwerkingtreding. Volgens vlaanderen.be gebeurt een verlenging onder dezelfde voorwaarden en blijft de huurprijs dezelfde, zodat de berekening op dezelfde basis doorloopt. Pas met een nieuw contract, dat op een nieuwe datum ingaat, verandert de berekening: dan start alles opnieuw met een nieuwe basishuurprijs en een nieuw aanvangsindexcijfer.' },
    { q: 'Mag de verhuurder de huur indexeren als hij het huurcontract niet heeft laten registreren?', a: 'In Brussel en Wallonië niet. Brussel vereist een geregistreerd contract en een geldig EPB-certificaat dat aan de huurder bezorgd is. In Wallonië moet een contract voor een hoofdverblijfplaats sinds 1 september 2018 geregistreerd zijn, ook als het daarvoor al liep. De Vlaamse pagina’s die wij gelezen hebben, koppelen de indexatie niet aan de registratie; vraag bij twijfel raad aan een woonloket.' },
    { q: 'Waarom geeft de rekenhulp een ander bedrag dan mijn verhuurder?', a: 'Meestal door een andere maand: het aanvangsindexcijfer moet de maand vóór de ondertekening (Brussel, Wallonië) of vóór de inwerkingtreding (Vlaanderen) zijn, het nieuwe indexcijfer de maand vóór de verjaardag. Een tweede oorzaak is de correctiefactor die vergeten of verkeerd gekozen is. Ook een ander basisjaar van de index kan enkele centen verschil geven.' },
  ],
  body: (h) => {
    const labels = ['C', 'D', 'E', 'F', 'sans'];
    const rows = labels.map((l) => {
      const cell = (reg: Reg) => { const x = calc(h, reg, 850, '2021-05', '2021-06', 2026, l); return x.r ? h.eur(x.r.nouveauLoyer) : 'geen indexatie'; };
      return [l === 'sans' ? 'Geen certificaat' : l, cell('flandre'), cell('bruxelles'), cell('wallonie')];
    });
    const v = calc(h, 'flandre', 850, '2021-05', '2021-06', 2026, 'C'), b = calc(h, 'bruxelles', 850, '2021-05', '2021-06', 2026, 'C');
    const ex = calc(h, 'flandre', 720, '2023-08', '2023-09', 2026, 'B');
    return `<h2>De berekening in drie stappen</h2>
<ol>
<li><strong>De basishuurprijs</strong>: de huur die in het contract staat, zonder kosten en lasten. Niet de huur van vorig jaar: elke indexatie vertrekt opnieuw van het oorspronkelijke bedrag.</li>
<li><strong>Het aanvangsindexcijfer</strong>: de gezondheidsindex van de maand vóór de inwerkingtreding (Vlaanderen) of vóór de ondertekening (Brussel, Wallonië).</li>
<li><strong>Het nieuwe indexcijfer</strong>: de gezondheidsindex van de maand vóór de verjaardag van de inwerkingtreding, in hetzelfde basisjaar.</li>
</ol>
<p>Daarna is het een eenvoudige verhouding. Een contract van 720 euro dat op 1 september 2023 inging, vertrekt in Vlaanderen van de index van ${h.mois(ex.mDep)} (${h.num(ex.dep)}). In september 2026 is het nieuwe indexcijfer dat van ${h.mois(ex.mNew)} (${h.num(ex.nouv)}): 720 × ${h.num(ex.nouv)} / ${h.num(ex.dep)} = ${h.eur(ex.r!.nouveauLoyer)}. Omdat het contract na 1 oktober 2022 inging, speelt het EPC-label hier geen rol.</p>
<h2>Hetzelfde contract in de drie Gewesten</h2>
${h.table(['EPC / EPB', 'Vlaanderen', 'Brussel', 'Wallonië'], rows, `Basishuurprijs 850 euro, ondertekend in mei 2021, in werking in juni 2021, indexatie van juni 2026 (index van ${h.mois(v.mNew)}: ${h.num(v.nouv)}). Berekening van de rekenhulp.`, ['l', 'r', 'r', 'r'])}
<p>Met een goed label verschillen de drie bedragen nauwelijks: Vlaanderen vertrekt van de index van ${h.mois(v.mDep)} (${h.num(v.dep)}), Brussel en Wallonië van die van ${h.mois(b.mDep)} (${h.num(b.dep)}). Vanaf label D lopen de regels uiteen. Vlaanderen corrigeert vanaf D en ook zonder EPC, Brussel pas vanaf E, Wallonië houdt rekening met een aangepaste huur uit 2022-2023. Zonder certificaat blokkeert Brussel elke indexatie.</p>
<h2>Vlaanderen: de correctiefactor</h2>
<p>Voor een woning die als hoofdverblijfplaats op de private huurmarkt verhuurd wordt, met een contract dat vóór 1 oktober 2022 in werking trad en een EPC-label D, E of F of geen geldig EPC, wordt het resultaat van de standaardformule vermenigvuldigd met een correctiefactor. Die factor hangt af van de maand van de verjaardag en van het label, en geldt bij elke indexatie zolang er geen beter EPC is of geen nieuw contract start. Een vervallen EPC telt als geen EPC. De volledige tabel staat op ${h.src('vlCorrectie', 'vlaanderen.be')}; de uitleg met het officiële voorbeeld leest u op ${h.a('be-vl', 'de pagina over huurindexatie in Vlaanderen')}.</p>
<h2>Brussel: EPB-certificaat en correctiefactor</h2>
<p>In het Brussels Hoofdstedelijk Gewest moet de verhuurder het contract geregistreerd hebben en de huurder een EPB-certificaat bezorgd hebben dat geldig is op het moment van de indexatievraag. Zonder dat certificaat is geen indexatie mogelijk. Voor contracten die vóór 14 oktober 2022 in werking traden en een EPB E, F of G hebben, geldt een correctiefactor, berekend uit de gezondheidsindexen van de verjaardagen in 2021 en 2022, of in 2022 en 2023, afhankelijk van de datum van de verjaardag. De sociale verhuurders SISP en het Woningfonds vallen erbuiten. De officiële uitleg en tabel staan op ${h.src('bxlCorrection', 'be.brussels')}, alleen in het Frans; de Franstalige pagina ${h.a('be-bxl', 'over Brussel')} werkt het officiële voorbeeld uit.</p>
<h2>Wallonië: de beperking van 2022-2023</h2>
<p>In Wallonië was de indexatie beperkt voor verjaardagen tussen 1 november 2022 en 31 oktober 2023: volledig voor EPB A, B en C, voor 75 procent bij D, voor 50 procent bij E, en niet voor F, G of zonder certificaat. Die beperking werkt door: de toen „aangepaste” huur wordt de nieuwe basishuurprijs, en de index van die verjaardag het nieuwe aanvangsindexcijfer. De Waalse pagina ${h.src('walIndexer', 'Indexer un loyer')} legt het uit. De rekenhulp berekent de indexsprong van 2016 niet, die geldt voor contracten die op 1 april 2016 al liepen; meer op ${h.a('be-wal', 'de Franstalige pagina over Wallonië')}.</p>
<h2>Schriftelijk vragen, hoogstens drie maanden terug</h2>
<p>Een indexatie moet altijd schriftelijk gevraagd worden; in Wallonië volstaan een gewone brief, een sms of een e-mail, op voorwaarde dat de verzender een bewijs bewaart. Vraagt de verhuurder te laat, dan verliest hij zijn recht niet, maar hij kan de geïndexeerde huur slechts voor drie maanden terug vragen. Het Vlaamse voorbeeld: een contract dat op 1 maart 2025 startte, kan ten vroegste op 1 maart 2026 geïndexeerd worden. Een vraag op 1 januari 2026 werkt pas vanaf 1 maart; een vraag op 1 mei 2026 werkt terug tot 1 maart; een vraag op 1 juli 2026 werkt maar terug tot 1 april 2026.</p>
<p>Voor laattijdige vragen in Vlaanderen geldt volgens vlaanderen.be de gezondheidsindex van het moment van de schriftelijke melding. De rekenhulp neemt standaard de maand vóór de verjaardag; kies bij een late vraag zelf de juiste maand op ${h.a('be-sante', 'de pagina van de gezondheidsindex')}.</p>
<h2>Welke index bij welke verjaardag in 2026</h2>
${h.table(['Verjaardag in', 'Nieuw indexcijfer van', 'Waarde (basis 2013)'], ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((m) => { const im = h.E.moisPrecedent(`2026-${m}-01`); const x = h.D.indiceSante(im); return [h.mois(`2026-${m}`), h.mois(im), x !== undefined ? h.num(x) : 'nog niet gepubliceerd (eind ' + h.mois(im) + ')']; }), 'Gezondheidsindex van Statbel, maand vóór de verjaardag van de inwerkingtreding.', ['l', 'l', 'r'])}
<p>Deze tabel geldt in de drie Gewesten, want het nieuwe indexcijfer is overal dat van de maand vóór de verjaardag. Wat per Gewest verschilt, is alleen het aanvangsindexcijfer en de eventuele correctie. Voor een verjaardag in november 2026 is de index van oktober 2026 nodig, die Statbel eind oktober publiceert; voor december die van november, die eind november verschijnt. Wie vroeger rekent, ziet in de rekenhulp de melding dat de index nog niet beschikbaar is.</p>
<p>Kosten en lasten vallen buiten de indexatie: de basishuurprijs is de huur zonder kosten, en de lasten volgen hun eigen afrekening volgens het contract. Een huur met forfaitaire kosten splitst u dus eerst op voordat u de formule toepast.</p>
<h2>Wanneer indexeren niet mag</h2>
<ul>
<li>Het contract sluit indexatie uitdrukkelijk uit.</li>
<li>In Brussel: het contract is niet geregistreerd of de huurder kreeg geen geldig EPB-certificaat.</li>
<li>In Wallonië: het contract voor een hoofdverblijfplaats is niet geregistreerd.</li>
<li>De eerste verjaardag van de inwerkingtreding is nog niet bereikt.</li>
<li>In Vlaanderen: een mondeling contract zonder bewijs dat indexatie afgesproken werd.</li>
</ul>
<h2>Indexeren is niet hetzelfde als de huurprijs herzien</h2>
<p>De indexatie volgt alleen de gezondheidsindex. Een herziening is een echte aanpassing van de huurprijs, los van de index. In Vlaanderen kunnen huurder en verhuurder tussen de negende en de zesde maand vóór het einde van elke driejarige periode samen een nieuwe huurprijs afspreken. Lukt dat niet, dan kan een van beiden tussen de zesde en de derde maand naar de vrederechter, die de huur kan aanpassen als de normale huurwaarde door nieuwe omstandigheden minstens 20 procent hoger of lager ligt, of als ze door werken op kosten van de verhuurder minstens 10 procent gestegen is. Voor contracten vanaf 1 januari 2019 kan de verhuurder de huur ook herzien na energiebesparende maatregelen. Een herziening berekent deze rekenhulp niet.</p>
<h2>Zo leest u het resultaat</h2>
<p>De rekenhulp toont de volledig geïndexeerde huur, de eisbare huurprijs na een eventuele correctie, en de twee gebruikte indexcijfers met hun maand. In Vlaanderen vraagt ze geen datum van ondertekening, omdat alleen de inwerkingtreding telt. Bij een EPC-label F of G in Vlaanderen kiest u „F / G”: beide krijgen dezelfde correctiefactor als E. Verschijnt er een melding dat de index nog niet gepubliceerd is, dan gaat het om een maand waarvoor Statbel nog geen cijfer heeft; de index van een maand verschijnt op het einde van die maand. Met de kopieerknop neemt u de berekening over in een brief aan de huurder.</p>
<h2>Bronnen en uitgever</h2>
<p>De gezondheidsindexen komen van ${h.src('statbelSanteNl', 'Statbel')}, onder de open licentie CC BY 4.0, en worden bij elke maandelijkse publicatie bijgewerkt; de reeks in basis 2013 gaat terug tot januari 1994. De regels komen van de officiële pagina’s van de drie Gewesten. Deze site wordt uitgegeven door het bedrijf Radif Partners en is niet verbonden aan Statbel of aan een overheid. Hij geeft het resultaat van de formule en vervangt het contract niet; bij een geschil zijn een woonloket, een advocaat of de vrederechter de juiste aanspreekpunten.</p>`;
  },
};
export default t;
