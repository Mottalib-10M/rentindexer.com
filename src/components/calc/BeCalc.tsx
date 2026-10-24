/**
 * Indexation d'un loyer d'habitation en Belgique, par région : loyer de base × nouvel indice santé /
 * indice de départ, puis la correction propre à la région pour les logements peu performants
 * (Bruxelles : facteur de correction PEB E-F-G ; Wallonie : loyer adapté 2022-2023 ; Flandre :
 * correctiefactor EPC D, E, F ou sans EPC). Indices Statbel, base 2013.
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, Row2, tr, eur, nr, pc, mois, MONTHS, monthLabel, yearRange, useParams, type L } from './kit';
import { indexerBe, indexerBruxelles, indexerFlandre, indexerWallonie, anniversairesCorrectionBxl, anniversaire2223, moisPrecedent, type RegionBe, type Resultat } from '../../lib/engine/indexation';
import { indiceSante, dernierSante, regles } from '../../lib/engine/donnees';

interface Props { lang: L; region?: RegionBe; methodHref?: string }
const REGIONS: RegionBe[] = ['bruxelles', 'wallonie', 'flandre'];
const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'sans'] as const;
const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;

export default function BeCalc({ lang: l, region = 'bruxelles', methodHref }: Props) {
  const last = dernierSante();
  const lastY = Number(last.p.slice(0, 4));
  const [v, set] = useParams({ reg: REGIONS.indexOf(region), loyer: 850, sy: 2021, sm: 5, ey: 2021, em: 6, an: 2026, peb: 3, ej: 0, dm: 0 });
  const reg = REGIONS[v.reg] ?? 'bruxelles';
  const vl = reg === 'flandre';
  const bx = reg === 'bruxelles';
  // Bruxelles : le facteur de correction dépend de l'anniversaire avant ou à partir du 14 octobre.
  const entree = `${ym(v.ey, v.em)}-${bx && v.em === 10 && v.ej ? '14' : '01'}`;
  // Flandre : en cas de demande tardive, l'indice santé du moment de la demande (vlaanderen.be, « De huurprijs »).
  const retard = vl ? Math.max(0, Math.min(11, v.dm)) : 0;
  const mDemande = (() => { const t = v.an * 12 + (v.em - 1) + retard; return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, '0')}-01`; })();
  // Indice de départ : mois précédant la signature (Bruxelles, Wallonie) ou l'entrée en vigueur (Flandre).
  const mDep = moisPrecedent(vl ? entree : `${ym(v.sy, v.sm)}-01`);
  const mNew = moisPrecedent(mDemande);
  const dep = indiceSante(mDep), nouv = indiceSante(mNew);
  const label = LABELS[v.peb] ?? 'sans';
  let r: Resultat | null = null; let erreur = '';
  try {
    if (dep === undefined) erreur = tr(l, { fr: `Indice de ${mois(mDep, l)} absent de la série (depuis janvier 1994).`, nl: `Indexcijfer van ${mois(mDep, l)} ontbreekt in de reeks (sinds januari 1994).`, en: `No index for ${mois(mDep, l)} in the series (from January 1994).` });
    else if (nouv === undefined) erreur = tr(l, { fr: `L'indice santé de ${mois(mNew, l)} n'est pas encore publié par Statbel (dernier connu : ${mois(last.p, l)}).`, nl: `Statbel heeft de gezondheidsindex van ${mois(mNew, l)} nog niet gepubliceerd (laatste: ${mois(last.p, l)}).`, en: `Statbel has not yet published the health index for ${mois(mNew, l)} (latest: ${mois(last.p, l)}).` });
    else if (v.an * 100 + v.em <= v.ey * 100 + v.em) erreur = tr(l, { fr: "L'indexation ne peut avoir lieu qu'à partir du premier anniversaire de l'entrée en vigueur.", nl: 'Indexeren kan pas vanaf de eerste verjaardag van de inwerkingtreding.', en: 'Indexation can only start from the first anniversary of the start date.' });
    else if (reg === 'bruxelles' && label === 'sans') {
      r = { nouveauLoyer: v.loyer, hausse: 0, taux: 0, bloque: true, plafond: 'be-bxl-sans-peb', indiceAncien: dep, indiceNouveau: nouv };
    } else if (reg === 'bruxelles') {
      const [y1, y2] = anniversairesCorrectionBxl(entree);
      const m1 = moisPrecedent(`${ym(y1, v.em)}-01`), m2 = moisPrecedent(`${ym(y2, v.em)}-01`);
      r = indexerBruxelles({ loyerBase: v.loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label as 'A', entreeVigueur: entree, indicesCorrection: [indiceSante(m1)!, indiceSante(m2)!] });
    } else if (reg === 'wallonie') {
      const a = anniversaire2223(entree);
      const ma = moisPrecedent(a), mb = moisPrecedent(`${Number(a.slice(0, 4)) - 1}${a.slice(4)}`);
      r = indexerWallonie({ loyerBase: v.loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label, entreeVigueur: entree, indiceAnniv2223: indiceSante(ma), indiceAnnivPrecedent: indiceSante(mb) }, regles.be.wallonie.limitation_2022_2023.part_indexation);
    } else {
      r = indexerFlandre({ loyerBase: v.loyer, indiceDepart: dep, nouvelIndice: nouv, moisAnniversaire: MONTHS[v.em - 1], epc: label === 'G' ? 'F' : label, entreeVigueur: entree, facteurs: regles.be.flandre.correctiefactor.par_mois_anniversaire });
    }
  } catch { erreur = tr(l, { fr: 'Calcul impossible avec ces dates.', nl: 'Berekening onmogelijk met deze data.', en: 'These dates cannot be computed.' }); }
  const plein = dep && nouv ? indexerBe(v.loyer, dep, nouv) : 0;
  const rl = { bruxelles: tr(l, { fr: 'Bruxelles-Capitale', nl: 'Brussels Hoofdstedelijk Gewest', en: 'Brussels-Capital' }), wallonie: tr(l, { fr: 'Wallonie', nl: 'Wallonië', en: 'Wallonia' }), flandre: tr(l, { fr: 'Flandre', nl: 'Vlaanderen', en: 'Flanders' }) };
  const years = yearRange(1994, lastY);
  const monthOpts = MONTHS.map((m, i) => ({ value: String(i + 1), label: monthLabel(m, l) }));
  const yearOpts = years.map((y) => ({ value: String(y), label: String(y) }));
  const cert = vl ? 'EPC' : 'PEB';
  const form = (
    <>
      <Row2>
        <SelectField id="be-reg" label={tr(l, { fr: 'Région du logement', nl: 'Gewest van de woning', en: 'Region of the home' })} value={String(v.reg)} onChange={(x) => set('reg')(Number(x))} options={REGIONS.map((x, i) => ({ value: String(i), label: rl[x] }))} />
        <NumberField id="be-loyer" label={tr(l, { fr: 'Loyer de base (au bail)', nl: 'Basishuurprijs (in het contract)', en: 'Base rent (in the lease)' })} value={v.loyer} onChange={set('loyer')} unit="€" max={20000} decimals={2} lang={l} />
      </Row2>
      {!vl && (
        <Row2>
          <SelectField id="be-sm" label={tr(l, { fr: 'Mois de signature', nl: 'Maand van ondertekening', en: 'Month signed' })} value={String(v.sm)} onChange={(x) => set('sm')(Number(x))} options={monthOpts} />
          <SelectField id="be-sy" label={tr(l, { fr: 'Année de signature', nl: 'Jaar van ondertekening', en: 'Year signed' })} value={String(v.sy)} onChange={(x) => set('sy')(Number(x))} options={yearOpts} />
        </Row2>
      )}
      <Row2>
        <SelectField id="be-em" label={tr(l, { fr: "Mois d'entrée en vigueur", nl: 'Maand van inwerkingtreding', en: 'Month the lease started' })} value={String(v.em)} onChange={(x) => set('em')(Number(x))} options={monthOpts} />
        <SelectField id="be-ey" label={tr(l, { fr: "Année d'entrée en vigueur", nl: 'Jaar van inwerkingtreding', en: 'Year the lease started' })} value={String(v.ey)} onChange={(x) => set('ey')(Number(x))} options={yearOpts} />
      </Row2>
      {bx && v.em === 10 && (
        <SelectField id="be-ej" label={tr(l, { fr: "Jour d'entrée en vigueur en octobre", nl: 'Dag van inwerkingtreding in oktober', en: 'Day the lease started in October' })} value={String(v.ej)} onChange={(x) => set('ej')(Number(x))} options={[{ value: '0', label: tr(l, { fr: 'du 1er au 13', nl: 'van 1 tot 13', en: '1st to 13th' }) }, { value: '1', label: tr(l, { fr: 'du 14 au 31', nl: 'van 14 tot 31', en: '14th to 31st' }) }]} />
      )}
      {vl && (
        <SelectField id="be-dm" label={tr(l, { fr: "Date de la demande écrite d'indexation", nl: 'Schriftelijke vraag van de verhuurder', en: 'Landlord’s written request' })} value={String(v.dm)} onChange={(x) => set('dm')(Number(x))} options={Array.from({ length: 12 }, (_, i) => ({ value: String(i), label: i === 0 ? tr(l, { fr: "à l'anniversaire", nl: 'op de verjaardag', en: 'on the anniversary' }) : tr(l, { fr: `${i} mois après l'anniversaire`, nl: `${i} maand${i > 1 ? 'en' : ''} na de verjaardag`, en: `${i} month${i > 1 ? 's' : ''} after the anniversary` }) }))} />
      )}
      <Row2>
        <SelectField id="be-an" label={tr(l, { fr: "Année de l'indexation", nl: 'Jaar van de indexatie', en: 'Year of the indexation' })} value={String(v.an)} onChange={(x) => set('an')(Number(x))} options={yearRange(1995, lastY + 1).map((y) => ({ value: String(y), label: String(y) }))} />
        <SelectField id="be-peb" label={tr(l, { fr: `Certificat ${cert}`, nl: `${cert}-label`, en: `${cert} certificate` })} value={String(v.peb)} onChange={(x) => set('peb')(Number(x))} options={LABELS.map((x, i) => ({ value: String(i), label: x === 'sans' ? tr(l, { fr: 'Aucun ou périmé', nl: 'Geen of vervallen', en: 'None or expired' }) : vl && x === 'G' ? 'F / G' : x }))} />
      </Row2>
    </>
  );
  const result = r ? (
    <ResultPanel lang={l} head={tr(l, { fr: `Loyer indexé (${rl[reg]})`, nl: `Geïndexeerde huur (${rl[reg]})`, en: `Indexed rent (${rl[reg]})` })} value={eur(r.nouveauLoyer, l)}
      sub={`${tr(l, { fr: 'à partir de', nl: 'vanaf', en: 'from' })} ${mois(mDemande.slice(0, 7), l)} · ${r.taux >= 0 ? '+' : ''}${pc(r.taux, l)} ${tr(l, { fr: 'sur le loyer de base', nl: 'op de basishuur', en: 'on the base rent' })}`}
      warn={r.plafond ? tr(l, {
        fr: r.plafond === 'be-bxl-sans-peb' ? "À Bruxelles, le loyer ne peut pas être indexé tant que le bailleur n'a pas communiqué un certificat PEB valide." : r.plafond === 'be-bxl-facteur-correction' ? `Facteur de correction bruxellois appliqué (PEB ${label}) : sans lui, le loyer serait de ${eur(plein, l)}.` : r.plafond === 'be-wal-loyer-adapte' ? `Règle wallonne du loyer adapté 2022-2023 (PEB ${label}) : sans elle, le loyer serait de ${eur(plein, l)}.` : `Correctiefactor flamand appliqué (EPC ${label}) : sans lui, le loyer serait de ${eur(plein, l)}.`,
        nl: r.plafond === 'be-bxl-sans-peb' ? 'In Brussel kan de huur niet geïndexeerd worden zolang de verhuurder geen geldig EPB-certificaat heeft bezorgd.' : r.plafond === 'be-vl-correctiefactor' ? `Vlaamse correctiefactor toegepast (EPC ${label}): zonder correctie zou de huur ${eur(plein, l)} bedragen.` : r.plafond === 'be-bxl-facteur-correction' ? `Brusselse correctiefactor toegepast (EPB ${label}): zonder correctie ${eur(plein, l)}.` : `Waalse regel van de aangepaste huur 2022-2023 (EPB ${label}): zonder die regel ${eur(plein, l)}.`,
        en: r.plafond === 'be-bxl-sans-peb' ? 'In Brussels the rent cannot be indexed until the landlord has provided a valid EPB certificate.' : `Regional energy-label correction applied (${cert} ${label}): without it the rent would be ${eur(plein, l)}.`,
      }) : undefined}
      fraction={{ base: eur(v.loyer, l), top: `${nr(nouv!, l)} (${mois(mNew, l)})`, bottom: `${nr(dep!, l)} (${mois(mDep, l)})` }}
      rows={[
        { label: tr(l, { fr: 'Indice de départ', nl: 'Aanvangsindexcijfer', en: 'Starting index' }), value: `${nr(dep!, l)} · ${mois(mDep, l)}` },
        { label: tr(l, { fr: 'Nouvel indice', nl: 'Nieuw indexcijfer', en: 'New index' }), value: `${nr(nouv!, l)} · ${mois(mNew, l)}` },
        { label: tr(l, { fr: 'Loyer pleinement indexé', nl: 'Volledig geïndexeerde huur', en: 'Fully indexed rent' }), value: eur(plein, l) },
        { label: tr(l, { fr: 'Loyer exigible', nl: 'Eisbare huurprijs', en: 'Rent that can be charged' }), value: eur(r.nouveauLoyer, l), strong: true },
      ]}
      hyp={tr(l, {
        fr: "Indice santé de Statbel, base 2013. L'indexation doit être demandée par écrit ; elle peut remonter au plus trois mois avant la demande, et en Flandre une demande tardive prend l'indice du moment de la demande. À Bruxelles, le bail doit être enregistré et le certificat PEB communiqué ; en Wallonie, le bail de résidence principale doit être enregistré.",
        nl: 'Gezondheidsindex van Statbel, basis 2013. De verhuurder moet de indexatie schriftelijk vragen; bij een late vraag geldt in Vlaanderen het indexcijfer van dat moment, met hoogstens drie maanden terugwerkende kracht.',
        en: 'Statbel health index, base 2013. Indexation must be requested in writing and can go back three months at most; in Flanders a late request uses the index at the time of the request.',
      })}
      methodHref={methodHref} copyText={`${eur(v.loyer, l)} → ${eur(r.nouveauLoyer, l)} (${rl[reg]}, ${mois(mNew, l)})`} />
  ) : <ResultPanel lang={l} head={tr(l, { fr: 'Indexation', nl: 'Indexatie', en: 'Indexation' })} value="—" rows={[]} copyText="" warn={erreur} />;
  return <Frame form={form} result={result} />;
}
