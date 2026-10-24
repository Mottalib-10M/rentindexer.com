/**
 * Indexation d'une somme par un indice Insee entre deux périodes : loyer commercial (ILC), bureaux et
 * activités tertiaires (ILAT), pension alimentaire (indice des prix hors tabac, base 2025).
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, trim, mois, useParams, type L } from './kit';
import { indexerSomme } from '../../lib/engine/indexation';
import { trimestresFr, valeurFr, moisIpcFr, valeurIpcFr } from '../../lib/engine/donnees';

interface Props { lang: L; serie: 'ilc' | 'ilat' | 'ipc'; methodHref?: string }

export default function FrSommeCalc({ lang: l, serie, methodHref }: Props) {
  const ipc = serie === 'ipc';
  const periodes = ipc ? moisIpcFr().filter((m) => m >= '1996-01') : trimestresFr(serie);
  const label = (p: string) => (ipc ? mois(p, l) : trim(p, l));
  const val = (p: string) => (ipc ? valeurIpcFr(p) : valeurFr(serie, p));
  const pas = ipc ? 12 : 4;
  const [v, set] = useParams({ m: ipc ? 400 : 24000, a: 0, b: pas, tri: 0 });
  const fin = periodes[v.a] ?? periodes[0];
  const debIdx = !ipc && v.tri ? v.a + 12 : v.b;
  const deb = periodes[debIdx] ?? periodes[periodes.length - 1];
  const r = val(deb) && val(fin) ? indexerSomme(v.m, val(deb)!, val(fin)!) : null;
  const opts = periodes.slice(0, ipc ? 360 : 80).map((p, i) => ({ value: String(i), label: label(p) }));
  const nom = { ilc: 'ILC', ilat: 'ILAT', ipc: tr(l, { fr: 'Indice des prix hors tabac', en: 'CPI excluding tobacco' }) }[serie];
  const form = (
    <>
      <Row2>
        <NumberField id={`fs-${serie}-m`} label={ipc ? tr(l, { fr: 'Pension actuelle (par mois)', en: 'Current payment (a month)' }) : tr(l, { fr: 'Loyer annuel hors taxes', en: 'Annual rent before VAT' })} value={v.m} onChange={set('m')} unit="€" max={ipc ? 50000 : 5_000_000} decimals={2} lang={l} />
        <SelectField id={`fs-${serie}-a`} label={ipc ? tr(l, { fr: 'Nouvel indice (mois)', en: 'New index (month)' }) : tr(l, { fr: 'Nouvel indice (trimestre)', en: 'New index (quarter)' })} value={String(v.a)} onChange={(x) => set('a')(Number(x))} options={opts.slice(0, ipc ? 24 : 12)} />
      </Row2>
      <Row2>
        <SelectField id={`fs-${serie}-b`} label={ipc ? tr(l, { fr: 'Indice de référence (mois du jugement ou de la dernière révision)', en: 'Base index (month of the ruling or last review)' }) : tr(l, { fr: 'Indice de départ (trimestre)', en: 'Starting index (quarter)' })} value={String(debIdx)} onChange={(x) => { set('tri')(0); set('b')(Number(x)); }} options={opts} />
        {!ipc && <Toggle id={`fs-${serie}-tri`} label={tr(l, { fr: 'Révision triennale', en: 'Three-year review' })} value={String(v.tri)} onChange={(x) => set('tri')(Number(x))} options={[{ value: '0', label: tr(l, { fr: 'Non', en: 'No' }) }, { value: '1', label: tr(l, { fr: 'Oui', en: 'Yes' }) }]} />}
      </Row2>
    </>
  );
  const result = r ? (
    <ResultPanel lang={l} head={ipc ? tr(l, { fr: 'Pension indexée', en: 'Indexed payment' }) : tr(l, { fr: 'Loyer annuel indexé', en: 'Indexed annual rent' })} value={eur(r.nouveauLoyer, l)}
      sub={`${r.hausse >= 0 ? '+' : ''}${eur(r.hausse, l)} · ${r.taux >= 0 ? '+' : ''}${pc(r.taux, l)}`}
      fraction={{ base: eur(v.m, l), top: `${nr(val(fin)!, l)} (${label(fin)})`, bottom: `${nr(val(deb)!, l)} (${label(deb)})` }}
      rows={[
        { label: `${nom} ${label(fin)}`, value: nr(val(fin)!, l) },
        { label: `${nom} ${label(deb)}`, value: nr(val(deb)!, l) },
        { label: tr(l, { fr: 'Variation', en: 'Change' }), value: pc(r.taux, l) },
        ...(ipc ? [] : [{ label: tr(l, { fr: 'Loyer mensuel indexé', en: 'Indexed monthly rent' }), value: eur(r.nouveauLoyer / 12, l) }]),
      ]}
      hyp={ipc
        ? tr(l, { fr: "Indice des prix à la consommation, ensemble des ménages, France, hors tabac (base 2025, série Insee 011814056, rétropolée jusqu'en 1996 par l'Insee). Si le jugement cite un autre indice, prenez ses valeurs.", en: 'Consumer price index, all households, France, excluding tobacco (base 2025, Insee series 011814056). If the ruling names another index, use its values.' })
        : tr(l, { fr: `${nom} publié par l'Insee. Le contrat fixe le trimestre de référence ; un indice négatif fait baisser le loyer si la clause joue dans les deux sens.`, en: `${nom} published by Insee. The lease sets the reference quarter.` })}
      methodHref={methodHref} copyText={`${eur(v.m, l)} → ${eur(r.nouveauLoyer, l)} (${nom})`} />
  ) : <ResultPanel lang={l} head="—" value="—" rows={[]} copyText="" />;
  return <Frame form={form} result={result} />;
}
