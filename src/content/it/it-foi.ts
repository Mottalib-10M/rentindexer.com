import type { PageText } from '../../lib/types';

/** Indice FOI : la serie mensile, la base 2025 e come leggerla (« indice istat foi », « indice foi »). */
const t: PageText = {
  slug: 'indice-foi',
  nav: 'Indice Istat FOI',
  card: 'L’indice FOI senza tabacchi mese per mese, con la variazione sull’anno, il passaggio alla base 2025 e le medie annue.',
  title: 'Indice Istat FOI senza tabacchi: valori mensili e base 2025',
  description: 'Indice Istat FOI senza tabacchi mese per mese: valore, variazione su dodici mesi, passaggio alla base 2025 da gennaio 2026 e medie annue per i contratti.',
  h1: 'Indice Istat FOI: la serie mese per mese',
  intro: 'Scegli il mese Istat indicato nel contratto: il calcolatore legge la variazione FOI di quel mese e la applica al canone.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const m25 = h.D.foi('2025-12')!, g26 = h.D.foi('2026-01')!;
    return `L’indice dei prezzi al consumo per le famiglie di operai e impiegati, il FOI, è l’indice che l’Istat pubblica per l’adeguamento dei valori monetari: canoni d’affitto, assegni, crediti. Si usa nella versione senza tabacchi. L’ultimo valore pubblicato è quello di ${h.mois(u.m)}: ${h.num(u.indice, 1)}, con una variazione del ${h.pc(u.varAnno!, 1)} rispetto allo stesso mese dell’anno prima. Da gennaio 2026 l’indice è in base 2025 = 100 ed è calcolato secondo la nuova classificazione europea ECOICOP versione 2: per questo l’indice di gennaio 2026 (${h.num(g26.indice, 1)}) è molto più basso di quello di dicembre 2025 (${h.num(m25.indice, 1)}, base 2015), senza che i prezzi siano scesi. Per confrontare due mesi di basi diverse si moltiplica per il coefficiente di raccordo ${h.num(h.D.RACCORDI[2025], 3)}. La variazione annua che l’Istat pubblica per ogni mese, invece, si legge direttamente e non richiede raccordi: è il dato che serve per l’aggiornamento annuale del canone.`;
  },
  faqs: (h) => [
    { q: 'Il FOI con tabacchi e quello senza tabacchi danno lo stesso risultato?', a: 'No, e la differenza può pesare nei mesi in cui i prezzi dei tabacchi cambiano molto. Per le rivalutazioni monetarie e per l’aggiornamento dei canoni l’Istat pubblica e indica l’indice senza tabacchi, che è quello riportato in questa pagina. Il FOI con tabacchi serve ad altri usi statistici e non va confuso con il primo.' },
    { q: 'Perché la variazione annua di gennaio 2026 si può leggere anche se la base è cambiata?', a: `Perché l’Istat ha ricostruito la serie dal 1996 con la nuova classificazione e calcola la variazione sui dodici mesi in modo omogeneo. Per gennaio 2026 pubblica un ${h.pc(h.D.foi('2026-01')!.varAnno!, 1)}, che si applica direttamente. Il cambio di base conta solo quando si dividono due indici di basi diverse, come in una rivalutazione tra due date lontane.` },
    { q: 'Dove trovo la media annua del FOI per un contratto che la richiama?', a: 'L’Istat calcola l’indice medio annuo come media aritmetica dei dodici indici mensili, arrotondata a un decimale, e lo pubblica nelle sue tavole. Si usa quando un titolo fa riferimento a un anno intero. Il calcolatore di questa pagina lavora sui singoli mesi e non sostituisce quelle medie, che vanno lette nella fonte.' },
  ],
  body: (h) => {
    const mesi = h.D.mesiFoi().slice(0, 21);
    const righe = mesi.map((m) => { const f = h.D.foi(m)!; return [h.mois(m), h.num(f.indice, 1), String(f.base), f.varAnno !== undefined ? h.pc(f.varAnno, 1) : '–']; });
    return `<h2>Gli indici FOI senza tabacchi degli ultimi mesi</h2>
${h.table(['Mese', 'Indice', 'Base', 'Variazione su dodici mesi'], righe, `Fonte: ${h.src('istatFoi', 'Istat, indice FOI senza tabacchi')}, letto il 24 ottobre 2026. Licenza CC BY 4.0.`, ['l', 'r', 'r', 'r'])}
<h2>Come leggere la tabella</h2>
<p>La colonna dell’indice dice il livello dei prezzi rispetto alla media dell’anno base, posto uguale a 100. La colonna della variazione dice di quanto quel livello è cambiato in dodici mesi: è il numero che si applica, intero o al 75 %, nell’aggiornamento annuale di un canone. L’indice è diffuso con un decimale, e anche la variazione è arrotondata a un decimale, secondo la nota metodologica dell’Istat.</p>
<p>Per rivalutare una somma tra due mesi non si usa la variazione, ma il rapporto tra i due indici e, se le basi sono diverse, i coefficienti di raccordo (${h.num(h.D.RACCORDI[2010], 3)}, ${h.num(h.D.RACCORDI[2015], 3)} e ${h.num(h.D.RACCORDI[2025], 3)}) pubblicati dal ${h.src('istatRivaluta', 'servizio Rivaluta')}. Il calcolo è spiegato passo per passo in ${h.a('it-home', 'rivalutazione Istat')} e applicato a una somma in ${h.a('it-rival', 'calcolo della rivalutazione monetaria')}.</p>
<h2>Il prossimo indice</h2>
<p>L’Istat pubblica l’indice di ogni mese verso la metà del mese successivo. Il mese che segue ${h.mois(h.D.ultimoFoi().m)} non è ancora disponibile: il calcolatore lo aggiungerà quando sarà pubblicato, senza stime nel frattempo. Per l’uso dell’indice nei contratti d’affitto, vedi ${h.a('it-affitto', 'aggiornamento Istat del canone')}.</p>`;
  },
};
export default t;
