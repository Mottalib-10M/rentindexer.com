/**
 * Révision annuelle d'un loyer d'habitation par l'IRL (loi du 6 juillet 1989, art. 17-1).
 * Modes : « revision » (trimestre de référence choisi), « anniversaire » (mois de révision en 2026 →
 * dernier IRL paru au JO à cette date), ; `trimestre` : trimestre présélectionné.
 */
import { useMemo } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, trim, MONTHS, monthLabel, useParams, type L } from './kit';
import { reviserFr, trimestreN1, type ZoneFr } from '../../lib/engine/indexation';
import { serieFr, trimestresFr, trimestreParuLe, dernierFr, type SerieFr } from '../../lib/engine/donnees';

interface Props { lang: L; mode?: 'revision' | 'anniversaire'; trimestre?: string; methodHref?: string }
const ZONES: ZoneFr[] = ['metropole', 'corse', 'dom'];
const SERIE: Record<ZoneFr, SerieFr> = { metropole: 'irl', corse: 'irl_corse', dom: 'irl_dom' };
const DPE = ['A', 'B', 'C', 'D', 'E', 'F', 'G', '?'];

export default function FrIrlCalc({ lang: l, mode = 'revision', trimestre, methodHref }: Props) {
  const last = dernierFr('irl').p;
  const quarters = trimestresFr('irl').filter((q) => q >= '2006-Q1');
  const [v, set] = useParams({ loyer: 750, zone: 0, q: quarters.indexOf(trimestre ?? last), dpe: 3, gel: 1, mois: 11 });
  const zone = ZONES[v.zone] ?? 'metropole';
  const serie = useMemo(() => Object.fromEntries(serieFr(SERIE[zone]).map((o) => [o.p, o.v])) as Record<string, number>, [zone]);
  let q = quarters[v.q] ?? last;
  if (mode === 'anniversaire') q = trimestreParuLe('irl', `2026-${MONTHS[v.mois - 1] ?? '11'}-01`)?.p ?? last;
  const dpe = DPE[v.dpe] ?? '?';
  const ok = serie[q] !== undefined && serie[trimestreN1(q)] !== undefined;
  const r = ok ? reviserFr({ loyer: v.loyer, trimestre: q, irl: serie, zone, dpe: dpe === '?' ? undefined : (dpe as 'A'), dateBail: v.gel ? '2023-01-01' : '2020-01-01' }) : null;
  const zl = { metropole: tr(l, { fr: 'Métropole', en: 'Mainland France' }), corse: tr(l, { fr: 'Corse', en: 'Corsica' }), dom: tr(l, { fr: 'Outre-mer (DROM)', en: 'Overseas (DROM)' }) };
  const form = (
    <>
      <Row2>
        <NumberField id="fr-loyer" label={tr(l, { fr: 'Loyer hors charges', en: 'Rent excluding service charges' })} value={v.loyer} onChange={set('loyer')} unit="€" max={20000} decimals={2} lang={l} />
        <SelectField id="fr-zone" label={tr(l, { fr: 'Lieu du logement', en: 'Where the home is' })} value={String(v.zone)} onChange={(x) => set('zone')(Number(x))} options={ZONES.map((z, i) => ({ value: String(i), label: zl[z] }))} />
      </Row2>
      <Row2>
        {mode === 'anniversaire'
          ? <SelectField id="fr-mois" label={tr(l, { fr: 'Mois de la révision en 2026', en: 'Month of the 2026 review' })} value={String(v.mois)} onChange={(x) => set('mois')(Number(x))} options={MONTHS.map((m, i) => ({ value: String(i + 1), label: monthLabel(m, l) }))} />
          : <SelectField id="fr-q" label={tr(l, { fr: 'Trimestre de référence du bail', en: 'Reference quarter in the lease' })} value={String(Math.max(0, quarters.indexOf(q)))} onChange={(x) => set('q')(Number(x))} options={quarters.slice(0, 40).map((x, i) => ({ value: String(i), label: trim(x, l) }))} />}
        <SelectField id="fr-dpe" label={tr(l, { fr: 'Classe énergie (DPE)', en: 'Energy rating (DPE)' })} value={String(v.dpe)} onChange={(x) => set('dpe')(Number(x))} options={DPE.map((d, i) => ({ value: String(i), label: d === '?' ? tr(l, { fr: 'Inconnue', en: 'Unknown' }) : d }))} />
      </Row2>
      {(dpe === 'F' || dpe === 'G') && (
        <Toggle id="fr-gel" label={tr(l, { fr: zone === 'dom' ? 'Bail signé, renouvelé ou reconduit depuis le 1er juillet 2024 ?' : 'Bail signé, renouvelé ou reconduit depuis le 24 août 2022 ?', en: zone === 'dom' ? 'Lease signed, renewed or rolled over since 1 July 2024?' : 'Lease signed, renewed or rolled over since 24 August 2022?' })}
          value={String(v.gel)} onChange={(x) => set('gel')(Number(x))} options={[{ value: '1', label: tr(l, { fr: 'Oui', en: 'Yes' }) }, { value: '0', label: tr(l, { fr: 'Non', en: 'No' }) }]} />
      )}
    </>
  );
  const result = r ? (
    <ResultPanel lang={l} head={tr(l, { fr: 'Loyer hors charges après révision', en: 'Rent after the review' })} value={eur(r.nouveauLoyer, l)}
      sub={r.bloque ? tr(l, { fr: 'Aucune hausse possible', en: 'No increase allowed' }) : `+${eur(r.hausse, l)} ${tr(l, { fr: 'par mois', en: 'a month' })} · +${pc(r.taux, l)}`}
      warn={r.bloque ? tr(l, { fr: 'Logement classé F ou G : la révision est interdite pour un bail signé, renouvelé ou reconduit depuis la date du gel.', en: 'F or G rated home: the review is banned for a lease signed, renewed or rolled over since the freeze date.' }) : undefined}
      fraction={{ base: eur(v.loyer, l), top: `${nr(r.indiceNouveau!, l)} (${trim(q, l)})`, bottom: `${nr(r.indiceAncien!, l)} (${trim(trimestreN1(q), l)})` }}
      rows={[
        { label: tr(l, { fr: `IRL ${trim(q, l)}`, en: `IRL ${trim(q, l)}` }), value: nr(r.indiceNouveau!, l) },
        { label: tr(l, { fr: `IRL ${trim(trimestreN1(q), l)}`, en: `IRL ${trim(trimestreN1(q), l)}` }), value: nr(r.indiceAncien!, l) },
        { label: tr(l, { fr: 'Hausse sur douze mois', en: 'Increase over twelve months' }), value: eur(r.hausse * 12, l) },
        { label: tr(l, { fr: 'Nouveau loyer', en: 'New rent' }), value: eur(r.nouveauLoyer, l), strong: true },
      ]}
      hyp={tr(l, { fr: `Révision une fois par an à la date prévue au bail, sans effet rétroactif : le bailleur a un an pour la demander. IRL publiés par l'Insee (${zl[zone]}), arrondis au centime.`, en: `One review a year on the date set in the lease, never backdated: the landlord has one year to ask for it. IRL values published by Insee (${zl[zone]}), rounded to the cent.` })}
      methodHref={methodHref} copyText={`${eur(v.loyer, l)} → ${eur(r.nouveauLoyer, l)} (IRL ${trim(q, l)})`} />
  ) : (
    <ResultPanel lang={l} head={tr(l, { fr: 'Indice à paraître', en: 'Index not yet published' })} value="—" rows={[]} copyText="" warn={tr(l, { fr: `L'IRL du ${trim(q, l)} n'est pas encore publié par l'Insee.`, en: `Insee has not yet published the IRL for ${trim(q, l)}.` })} />
  );
  return <Frame form={form} result={result} />;
}
