import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Canone aggiornato: editore e regole editoriali di Radif',
    description: 'Chi pubblica Canone aggiornato, da dove vengono gli indici, come vengono verificate e corrette le pagine e come segnalare un errore: la società Radif Partners.',
    h1: 'Chi pubblica Canone aggiornato',
    body: (h) => `<p>Canone aggiornato è pubblicato dalla società Radif Partners. Il sito fa una cosa sola: applica a un contratto o a una somma l’indice ufficiale previsto dalla legge, con i limiti che riducono o escludono l’aumento, e mostra ogni cifra con la fonte e il mese. In Italia si tratta dell’indice FOI senza tabacchi dell’Istat, dei coefficienti di raccordo tra le basi e delle regole della legge 392/1978, della legge 431/1998 e della cedolare secca. Gli stessi calcolatori esistono per Francia, Belgio, Spagna, Portogallo e Austria.</p>
<p>Il sito non ha legami con l’Istat, con enti pubblici né con agenzie immobiliari. Non vende nulla, non chiede recapiti e non trasmette nulla a terzi: ogni calcolo avviene nel tuo browser.</p>
<h2>Editore</h2>
<!--identite-->
<h2 id="editorial">Politica editoriale</h2>
<p>Ogni indice è verificato alla fonte: la banca dati dell’Istat per il FOI, gli istituti di statistica degli altri paesi per il resto. I file di dati sono rigenerati da un programma che interroga direttamente queste fonti, e ogni pagina indica quando i valori sono stati controllati l’ultima volta. Una regola giuridica viene spiegata solo dopo aver letto il testo vigente su Normattiva, collegato in fondo alla pagina.</p>
<p>Se un indice non è ancora uscito, la pagina lo dice e non lo inventa: il calcolatore indica «non ancora pubblicato» invece di una stima spacciata per ufficiale. Gli esempi numerici sono prodotti dal motore di calcolo del sito, verificato automaticamente sugli esempi della nota metodologica dell’Istat.</p>
<h2 id="contact">Contatti e segnalazione di errori</h2>
<p>Un indice sbagliato, una regola fraintesa o un caso che il calcolatore non tratta: scrivi a <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> indicando l’indirizzo della pagina e, se possibile, la fonte che la contraddice. Non rispondiamo su una controversia specifica: per questo sono adatti un sindacato degli inquilini, un’associazione della proprietà o un avvocato.</p>
<p>Il dettaglio del calcolo è nella pagina ${h.a('method', 'metodo e fonti')}.</p>`,
  },
  method: {
    title: 'Aggiornamento del canone: metodo, fonti e limiti del calcolo',
    description: 'La formula di ogni paese, le serie ufficiali usate, gli arrotondamenti, l’aggiornamento degli indici e i limiti noti dei calcolatori di Canone aggiornato.',
    h1: 'Come funzionano i calcoli',
    body: (h) => `<p>Ogni calcolatore applica la formula prevista dalle norme del paese, con la serie pubblicata dall’istituto di statistica competente, arrotondata come chiede il testo.</p>
<h2>Italia</h2>
<p>Aggiornamento del canone: canone × variazione annua dell’indice FOI senza tabacchi del mese indicato nel contratto × quota pattuita (al massimo 75 % per gli immobili a uso diverso, ${h.src('l392', 'legge 392/1978, art. 32')}). Con la cedolare secca l’aggiornamento è sospeso per tutta la durata dell’opzione (${h.src('dlgs23', 'D.Lgs. 23/2011, art. 3, comma 11')}). Rivalutazione tra due mesi: rapporto tra gli indici FOI dei due mesi, moltiplicato per i coefficienti di raccordo tra le basi pubblicati dall’Istat (${h.src('istatFoi', 'nota Istat')}), coefficiente arrotondato a tre decimali come nel metodo dell’Istat.</p>
<h2>Altri paesi</h2>
<p>Francia: canone × IRL del trimestre di riferimento / IRL dell’anno precedente. Belgio: canone di base × nuovo indice sanitario / indice iniziale. Spagna: variazione annua dell’IPC o dell’IRAV con i limiti di legge. Portogallo: coefficienti annuali del Diário da República, arrotondati al centesimo superiore. Austria: variazione media del VPI secondo la legge MieWeG.</p>
<h2>Aggiornamento e limiti</h2>
<p>Le serie sono scaricate dalle interfacce ufficiali e controllate a ogni nuova pubblicazione. Un calcolo non sostituisce la lettura del contratto: una clausola specifica prevale sul caso generale, e un giudice può decidere diversamente un caso controverso.</p>`,
    faqs: (h) => [
      { q: 'Perché il coefficiente di rivalutazione ha solo tre decimali?', a: 'Perché è il metodo che l’Istat applica nel proprio servizio di calcolo e nella nota sulle rivalutazioni monetarie: il rapporto tra gli indici, moltiplicato per i coefficienti di raccordo, viene arrotondato a tre decimali, e la variazione percentuale a un decimale. Usare più decimali darebbe differenze di pochi centesimi, ma non coinciderebbe con il risultato ufficiale.' },
      { q: 'Il cambio di base dell’indice FOI nel 2026 cambia i calcoli?', a: 'No, se si usano i coefficienti di raccordo. Da gennaio 2026 l’Istat pubblica il FOI in base 2025; per confrontare un mese del 2026 con un mese precedente si moltiplica per il coefficiente 1,214, come per i cambi di base del 2011 e del 2016. Il calcolatore applica automaticamente i coefficienti necessari tra i due mesi scelti.' },
      { q: 'Il sito conserva i dati che inserisco?', a: 'No. Importi e mesi restano nel tuo browser e non vengono inviati ad alcun server. Se copi il risultato, il link contiene i valori nell’indirizzo della pagina, così puoi inviarlo all’altra parte del contratto o al tuo consulente: nessun altro lo riceve, a meno che tu non lo condivida.' },
    ],
  },
};
export default s;
