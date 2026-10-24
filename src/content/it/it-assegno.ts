import type { PageText, Helpers } from '../../lib/types';

/** Adeguamento Istat dell'assegno di mantenimento (« adeguamento istat assegno mantenimento », « rivalutazione assegno di mantenimento »). */
const riv = (h: Helpers, imp: number, da: string, a: string) => h.E.rivalutaIt(imp, h.D.foi(da)!.indice, h.D.foi(a)!.indice, h.D.raccordiTra(da, a));

const t: PageText = {
  slug: 'rivalutazione-assegno-mantenimento',
  nav: 'Adeguamento Istat dell’assegno',
  card: 'L’assegno di mantenimento adeguato agli indici Istat dal mese del provvedimento, con gli anni già trascorsi.',
  title: 'Adeguamento Istat assegno di mantenimento: nuovo importo',
  description: 'Adeguamento Istat dell’assegno di mantenimento: importo aggiornato dal mese del provvedimento con l’indice FOI, anno per anno, e i punti da controllare.',
  h1: 'Adeguamento Istat dell’assegno di mantenimento',
  intro: 'Inserisci l’assegno stabilito e il mese del provvedimento: il calcolatore lo porta al mese che scegli con gli indici FOI dell’Istat.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const r = riv(h, 450, '2023-09', u.m);
    return `Quando un provvedimento del giudice o un accordo tra i genitori prevede che l’assegno di mantenimento sia adeguato agli indici Istat, l’importo si aggiorna con l’indice FOI senza tabacchi, la stessa serie usata per le rivalutazioni monetarie. Il punto di partenza è il mese del provvedimento, o quello che il provvedimento stesso indica; l’adeguamento si fa di solito una volta l’anno, nel mese anniversario. Il calcolo è semplice: assegno stabilito × indice del mese di arrivo / indice del mese di partenza, con il coefficiente di raccordo ${h.num(h.D.RACCORDI[2025], 3)} se si attraversa il cambio di base di gennaio 2026. Un assegno di 450 € fissato a settembre 2023, portato a ${h.mois(u.m)}, diventa ${h.eur(r.rivalutato)}: coefficiente ${h.num(r.coefficiente, 3)}, ${h.pc(r.variazione, 1)}. Per l’assegno si applica la variazione intera, non il 75 % previsto per alcuni canoni d’affitto. Se il provvedimento fissa un altro indice, un’altra cadenza o un importo già aggiornato, vale quello che c’è scritto.`;
  },
  faqs: (h) => {
    const u = h.D.ultimoFoi();
    return [
      { q: 'Il genitore che riceve l’assegno deve chiedere ogni anno l’adeguamento?', a: 'Dipende dal provvedimento. Quando prevede l’adeguamento automatico agli indici Istat, l’importo aggiornato è dovuto senza bisogno di un nuovo provvedimento, ma conviene comunicarlo per iscritto all’altro genitore, con il calcolo e i mesi usati. Se il provvedimento non dice nulla, la questione va verificata con un professionista prima di pretendere un importo diverso.' },
      { q: 'Si possono chiedere gli adeguamenti degli anni passati non applicati?', a: 'Il calcolo permette di ricostruirli: per ogni anno si porta l’assegno dal mese del provvedimento al mese anniversario di quell’anno e si confronta con quanto pagato. Se e fino a quando le differenze si possano ancora chiedere è una questione giuridica, legata anche alla prescrizione, che va valutata con un avvocato o con il proprio legale.' },
      { q: `Che cosa cambia la nuova base 2025 per un assegno fissato nel 2022?`, a: `Nulla sul risultato, purché si usi il raccordo. L’indice di partenza del 2022 è in base 2015, quello di ${h.mois(u.m)} in base 2025: il calcolatore moltiplica il rapporto per ${h.num(h.D.RACCORDI[2025], 3)}, come indica l’Istat. Dividere i due indici senza raccordo darebbe un assegno più basso di quello di partenza, che è un errore.` },
    ];
  },
  body: (h) => {
    const u = h.D.ultimoFoi();
    const anni = ['2024-09', '2025-09', '2026-09'].filter((m) => h.D.foi(m)).map((m) => { const r = riv(h, 450, '2023-09', m); return [h.mois(m), h.num(r.coefficiente, 3), h.pc(r.variazione, 1), h.eur(r.rivalutato)]; });
    return `<h2>Un assegno di 450 € anno per anno</h2>
${h.table(['Adeguamento di', 'Coefficiente da settembre 2023', 'Variazione', 'Assegno dovuto'], anni, `Indici FOI senza tabacchi (${h.src('istatFoi', 'Istat')}); raccordo base 2015 / base 2025: ${h.num(h.D.RACCORDI[2025], 3)}.`, ['l', 'r', 'r', 'r'])}
<p>Ogni riga parte dall’assegno originale e dal mese del provvedimento, e non dall’importo dell’anno prima: così gli arrotondamenti non si accumulano. Il risultato coincide, a pochi centesimi, con quello che si ottiene aggiornando l’assegno ogni anno con la variazione dei dodici mesi.</p>
<h2>Che cosa verificare nel provvedimento</h2>
<ul>
<li><strong>Il mese di partenza.</strong> È quasi sempre il mese del provvedimento, ma alcuni fissano una decorrenza diversa.</li>
<li><strong>La cadenza.</strong> L’adeguamento annuale è il caso più comune; se è indicata un’altra cadenza, il mese di arrivo cambia.</li>
<li><strong>L’indice.</strong> Senza altra indicazione si usa il FOI senza tabacchi, l’indice dell’Istat per le rivalutazioni monetarie.</li>
<li><strong>Le spese straordinarie.</strong> Non si rivalutano con l’assegno: si dividono secondo quanto stabilito.</li>
</ul>
<p>Il metodo di calcolo con i raccordi è spiegato in ${h.a('it-home', 'rivalutazione Istat')}; lo stesso calcolo per un credito è in ${h.a('it-rival', 'calcolo della rivalutazione monetaria')}. Per l’equivalente francese, l’indicizzazione della pensione alimentare, vedi ${h.a('fr-pension', 'la pagina sulla Francia')}. Questa pagina spiega un calcolo; non sostituisce il parere di un avvocato su un caso concreto.</p>`;
  },
};
export default t;
