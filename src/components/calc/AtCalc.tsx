/**
 * Österreich.
 * - « mieweg » : Anpassung am 1. April nach dem Mieten-Wertsicherungsgesetz (BGBl. I Nr. 114/2025) :
 *   durchschnittliche Veränderung des VPI im Vorjahr, Anteil über 3 % nur zur Hälfte, Deckel für
 *   MRG-Wohnungen mit Mietzinsbeschränkung (2025 : 1 %, 2026 : 2 %), erste Valorisierung aliquot.
 * - « wert » : Wertsicherung eines Betrags zwischen zwei Monaten (VPI 2010 → 2015 → 2020 → 2025 verkettet),
 *   mit optionalem Schwellenwert der Vertragsklausel.
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, mois, MONTHS, monthLabel, yearRange, useParams, type L } from './kit';
import { mieWegProzent, valorisierenAt, wertsichernAt } from '../../lib/engine/indexation';
import { vpi, vpiIn, monateVpi, letzterVpi, verkettungZwischen, VERKETTUNG } from '../../lib/engine/donnees';

interface Props { lang: L; modo?: 'mieweg' | 'wert'; methodHref?: string }

/** Zwischenstand der Jahresveränderung 2026 : verfügbare Monate 2026 gegen dieselben Monate 2025. */
function zwischenstand2026(): { prozent: number; bis: string } | null {
  const m26 = monateVpi().filter((m) => m.startsWith('2026')).sort();
  if (!m26.length) return null;
  const a = m26.reduce((s, m) => s + (vpiIn(2025, m) ?? 0), 0) / m26.length * VERKETTUNG[2025];
  const b = m26.reduce((s, m) => s + (vpiIn(2020, `2025${m.slice(4)}`) ?? 0), 0) / m26.length;
  return { prozent: (a / b - 1) * 100, bis: m26[m26.length - 1] };
}

export default function AtCalc({ lang: l, modo = 'mieweg', methodHref }: Props) {
  const [v, set] = useParams({ b: modo === 'wert' ? 10000 : 850, mrg: 1, jahr: 2026, by: 2024, bm: 3, von: 0, bis: 0, sw: 0 });
  if (modo === 'wert') {
    const monate = monateVpi();
    const bis = monate[v.bis] ?? monate[0];
    const vonIdx = v.von || monate.indexOf('2020-01');
    const von = monate[vonIdx] ?? monate[monate.length - 1];
    const w = wertsichernAt(v.b, vpi(von)!.wert, vpi(bis)!.wert, verkettungZwischen(von, bis));
    const unter = v.sw > 0 && Math.abs(w.prozent) < v.sw;
    const opts = monate.map((m, i) => ({ value: String(i), label: mois(m, l) }));
    const form = (
      <>
        <Row2>
          <NumberField id="at-w-b" label={tr(l, { de: 'Betrag (Miete, Unterhalt, Preis)', en: 'Amount (rent, maintenance, price)' })} value={v.b} onChange={set('b')} unit="€" max={100_000_000} decimals={2} lang={l} />
          <NumberField id="at-w-sw" label={tr(l, { de: 'Schwellenwert laut Vertrag', en: 'Threshold in the clause' })} value={v.sw} onChange={set('sw')} unit="%" max={20} decimals={1} lang={l} />
        </Row2>
        <Row2>
          <SelectField id="at-w-von" label={tr(l, { de: 'Ausgangsmonat (Vertrag oder letzte Anpassung)', en: 'Starting month (contract or last adjustment)' })} value={String(vonIdx)} onChange={(x) => set('von')(Number(x))} options={opts} />
          <SelectField id="at-w-bis" label={tr(l, { de: 'Vergleichsmonat', en: 'Comparison month' })} value={String(v.bis)} onChange={(x) => set('bis')(Number(x))} options={opts.slice(0, 36)} />
        </Row2>
      </>
    );
    return <Frame form={form} result={
      <ResultPanel lang={l} head={tr(l, { de: `Wertgesicherter Betrag (${mois(bis, l)})`, en: `Index-linked amount (${mois(bis, l)})` })} value={eur(unter ? v.b : w.betrag, l)}
        sub={`${w.prozent >= 0 ? '+' : ''}${pc(w.prozent, l)} · ${tr(l, { de: 'Faktor', en: 'factor' })} ${nr(w.faktor, l, 4)}`}
        warn={unter ? tr(l, { de: `Veränderung unter dem vereinbarten Schwellenwert von ${pc(v.sw, l, 1)} : noch keine Anpassung.`, en: `Change below the agreed ${pc(v.sw, l, 1)} threshold: no adjustment yet.` }) : undefined}
        fraction={{ base: eur(v.b, l), top: `${nr(vpi(bis)!.wert, l, 1)} (VPI ${vpi(bis)!.basis})`, bottom: `${nr(vpi(von)!.wert, l, 1)} (VPI ${vpi(von)!.basis})` }}
        rows={[
          { label: `${mois(von, l)} · VPI ${vpi(von)!.basis}`, value: nr(vpi(von)!.wert, l, 1) },
          { label: `${mois(bis, l)} · VPI ${vpi(bis)!.basis}`, value: nr(vpi(bis)!.wert, l, 1) },
          { label: tr(l, { de: 'Verkettungsfaktoren', en: 'Chain factors' }), value: verkettungZwischen(von, bis).map((f) => nr(f, l, 3)).join(' × ') || '—' },
          { label: tr(l, { de: 'Neuer Betrag', en: 'New amount' }), value: eur(unter ? v.b : w.betrag, l), strong: true },
        ]}
        hyp={tr(l, { de: 'Verbraucherpreisindex der Statistik Austria ; ältere Basen über die Jahresdurchschnitte verkettet (VPI 2010 → 2015 : 1,107 ; 2015 → 2020 : 1,082 ; 2020 → 2025 : 1,282). Für Wohnungsmieten gilt seit 2026 zusätzlich das Mieten-Wertsicherungsgesetz.', en: 'Statistik Austria consumer price index; older bases chained through annual averages. Since 2026, residential rents are also capped by the Rent Value-Protection Act (MieWeG).' })}
        methodHref={methodHref} copyText={`${eur(v.b, l)} → ${eur(w.betrag, l)} (${mois(von, l)} → ${mois(bis, l)})`} />
    } />;
  }
  const jahr = v.jahr;
  const vor = jahr - 1;
  const avgVor = vpiIn(2020, String(vor)), avgVorVor = vpiIn(2020, String(vor - 1));
  const bezug = `${v.by}-${String(v.bm).padStart(2, '0')}`;
  const volleMonate = v.by === vor ? 12 - v.bm : v.by < vor ? 12 : 0;
  const zs = zwischenstand2026();
  const form = (
    <>
      <Row2>
        <NumberField id="at-miete" label={tr(l, { de: 'Hauptmietzins (netto, pro Monat)', en: 'Main rent (net, a month)' })} value={v.b} onChange={set('b')} unit="€" max={50000} decimals={2} lang={l} />
        <SelectField id="at-jahr" label={tr(l, { de: 'Anpassung am 1. April', en: 'Adjustment on 1 April' })} value={String(v.jahr)} onChange={(x) => set('jahr')(Number(x))} options={[2026, 2027].map((y) => ({ value: String(y), label: String(y) }))} />
      </Row2>
      <Toggle id="at-mrg" label={tr(l, { de: 'Mietzinsbeschränkung nach MRG (Richtwert, Kategorie, angemessen)?', en: 'Rent-controlled under the MRG (Richtwert, category, reasonable rent)?' })} value={String(v.mrg)} onChange={(x) => set('mrg')(Number(x))} options={[{ value: '1', label: tr(l, { de: 'Ja', en: 'Yes' }) }, { value: '0', label: tr(l, { de: 'Nein', en: 'No' }) }]} />
      <Row2>
        <SelectField id="at-bm" label={tr(l, { de: 'Bezugsmonat', en: 'Reference month' })} value={String(v.bm)} onChange={(x) => set('bm')(Number(x))} options={MONTHS.map((m, i) => ({ value: String(i + 1), label: monthLabel(m, l) }))} help={tr(l, { de: 'Vertragsabschluss oder Monat des Indexwerts der letzten Anpassung', en: 'Contract signed, or month of the index used for the last adjustment' })} />
        <SelectField id="at-by" label={tr(l, { de: 'Bezugsjahr', en: 'Reference year' })} value={String(v.by)} onChange={(x) => set('by')(Number(x))} options={yearRange(2015, jahr - 1).map((y) => ({ value: String(y), label: String(y) }))} />
      </Row2>
    </>
  );
  if (avgVor === undefined || avgVorVor === undefined) {
    return <Frame form={form} result={
      <ResultPanel lang={l} head={tr(l, { de: `Anpassung am 1. April ${jahr}`, en: `Adjustment on 1 April ${jahr}` })} value="—" copyText=""
        warn={tr(l, { de: `Der Jahresdurchschnitt ${vor} des VPI erscheint im Jänner ${jahr}. Erst dann steht der Prozentsatz fest.`, en: `The ${vor} annual average of the CPI comes out in January ${jahr}; only then is the percentage known.` })}
        rows={zs ? [
          { label: tr(l, { de: `Zwischenstand Jänner bis ${mois(zs.bis, l)} (kein amtlicher Wert)`, en: `Running figure January to ${mois(zs.bis, l)} (not official)` }), value: pc(zs.prozent, l) },
          { label: tr(l, { de: 'Höchstens bei MRG-Mietzinsbeschränkung', en: 'Cap for rent-controlled flats' }), value: '2,00 %' },
        ] : []} />
    } />;
  }
  const roh = (avgVor / avgVorVor - 1) * 100;
  const p = mieWegProzent(avgVor, avgVorVor, { jahr: vor, mrgBeschraenkt: !!v.mrg, ersteValorisierungMonate: volleMonate < 12 ? volleMonate : undefined });
  const r = valorisierenAt(v.b, p);
  return <Frame form={form} result={
    <ResultPanel lang={l} head={tr(l, { de: `Miete ab 1. April ${jahr}`, en: `Rent from 1 April ${jahr}` })} value={eur(r.nouveauLoyer, l)}
      sub={`+${eur(r.hausse, l)} ${tr(l, { de: 'pro Monat', en: 'a month' })} · +${pc(p, l)}`}
      warn={volleMonate === 0 ? tr(l, { de: `Bezugsmonat im Jahr ${jahr}: keine Anpassung am 1. April ${jahr}.`, en: `Reference month in ${jahr}: no adjustment on 1 April ${jahr}.` }) : volleMonate < 12 ? tr(l, { de: `Erste Valorisierung: nur ${volleMonate} volle Monate von zwölf.`, en: `First adjustment: only ${volleMonate} full months out of twelve.` }) : undefined}
      rows={[
        { label: tr(l, { de: `VPI 2020, Jahresdurchschnitt ${vor}`, en: `CPI 2020, ${vor} average` }), value: nr(avgVor, l, 1) },
        { label: tr(l, { de: `VPI 2020, Jahresdurchschnitt ${vor - 1}`, en: `CPI 2020, ${vor - 1} average` }), value: nr(avgVorVor, l, 1) },
        { label: tr(l, { de: 'Durchschnittliche Veränderung', en: 'Average change' }), value: pc(roh, l) },
        { label: tr(l, { de: 'Berücksichtigt nach MieWeG', en: 'Counted under the MieWeG' }), value: pc(p, l) },
        { label: tr(l, { de: 'Neue Miete', en: 'New rent' }), value: eur(r.nouveauLoyer, l), strong: true },
      ]}
      hyp={tr(l, { de: `Bezugsmonat ${mois(bezug, l)}. Für Verträge vor 2026 kann das Gesetz bei der ersten Anpassung auch Monate früherer Jahre berücksichtigen ; dieser Fall wird hier nicht gerechnet. Nicht anwendbar auf WGG-Wohnungen (außer § 13 Abs. 4 WGG) und Geschäftsräume.`, en: `Reference month ${mois(bezug, l)}. For leases signed before 2026, the first adjustment may also count months of earlier years; that case is not computed here. Does not apply to non-profit (WGG) flats or business premises.` })}
      methodHref={methodHref} copyText={`${eur(v.b, l)} → ${eur(r.nouveauLoyer, l)} (1.4.${jahr})`} />
  } />;
}
