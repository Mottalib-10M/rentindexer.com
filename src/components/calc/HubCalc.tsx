/**
 * Page des six pays (/en/) : on choisit le pays du bail, le calculateur de ce pays s'affiche avec
 * l'indice que la loi y applique. Chaque calculateur garde ses propres règles (kit + moteur).
 */
import FrIrlCalc from './FrIrlCalc';
import BeCalc from './BeCalc';
import EsCalc from './EsCalc';
import ItCalc from './ItCalc';
import PtCalc from './PtCalc';
import AtCalc from './AtCalc';
import SelectField from '../ui/SelectField';
import { useParams, type L } from './kit';

const PAYS = [
  { k: 'fr', label: 'France · IRL' },
  { k: 'be', label: 'Belgium · health index' },
  { k: 'es', label: 'Spain · CPI / IRAV' },
  { k: 'it', label: 'Italy · Istat FOI' },
  { k: 'pt', label: 'Portugal · coefficient' },
  { k: 'at', label: 'Austria · MieWeG' },
] as const;

export default function HubCalc({ lang = 'en', methodHref }: { lang?: L; methodHref?: string }) {
  const [v, set] = useParams({ pays: 0 });
  const p = PAYS[v.pays]?.k ?? 'fr';
  return (
    <div>
      <div className="not-prose mb-4">
        <SelectField id="hub-pays" label="Country of the rented property" value={String(v.pays)} onChange={(x) => set('pays')(Number(x))} options={PAYS.map((x, i) => ({ value: String(i), label: x.label }))} />
      </div>
      {p === 'fr' && <FrIrlCalc lang={lang} methodHref={methodHref} />}
      {p === 'be' && <BeCalc lang={lang} methodHref={methodHref} />}
      {p === 'es' && <EsCalc lang={lang} methodHref={methodHref} />}
      {p === 'it' && <ItCalc lang={lang} modo="affitto" methodHref={methodHref} />}
      {p === 'pt' && <PtCalc lang={lang} methodHref={methodHref} />}
      {p === 'at' && <AtCalc lang={lang} methodHref={methodHref} />}
    </div>
  );
}
