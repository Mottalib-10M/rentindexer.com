/**
 * Calcolatori Istat (indice FOI senza tabacchi).
 * - « affitto » : aggiornamento annuale del canone = variazione annua del mese indicato × quota
 *   (100 % libero se pattuito, 75 % uso diverso — L. 392/1978 art. 32 —, cedolare secca : sospeso).
 * - « rivaluta » e « assegno » : somma rivalutata tra due mesi con i coefficienti di raccordo Istat.
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, mois, useParams, type L } from './kit';
import { aggiornaIt, rivalutaIt, type RegimeIt } from '../../lib/engine/indexation';
import { foi, mesiFoi, raccordiTra } from '../../lib/engine/donnees';

interface Props { lang: L; modo?: 'affitto' | 'rivaluta' | 'assegno'; methodHref?: string }
const REGIMI: RegimeIt[] = ['libero', 'concordato', 'commerciale', 'cedolare'];

export default function ItCalc({ lang: l, modo = 'affitto', methodHref }: Props) {
  const mesi = mesiFoi();
  const conVar = mesi.filter((m) => foi(m)?.varAnno !== undefined);
  const defDa = modo === 'assegno' ? mesi.indexOf('2023-09') : mesi.indexOf('2016-01');
  const [v, set] = useParams({ imp: modo === 'affitto' ? 800 : modo === 'assegno' ? 450 : 10000, m: 0, da: defDa, reg: 0, quota: 100 });
  if (modo === 'affitto') {
    const m = conVar[v.m] ?? conVar[0];
    const f = foi(m)!;
    const reg = REGIMI[v.reg] ?? 'libero';
    const quota = reg === 'libero' ? v.quota / 100 : 0.75;
    const r = aggiornaIt(v.imp, f.varAnno!, reg, quota);
    const rl = { libero: tr(l, { it: 'Abitativo a canone libero (4+4)', en: 'Residential, open-market lease (4+4)' }), concordato: tr(l, { it: 'Abitativo a canone concordato (3+2)', en: 'Residential, agreed-rent lease (3+2)' }), commerciale: tr(l, { it: 'Uso diverso (negozio, ufficio)', en: 'Commercial use (shop, office)' }), cedolare: tr(l, { it: 'Con cedolare secca', en: 'Under cedolare secca (flat tax)' }) };
    const form = (
      <>
        <Row2>
          <NumberField id="it-canone" label={tr(l, { it: 'Canone mensile attuale', en: 'Current monthly rent' })} value={v.imp} onChange={set('imp')} unit="€" max={50000} decimals={2} lang={l} />
          <SelectField id="it-mese" label={tr(l, { it: 'Mese di riferimento Istat', en: 'Istat reference month' })} value={String(v.m)} onChange={(x) => set('m')(Number(x))} options={conVar.slice(0, 36).map((x, i) => ({ value: String(i), label: mois(x, l) }))} />
        </Row2>
        <Row2>
          <SelectField id="it-reg" label={tr(l, { it: 'Tipo di contratto', en: 'Type of lease' })} value={String(v.reg)} onChange={(x) => set('reg')(Number(x))} options={REGIMI.map((x, i) => ({ value: String(i), label: rl[x] }))} />
          {reg === 'libero' ? <SelectField id="it-quota" label={tr(l, { it: 'Quota pattuita della variazione', en: 'Share of the change agreed' })} value={String(v.quota)} onChange={(x) => set('quota')(Number(x))} options={[{ value: '100', label: pc(100, l, 0) }, { value: '75', label: pc(75, l, 0) }]} /> : <div />}
        </Row2>
      </>
    );
    return <Frame form={form} result={
      <ResultPanel lang={l} head={tr(l, { it: 'Nuovo canone mensile', en: 'New monthly rent' })} value={eur(r.nouveauLoyer, l)}
        sub={r.bloque ? tr(l, { it: 'Nessun aggiornamento', en: 'No update' }) : `+${eur(r.hausse, l)} ${tr(l, { it: 'al mese', en: 'a month' })} · +${eur(r.hausse * 12, l)} ${tr(l, { it: "all'anno", en: 'a year' })}`}
        warn={r.bloque ? tr(l, { it: 'Con la cedolare secca la facoltà di chiedere l’aggiornamento Istat è sospesa per tutta la durata dell’opzione (D.Lgs. 23/2011, art. 3, c. 11).', en: 'Under cedolare secca the right to an Istat update is suspended for as long as the option runs (Legislative Decree 23/2011, art. 3(11)).' }) : undefined}
        rows={[
          { label: tr(l, { it: `Variazione FOI ${mois(m, l)} su un anno`, en: `FOI change to ${mois(m, l)}, 12 months` }), value: pc(f.varAnno!, l, 1) },
          { label: tr(l, { it: 'Quota applicata', en: 'Share applied' }), value: pc(r.bloque ? 0 : quota * 100, l, 0) },
          { label: tr(l, { it: 'Aumento applicato', en: 'Increase applied' }), value: pc(r.taux, l) },
          { label: tr(l, { it: 'Nuovo canone', en: 'New rent' }), value: eur(r.nouveauLoyer, l), strong: true },
        ]}
        hyp={tr(l, { it: "Variazione annua dell'indice FOI senza tabacchi pubblicata dall'Istat per il mese indicato nel contratto. L'aggiornamento spetta su richiesta del locatore e non è retroattivo oltre quanto previsto dal contratto.", en: 'Annual change in the FOI index excluding tobacco, published by Istat for the month named in the lease. The landlord has to ask for the update.' })}
        methodHref={methodHref} copyText={`${eur(v.imp, l)} → ${eur(r.nouveauLoyer, l)} (FOI ${mois(m, l)})`} />
    } />;
  }
  const a = mesi[v.m] ?? mesi[0];
  const da = mesi[v.da] ?? mesi[mesi.length - 1];
  const fa = foi(a)!, fd = foi(da)!;
  const rac = raccordiTra(da, a);
  const r = rivalutaIt(v.imp, fd.indice, fa.indice, rac);
  const ass = modo === 'assegno';
  const opts = mesi.map((x, i) => ({ value: String(i), label: mois(x, l) }));
  const form = (
    <>
      <NumberField id={`it-${modo}-imp`} label={ass ? tr(l, { it: 'Assegno mensile stabilito', en: 'Monthly allowance set by the court' }) : tr(l, { it: 'Somma da rivalutare', en: 'Amount to revalue' })} value={v.imp} onChange={set('imp')} unit="€" max={100_000_000} decimals={2} lang={l} />
      <Row2>
        <SelectField id={`it-${modo}-da`} label={ass ? tr(l, { it: 'Mese del provvedimento', en: 'Month of the ruling' }) : tr(l, { it: 'Dal mese', en: 'From month' })} value={String(v.da)} onChange={(x) => set('da')(Number(x))} options={opts} />
        <SelectField id={`it-${modo}-a`} label={tr(l, { it: 'Al mese', en: 'To month' })} value={String(v.m)} onChange={(x) => set('m')(Number(x))} options={opts.slice(0, 120)} />
      </Row2>
    </>
  );
  return <Frame form={form} result={
    <ResultPanel lang={l} head={ass ? tr(l, { it: `Assegno adeguato a ${mois(a, l)}`, en: `Allowance updated to ${mois(a, l)}` }) : tr(l, { it: `Somma rivalutata a ${mois(a, l)}`, en: `Amount revalued to ${mois(a, l)}` })} value={eur(r.rivalutato, l)}
      sub={`${tr(l, { it: 'coefficiente', en: 'coefficient' })} ${nr(r.coefficiente, l, 3)} · ${r.variazione >= 0 ? '+' : ''}${pc(r.variazione, l, 1)}`}
      fraction={{ base: eur(v.imp, l), top: `${nr(fa.indice, l, 1)} (${mois(a, l)}, base ${fa.base})`, bottom: `${nr(fd.indice, l, 1)} (${mois(da, l)}, base ${fd.base})` }}
      rows={[
        { label: tr(l, { it: `Indice FOI ${mois(da, l)}`, en: `FOI index ${mois(da, l)}` }), value: `${nr(fd.indice, l, 1)} (base ${fd.base})` },
        { label: tr(l, { it: `Indice FOI ${mois(a, l)}`, en: `FOI index ${mois(a, l)}` }), value: `${nr(fa.indice, l, 1)} (base ${fa.base})` },
        { label: tr(l, { it: 'Coefficienti di raccordo', en: 'Base-linking coefficients' }), value: rac.length ? rac.map((c) => nr(c, l, 3)).join(' × ') : '—' },
        { label: tr(l, { it: 'Aumento', en: 'Increase' }), value: eur(r.rivalutato - v.imp, l) },
        { label: ass ? tr(l, { it: 'Nuovo assegno', en: 'New allowance' }) : tr(l, { it: 'Somma rivalutata', en: 'Revalued amount' }), value: eur(r.rivalutato, l), strong: true },
      ]}
      hyp={tr(l, { it: "Metodo Istat : rapporto tra gli indici FOI senza tabacchi dei due mesi, moltiplicato per i coefficienti di raccordo tra basi (1,373 · 1,071 · 1,214), coefficiente arrotondato a tre decimali. Per un assegno, verifica nel provvedimento il mese di partenza e se l'adeguamento è annuale.", en: 'Istat method: ratio of the FOI indices excluding tobacco for the two months, times the base-linking coefficients (1.373 · 1.071 · 1.214), coefficient rounded to three decimals.' })}
      methodHref={methodHref} copyText={`${eur(v.imp, l)} → ${eur(r.rivalutato, l)} (${mois(da, l)} → ${mois(a, l)})`} />
  } />;
}
