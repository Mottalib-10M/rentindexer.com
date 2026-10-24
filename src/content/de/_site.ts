import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Miete wertgesichert: Herausgeber und Grundsätze von Radif',
    description: 'Wer Miete wertgesichert herausgibt, woher die Indexwerte stammen, wie die Seiten geprüft und berichtigt werden und wie Sie einen Fehler melden: Radif Partners.',
    h1: 'Wer Miete wertgesichert herausgibt',
    body: (h) => `<p>Miete wertgesichert wird von der Gesellschaft Radif Partners herausgegeben. Die Seite tut eine Sache: Sie wendet auf einen Mietvertrag den amtlichen Index an, den das Gesetz vorsieht, mit den Regeln, die die Erhöhung begrenzen, und zeigt jeden Wert mit Quelle und Monat. In Österreich sind das der Verbraucherpreisindex der Statistik Austria und das Mieten-Wertsicherungsgesetz. Dieselben Rechner gibt es für Frankreich, Belgien, Spanien, Italien und Portugal.</p>
<p>Die Seite steht in keiner Verbindung zu einer Behörde, zur Statistik Austria oder zu einem Immobilienbüro. Sie verkauft nichts, fragt keine Kontaktdaten ab und gibt nichts an Dritte weiter: Jede Berechnung läuft in Ihrem Browser.</p>
<h2>Herausgeber</h2>
<!--identite-->
<h2 id="editorial">Redaktionelle Grundsätze</h2>
<p>Jeder Indexwert wird an der Quelle geprüft: in der offenen Datenbank der Statistik Austria für den VPI, bei den Statistikämtern der anderen Länder für den Rest. Ein Programm lädt die Reihen der Statistik Austria, von Insee, INE, Istat und die letzten 13 Monate von Statbel über die amtlichen Schnittstellen und prüft jede Reihe auf Stimmigkeit; die ältere belgische Reihe stammt aus dem Rechner von Bruxelles Logement und ist die einzige, die mit einer zweiten Quelle verglichen wird. Von Hand eingetragen, nach Lektüre des amtlichen Textes, werden die portugiesischen Koeffizienten, die flämischen Korrekturfaktoren und die Verkettungskoeffizienten der Istat. Jede Seite nennt das Datum der letzten Prüfung. Eine Rechtsregel wird erst beschrieben, nachdem die geltende Fassung im Rechtsinformationssystem des Bundes gelesen wurde; sie ist unten auf der Seite verlinkt.</p>
<p>Ist ein Wert noch nicht veröffentlicht, sagt die Seite das und erfindet keinen: Der Rechner zeigt „noch nicht veröffentlicht“ statt einer Schätzung, die als amtlich gelten könnte. Rechenbeispiele stammen aus dem Rechenkern der Seite, der automatisch geprüft wird.</p>
<h2 id="contact">Kontakt und Fehlermeldung</h2>
<p>Ein falscher Indexwert, eine missverstandene Regel oder ein Fall, den der Rechner nicht abdeckt: Schreiben Sie an <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> mit der Adresse der Seite und, wenn möglich, der Quelle, die ihr widerspricht. Zu einem konkreten Streitfall antworten wir nicht; dafür sind Mietervereinigungen, Schlichtungsstellen der Gemeinden oder eine Rechtsanwältin oder ein Rechtsanwalt die richtigen Ansprechpartner.</p>
<p>Die Berechnung im Einzelnen steht unter ${h.a('method', 'Methode und Quellen')}.</p>`,
  },
  method: {
    title: 'Wertsicherung der Miete: Rechenweg, Quellen und Grenzen',
    description: 'Die Formel jedes Landes, die amtlichen Reihen, die Rundung, die Aktualisierung der Indexwerte und die bekannten Grenzen der Rechner von Miete wertgesichert.',
    h1: 'Wie die Berechnungen funktionieren',
    body: (h) => `<p>Jeder Rechner wendet die Formel an, die das Recht des Landes vorgibt, mit der Reihe des zuständigen Statistikamts, und rundet, wie der Text es verlangt.</p>
<h2>Österreich</h2>
<p>Anpassung nach dem ${h.src('risMieWeG', 'Mieten-Wertsicherungsgesetz')}: Die Miete ändert sich jährlich am 1. April um die durchschnittliche Veränderung des VPI im Vorjahr, berechnet aus den Jahresdurchschnitten der ${h.src('statistikVpi', 'Statistik Austria')}. Der Teil der Veränderung über 3 % zählt nur zur Hälfte. Für Wohnungen mit Mietzinsbeschränkung nach dem MRG gilt für 2025 höchstens 1 % und für 2026 höchstens 2 %. Die erste Anpassung wird nach vollen Monaten aliquotiert. Gerundet wird kaufmännisch auf ganze Cent. Für die Wertsicherung eines Betrags zwischen zwei Monaten werden ältere Indexbasen über die amtlichen Verkettungsfaktoren verbunden.</p>
<h2>Andere Länder</h2>
<p>Frankreich: Miete × IRL des Referenzquartals / IRL ein Jahr zuvor. Belgien: Ausgangsmiete × neuer Gesundheitsindex / Ausgangsindex. Spanien: Jahresveränderung des VPI oder des IRAV mit den gesetzlichen Obergrenzen. Italien: Jahresveränderung des FOI-Index zu 75 % oder 100 %. Portugal: jährliche Koeffizienten aus dem Diário da República, auf den Cent aufgerundet.</p>
<h2>Aktualisierung und Grenzen</h2>
<p>Die Reihen werden von einem Programm über die amtlichen Schnittstellen abgerufen; portugiesische Koeffizienten, flämische Faktoren und Istat-Verkettungskoeffizienten werden von Hand nachgetragen. Eine Berechnung ersetzt nicht das Lesen des Mietvertrags: Eine eigene Klausel geht dem allgemeinen Fall vor, soweit das Gesetz sie zulässt, und ein Gericht kann einen strittigen Fall anders entscheiden.</p>`,
    faqs: (h) => [
      { q: 'Warum rechnet der Rechner mit Jahresdurchschnitten statt mit einem Monatswert?', a: 'Weil das Mieten-Wertsicherungsgesetz die Anpassung an die durchschnittliche Veränderung des Verbraucherpreisindex im Vorjahr knüpft, also an den Jahresdurchschnitt im Vergleich zum Jahresdurchschnitt davor. Ein einzelner Monatswert, wie ihn ältere Wertsicherungsklauseln verwenden, zählt für Wohnungsmieten im Anwendungsbereich des Gesetzes seit 2026 nicht mehr; für andere Beträge rechnet der Wertsicherungsrechner weiter mit Monaten.' },
      { q: 'Wie werden VPI 2010, VPI 2015, VPI 2020 und VPI 2025 miteinander verbunden?', a: 'Über die Verkettungsfaktoren der Statistik Austria, die das Verhältnis der Jahresdurchschnitte im Basisjahr wiedergeben: 1,107 von VPI 2010 auf VPI 2015, 1,082 von VPI 2015 auf VPI 2020 und 1,282 von VPI 2020 auf VPI 2025. Liegen Ausgangs- und Vergleichsmonat in verschiedenen Basen, multipliziert der Rechner das Verhältnis der Indexwerte mit den nötigen Faktoren.' },
      { q: 'Speichert die Seite meine Vertragsdaten?', a: 'Nein. Miete, Monate und Angaben zum Vertrag bleiben in Ihrem Browser und werden an keinen Server übertragen. Wenn Sie das Ergebnis kopieren, enthält der Link Ihre Werte in der Adresse der Seite, damit Sie ihn der anderen Vertragspartei schicken können. Niemand sonst erhält ihn, solange Sie ihn nicht weitergeben.' },
    ],
  },
};
export default s;
