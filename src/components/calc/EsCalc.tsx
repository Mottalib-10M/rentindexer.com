/**
 * Actualización anual de la renta de vivienda (LAU art. 18, redacción del RDL 29/2026, y su
 * disposición final sexta). Mes de referencia : el último índice publicado en la fecha de
 * actualización ; el INE publica el IPC y el IRAV de un mes hacia mediados del mes siguiente.
 * Vista « comparador » : la misma renta con IPC, IRAV y el tope del 2 %.
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Frame, ResultPanel, Row2, tr, eur, pc, mois, MONTHS, monthLabel, yearRange, useParams, type L } from './kit';
import { actualizarEs, centimes } from '../../lib/engine/indexation';
import { IPC_ES, IRAV_ES, dernierEs } from '../../lib/engine/donnees';

interface Props { lang: L; vista?: 'general' | 'comparador'; pacto?: number; methodHref?: string }
const PACTOS = ['ipc', 'irav', 'sin-indice', 'ninguno'] as const;
const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
/** Último mes publicado el día 1 del mes de actualización : dos meses antes. */
const mesRef = (y: number, m: number) => { let mm = m - 2, yy = y; if (mm <= 0) { mm += 12; yy -= 1; } return ym(yy, mm); };

export default function EsCalc({ lang: l, vista = 'general', pacto = 0, methodHref }: Props) {
  const ult = dernierEs();
  const [v, set] = useParams({ renta: 950, fy: 2021, fm: 11, ay: 2026, pac: pacto, sobre: 0 });
  const fecha = `${ym(v.fy, v.fm)}-01`;
  const act = `${ym(v.ay, v.fm)}-01`;
  const ref = mesRef(v.ay, v.fm);
  const pac = PACTOS[v.pac] ?? 'ipc';
  const enPeriodo = act >= '2026-10-08' && act <= '2027-12-31';
  const base = { renta: v.renta, fechaContrato: fecha, fechaActualizacion: act, ipc: IPC_ES, irav: IRAV_ES, mesReferencia: ref, rdl29Vigente: true, rentaSobreIndiceReferencia: !!v.sobre };
  let r: ReturnType<typeof actualizarEs> | null = null; let err = '';
  if (v.ay <= v.fy) err = tr(l, { es: 'La primera actualización llega al cumplirse el primer año de contrato.', en: 'The first update comes on the first anniversary of the lease.' });
  else if (IPC_ES[ref] === undefined) err = tr(l, { es: `El índice de ${mois(ref, l)} aún no está publicado (último: ${mois(ult.p, l)}). El INE lo publicará hacia mediados del mes siguiente.`, en: `The ${mois(ref, l)} figure is not out yet (latest: ${mois(ult.p, l)}). INE publishes it around the middle of the following month.` });
  else { try { r = actualizarEs({ ...base, pacto: pac }); } catch { err = tr(l, { es: `No hay IRAV para ${mois(ref, l)}: el índice existe desde noviembre de 2024.`, en: `No IRAV for ${mois(ref, l)}: the index starts in November 2024.` }); } }
  const pl: Record<string, string> = {
    'es-tope-irav': tr(l, { es: 'Tope del IRAV aplicado: el incremento no puede superar la variación del IRAV (art. 18 LAU).', en: 'IRAV cap applied: the increase cannot exceed the IRAV change (LAU art. 18).' }),
    'es-rdl29-2pct': tr(l, { es: 'Tope del 2 % del Real Decreto-ley 29/2026 (anualidad entre el 8/10/2026 y el 31/12/2027, sin nuevo pacto).', en: '2% cap of Royal Decree-law 29/2026 (anniversary between 8/10/2026 and 31/12/2027, no new agreement).' }),
    'es-rdl29-sobre-indice': tr(l, { es: 'Renta por encima del límite del sistema estatal de índices de referencia: no procede ningún incremento (RDL 29/2026).', en: 'Rent above the state reference-index ceiling: no increase at all (RDL 29/2026).' }),
    'es-sin-pacto': tr(l, { es: 'Sin cláusula de actualización en el contrato: la renta no se actualiza.', en: 'No update clause in the lease: the rent stays the same.' }),
  };
  const opts = PACTOS.map((p, i) => ({ value: String(i), label: { ipc: tr(l, { es: 'IPC (índice general)', en: 'CPI (general index)' }), irav: 'IRAV', 'sin-indice': tr(l, { es: 'Actualización pactada sin índice', en: 'Update agreed, no index named' }), ninguno: tr(l, { es: 'Ninguna cláusula', en: 'No clause at all' }) }[p] }));
  const form = (
    <>
      <Row2>
        <NumberField id="es-renta" label={tr(l, { es: 'Renta mensual actual', en: 'Current monthly rent' })} value={v.renta} onChange={set('renta')} unit="€" max={30000} decimals={2} lang={l} />
        <SelectField id="es-pac" label={tr(l, { es: 'Qué dice el contrato', en: 'What the lease says' })} value={String(v.pac)} onChange={(x) => set('pac')(Number(x))} options={opts} />
      </Row2>
      <Row2>
        <SelectField id="es-fm" label={tr(l, { es: 'Mes de firma (aniversario)', en: 'Month signed (anniversary)' })} value={String(v.fm)} onChange={(x) => set('fm')(Number(x))} options={MONTHS.map((m, i) => ({ value: String(i + 1), label: monthLabel(m, l) }))} />
        <SelectField id="es-fy" label={tr(l, { es: 'Año de firma', en: 'Year signed' })} value={String(v.fy)} onChange={(x) => set('fy')(Number(x))} options={yearRange(2000, 2027).map((y) => ({ value: String(y), label: String(y) }))} />
      </Row2>
      <Row2>
        <SelectField id="es-ay" label={tr(l, { es: 'Año de la actualización', en: 'Year of the update' })} value={String(v.ay)} onChange={(x) => set('ay')(Number(x))} options={yearRange(2024, 2027).map((y) => ({ value: String(y), label: String(y) }))} />
        {enPeriodo ? <Toggle id="es-sobre" label={tr(l, { es: '¿Renta por encima del índice de referencia?', en: 'Rent above the reference index?' })} value={String(v.sobre)} onChange={(x) => set('sobre')(Number(x))} options={[{ value: '0', label: 'No' }, { value: '1', label: tr(l, { es: 'Sí', en: 'Yes' }) }]} /> : <div />}
      </Row2>
    </>
  );
  if (!r) return <Frame form={form} result={<ResultPanel lang={l} head={tr(l, { es: 'Actualización', en: 'Update' })} value="—" rows={[]} copyText="" warn={err} />} />;
  const comp = vista === 'comparador';
  const sin = (p: 'ipc' | 'irav') => (IPC_ES[ref] !== undefined && (p === 'ipc' || IRAV_ES[ref] !== undefined) ? centimes(v.renta * (1 + (p === 'ipc' ? IPC_ES[ref] : IRAV_ES[ref]) / 100)) : null);
  const rows = comp
    ? [
      { label: tr(l, { es: `Con el IPC de ${mois(ref, l)} (${pc(IPC_ES[ref], l, 1)})`, en: `With ${mois(ref, l)} CPI (${pc(IPC_ES[ref], l, 1)})` }), value: eur(sin('ipc') ?? 0, l) },
      { label: tr(l, { es: `Con el IRAV de ${mois(ref, l)}`, en: `With ${mois(ref, l)} IRAV` }), value: IRAV_ES[ref] !== undefined ? `${eur(sin('irav') ?? 0, l)} (${pc(IRAV_ES[ref], l)})` : '—' },
      { label: tr(l, { es: 'Con el tope del 2 %', en: 'With the 2% cap' }), value: eur(centimes(v.renta * 1.02), l) },
      { label: tr(l, { es: 'Lo que se aplica a tu contrato', en: 'What applies to your lease' }), value: eur(r.nouveauLoyer, l), strong: true },
    ]
    : [
      { label: tr(l, { es: 'Mes de referencia', en: 'Reference month' }), value: mois(ref, l) },
      { label: tr(l, { es: 'IPC general, variación anual', en: 'General CPI, annual change' }), value: pc(IPC_ES[ref], l, 1) },
      { label: tr(l, { es: 'IRAV, variación anual', en: 'IRAV, annual change' }), value: IRAV_ES[ref] !== undefined ? pc(IRAV_ES[ref], l) : '—' },
      { label: tr(l, { es: 'Subida aplicada', en: 'Increase applied' }), value: pc(r.taux, l) },
      { label: tr(l, { es: 'Nueva renta', en: 'New rent' }), value: eur(r.nouveauLoyer, l), strong: true },
    ];
  return <Frame form={form} result={
    <ResultPanel lang={l} head={tr(l, { es: `Renta desde ${mois(ym(v.ay, v.fm), l)}`, en: `Rent from ${mois(ym(v.ay, v.fm), l)}` })} value={eur(r.nouveauLoyer, l)}
      sub={`+${eur(r.hausse, l)} ${tr(l, { es: 'al mes', en: 'a month' })} · +${eur(r.hausse * 12, l)} ${tr(l, { es: 'al año', en: 'a year' })}`}
      warn={r.plafond ? pl[r.plafond] : undefined}
      rows={rows}
      hyp={tr(l, { es: 'Índices del INE. El Real Decreto-ley 29/2026 está en vigor desde el 8 de octubre de 2026 y debe ser convalidado por el Congreso: si se deroga, su tope del 2 % deja de aplicarse. Los contratos firmados antes del 26 de mayo de 2023 conservan el índice pactado.', en: 'INE indices. Royal Decree-law 29/2026 has applied since 8 October 2026 and still needs to be confirmed by Congress: if it is repealed, its 2% cap stops applying. Leases signed before 26 May 2023 keep the index they agreed.' })}
      methodHref={methodHref} copyText={`${eur(v.renta, l)} → ${eur(r.nouveauLoyer, l)} (${mois(ref, l)})`} />
  } />;
}
