/** Indice santé d'un mois (Statbel) et variation entre deux mois : la donnée qu'on vient chercher. */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, mois, useParams, type L } from './kit';
import { indiceSante, moisSante, santeBase2025 } from '../../lib/engine/donnees';

export default function BeIndiceCalc({ lang: l, methodHref }: { lang: L; methodHref?: string }) {
  const liste = moisSante();
  const [v, set] = useParams({ a: 0, b: 12, m: 1000 });
  const ma = liste[v.a] ?? liste[0], mb = liste[v.b] ?? liste[12];
  const ia = indiceSante(ma)!, ib = indiceSante(mb)!;
  const varPct = (ia / ib - 1) * 100;
  const opts = liste.map((m, i) => ({ value: String(i), label: mois(m, l) }));
  const form = (
    <>
      <Row2>
        <SelectField id="bi-a" label={tr(l, { fr: 'Mois recherché', nl: 'Gezochte maand', en: 'Month you need' })} value={String(v.a)} onChange={(x) => set('a')(Number(x))} options={opts.slice(0, 60)} />
        <SelectField id="bi-b" label={tr(l, { fr: 'Mois de comparaison', nl: 'Vergelijkingsmaand', en: 'Compare with' })} value={String(v.b)} onChange={(x) => set('b')(Number(x))} options={opts} />
      </Row2>
      <NumberField id="bi-m" label={tr(l, { fr: 'Montant à indexer (facultatif)', nl: 'Te indexeren bedrag (optioneel)', en: 'Amount to index (optional)' })} value={v.m} onChange={set('m')} unit="€" max={10_000_000} decimals={2} lang={l} />
    </>
  );
  const result = (
    <ResultPanel lang={l} head={tr(l, { fr: `Indice santé de ${mois(ma, l)} (base 2013)`, nl: `Gezondheidsindex ${mois(ma, l)} (basis 2013)`, en: `Health index, ${mois(ma, l)} (base 2013)` })} value={nr(ia, l)}
      sub={santeBase2025[ma] !== undefined ? tr(l, { fr: `Base 2025 : ${nr(santeBase2025[ma], l)}`, nl: `Basis 2025: ${nr(santeBase2025[ma], l)}`, en: `Base 2025: ${nr(santeBase2025[ma], l)}` }) : undefined}
      fraction={{ base: eur(v.m, l), top: `${nr(ia, l)} (${mois(ma, l)})`, bottom: `${nr(ib, l)} (${mois(mb, l)})` }}
      rows={[
        { label: tr(l, { fr: `Indice de ${mois(mb, l)}`, nl: `Indexcijfer ${mois(mb, l)}`, en: `Index for ${mois(mb, l)}` }), value: nr(ib, l) },
        { label: tr(l, { fr: 'Variation entre les deux mois', nl: 'Verschil tussen beide maanden', en: 'Change between the two months' }), value: pc(varPct, l) },
        { label: tr(l, { fr: 'Montant indexé', nl: 'Geïndexeerd bedrag', en: 'Indexed amount' }), value: eur((v.m * ia) / ib, l), strong: true },
      ]}
      hyp={tr(l, { fr: "Statbel publie l'indice santé du mois à la fin de ce mois. La série de base 2013 remonte ici à janvier 1994 ; le bail ou le jugement peut citer une autre base, le rapport entre deux mois reste presque identique.", nl: 'Statbel publiceert de gezondheidsindex van een maand op het einde van die maand. Basis 2013 hier vanaf januari 1994.', en: 'Statbel publishes each month’s health index at the end of that month. Base 2013 series from January 1994.' })}
      methodHref={methodHref} copyText={`${mois(ma, l)} : ${nr(ia, l)}`} />
  );
  return <Frame form={form} result={result} />;
}
