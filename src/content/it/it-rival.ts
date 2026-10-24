import type { PageText, Helpers } from '../../lib/types';

/** Calcolo della rivalutazione monetaria di una somma (« calcolo rivalutazione monetaria », « rivalutazione monetaria »). */
const riv = (h: Helpers, imp: number, da: string, a: string) => h.E.rivalutaIt(imp, h.D.foi(da)!.indice, h.D.foi(a)!.indice, h.D.raccordiTra(da, a));

const t: PageText = {
  slug: 'rivalutazione-monetaria',
  nav: 'Calcolo della rivalutazione monetaria',
  card: 'Rivalutare un credito, un risarcimento o un prezzo con il coefficiente Istat tra il mese in cui era dovuto e oggi.',
  title: 'Rivalutazione monetaria di una somma: calcolo con il FOI',
  description: 'Calcolo della rivalutazione monetaria di una somma: coefficiente Istat tra due mesi, raccordi tra basi, esempi per crediti e prezzi e limiti del calcolo.',
  h1: 'Calcolo della rivalutazione monetaria di una somma',
  intro: 'Inserisci la somma, il mese in cui era dovuta e il mese di arrivo: il risultato è la somma espressa nella moneta di quel mese.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const r1 = riv(h, 5000, '2020-01', u.m);
    return `Il calcolo della rivalutazione monetaria esprime una somma di un certo mese nel valore della moneta di un mese successivo. Serve, per esempio, per un credito rimasto non pagato, un risarcimento liquidato in una data lontana, un prezzo o una penale da aggiornare, un deposito da restituire. Il metodo è quello dell’Istat: si divide l’indice FOI senza tabacchi del mese di arrivo per quello del mese di partenza, si moltiplica per i coefficienti di raccordo se l’intervallo attraversa un cambio di base, e si arrotonda a tre decimali. Con gli ultimi dati, 5.000 € di gennaio 2020 valgono ${h.eur(r1.rivalutato)} di ${h.mois(u.m)}: coefficiente ${h.num(r1.coefficiente, 3)}, cioè ${h.pc(r1.variazione, 1)}. Il calcolo misura solo la perdita di potere d’acquisto della moneta. Non dice se la rivalutazione sia dovuta, da quale data decorra né se vadano aggiunti interessi: sono questioni che dipendono dal titolo del credito, cioè dal contratto, dalla sentenza o dalla norma che lo regola.`;
  },
  faqs: (h) => {
    const u = h.D.ultimoFoi();
    return [
      { q: 'Quale mese di partenza si sceglie per un credito non pagato?', a: 'In genere il mese in cui la somma era dovuta, cioè la scadenza del pagamento, oppure la data fissata nel titolo. Per un risarcimento è spesso la data del fatto o quella della liquidazione decisa dal giudice. Il calcolatore accetta qualsiasi mese da gennaio 1996; la scelta del mese corretto dipende dal caso e, in una causa, dalle indicazioni del giudice.' },
      { q: 'Si possono rivalutare somme in lire?', a: 'Sì, rivalutandole prima nella moneta del mese di arrivo e convertendole poi in euro al cambio fisso di 1.936,27 lire per euro, come nell’esempio della nota Istat. Il calcolatore lavora in euro: per una somma in lire di un mese dopo il 1995, dividi l’importo per 1.936,27 e inserisci il risultato, poi applica la rivalutazione.' },
      { q: `Quanto vale oggi un prezzo di 100.000 € fissato a gennaio 2016?`, a: `Con il FOI senza tabacchi, da gennaio 2016 a ${h.mois(u.m)} il coefficiente è ${h.num(riv(h, 100000, '2016-01', u.m).coefficiente, 3)}: lo stesso prezzo, espresso in moneta di oggi, sarebbe ${h.eur(riv(h, 100000, '2016-01', u.m).rivalutato)}. Se un contratto prevede l’aggiornamento del prezzo, vale la sua clausola: il mese, l’indice e la quota possono essere diversi da questo calcolo.` },
    ];
  },
  body: (h) => {
    const u = h.D.ultimoFoi();
    const righe = ['2001-01', '2005-01', '2010-01', '2015-01', '2020-01', '2022-01', '2024-01'].map((m) => { const r = riv(h, 1000, m, u.m); return [h.mois(m), String(h.D.foi(m)!.base), h.D.raccordiTra(m, u.m).map((c) => h.num(c, 3)).join(' × ') || '–', h.num(r.coefficiente, 3), h.eur(r.rivalutato)]; });
    return `<h2>Coefficienti dal mese di partenza a ${h.mois(u.m)}</h2>
${h.table(['Partenza', 'Base', 'Raccordi', 'Coefficiente', '1.000 € diventano'], righe, `Indici FOI senza tabacchi e coefficienti di raccordo: ${h.src('istatRivaluta', 'Istat, servizio Rivaluta')}.`, ['l', 'r', 'l', 'r', 'r'])}
<p>La tabella mostra come cresce il numero dei raccordi andando indietro nel tempo: da gennaio 2001 se ne applicano tre, da gennaio 2024 uno solo. Il calcolatore li sceglie in automatico, e la riga «Coefficienti di raccordo» del risultato li elenca.</p>
<h2>Coefficiente o variazione: stesso risultato</h2>
<p>La ${h.src('istatFoi', 'nota dell’Istat')} ammette due strade equivalenti: moltiplicare la somma per il coefficiente, oppure aggiungerle la variazione percentuale dell’indice nel periodo. Il coefficiente, con tre decimali, è più preciso della variazione arrotondata a un decimale, e per somme grandi conviene usarlo. È quello che fa il calcolatore.</p>
<h2>Quello che il calcolo non fa</h2>
<ul>
<li>Non aggiunge interessi legali o moratori, che si calcolano a parte e secondo regole proprie.</li>
<li>Non decide se un debito vada rivalutato: alcuni crediti lo sono per legge o per sentenza, altri no.</li>
<li>Non applica quote ridotte: per un canone commerciale al 75 % serve ${h.a('it-affitto', 'l’aggiornamento Istat del canone')}, anno per anno.</li>
</ul>
<p>Per l’adeguamento di un assegno, vedi ${h.a('it-assegno', 'adeguamento Istat dell’assegno di mantenimento')}; la serie dell’indice è in ${h.a('it-foi', 'indice Istat FOI')}.</p>`;
  },
};
export default t;
