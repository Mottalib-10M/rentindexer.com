import type { PageText, Helpers } from '../../lib/types';

/** Indexation du loyer en Belgique, page outil en français (« indexation loyer », « calcul indexation loyer »). */
type Reg = 'bruxelles' | 'wallonie' | 'flandre';
/** Même enchaînement que le calculateur BeCalc : indice de départ, nouvel indice, correction régionale. */
function calc(h: Helpers, reg: Reg, loyer: number, sign: string, entree: string, an: number, label: string) {
  const ed = `${entree}-01`, em = entree.slice(5);
  const mDep = h.E.moisPrecedent(reg === 'flandre' ? ed : `${sign}-01`), mNew = h.E.moisPrecedent(`${an}-${em}-01`);
  const dep = h.D.indiceSante(mDep)!, nouv = h.D.indiceSante(mNew)!;
  const s = (m: string) => h.D.indiceSante(m)!;
  let r;
  if (reg === 'bruxelles') {
    if (label === 'sans') return { r: null, dep, nouv, mDep, mNew };
    const [y1, y2] = h.E.anniversairesCorrectionBxl(ed);
    r = h.E.indexerBruxelles({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label as 'A', entreeVigueur: ed, indicesCorrection: [s(h.E.moisPrecedent(`${y1}-${em}-01`)), s(h.E.moisPrecedent(`${y2}-${em}-01`))] });
  } else if (reg === 'wallonie') {
    const a = h.E.anniversaire2223(ed);
    r = h.E.indexerWallonie({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, peb: label as 'A', entreeVigueur: ed, indiceAnniv2223: s(h.E.moisPrecedent(a)), indiceAnnivPrecedent: s(h.E.moisPrecedent(`${Number(a.slice(0, 4)) - 1}${a.slice(4)}`)) }, h.D.regles.be.wallonie.limitation_2022_2023.part_indexation);
  } else {
    r = h.E.indexerFlandre({ loyerBase: loyer, indiceDepart: dep, nouvelIndice: nouv, moisAnniversaire: em, epc: (label === 'G' ? 'F' : label) as 'A', entreeVigueur: ed, facteurs: h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire });
  }
  return { r, dep, nouv, mDep, mNew };
}

const t: PageText = {
  slug: 'indexation-loyer-belgique',
  nav: 'Indexation du loyer en Belgique',
  card: 'Le calcul de l’indexation d’un loyer d’habitation à Bruxelles, en Wallonie et en Flandre, avec l’indice santé et les corrections propres à chaque Région.',
  title: 'Indexation loyer en Belgique : calcul par Région en 2026',
  description: 'Indexation du loyer en Belgique : formule de l’indice santé, écarts entre Bruxelles, la Wallonie et la Flandre, correction selon PEB ou EPC, exemple chiffré.',
  h1: 'Indexation du loyer en Belgique : le calcul Région par Région',
  intro: 'Choisissez la Région, le loyer de base et les dates du bail : l’outil prend les bons indices santé et applique la correction énergétique éventuelle.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const nx = ((y: number, m: number) => (m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`))(Number(d.p.slice(0, 4)), Number(d.p.slice(5)));
    const ex = calc(h, 'bruxelles', 850, '2021-05', '2021-06', 2026, 'C');
    return `En Belgique, le loyer d’un bail d’habitation s’indexe au plus une fois par an, à partir de l’anniversaire de son entrée en vigueur, avec une formule commune aux trois Régions : loyer de base × nouvel indice santé / indice de départ. Le loyer de base est celui du contrat, hors charges ; le nouvel indice est celui du mois qui précède l’anniversaire. L’indice de départ diffère : à Bruxelles et en Wallonie, c’est l’indice du mois qui précède la signature du bail ; en Flandre, celui du mois qui précède son entrée en vigueur. Le dernier indice santé publié par Statbel est celui de ${h.mois(d.p)} : ${h.num(d.v)} en base 2013 ; celui de ${h.mois(nx)} est à paraître à la fin de ce mois. Un bail de 850 € signé en mai 2021 et entré en vigueur en juin 2021 passe ainsi, à Bruxelles et pour un PEB C, à ${h.eur(ex.r!.nouveauLoyer)} en juin 2026. L’indexation n’est jamais automatique : le bailleur doit la demander par écrit et ne peut remonter que trois mois en arrière. Pour les logements peu performants loués avant l’automne 2022, chaque Région applique en plus une correction.`;
  },
  faqs: (h) => [
    { q: 'Le même bail donne-t-il le même loyer indexé à Bruxelles, en Wallonie et en Flandre ?', a: 'Pas forcément. Pour un logement bien classé, l’écart vient seulement de l’indice de départ, qui est celui du mois avant la signature à Bruxelles et en Wallonie, et celui du mois avant l’entrée en vigueur en Flandre ; il est nul si les deux dates tombent le même mois. Pour un logement peu performant loué avant octobre ou novembre 2022, les règles de correction diffèrent nettement, comme le montre le tableau de la page.' },
    { q: 'Le propriétaire peut-il indexer le loyer en cours d’année, à une autre date que l’anniversaire ?', a: 'Non. Les trois Régions fixent le même point de départ : l’indexation est possible une fois par an, au plus tôt à la date anniversaire de l’entrée en vigueur du bail. Une demande envoyée avant cette date ne prend effet qu’à l’anniversaire. Une demande envoyée plus tard reste possible, mais les arriérés sont limités aux trois mois qui précèdent celui de la demande.' },
    { q: 'Le bail peut-il interdire l’indexation du loyer ?', a: 'Oui. Une clause du bail peut exclure expressément toute indexation pendant la durée de la location ; c’est rappelé par les pages officielles de la Wallonie, de Bruxelles et de la Flandre. Dans ce cas, le loyer reste celui du contrat et le calculateur n’a pas lieu d’être utilisé. Hors de cette exclusion, l’indexation est possible chaque année aux conditions de la Région.' },
  ],
  body: (h) => {
    const labels = ['C', 'D', 'E', 'F', 'sans'];
    const rows = labels.map((l) => {
      const cell = (reg: Reg) => { const x = calc(h, reg, 850, '2021-05', '2021-06', 2026, l); return x.r ? h.eur(x.r.nouveauLoyer) : 'pas d’indexation'; };
      return [l === 'sans' ? 'Aucun certificat' : l, cell('bruxelles'), cell('wallonie'), cell('flandre')];
    });
    const b = calc(h, 'bruxelles', 850, '2021-05', '2021-06', 2026, 'C'), f = calc(h, 'flandre', 850, '2021-05', '2021-06', 2026, 'C');
    return `<h2>Un même bail dans les trois Régions</h2>
${h.table(['Certificat PEB / EPC', 'Bruxelles', 'Wallonie', 'Flandre'], rows, `Loyer de base 850 €, bail signé en mai 2021, entré en vigueur en juin 2021, indexation de juin 2026 (indice de ${h.mois(b.mNew)} : ${h.num(b.nouv)}). Calcul du moteur du site.`, ['l', 'r', 'r', 'r'])}
<p>Avec un certificat C, Bruxelles et la Wallonie partent de l’indice d’${h.mois(b.mDep)} (${h.num(b.dep)}), la Flandre de celui de ${h.mois(f.mDep)} (${h.num(f.dep)}) : quelques euros d’écart. À partir du label D, les règles s’écartent : Bruxelles ne corrige qu’à partir de E, la Wallonie applique sa limitation de 2022-2023 dès D, la Flandre son correctiefactor pour D, E, F et l’absence de certificat. Sans certificat, Bruxelles bloque toute indexation.</p>
<h2>Les règles propres à chaque Région</h2>
<ul>
<li><strong>Bruxelles-Capitale</strong> : bail enregistré et certificat PEB valide communiqué au locataire ; facteur de correction pour un PEB E, F ou G si le bail est entré en vigueur avant le 14 octobre 2022 (${h.src('bxlCorrection', 'be.brussels')}). Détail sur ${h.a('be-bxl', 'l’indexation à Bruxelles')}.</li>
<li><strong>Wallonie</strong> : bail de résidence principale enregistré ; indexation limitée selon le PEB pour les anniversaires du 1er novembre 2022 au 31 octobre 2023, avec un loyer adapté qui sert ensuite de base (${h.src('walIndexer', 'wallonie.be')}). Détail sur ${h.a('be-wal', 'l’indexation en Wallonie')}.</li>
<li><strong>Flandre</strong> : correctiefactor pour un EPC D, E, F ou sans EPC si le bail est entré en vigueur avant le 1er octobre 2022 (${h.src('vlCorrectie', 'vlaanderen.be')}). Détail sur ${h.a('be-vl', 'l’indexation en Flandre')}.</li>
</ul>
<h2>Ce que l’outil ne fait pas</h2>
<p>Il ne traite pas le saut d’index wallon de 2016, ni le calcul au prorata d’un mois où un nouveau certificat a été obtenu, ni les baux sociaux exclus des corrections. Il raisonne au mois : pour un anniversaire en octobre à Bruxelles, vérifiez dans le tableau officiel si la date tombe avant ou après le 14. Les valeurs de l’indice sont sur ${h.a('be-sante', 'la page de l’indice santé')} et ${h.src('statbelSante', 'chez Statbel')}.</p>`;
  },
};
export default t;
