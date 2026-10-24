import type { PageText, Helpers } from '../../lib/types';

/** Radice /it/ : rivalutazione Istat tra due mesi con l'indice FOI (« rivalutazione istat »). */
const riv = (h: Helpers, importo: number, da: string, a: string) => {
  const fd = h.D.foi(da)!, fa = h.D.foi(a)!;
  return { ...h.E.rivalutaIt(importo, fd.indice, fa.indice, h.D.raccordiTra(da, a)), fd, fa };
};

const t: PageText = {
  slug: '',
  nav: 'Rivalutazione Istat',
  card: 'Rivalutare una somma o un canone tra due mesi con l’indice FOI dell’Istat, i coefficienti di raccordo e il metodo ufficiale.',
  title: 'Rivalutazione Istat 2026: indice FOI e calcolo tra due mesi',
  description: 'Rivalutazione Istat di una somma tra due mesi con l’indice FOI senza tabacchi: coefficienti di raccordo tra basi, metodo ufficiale, canone d’affitto e assegno.',
  h1: 'Rivalutazione Istat: il calcolo con l’indice FOI tra due mesi',
  intro: 'Scegli l’importo, il mese di partenza e il mese di arrivo: il calcolatore applica gli indici FOI e i coefficienti di raccordo come indica l’Istat.',
  resume: (h) => {
    const u = h.D.ultimoFoi();
    const es = riv(h, 1000, '2009-01', '2026-01');
    return `La rivalutazione Istat porta una somma di denaro da un mese a un mese successivo con l’indice dei prezzi al consumo per le famiglie di operai e impiegati al netto dei tabacchi, il FOI senza tabacchi. L’ultimo indice pubblicato è quello di ${h.mois(u.m)}: ${h.num(u.indice, 1)} in base 2025, con una variazione del ${h.pc(u.varAnno!, 1)} sullo stesso mese dell’anno prima. Il coefficiente si ottiene dividendo l’indice del mese di arrivo per quello del mese di partenza e, se nel frattempo l’Istat ha cambiato base, moltiplicando per un coefficiente di raccordo a ogni cambio: ${h.num(h.D.RACCORDI[2010], 3)} tra la base 1995 e la base 2010, ${h.num(h.D.RACCORDI[2015], 3)} tra la 2010 e la 2015, ${h.num(h.D.RACCORDI[2025], 3)} tra la 2015 e la nuova base 2025, in uso da gennaio 2026. Il risultato si arrotonda a tre decimali. L’esempio dell’Istat: da gennaio 2009 (${h.num(es.fd.indice, 1)}, base 1995) a gennaio 2026 (${h.num(es.fa.indice, 1)}, base 2025) il coefficiente è ${h.num(es.coefficiente, 3)}, cioè un aumento del ${h.pc(es.variazione, 1)}. Lo stesso indice serve per l’aggiornamento del canone d’affitto, al 75 % o al 100 % secondo il contratto.`;
  },
  faqs: (h) => {
    const u = h.D.ultimoFoi();
    return [
      { q: 'Che differenza c’è tra variazione percentuale e coefficiente di rivalutazione?', a: 'Sono due modi di dire la stessa cosa. Il coefficiente è il numero per cui si moltiplica la somma (1,336 vuol dire che 1.000 € diventano 1.336 €); la variazione è lo stesso dato espresso in percentuale (+33,6 %). L’Istat arrotonda il coefficiente a tre decimali e la variazione a un decimale, calcolando entrambi in un unico passaggio, senza usare valori intermedi già arrotondati.' },
      { q: 'Perché si usa il FOI senza tabacchi e non l’indice NIC?', a: 'Perché è l’indice che la legge indica per l’adeguamento dei valori monetari: l’Istat lo pubblica in Gazzetta Ufficiale ai sensi dell’articolo 81 della legge 392/1978 e lo segnala come l’indice da usare per le rivalutazioni. Il NIC e l’IPCA misurano l’inflazione per altri scopi e danno risultati un po’ diversi; quando un titolo parla di adeguamento agli indici Istat si applica in pratica il FOI senza tabacchi, a meno che non ne indichi espressamente un altro.' },
      { q: `Quando esce l’indice FOI del mese dopo ${h.mois(u.m)}?`, a: 'L’Istat pubblica l’indice definitivo di ogni mese verso la metà del mese successivo, insieme ai dati sui prezzi al consumo, e lo comunica poi alla Gazzetta Ufficiale. Il calcolatore aggiunge il nuovo mese appena è disponibile nella banca dati dell’Istat; fino ad allora non propone stime e il mese più recente selezionabile resta l’ultimo pubblicato.' },
      { q: 'Si possono rivalutare somme anteriori al 1996?', a: 'Sì, con il metodo dell’Istat, ma questo calcolatore parte da gennaio 1996, il primo mese della base 1995. Per periodi più lontani servono altri coefficienti di raccordo (base 1989 e 1992) e, per gli intervalli che comprendono febbraio 1992, il coefficiente aggiuntivo 1,0009 indicato dall’Istat. Per quegli anni conviene seguire la nota dell’Istat, che riporta i coefficienti e un esempio con un importo in lire.' },
      { q: 'La rivalutazione comprende anche gli interessi?', a: 'No. La rivalutazione Istat misura solo la perdita di potere d’acquisto della moneta tra due mesi. Gli interessi, se dovuti, si calcolano a parte secondo il titolo del credito: il contratto, la sentenza o le norme applicabili. Questa pagina non li calcola e non dice se e come vadano cumulati con la rivalutazione, perché la risposta dipende dal tipo di somma.' },
      { q: 'Come si usa l’indice medio annuo?', a: 'Quando un contratto o un provvedimento fa riferimento a un anno intero, e non a un mese, si confrontano gli indici medi annui. L’Istat li calcola come media aritmetica dei dodici indici mensili, arrotondata a un decimale, e il metodo di calcolo del coefficiente resta lo stesso, compresi i raccordi tra basi. Il calcolatore lavora per mesi: per un riferimento annuo serve la tabella delle medie dell’Istat.' },
      { q: 'Cosa succede se l’indice scende tra i due mesi?', a: 'Il coefficiente diventa inferiore a uno e la somma rivalutata è più bassa di quella di partenza. Con l’inflazione degli ultimi anni è un caso raro, ma il calcolo lo gestisce. Per il canone d’affitto la legge 392/1978 parla di variazioni in aumento; per una somma da rivalutare, invece, il titolo da cui nasce il credito dice se una diminuzione si applica.' },
    ];
  },
  body: (h) => {
    const u = h.D.ultimoFoi();
    const mesi = h.D.mesiFoi().slice(0, 12);
    const righe = mesi.map((m) => { const f = h.D.foi(m)!; return [h.mois(m), h.num(f.indice, 1), `base ${f.base}`, f.varAnno !== undefined ? h.pc(f.varAnno, 1) : '–']; });
    const es1 = riv(h, 1000, '2009-01', '2026-01');
    const es2 = riv(h, 10000, '2016-01', u.m);
    const es3 = riv(h, 25000, '2021-06', u.m);
    const basi = [
      ['1995 = 100', 'da gennaio 1996 a dicembre 2010', '–'],
      ['2010 = 100', 'da gennaio 2011 a dicembre 2015', h.num(h.D.RACCORDI[2010], 3)],
      ['2015 = 100', 'da gennaio 2016 a dicembre 2025', h.num(h.D.RACCORDI[2015], 3)],
      ['2025 = 100', 'da gennaio 2026', h.num(h.D.RACCORDI[2025], 3)],
    ];
    const anni = [2016, 2018, 2020, 2022, 2023, 2024, 2025].map((y) => { const r = riv(h, 1000, `${y}-01`, u.m); return [h.mois(`${y}-01`), h.num(r.coefficiente, 3), h.eur(r.rivalutato)]; });
    return `<h2>Cosa vuol dire rivalutare una somma</h2>
<p>Mille euro di dieci anni fa non comprano quanto mille euro di oggi. La rivalutazione monetaria traduce un importo espresso nella moneta di un certo mese nel suo equivalente di un mese successivo, usando un indice dei prezzi. In Italia l’indice di riferimento è il FOI senza tabacchi: la ${h.src('istatFoi', 'nota dell’Istat sull’indice per le rivalutazioni monetarie')} lo indica come l’indice usato per l’adeguamento periodico dei valori monetari, pubblicato in Gazzetta Ufficiale ai sensi dell’articolo 81 della ${h.src('l392', 'legge 392/1978')}.</p>
<p>Gli usi più frequenti sono tre: l’aggiornamento annuale del canone di locazione, l’adeguamento dell’assegno di mantenimento e la rivalutazione di un credito o di una somma tra due date. Il calcolo è lo stesso; cambiano la quota della variazione da applicare e la cadenza.</p>
<h2>Gli ultimi dodici indici FOI</h2>
${h.table(['Mese', 'Indice FOI senza tabacchi', 'Base', 'Variazione sull’anno prima'], righe, 'Fonte: Istat, indice FOI senza tabacchi (ECOICOP v2), letto il 24 ottobre 2026. Licenza CC BY 4.0.', ['l', 'r', 'l', 'r'])}
<p>Da gennaio 2026 l’Istat pubblica il FOI in base 2025 = 100 e con la nuova classificazione europea delle voci di spesa (ECOICOP versione 2). Le serie storiche dal 1996 al 2025 sono state ricostruite, ma l’Istat precisa che gli indici generali, FOI e FOI senza tabacchi, restano invariati. I valori di prima del 2026 restano quindi nelle loro basi, e il collegamento si fa con i coefficienti di raccordo.</p>
<h2>Le basi dell’indice e i coefficienti di raccordo</h2>
${h.table(['Base', 'Mesi coperti', 'Raccordo con la base precedente'], basi, 'Coefficienti di raccordo indicati dall’Istat (nota 2026). Il raccordo è l’indice medio del nuovo anno base espresso nella base precedente, diviso per 100.', ['l', 'l', 'r'])}
<p>Il coefficiente di raccordo serve quando i due mesi del calcolo appartengono a basi diverse. Se il mese di partenza è in base 2015 e quello di arrivo in base 2025, si moltiplica il rapporto degli indici per ${h.num(h.D.RACCORDI[2025], 3)}; se si parte dalla base 1995, si moltiplica per tutti e tre i coefficienti. Il calcolatore sceglie da solo i raccordi necessari e li mostra nel risultato.</p>
<h2>La formula, passo per passo</h2>
<ol>
<li>Si legge l’indice FOI senza tabacchi del mese di partenza e quello del mese di arrivo, ciascuno nella sua base.</li>
<li>Si divide l’indice di arrivo per quello di partenza.</li>
<li>Si moltiplica per i coefficienti di raccordo, uno per ogni cambio di base nell’intervallo.</li>
<li>Si arrotonda il risultato a tre decimali: è il coefficiente di rivalutazione. La variazione percentuale è lo stesso numero meno uno, per cento, arrotondata a un decimale.</li>
<li>Si moltiplica la somma per il coefficiente.</li>
</ol>
<p>L’Istat raccomanda di fare il calcolo in un unico passaggio, senza usare termini arrotondati: arrotondare a metà strada può spostare il terzo decimale. Il calcolatore segue questa regola.</p>
<h2>Tre esempi calcolati</h2>
<p><strong>L’esempio ufficiale dell’Istat.</strong> Gennaio 2009, indice ${h.num(es1.fd.indice, 1)} in base 1995; gennaio 2026, indice ${h.num(es1.fa.indice, 1)} in base 2025. Tre cambi di base: ${h.num(es1.fa.indice, 1)} / ${h.num(es1.fd.indice, 1)} × ${h.num(h.D.RACCORDI[2010], 3)} × ${h.num(h.D.RACCORDI[2015], 3)} × ${h.num(h.D.RACCORDI[2025], 3)} = ${h.num(es1.coefficiente, 3)}, variazione ${h.pc(es1.variazione, 1)}. Mille euro del 2009 valgono ${h.eur(es1.rivalutato)} di gennaio 2026.</p>
<p><strong>Una somma del 2016.</strong> 10.000 € di gennaio 2016 (indice ${h.num(es2.fd.indice, 1)}, base 2015) portati a ${h.mois(u.m)} (${h.num(es2.fa.indice, 1)}, base 2025): coefficiente ${h.num(es2.coefficiente, 3)}, somma rivalutata ${h.eur(es2.rivalutato)}.</p>
<p><strong>Un importo del 2021.</strong> 25.000 € di giugno 2021 portati a ${h.mois(u.m)}: coefficiente ${h.num(es3.coefficiente, 3)}, cioè ${h.pc(es3.variazione, 1)}, somma rivalutata ${h.eur(es3.rivalutato)}. Buona parte dell’aumento viene dal 2022 e dal 2023, gli anni in cui l’indice è cresciuto di più.</p>
<h2>Quanto valgono oggi 1.000 € di gennaio</h2>
${h.table(['Mese di partenza', `Coefficiente fino a ${h.mois(u.m)}`, '1.000 € rivalutati'], anni, 'Calcolo con gli indici FOI senza tabacchi e i coefficienti di raccordo dell’Istat.', ['l', 'r', 'r'])}
<h2>Il canone d’affitto: non sempre il 100 %</h2>
<p>Per il canone di locazione non si rivaluta di solito tra due mesi qualsiasi: si applica ogni anno la variazione dell’indice sui dodici mesi, nella misura prevista dal contratto. La legge 392/1978, all’articolo 32, limita l’aumento al 75 % della variazione per le locazioni a uso diverso dall’abitazione; per le abitazioni, la ${h.src('l431', 'legge 431/1998')} lascia alle parti la clausola nel canone libero, mentre nel canone concordato vale l’accordo territoriale, di norma il 75 %. Con la cedolare secca l’aggiornamento è sospeso per tutta la durata dell’opzione (${h.src('dlgs23', 'D.Lgs. 23/2011')}, art. 3, comma 11). Il calcolo dettagliato è nella pagina ${h.a('it-affitto', 'aggiornamento Istat del canone')}.</p>
<h2>Assegno di mantenimento e crediti</h2>
<p>Un assegno di mantenimento fissato da un giudice o da un accordo si adegua di solito ogni anno agli indici Istat, partendo dal mese del provvedimento: la pagina ${h.a('it-assegno', 'adeguamento Istat dell’assegno')} spiega come trattare gli anni già trascorsi. Per una somma qualsiasi, come un credito, un risarcimento o un prezzo da attualizzare, vale il calcolo di questa pagina; la pagina ${h.a('it-rival', 'calcolo della rivalutazione monetaria')} si sofferma sui casi in cui serve e su quello che non comprende. La serie completa dell’indice, mese per mese, è in ${h.a('it-foi', 'indice Istat FOI')}.</p>
<h2>Cinque errori che falsano la rivalutazione</h2>
<ul>
<li><strong>Sommare le variazioni mensili.</strong> La variazione da un mese all’altro, pubblicata anch’essa dall’Istat, non si somma: dodici variazioni mensili dello 0,3 % non danno il 3,6 %. Il coefficiente nasce sempre dal rapporto tra i due indici.</li>
<li><strong>Dimenticare il raccordo.</strong> Dividere un indice in base 2025 per uno in base 2015 senza moltiplicare per ${h.num(h.D.RACCORDI[2025], 3)} dà un risultato senza senso: l’indice di gennaio 2026 (${h.num(h.D.foi('2026-01')!.indice, 1)}) sembra più basso di quello di dicembre 2025 (${h.num(h.D.foi('2025-12')!.indice, 1)}), solo perché la scala è cambiata.</li>
<li><strong>Usare un indice diverso.</strong> Il NIC, l’IPCA o il FOI con tabacchi sono indici pubblicati anch’essi dall’Istat, ma non quello indicato per le rivalutazioni monetarie. Se il titolo non dice altro, l’indice è il FOI senza tabacchi.</li>
<li><strong>Arrotondare a metà strada.</strong> Arrotondare il rapporto degli indici prima di moltiplicarlo per i raccordi, oppure usare una variazione percentuale già arrotondata a un decimale, può spostare il risultato di qualche euro su somme importanti.</li>
<li><strong>Sbagliare il mese.</strong> Il mese di partenza è quello in cui la somma era dovuta o è stata fissata, non quello in cui la si chiede. Per un canone conta il mese indicato nel contratto, spesso quello che precede la scadenza annuale.</li>
</ul>
<h2>Rivalutare ogni anno o in un’unica volta</h2>
<p>Una somma aggiornata ogni anno con il 100 % della variazione dei dodici mesi arriva, dopo qualche anno, quasi allo stesso importo di una rivalutazione fatta in un’unica volta tra il primo e l’ultimo mese: il prodotto dei coefficienti annuali coincide con il rapporto tra gli indici estremi, salvo gli arrotondamenti di ogni passaggio. La differenza, di pochi centesimi, nasce dal fatto che ogni aggiornamento annuale arrotonda l’importo al centesimo e la variazione a un decimale. Se invece l’aggiornamento è al 75 %, come per i locali commerciali, la catena annuale dà sempre meno della rivalutazione piena, e la differenza cresce con gli anni: per questo il canone commerciale non si ricostruisce con un calcolo tra due date, ma anno per anno.</p>
<h2>Quando la rivalutazione non si applica da sola</h2>
<p>La rivalutazione è un calcolo, non un diritto automatico. Per un canone d’affitto serve una clausola nel contratto e, in genere, la richiesta del locatore; per un assegno serve che il provvedimento o l’accordo preveda l’adeguamento; per un credito dipende dalla natura del debito e da quanto ha deciso il giudice. Il calcolatore ti dice di quanto cresce l’importo se l’indice si applica; se si applica, e da quando, lo dice il titolo da cui nasce la somma.</p>
<h2>Fonti e limiti del calcolo</h2>
<p>Gli indici vengono dalla banca dati dell’Istat e sono controllati sulla nota ufficiale; i coefficienti di raccordo sono quelli del ${h.src('istatRivaluta', 'servizio Rivaluta dell’Istat')}. Il calcolatore copre i mesi da gennaio 1996 all’ultimo indice pubblicato e non applica interessi né arrotondamenti diversi da quelli dell’Istat. Se un contratto o una sentenza prevede un indice diverso, una quota diversa o un mese diverso, vale quanto scritto nel titolo. Per una controversia, rivolgiti a un professionista.</p>`;
  },
};
export default t;
