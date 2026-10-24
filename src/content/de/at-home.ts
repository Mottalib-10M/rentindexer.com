import type { PageText, Helpers } from '../../lib/types';

/** Wurzel /de/ : Indexanpassung der Miete nach dem MieWeG (« mieweg », « indexanpassung miete », « mieten wertsicherungsgesetz », « wertsicherung miete »). */
const avg = (h: Helpers, j: number) => h.D.vpiIn(2020, String(j));
const prozent = (h: Helpers, jahr: number, mrg: boolean, monate?: number) => {
  const a = avg(h, jahr), b = avg(h, jahr - 1);
  if (a === undefined || b === undefined) return null;
  return h.E.mieWegProzent(a, b, { jahr, mrgBeschraenkt: mrg, ersteValorisierungMonate: monate });
};

const t: PageText = {
  slug: '',
  nav: 'Indexanpassung nach dem MieWeG',
  card: 'Die Anpassung der Wohnungsmiete am 1. April nach dem Mieten-Wertsicherungsgesetz: VPI-Durchschnitt, Halbierung über 3 %, Deckel für MRG-Mieten.',
  title: 'MieWeG 2026: Indexanpassung der Miete am 1. April berechnen',
  description: 'MieWeG und Indexanpassung der Miete: Anpassung am 1. April nach dem VPI-Jahresdurchschnitt, Hälfte über 3 %, Deckel für MRG-Mieten, erste Anpassung aliquot.',
  h1: 'Indexanpassung der Miete nach dem Mieten-Wertsicherungsgesetz',
  intro: 'Geben Sie die Miete, das Jahr der Anpassung und den Bezugsmonat ein: Der Rechner wendet das Berechnungsmodell des MieWeG an.',
  resume: (h) => {
    const a25 = avg(h, 2025)!, a24 = avg(h, 2024)!;
    const roh = (a25 / a24 - 1) * 100;
    const p = prozent(h, 2025, false)!, pm = prozent(h, 2025, true)!;
    return `Seit 1. Jänner 2026 begrenzt das Mieten-Wertsicherungsgesetz (MieWeG, BGBl. I Nr. 114/2025) jede vertragliche Wertsicherung von Wohnungsmieten im Anwendungsbereich des Mietrechtsgesetzes. Die Miete ändert sich nur noch einmal im Jahr, am 1. April, und zwar im Ausmaß der durchschnittlichen Veränderung des Verbraucherpreisindex im vorangegangenen Kalenderjahr, verglichen werden die Jahresdurchschnitte. Liegt diese Veränderung über drei Prozent, zählt der darüber liegende Teil nur zur Hälfte. Für die Anpassung am 1. April 2026 heißt das: VPI 2020 im Jahresdurchschnitt 2025 ${h.num(a25, 1)}, im Jahr 2024 ${h.num(a24, 1)}, Veränderung ${h.pc(roh)}, berücksichtigt werden ${h.pc(p)}. Bei Mieten, für die eine Mietzinsbeschränkung des MRG gilt, etwa Richtwert- oder Kategoriemieten, zählt die Veränderung für 2025 höchstens mit einem Prozent und für 2026 höchstens mit zwei Prozent: im April 2026 also ${h.pc(pm)}. Die erste Anpassung nach Vertragsabschluss erfolgt nur anteilig nach vollen Monaten, und der neue Betrag wird auf ganze Cent gerundet. Der Wert für April 2027 steht erst fest, wenn Statistik Austria im Jänner 2027 den Jahresdurchschnitt 2026 veröffentlicht.`;
  },
  faqs: (h) => {
    const p = prozent(h, 2025, false)!;
    return [
      { q: 'Gilt das MieWeG auch für meinen Mietvertrag aus dem Jahr 2019?', a: 'Ja, für Erhöhungen ab dem 1. Jänner 2026. Laut § 4 Abs. 2 ist § 1 auch auf Verträge anzuwenden, die vor 2026 geschlossen wurden. Hat bereits eine Valorisierung stattgefunden, gilt als Zeitpunkt des Vertragsabschlusses der Monat, auf den sich der Indexwert der letzten Anpassung bezogen hat. Ab dann rechnet die Miete nach dem neuen Modell weiter.' },
      { q: 'Darf der Vermieter die Miete wie früher bei Überschreiten von 5 % anpassen?', a: 'Eine Schwellenwertklausel bleibt im Vertrag stehen, aber für Wohnungsmieten im Anwendungsbereich des MRG begrenzt das MieWeG ihr Ergebnis. Eine Erhöhung kann nicht früher und nicht in größerem Umfang eintreten als nach dem Gesetz: nur am 1. April und höchstens im Ausmaß des Berechnungsmodells. Die Erhöhung tritt dort nur in dem Umfang ein, in dem sie zum vertraglichen Zeitpunkt eingetreten wäre.' },
      { q: 'Kann die Miete nach dem MieWeG auch sinken?', a: 'Das Gesetz spricht davon, dass sich das Entgelt erhöht oder vermindert. Sinkt der Jahresdurchschnitt des VPI gegenüber dem Vorjahr, ergibt das Berechnungsmodell eine Verminderung zum 1. April. In den vergangenen Jahren ist der Durchschnitt allerdings jedes Jahr gestiegen; der Rechner zeigt das Ergebnis mit Vorzeichen, falls es einmal anders kommt.' },
      { q: 'Was bedeutet die Halbierung über drei Prozent konkret?', a: `Steigt der VPI im Jahresdurchschnitt etwa um 5 %, zählen die ersten drei Prozentpunkte voll und die übrigen zwei nur zur Hälfte: Die Miete steigt um 4 %. Für die Anpassung am 1. April 2026 ergibt die Rechnung ${h.pc(p)} bei frei vereinbarter Miete. Bei Veränderungen bis 3 % wirkt die Halbierung nicht.` },
      { q: 'Muss die Klausel im Mietvertrag ausdrücklich auf das MieWeG verweisen?', a: 'Nein, aber sie kann es. § 2 erlaubt, eine Wertsicherung durch bloße Bezugnahme zu vereinbaren, etwa mit der Wendung „wertgesichert gemäß § 1 Abs. 2 des Mieten-Wertsicherungsgesetzes“. Bei MRG-Wohnungen mit Mietzinsbeschränkung, deren Vertrag vor dem 1. Dezember 2026 geschlossen wird, kann zusätzlich Abs. 3 genannt werden. Eine ältere Klausel bleibt gültig, wird aber durch das Gesetz begrenzt.' },
      { q: 'Gilt das Gesetz für Genossenschaftswohnungen?', a: 'Grundsätzlich nicht. § 1 Abs. 6 nimmt Verträge im Anwendungsbereich des Wohnungsgemeinnützigkeitsgesetzes (WGG) aus, außer die zulässige Höhe des Entgelts richtet sich nach § 13 Abs. 4 WGG. Für diese Ausnahme gilt das Berechnungsmodell wieder. Auch § 16 Abs. 9 MRG und Mietzinsvorschriften aus Förderungsbestimmungen bleiben vom MieWeG unberührt.' },
      { q: 'Wie lange gelten die Deckel von einem und zwei Prozent?', a: 'Nur für zwei Jahre. § 1 Abs. 3 begrenzt die Veränderung für das Jahr 2025, die bei der Anpassung am 1. April 2026 zählt, auf ein Prozent und für das Jahr 2026, die im April 2027 zählt, auf zwei Prozent. Für spätere Jahre sieht das Gesetz in seiner geltenden Fassung keinen Deckel vor; dann gilt auch für MRG-Mieten das allgemeine Modell mit der Halbierung über drei Prozent.' },
      { q: 'Was ist, wenn meine alte Wertsicherungsklausel unwirksam war?', a: 'Für Verträge, die vor 2026 geschlossen wurden, beschränkt § 4 Abs. 3 die Rückforderung auf Zahlungen der letzten fünf Jahre vor Vertragsende oder, bei laufendem Vertrag, vor Kenntnis der Unwirksamkeit. Die Ansprüche verjähren drei Jahre ab Kenntnis, längstens dreißig Jahre ab Zahlung. Ausnahmen gelten für vor 2026 eingeklagte Ansprüche und für missbräuchliche Klauseln; einen Einzelfall sollte eine Beratungsstelle prüfen.' },
    ];
  },
  body: (h) => {
    const jahre = [2021, 2022, 2023, 2024, 2025].map((j) => { const a = avg(h, j)!, b = avg(h, j - 1); return [String(j), h.num(a, 1), b !== undefined ? h.pc((a / b - 1) * 100) : '–']; });
    const p = prozent(h, 2025, false)!, pm = prozent(h, 2025, true)!;
    const frei = h.E.valorisierenAt(850, p), mrg = h.E.valorisierenAt(850, pm);
    const p9 = prozent(h, 2025, false, 9)!, e9 = h.E.valorisierenAt(1000, p9);
    const zz = (x: number) => h.pc(x);
    return `<h2>Das Berechnungsmodell in fünf Regeln</h2>
<p>§ 1 Abs. 2 des ${h.src('risMieWeG', 'Mieten-Wertsicherungsgesetzes')} legt fest, wie eine vertraglich vereinbarte Wertsicherung bei Wohnungsmieten höchstens wirken darf. Zusammengefasst:</p>
<ol>
<li><strong>Ein Termin im Jahr.</strong> Das Entgelt ändert sich am 1. April des vollen Kalenderjahrs nach Vertragsabschluss und danach jährlich am 1. April.</li>
<li><strong>Jahresdurchschnitte statt Monatswerte.</strong> Maßgeblich ist die durchschnittliche Veränderung des Verbraucherpreisindex 2020 (oder des an seine Stelle tretenden Index) im Kalenderjahr vor dem 1. April, ermittelt aus dem Vergleich der aufeinanderfolgenden Jahresdurchschnitte.</li>
<li><strong>Dämpfung über drei Prozent.</strong> Übersteigt die Veränderung drei Prozent, wird der darüber liegende Teil nur zur Hälfte berücksichtigt.</li>
<li><strong>Erste Anpassung anteilig.</strong> Bei der ersten Valorisierung zählt die Veränderung nur im Verhältnis der vollen Monate, die im Vorjahr nach Vertragsabschluss verstrichen sind, zu zwölf.</li>
<li><strong>Rundung auf ganze Cent.</strong> Bis zu einem halben Cent wird abgerundet, darüber aufgerundet.</li>
</ol>
<p>Für Wohnungen, auf die Mietzinsbeschränkungen des ${h.src('risMrg', 'Mietrechtsgesetzes')} anzuwenden sind, kommt § 1 Abs. 3 hinzu: Die Veränderung des VPI zählt für das Jahr 2025 mit höchstens einem Prozent und für 2026 mit höchstens zwei Prozent.</p>
<h2>Die Jahresdurchschnitte des VPI 2020</h2>
${h.table(['Jahr', 'VPI 2020, Jahresdurchschnitt', 'Veränderung zum Vorjahr'], jahre, `Quelle: ${h.src('statistikVpi', 'Statistik Austria, Verbraucherpreisindex')}, abgerufen am 24. Oktober 2026, Lizenz CC BY 4.0.`, ['l', 'r', 'r'])}
<p>Seit den Daten für Jänner 2026 veröffentlicht Statistik Austria den VPI auch in der Basis 2025. Der Jahresdurchschnitt 2026, der die Anpassung am 1. April 2027 bestimmt, erscheint im Jänner 2027. Bis dahin ist der Prozentsatz für April 2027 nicht bekannt; fest steht nur der Deckel von zwei Prozent für Mieten mit MRG-Mietzinsbeschränkung.</p>
<p>Das Gesetz nennt den VPI 2020 „oder den an seine Stelle tretenden Index“. Der Wechsel auf die neue Basis 2025 ändert an der Rechnung nichts Wesentliches: Verglichen werden immer zwei Jahresdurchschnitte in derselben Basis, und die Veränderung in Prozent bleibt bei einem Basiswechsel gleich, abgesehen von Rundungen. Für ältere Verträge, die einen Monatswert des VPI 2010 oder 2015 nennen, lassen sich die Basen über die Jahresdurchschnitte verketten; der ${h.a('at-vpi', 'Wertsicherungsrechner')} wendet diese Verkettung an.</p>
<h2>Die Anpassung am 1. April 2026 in Zahlen</h2>
${h.table(['Mietverhältnis', 'Berücksichtigte Veränderung', 'Miete 850 € ab 1. April 2026'], [
      ['Ohne Mietzinsbeschränkung (freier Mietzins)', zz(p), h.eur(frei.nouveauLoyer)],
      ['Mietzinsbeschränkung nach MRG', zz(pm), h.eur(mrg.nouveauLoyer)],
    ], 'Hauptmietzins netto pro Monat; Rundung nach § 1 Abs. 2 Z 3 MieWeG.', ['l', 'r', 'r'])}
<p>Die rohe Veränderung der Jahresdurchschnitte 2025 gegenüber 2024 beträgt ${h.pc((avg(h, 2025)! / avg(h, 2024)! - 1) * 100)}. Davon zählen drei Prozentpunkte voll und der Rest zur Hälfte: ${zz(p)}. Für eine Wohnung mit Richtwert- oder Kategoriemiete greift zusätzlich der Deckel von einem Prozent.</p>
<h2>Vier Mieten im Vergleich</h2>
${h.table(['Hauptmietzins bisher', 'Ab 1. April 2026, freie Miete', 'Ab 1. April 2026, MRG-Deckel'], [600, 850, 1200, 1500].map((m) => [h.eur(m), h.eur(h.E.valorisierenAt(m, p).nouveauLoyer), h.eur(h.E.valorisierenAt(m, pm).nouveauLoyer)]), `Berücksichtigte Veränderung: ${zz(p)} ohne, ${zz(pm)} mit Mietzinsbeschränkung.`, ['r', 'r', 'r'])}
<h2>Die erste Anpassung nach Vertragsabschluss</h2>
<p>Ein Mietvertrag, der im März 2025 unterschrieben wurde, wird erstmals am 1. April 2026 angepasst, dem 1. April des ersten vollen Kalenderjahrs nach dem Abschluss. Von 2025 sind nach Vertragsabschluss neun volle Monate verstrichen, April bis Dezember. Die Veränderung zählt deshalb nur zu neun Zwölfteln: ${h.pc(p9)} statt ${zz(p)}. Eine freie Miete von 1.000 € steigt so auf ${h.eur(e9.nouveauLoyer)}. Ein Vertrag vom Februar 2026 wird erstmals am 1. April 2027 angepasst, mit dem Anteil von zehn Zwölfteln der Veränderung 2026.</p>
<p>Bei Verträgen, die vor 2026 geschlossen wurden und schon einmal angepasst worden sind, gilt als Zeitpunkt des Vertragsabschlusses jener Monat, auf den sich der Indexwert der letzten Anpassung bezogen hat (§ 4 Abs. 2). Für diese Verträge darf die erste Anpassung nach dem neuen Modell auch Monate aus früheren Kalenderjahren berücksichtigen. Diesen Sonderfall rechnet der Rechner nicht; er verwendet nur das Vorjahr.</p>
<h2>Was eine abweichende Klausel noch bewirkt</h2>
<p>Weicht ein Wohnungsmietvertrag zum Nachteil der Mieterin oder des Mieters vom Berechnungsmodell ab, kann die Erhöhung nach § 1 Abs. 4 nicht früher und nicht in größerem Umfang eintreten, als das Gesetz vorsieht. Erhöhungen gibt es nur am 1. April. Wird die Valorisierung dadurch verschoben, tritt die Erhöhung am 1. April nur in dem Umfang ein, in dem sie zum vertraglich vorgesehenen Zeitpunkt eingetreten wäre. Und sie darf den Betrag nach dem Berechnungsmodell nicht übersteigen.</p>
<p>Das gilt auch, wenn der Vertrag die Erhöhung als festen Betrag oder Prozentsatz festlegt, außer die vereinbarte Erhöhung hat einen anderen Grund als die Wertsicherung. Eine Klausel „Erhöhung jedes Jahr um 4 %“ ist also bei Wohnungen im Anwendungsbereich des MRG auf das Ergebnis des Modells begrenzt.</p>
<h2>Wann das MieWeG nicht gilt</h2>
<ul>
<li><strong>Geschäftsräume.</strong> Das Gesetz begrenzt die Wertsicherung von Wohnungsmietverträgen. Für ein Geschäftslokal gilt die vertragliche Wertsicherung, meist mit dem VPI und einem Schwellenwert; gerechnet wird sie mit ${h.a('at-vpi', 'dem Wertsicherungsrechner für den VPI')}.</li>
<li><strong>Wohnungen außerhalb des MRG.</strong> Erfasst sind Haupt- und Untermietverträge über Wohnungen im Anwendungsbereich des Mietrechtsgesetzes, einschließlich der in § 1 Abs. 4 MRG genannten Mietgegenstände.</li>
<li><strong>Gemeinnützige Wohnungen.</strong> Verträge nach dem WGG sind ausgenommen, außer das zulässige Entgelt richtet sich nach § 13 Abs. 4 WGG.</li>
<li><strong>Sonderregeln.</strong> § 16 Abs. 9 MRG und Mietzinsvorschriften in Förderungsbestimmungen bleiben unberührt.</li>
</ul>
<h2>Der Kalender einer Anpassung</h2>
<ul>
<li><strong>Jänner:</strong> Statistik Austria veröffentlicht den Jahresdurchschnitt des Vorjahres. Ab dann steht der Prozentsatz für den 1. April fest.</li>
<li><strong>Februar und März:</strong> Die Vermieterin oder der Vermieter rechnet die neue Miete aus und teilt sie mit. Das MieWeG schreibt dafür keine bestimmte Form vor; was der Mietvertrag zur Mitteilung sagt, gilt weiter. Eine schriftliche Mitteilung mit Indexwerten und Rechenweg vermeidet Rückfragen.</li>
<li><strong>1. April:</strong> Die angepasste Miete gilt. Eine Anpassung zu einem anderen Termin ist bei Wohnungsmieten im Anwendungsbereich des Gesetzes nicht mehr möglich.</li>
</ul>
<h2>Was für den 1. April 2027 schon feststeht</h2>
<p>Für Wohnungen mit Mietzinsbeschränkung nach dem MRG ist die Veränderung für das Jahr 2026 auf höchstens zwei Prozent begrenzt. Für alle anderen Wohnungen hängt der Prozentsatz vom Jahresdurchschnitt 2026 ab, der noch nicht veröffentlicht ist. Die bisher erschienenen Monatswerte (zuletzt ${h.mois(h.D.letzterVpi().m)}: ${h.num(h.D.letzterVpi().wert, 1)} in der Basis ${h.D.letzterVpi().basis}) ersetzen ihn nicht: Das Gesetz stellt auf den Vergleich der Jahresdurchschnitte ab, nicht auf die Veränderung eines einzelnen Monats. Der Rechner zeigt deshalb für 2027 keinen Prozentsatz an, sondern nur den Deckel.</p>
<h2>Häufige Fehler bei der Indexanpassung</h2>
<ul>
<li><strong>Den Monatswert statt des Jahresdurchschnitts nehmen.</strong> Nach dem MieWeG zählt der Vergleich der Jahresdurchschnitte, nicht der Indexwert eines bestimmten Monats.</li>
<li><strong>Die Halbierung vergessen.</strong> Über drei Prozent zählt die Veränderung nur zur Hälfte, auch bei freien Mieten.</li>
<li><strong>Den Deckel auf freie Mieten anwenden.</strong> Ein Prozent und zwei Prozent gelten nur, wo eine Mietzinsbeschränkung des MRG anzuwenden ist.</li>
<li><strong>Die erste Anpassung voll rechnen.</strong> Bei der ersten Valorisierung zählen nur die vollen Monate seit Vertragsabschluss im Vorjahr.</li>
<li><strong>Betriebskosten mitrechnen.</strong> Wertgesichert wird das vereinbarte Entgelt; Betriebskosten werden nach ihren eigenen Regeln abgerechnet.</li>
</ul>
<h2>Indexanpassung Schritt für Schritt</h2>
<ol>
<li>Prüfen, ob die Wohnung im Anwendungsbereich des MRG liegt und ob eine Mietzinsbeschränkung gilt.</li>
<li>Den Bezugsmonat feststellen: Vertragsabschluss oder, bei älteren Verträgen, der Monat des Indexwerts der letzten Anpassung.</li>
<li>Die Jahresdurchschnitte des VPI für das Vorjahr und das Jahr davor nachschlagen und die Veränderung bilden.</li>
<li>Den Teil über drei Prozent halbieren, den MRG-Deckel anwenden, bei der ersten Anpassung die vollen Monate berücksichtigen.</li>
<li>Den Hauptmietzins mit dem Ergebnis multiplizieren und auf ganze Cent runden. Die neue Miete gilt ab 1. April.</li>
</ol>
<p>Der Rechner oben erledigt die Schritte drei bis fünf; die ersten beiden hängen vom Vertrag ab. Er rechnet den Hauptmietzins netto, ohne Betriebskosten und Umsatzsteuer, die eigenen Regeln folgen.</p>
<h2>Worauf Mieterinnen und Mieter achten können</h2>
<p>Wer eine Mitteilung über eine Indexanpassung erhält, kann sie mit wenigen Fragen prüfen. Gilt die neue Miete ab dem 1. April und nicht ab einem anderen Datum? Beruht die Rechnung auf den Jahresdurchschnitten des VPI und nicht auf einem einzelnen Monat? Ist der Anteil über drei Prozent halbiert? Wurde bei einer Richtwert- oder Kategoriemiete der Deckel beachtet? Und wurde bei einem jungen Vertrag die erste Anpassung nur anteilig gerechnet? Stimmen alle Antworten, entspricht die Erhöhung dem Gesetz. Weicht etwas ab, lohnt sich eine schriftliche Rückfrage mit dem Ergebnis aus dem Rechner.</p>
<h2>Was der Rechner nicht entscheidet</h2>
<p>Ob eine Wertsicherungsklausel wirksam ist, ob eine Mietzinsbeschränkung gilt und ob in der Vergangenheit zu viel verlangt wurde, ist eine Rechtsfrage des Einzelfalls. Diese Seite gibt wieder, was im Gesetz steht, und rechnet mit den amtlichen Indexwerten. Für einen Streitfall sind Mieterberatungen, Schlichtungsstellen, Interessenvertretungen der Vermieter oder eine Rechtsanwältin oder ein Rechtsanwalt die richtigen Stellen. Zum Vergleich mit anderen Ländern: ${h.a('it-home', 'die Rivalutazione Istat in Italien')}, ${h.a('hub', 'die Übersicht der sechs Länder')}.</p>`;
  },
};
export default t;
