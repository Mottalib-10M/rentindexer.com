import type { PageText, Helpers } from '../../lib/types';

/** VPI : Werte, Verkettung und Wertsicherung eines Betrags (« vpi 2020 », « wertsicherungsrechner », « verbraucherpreisindex österreich »). */
const ws = (h: Helpers, b: number, von: string, bis: string) => h.E.wertsichernAt(b, h.D.vpi(von)!.wert, h.D.vpi(bis)!.wert, h.D.verkettungZwischen(von, bis));

const t: PageText = {
  slug: 'vpi',
  nav: 'VPI und Wertsicherung',
  card: 'Die Werte des Verbraucherpreisindex 2020 und 2025, die Verkettung älterer Basen und die Wertsicherung eines Betrags zwischen zwei Monaten.',
  title: 'VPI 2020 und VPI 2025: Indexwerte und Wertsicherungsrechner',
  description: 'VPI 2020 und VPI 2025 der Statistik Austria: aktuelle Monatswerte, Verkettung der Basen 2010, 2015 und 2020 und Wertsicherung eines Betrags mit Schwellenwert.',
  h1: 'Verbraucherpreisindex Österreich: Werte und Wertsicherung',
  intro: 'Wählen Sie den Ausgangsmonat aus dem Vertrag und den Vergleichsmonat: Der Rechner verkettet die Basen und prüft den Schwellenwert.',
  resume: (h) => {
    const l = h.D.letzterVpi();
    const w = ws(h, 10000, '2020-01', l.m);
    return `Der Verbraucherpreisindex (VPI) der Statistik Austria ist der Maßstab der meisten Wertsicherungsklauseln in Österreich, für Mieten, Pachtzinse, Unterhaltsbeträge oder Kaufpreisraten. Der zuletzt veröffentlichte Monatswert ist jener für ${h.mois(l.m)}: ${h.num(l.wert, 1)} in der Basis ${l.basis}. Seit den Daten für Jänner 2026 gibt es den VPI 2025 als neue Basis; im Rechner reicht die Reihe des VPI 2020 bis Dezember 2025, ihr Jahresdurchschnitt 2025 beträgt ${h.num(h.D.vpiIn(2020, '2025')!, 1)}. Nennt ein Vertrag einen älteren Index, werden die Basen verkettet: Der Faktor von VPI 2020 auf VPI 2025 beträgt ${h.num(h.D.VERKETTUNG[2025], 3)}, von VPI 2015 auf VPI 2020 ${h.num(h.D.VERKETTUNG[2020], 3)}, von VPI 2010 auf VPI 2015 ${h.num(h.D.VERKETTUNG[2015], 3)}. Ein Betrag von 10.000 € mit Ausgangsmonat Jänner 2020 entspricht im ${h.mois(l.m)} ${h.eur(w.betrag)}, ein Plus von ${h.pc(w.prozent)}. Viele Klauseln sehen einen Schwellenwert vor, etwa 5 %, und passen erst an, wenn er überschritten ist. Für Wohnungsmieten begrenzt seit 2026 zusätzlich das Mieten-Wertsicherungsgesetz das Ergebnis.`;
  },
  faqs: (h) => [
    { q: 'Mein Vertrag nennt den VPI 2010: Muss ich ihn umrechnen?', a: `Wenn Sie den Wert nicht direkt in der Basis 2010 nachschlagen, ja, über die Verkettung. Im Rechner reicht die Reihe des VPI 2010 bis Dezember 2015; für spätere Monate multipliziert man mit den Faktoren ${h.num(h.D.VERKETTUNG[2015], 3)}, ${h.num(h.D.VERKETTUNG[2020], 3)} und ${h.num(h.D.VERKETTUNG[2025], 3)}, je nachdem, wie viele Basiswechsel im Zeitraum liegen. Der Rechner macht das automatisch und zeigt die verwendeten Faktoren im Ergebnis an.` },
    { q: 'Was ist ein Schwellenwert in der Wertsicherungsklausel?', a: 'Eine Schwelle, ab der angepasst wird: Bei „5 %“ bleibt der Betrag gleich, bis der Index um mehr als 5 % gegenüber dem Ausgangswert gestiegen ist. Dann wird um die ganze Veränderung angepasst, und der neue Indexwert wird zur nächsten Ausgangsbasis. Wie genau, regelt die Klausel; geben Sie die Schwelle im Rechner ein, um zu sehen, ob sie erreicht ist.' },
    { q: 'Gilt der Wertsicherungsrechner auch für Wohnungsmieten?', a: 'Er zeigt, was eine vertragliche VPI-Klausel ergibt. Für Wohnungsmieten im Anwendungsbereich des MRG begrenzt seit 1. Jänner 2026 das Mieten-Wertsicherungsgesetz dieses Ergebnis: Anpassung nur am 1. April, nach dem Jahresdurchschnitt, Hälfte über 3 %. Für diese Mieten ist der Rechner auf der Startseite der richtige; für Geschäftsräume und andere Beträge dieser hier.' },
  ],
  body: (h) => {
    const m26 = h.D.monateVpi().filter((m) => m.startsWith('2026')).sort().reverse();
    const reihe = m26.map((m) => { const vm = `2025${m.slice(4)}`; return [h.mois(m), h.num(h.D.vpiIn(2025, m)!, 1), h.num(h.D.vpiIn(2020, vm)!, 1)]; });
    const l = h.D.letzterVpi();
    const bsp = ['2016-01', '2021-01', '2024-01'].map((m) => { const w = ws(h, 1000, m, l.m); return [h.mois(m), `VPI ${h.D.vpi(m)!.basis}`, h.D.verkettungZwischen(m, l.m).map((f) => h.num(f, 3)).join(' × ') || '–', h.num(w.faktor, 4), h.eur(w.betrag)]; });
    return `<h2>Die Monatswerte 2026</h2>
${h.table(['Monat', 'VPI 2025', 'VPI 2020, gleicher Monat 2025'], reihe, `Quelle: ${h.src('statistikVpi', 'Statistik Austria, Verbraucherpreisindex')}, abgerufen am 24. Oktober 2026, Lizenz CC BY 4.0.`, ['l', 'r', 'r'])}
<p>Die beiden Spalten stehen in verschiedenen Basen und lassen sich nicht direkt teilen. Wer den VPI 2025 eines Monats 2026 mit dem VPI 2020 desselben Monats 2025 vergleichen will, multipliziert zuerst mit ${h.num(h.D.VERKETTUNG[2025], 3)}.</p>
<h2>1.000 € wertgesichert bis ${h.mois(l.m)}</h2>
${h.table(['Ausgangsmonat', 'Basis', 'Verkettung', 'Faktor', 'Betrag'], bsp, 'Rechnung: Indexwert des Vergleichsmonats / Indexwert des Ausgangsmonats × Verkettungsfaktoren, Betrag auf Cent gerundet.', ['l', 'l', 'l', 'r', 'r'])}
<h2>Wertsicherung und Mietrecht</h2>
<p>Für Geschäftsräume, Garagen, Pachtverträge oder Unterhaltsbeträge gilt die Klausel, wie sie vereinbart ist: Index, Ausgangsmonat, Schwellenwert. Für Wohnungen im Anwendungsbereich des Mietrechtsgesetzes legt das ${h.src('risMieWeG', 'Mieten-Wertsicherungsgesetz')} seit 2026 eine Obergrenze fest; die Berechnung steht auf der Seite ${h.a('at-home', 'Indexanpassung nach dem MieWeG')}. Zum Vergleich mit Italien, wo das Istat Koeffizienten für den Basiswechsel veröffentlicht: ${h.a('it-rival', 'die Rivalutazione monetaria')}.</p>`;
  },
};
export default t;
