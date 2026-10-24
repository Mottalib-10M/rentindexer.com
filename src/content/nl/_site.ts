import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Huur geïndexeerd: uitgever en redactiebeleid, Radif Partners',
    description: 'Wie Huur geïndexeerd uitgeeft, waar de indexcijfers vandaan komen, hoe pagina’s worden nagekeken en verbeterd en hoe u een fout meldt: Radif Partners.',
    h1: 'Wie Huur geïndexeerd uitgeeft',
    body: (h) => `<p>Huur geïndexeerd wordt uitgegeven door het bedrijf Radif Partners. De site doet één ding: het officiële indexcijfer dat de wet van het land aanwijst op een huurcontract toepassen, met de regels die de verhoging beperken of blokkeren, en elk cijfer tonen met zijn bron en maand. Voor België gaat het om de gezondheidsindex van Statbel en de regels van het Vlaamse, het Brusselse en het Waalse Gewest. Dezelfde rekenhulpen bestaan voor Frankrijk, Spanje, Italië, Portugal en Oostenrijk.</p>
<p>De site is niet verbonden aan een overheid, een statistiekbureau of een vastgoedkantoor. Ze verkoopt niets, vraagt geen contactgegevens en geeft niets door aan derden: elke berekening gebeurt in uw browser.</p>
<h2>Uitgever</h2>
<!--identite-->
<h2 id="editorial">Redactiebeleid</h2>
<p>Elk indexcijfer wordt bij de bron nagekeken: de open data van Statbel voor de gezondheidsindex, Insee, INE, Istat, het Diário da República en Statistik Austria voor de andere landen. Een script haalt via de officiële interfaces de laatste 13 maanden van de gezondheidsindex bij Statbel op, en de reeksen van Insee, INE, Istat en Statistik Austria. De oudere Belgische reeks komt uit de tabel „indices” van de rekenmodule van Brussel Huisvesting en wordt maand per maand met Statbel vergeleken. De Vlaamse correctiefactoren, de Portugese coëfficiënten en de schakelcoëfficiënten van Istat worden met de hand ingevoerd, na lezing van de officiële tekst. Elke pagina vermeldt wanneer de cijfers het laatst zijn nagekeken. Een rechtsregel wordt pas geschreven na lezing van de officiële tekst of de pagina van het Gewest die hem bevat; die staat onderaan de pagina gelinkt.</p>
<p>Is een indexcijfer nog niet verschenen, dan zegt de pagina dat en vult ze niets in: de rekenhulp toont “nog niet gepubliceerd” in plaats van een schatting die voor officieel zou doorgaan. De rekenvoorbeelden komen uit de rekenmotor van de site, die automatisch wordt getoetst aan de voorbeelden van de overheid.</p>
<p>De pagina’s worden minstens eenmaal per jaar herzien, en de tabellen bij elk nieuw indexcijfer. Een inhoudelijke verbetering wordt onderaan de pagina gedateerd.</p>
<h2 id="contact">Contact en foutmelding</h2>
<p>Een verkeerd indexcijfer, een verkeerd begrepen regel of een geval dat de rekenhulp niet behandelt: schrijf naar <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> met het adres van de pagina en, als het kan, de bron die de pagina tegenspreekt. Over een concreet geschil antwoorden we niet; daarvoor kunt u terecht bij een huurdersbond, het woonloket van uw gemeente of een advocaat.</p>
<p>De berekening per Gewest staat op de pagina ${h.a('method', 'methode en bronnen')}.</p>`,
  },
  method: {
    title: 'Huurindexatie: methode, bronnen en grenzen van de berekening',
    description: 'De formule per Gewest, de reeks van Statbel, de afronding, het bijwerken van de indexcijfers en de bekende grenzen van de rekenhulpen van Huur geïndexeerd.',
    h1: 'Hoe de berekeningen werken',
    body: (h) => `<p>Elke rekenhulp past de formule toe die de regelgeving van het land of het Gewest voorschrijft, met de reeks van het bevoegde statistiekbureau, afgerond zoals de tekst het vraagt.</p>
<h2>België</h2>
<p>Basishuurprijs × nieuwe gezondheidsindex / aanvangsindex (basis 2013: ${h.src('statbelSanteNl', 'Statbel')} voor de laatste 13 maanden, de rekenmodule van Brussel Huisvesting voor de oudere maanden). In Vlaanderen is de aanvangsindex die van de maand vóór de inwerkingtreding van het contract; in Brussel en Wallonië die van de maand vóór de ondertekening. De nieuwe index is die van de maand vóór de verjaardag. De correctiefactoren voor zwakke EPC-labels in Vlaanderen (${h.src('vlCorrectie', 'Vlaamse overheid')}), de Brusselse correctiefactor voor PEB E, F en G en de Waalse beperking van 2022-2023 volgen de pagina’s van de Gewesten. De indexsprong van 2016 wordt niet berekend. Het resultaat wordt op de cent afgerond.</p>
<h2>Andere landen</h2>
<p>Frankrijk: huur × IRL van het referentiekwartaal / IRL een jaar eerder. Spanje: jaarlijkse verandering van de CPI of de IRAV met de wettelijke plafonds. Italië: jaarlijkse verandering van de FOI-index, tegen 75 % of 100 %. Portugal: jaarlijkse coëfficiënten uit het Diário da República, naar boven afgerond. Oostenrijk: gemiddelde verandering van de VPI volgens het Mieten-Wertsicherungsgesetz.</p>
<h2>Bijwerken en grenzen</h2>
<p>De reeksen worden opnieuw opgehaald via de officiële interfaces; de Vlaamse correctiefactoren worden met de hand bijgewerkt. Een berekening vervangt het lezen van het huurcontract niet: een bijzondere clausule gaat voor op het algemene geval, en een rechter kan een betwist geval anders beslechten.</p>`,
    faqs: (h) => [
      { q: 'Waarom gebruikt de site de gezondheidsindex in basis 2013?', a: 'Omdat de meeste lopende huurcontracten en de rekenvoorbeelden van de Gewesten in die basis zijn opgesteld, en omdat Statbel ze maandelijks blijft publiceren naast de nieuwe basis 2025. Het rekenresultaat hangt niet af van de basis zolang de aanvangsindex en de nieuwe index uit dezelfde reeks komen: de verhouding tussen twee maanden blijft dan gelijk.' },
      { q: 'Wanneer worden de indexcijfers op de site bijgewerkt?', a: 'Statbel publiceert de gezondheidsindex van een maand op het einde van die maand. Kort daarna haalt het script van de site de nieuwe waarde op, vergelijkt ze met de vorige en werkt de tabellen en de rekenhulp bij. De datum van de laatste controle staat onderaan elke pagina; een maand die nog niet verschenen is, wordt nooit geschat.' },
      { q: 'Houdt de rekenhulp rekening met de indexsprong van 2016?', a: 'Nee. De indexsprong die rond 2016 voor sommige lopende contracten gold, wordt niet berekend; in Wallonië werd het decreet van 3 maart 2016 daarover in 2018 door het Grondwettelijk Hof vernietigd en door een nieuw decreet vervangen. Valt uw contract daaronder, controleer dan eerst de huurprijs die toen gold en vertrek van dat bedrag.' },
    ],
  },
};
export default s;
