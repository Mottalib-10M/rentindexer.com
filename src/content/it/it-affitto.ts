import type { PageText } from '../../lib/types';

/** Aggiornamento Istat del canone : quota secondo il tipo di contratto (« rivalutazione istat affitto », « aggiornamento istat canone »). */
const t: PageText = {
  slug: 'aggiornamento-istat-affitto',
  nav: 'Aggiornamento Istat del canone',
  card: 'Il nuovo canone dopo l’aggiornamento Istat: 100 % o 75 % della variazione FOI secondo il contratto, niente con la cedolare secca.',
  title: 'Aggiornamento Istat canone: 75 % o 100 % e nuovo affitto',
  description: 'Aggiornamento Istat del canone d’affitto: variazione FOI del mese del contratto, al 75 % o al 100 % secondo la locazione, e stop con la cedolare secca.',
  h1: 'Aggiornamento Istat del canone: quanto aumenta il tuo affitto',
  intro: 'Indica il canone, il mese Istat del contratto e il tipo di locazione: il calcolatore applica la quota giusta della variazione FOI.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const p100 = h.E.aggiornaIt(800, u.varAnno!, 'libero', 1), p75 = h.E.aggiornaIt(800, u.varAnno!, 'commerciale', 0.75);
    return `La rivalutazione Istat dell’affitto, detta anche aggiornamento Istat del canone, applica ogni anno al canone la variazione dell’indice FOI senza tabacchi sui dodici mesi, nella misura prevista dal contratto. L’ultima variazione pubblicata è quella di ${h.mois(u.m)}: ${h.pc(u.varAnno!, 1)}. Su un canone di 800 € al mese, l’aggiornamento al 100 % porta a ${h.eur(p100.nouveauLoyer)}, quello al 75 % a ${h.eur(p75.nouveauLoyer)}. La quota dipende dal contratto. Per i locali a uso diverso dall’abitazione, come negozi e uffici, la legge 392/1978 all’articolo 32 vieta di superare il 75 % della variazione accertata dall’Istat. Per le abitazioni a canone libero (4+4), regolate dalla legge 431/1998, le parti possono pattuire fino al 100 %; nel canone concordato (3+2) vale l’accordo territoriale, di norma il 75 %. Se il locatore ha scelto la cedolare secca, la facoltà di chiedere l’aggiornamento è sospesa per tutta la durata dell’opzione, anche se il contratto lo prevede. Il mese da usare è quello indicato nel contratto.`;
  },
  faqs: (h) => {
    const u = h.D.ultimoFoi();
    return [
      { q: 'L’aggiornamento Istat del canone scatta da solo ogni anno?', a: 'No. La legge 392/1978 prevede l’aggiornamento annuale su richiesta del locatore, e molti contratti ripetono la stessa formula. Se il locatore non lo chiede, il canone resta quello in vigore. Il calcolatore indica l’importo dovuto dopo la richiesta; da quando decorra e se si possa recuperare un anno non richiesto dipende dal contratto, che va letto con attenzione.' },
      { q: 'Se rinuncio alla cedolare secca, posso chiedere subito l’aggiornamento?', a: 'Il decreto legislativo 23/2011 sospende la facoltà di chiedere l’aggiornamento per il periodo di durata dell’opzione. Quando l’opzione cessa, torna applicabile la clausola del contratto. Se si possano recuperare gli aggiornamenti degli anni di cedolare è una questione da verificare con un professionista; il calcolatore parte dal canone pagato in quel momento.' },
      { q: `Con la variazione di ${h.mois(u.m)} quanto aumenta un negozio da 2.000 € al mese?`, a: `Al 75 % della variazione FOI del ${h.pc(u.varAnno!, 1)}, cioè il massimo per un uso diverso dall’abitazione, il canone sale a ${h.eur(h.E.aggiornaIt(2000, u.varAnno!, 'commerciale', 0.75).nouveauLoyer)} al mese. Con il 100 % si arriverebbe a ${h.eur(h.E.aggiornaIt(2000, u.varAnno!, 'libero', 1).nouveauLoyer)}, ma per un locale commerciale la legge non lo consente, anche se il contratto lo scrivesse.` },
    ];
  },
  body: (h) => {
    const u = h.D.ultimoFoi();
    const regimi = [
      ['Abitazione, canone libero (4+4)', 'Legge 431/1998', 'Fino al 100 % se pattuito'],
      ['Abitazione, canone concordato (3+2)', 'Accordo territoriale', 'Di norma 75 %'],
      ['Uso diverso (negozio, ufficio, laboratorio)', 'Legge 392/1978, art. 32', 'Massimo 75 %'],
      ['Qualsiasi contratto con cedolare secca', 'D.Lgs. 23/2011, art. 3, c. 11', 'Nessun aggiornamento'],
    ];
    const mesi = h.D.mesiFoi().filter((m) => h.D.foi(m)!.varAnno !== undefined).slice(0, 6);
    const righe = mesi.map((m) => { const v = h.D.foi(m)!.varAnno!; return [h.mois(m), h.pc(v, 1), h.eur(h.E.aggiornaIt(800, v, 'libero', 1).nouveauLoyer), h.eur(h.E.aggiornaIt(800, v, 'commerciale', 0.75).nouveauLoyer)]; });
    return `<h2>Quale quota per quale contratto</h2>
${h.table(['Contratto', 'Norma', 'Quota della variazione FOI'], regimi, `Fonti: ${h.src('l392', 'legge 392/1978')}, ${h.src('l431', 'legge 431/1998')}, ${h.src('dlgs23', 'D.Lgs. 23/2011')} (testi su Normattiva, in fondo alla pagina).`, ['l', 'l', 'l'])}
<h2>Un canone di 800 € con gli ultimi mesi</h2>
${h.table(['Mese Istat del contratto', 'Variazione FOI', 'Nuovo canone al 100 %', 'Nuovo canone al 75 %'], righe, 'Variazione su dodici mesi dell’indice FOI senza tabacchi (Istat). Canone arrotondato al centesimo.', ['l', 'r', 'r', 'r'])}
<p>Il mese di riferimento è quello che il contratto indica, spesso il mese che precede la ricorrenza annuale. Un contratto che scade a novembre e richiama «la variazione Istat del mese di ${h.mois(u.m).split(' ')[0]}» usa il ${h.pc(u.varAnno!, 1)}.</p>
<h2>La lettera al conduttore</h2>
<p>La richiesta conviene farla per iscritto, indicando il mese Istat, la variazione pubblicata, la quota applicata e il nuovo canone. Il calcolatore produce una riga riepilogativa da copiare. La serie completa della variazione è nella pagina ${h.a('it-foi', 'indice Istat FOI')}; per rivalutare una somma tra due mesi qualsiasi, vedi ${h.a('it-home', 'la rivalutazione Istat')}.</p>`;
  },
};
export default t;
