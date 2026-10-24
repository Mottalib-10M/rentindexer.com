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
      <div role="group" aria-label="Country of the rented property" className="not-prose mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {PAYS.map((x, i) => (
          <button key={x.k} type="button" aria-pressed={v.pays === i} onClick={() => set('pays')(i)}
            className={`w-full rounded-lg border px-3 py-2 text-center text-sm font-medium ${v.pays === i ? 'border-accent-600 bg-accent-600 text-white' : 'border-navy-300 bg-white text-navy-800 hover:bg-navy-50'}`}>{x.label}</button>
        ))}
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
