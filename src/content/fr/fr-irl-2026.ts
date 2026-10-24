import type { PageText, Helpers } from '../../lib/types';

/** IRL 2026 : quel trimestre retenir selon le mois de révision (« irl 2026 », « indice irl 2026 »). */
const MOIS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const serie = (h: Helpers) => Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v])) as Record<string, number>;
/** Dernier IRL paru au Journal officiel le 1er du mois de révision en 2026. */
const parMois = (h: Helpers) => MOIS.map((m) => ({ m, o: h.D.trimestreParuLe('irl', `2026-${m}-01`)! }));

const t: PageText = {
  slug: 'irl-trimestres',
  nav: 'IRL 2026 par mois de révision',
  card: 'Le trimestre d’IRL à retenir pour une révision en 2026, mois par mois, et la hausse maximale qui en découle.',
  title: 'IRL 2026 : quel trimestre pour votre mois de révision',
  description: 'IRL 2026 trimestre par trimestre : l’indice à retenir selon le mois de révision du bail, les valeurs de l’année et la hausse maximale pour 1 000 € de loyer.',
  h1: 'IRL 2026 : le bon trimestre selon le mois de révision du bail',
  intro: 'Choisissez le mois où tombe la révision en 2026 : l’outil retient le dernier IRL paru à cette date et le compare au même trimestre de 2025.',
  resume: (h) => {
    const q1 = h.D.valeurFr('irl', '2026-Q1')!, q2 = h.D.valeurFr('irl', '2026-Q2')!, q3 = h.D.dernierFr('irl');
    const v = (q: string) => h.D.serieFr('irl').find((o) => o.p === q)!.var!;
    return `En 2026, trois indices de référence des loyers sont déjà parus et le quatrième ne le sera qu’en janvier 2027. L’IRL du ${h.trim('2026-Q1')} vaut ${h.num(q1)} (${h.pc(v('2026-Q1'))} sur un an), celui du ${h.trim('2026-Q2')} ${h.num(q2)} (${h.pc(v('2026-Q2'))}) et celui du ${h.trim('2026-Q3')} ${h.num(q3.v)} (${h.pc(q3.var!)}), paru au Journal officiel le ${h.date(q3.jo!)}. L’IRL du 4e trimestre 2026 est à paraître, en principe vers le 15 janvier 2027. Le trimestre qui s’applique à votre révision n’est pas celui du mois en cours : c’est celui que désigne le bail, ou à défaut le dernier indice publié le jour de la signature. Comme l’Insee publie chaque trimestre à peu près à la même date d’une année sur l’autre, un bail muet se révise en pratique avec le dernier IRL paru à sa date anniversaire. Une révision au 1er novembre ou au 1er décembre 2026 prend donc le ${h.trim('2026-Q3')}, une révision d’août à octobre le ${h.trim('2026-Q2')}, et ainsi de suite.`;
  },
  faqs: (h) => {
    const q3 = h.D.dernierFr('irl');
    return [
      { q: 'Mon bail dit « IRL du 2e trimestre » mais ma révision est en novembre : lequel prendre ?', a: `Celui que le bail désigne, sans hésiter. La clause l’emporte sur le calendrier : une révision au 1er novembre 2026 avec un bail qui cite le 2e trimestre se calcule avec ${h.num(h.D.valeurFr('irl', '2026-Q2')!)} rapporté à ${h.num(h.D.valeurFr('irl', '2025-Q2')!)}, même si l’IRL du ${h.trim(q3.p)} est sorti entre-temps. Le dernier indice paru ne sert que lorsque le bail ne fixe aucun trimestre.` },
      { q: 'Ma révision tombe le 14 juillet : l’IRL du 2e trimestre est-il déjà paru ?', a: `Oui en 2026 : l’IRL du ${h.trim('2026-Q2')} a été publié au Journal officiel le ${h.date(h.D.serieFr('irl').find((o) => o.p === '2026-Q2')!.jo!)}. Les dates bougent d’un ou deux jours selon les années ; pour un bail muet signé autour du 10 au 17 juillet, il faut vérifier quel indice était paru le jour exact de la signature, car c’est lui qui fixe le trimestre pour toute la durée du bail.` },
      { q: 'Peut-on attendre l’IRL du 4e trimestre 2026 pour une révision en décembre ?', a: 'Non. La révision de décembre 2026 se fait avec le trimestre du bail, qui est connu ; l’IRL du 4e trimestre 2026 ne paraîtra qu’en janvier 2027 et ne concerne que les baux qui le désignent, révisés à partir de cette date. Attendre un indice qui n’est pas encore publié ne change pas le trimestre applicable.' },
    ];
  },
  body: (h) => {
    const s = serie(h);
    const rows = parMois(h).map(({ m, o }) => {
      const r = h.E.reviserFr({ loyer: 1000, trimestre: o.p, irl: s, zone: 'metropole', dateBail: '2020-01-01' });
      return [h.mois(`2026-${m}`), h.trim(o.p), h.num(o.v), h.eur(r.nouveauLoyer)];
    });
    const quatre = ['2026-Q1', '2026-Q2', '2026-Q3', '2026-Q4'].map((q) => {
      const o = h.D.serieFr('irl').find((x) => x.p === q);
      return o ? [h.trim(q), h.num(o.v), h.pc(o.var!), h.date(o.jo!)] : [h.trim(q), 'à paraître', 'à paraître', 'vers le 15 janvier 2027'];
    });
    return `<h2>Les quatre IRL de 2026</h2>
${h.table(['Trimestre', 'IRL métropole', 'Sur un an', 'Journal officiel'], quatre, 'Source : Insee, série 001515333, relue le 24 octobre 2026.', ['l', 'r', 'r', 'l'])}
<p>Le ${h.trim('2026-Q3')} est inférieur au ${h.trim('2026-Q2')} en niveau, mais c’est la comparaison avec le même trimestre de 2025 qui compte : sa variation annuelle est la plus forte de l’année. Les séries de la Corse et de l’outre-mer ont d’autres niveaux, avec la même variation ; elles sont détaillées sur la page ${h.a('fr-irl', 'IRL : valeurs et calcul')}.</p>
<h2>Révision au 1er de chaque mois de 2026 : l’indice paru ce jour-là</h2>
${h.table(['Révision le 1er', 'Dernier IRL paru', 'Valeur', 'Loyer de 1 000 € révisé'], rows, 'Bail sans trimestre désigné, logement en métropole, hors gel F/G. Calcul du moteur du site.', ['l', 'l', 'r', 'r'])}
<p>Ce tableau suppose un bail qui ne cite pas de trimestre et une révision à la date anniversaire. Pour un autre loyer, la hausse est proportionnelle ; le calculateur en haut de page fait le calcul exact avec le mois choisi.</p>
<h2>Les cas où le mois ne suffit pas</h2>
<p>Trois situations demandent de revenir au bail. D’abord la clause qui désigne un trimestre précis : elle reste valable toute la durée du contrat. Ensuite une signature à quelques jours d’une publication, autour du 15 janvier, avril, juillet ou octobre, où le dernier indice paru à la signature peut différer de celui paru à l’anniversaire. Enfin le logement social, révisé au 1er janvier avec l’IRL du 2e trimestre de l’année précédente : au 1er janvier 2027, ce sera le ${h.trim('2026-Q2')}, comme l’indique ${h.src('spIrl', 'la fiche F13723 de service-public.fr')}.</p>
<p>Le calendrier ne dit pas non plus si la hausse est encore exigible : le bailleur dispose d’un an après la date de révision, sans rétroactivité. Ces règles, et la lettre à envoyer, sont sur la page ${h.a('fr-augm', 'augmentation de loyer en 2026')}. Les baux révisés en fin d’année avec le dernier indice publié sont traités sur ${h.a('fr-irl-t3', 'la page de l’IRL du 3e trimestre 2026')}.</p>`;
  },
};
export default t;
