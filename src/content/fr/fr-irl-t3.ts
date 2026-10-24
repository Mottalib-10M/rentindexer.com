import type { PageText, Helpers } from '../../lib/types';

/** IRL du 3e trimestre 2026 : la valeur et les baux qu’elle révise (« irl 3ème trimestre 2026 »). */
const Q = '2026-Q3', QA = '2025-Q3';
const obs = (h: Helpers, s: 'irl' | 'irl_corse' | 'irl_dom', q: string) => h.D.serieFr(s).find((o) => o.p === q);
const serie = (h: Helpers, s: 'irl' | 'irl_corse' | 'irl_dom') => Object.fromEntries(h.D.serieFr(s).map((o) => [o.p, o.v])) as Record<string, number>;

const t: PageText = {
  slug: 'irl-troisieme-trimestre',
  nav: 'IRL du 3e trimestre 2026',
  card: 'L’IRL du 3e trimestre 2026 en métropole, en Corse et outre-mer, et les baux qu’il permet de réviser jusqu’en janvier 2027.',
  title: 'IRL 3e trimestre 2026 : 148,06 et les baux concernés',
  description: 'IRL du 3e trimestre 2026 : 148,06 en métropole, +1,57 % sur un an, paru au Journal officiel le 16 octobre 2026. Les baux qu’il révise et la hausse du loyer.',
  h1: 'IRL du 3e trimestre 2026 : ce qu’il change pour les baux concernés',
  intro: 'Le trimestre est déjà réglé sur le 3e trimestre 2026 : entrez le loyer hors charges pour voir la hausse permise.',
  resume: (h) => {
    const m = obs(h, 'irl', Q)!, a = obs(h, 'irl', QA)!, c = obs(h, 'irl_corse', Q)!, d = obs(h, 'irl_dom', Q)!;
    const ex = h.E.reviserFr({ loyer: 800, trimestre: Q, irl: serie(h, 'irl'), zone: 'metropole', dateBail: '2020-01-01' });
    return `L’indice de référence des loyers du ${h.trim(Q)} vaut ${h.num(m.v)} en métropole, contre ${h.num(a.v)} un an plus tôt, soit une hausse de ${h.pc(m.var!)}. L’Insee l’a publié le 15 octobre 2026 et l’avis est paru au Journal officiel le ${h.date(m.jo!)}. Il vaut ${h.num(c.v)} en Corse et ${h.num(d.v)} dans les départements d’outre-mer, avec la même variation annuelle. Il sert à deux familles de baux : ceux dont la clause de révision désigne le 3e trimestre, quelle que soit leur date anniversaire, et ceux qui ne désignent aucun trimestre mais ont été signés alors que le 3e trimestre était le dernier indice paru, c’est-à-dire en gros entre la mi-octobre et la mi-janvier. Pour un loyer de 800 € hors charges, la révision donne ${h.eur(ex.nouveauLoyer)}, soit ${h.eur(ex.hausse)} de plus par mois. La hausse reste interdite pour un logement classé F ou G dont le bail a été signé, renouvelé ou reconduit depuis le 24 août 2022 en métropole. L’indice suivant, celui du 4e trimestre 2026, est à paraître vers le 15 janvier 2027.`;
  },
  faqs: (h) => {
    const m = obs(h, 'irl', Q)!, q2 = obs(h, 'irl', '2026-Q2')!;
    return [
      { q: 'Pourquoi l’IRL du 3e trimestre 2026 est-il plus bas que celui du 2e alors que la hausse est plus forte ?', a: `Parce que la révision compare un trimestre au même trimestre de l’année précédente, pas au trimestre d’avant. En niveau, ${h.num(m.v)} est sous ${h.num(q2.v)}, mais l’IRL du ${h.trim(QA)} était lui-même bas, d’où une variation annuelle de ${h.pc(m.var!)}, contre ${h.pc(q2.var!)} pour le 2e trimestre. Seul le rapport entre les deux 3e trimestres compte pour votre bail.` },
      { q: 'Mon bail a pris effet le 1er novembre 2025 sans citer de trimestre : quel calcul en novembre 2026 ?', a: `Au 1er novembre 2025, le dernier IRL paru était celui du ${h.trim(QA)}, publié au Journal officiel le ${h.date(obs(h, 'irl', QA)!.jo!)}. C’est donc le trimestre de votre bail. En novembre 2026, le loyer se révise avec ${h.num(m.v)} rapporté à ${h.num(obs(h, 'irl', QA)!.v)}, à condition que le bail contienne une clause de révision et que le logement ne soit pas classé F ou G.` },
      { q: 'Jusqu’à quand le bailleur peut-il appliquer la révision du 3e trimestre 2026 ?', a: 'Pendant un an à compter de la date de révision prévue au bail. Une révision qui tombe le 1er décembre 2026 peut être demandée jusqu’au 30 novembre 2027, mais elle ne vaut que pour les loyers dus après la demande. Passé ce délai, la hausse de cette année est perdue ; le bailleur pourra seulement réviser à l’échéance suivante, avec le trimestre suivant de la même série.' },
    ];
  },
  body: (h) => {
    const zones: Array<['irl' | 'irl_corse' | 'irl_dom', string]> = [['irl', 'Métropole'], ['irl_corse', 'Corse'], ['irl_dom', 'Outre-mer']];
    const z = zones.map(([s, n]) => [n, h.num(obs(h, s, QA)!.v), h.num(obs(h, s, Q)!.v), h.pc(obs(h, s, Q)!.var!)]);
    const loyers = [450, 650, 900, 1200, 1600].map((l) => {
      const r = h.E.reviserFr({ loyer: l, trimestre: Q, irl: serie(h, 'irl'), zone: 'metropole', dateBail: '2020-01-01' });
      return [h.eur(l), h.eur(r.nouveauLoyer), `+${h.eur(r.hausse)}`, `+${h.eur(r.hausse * 12)}`];
    });
    return `<h2>Les trois séries du 3e trimestre</h2>
${h.table(['Zone', h.trim(QA), h.trim(Q), 'Variation'], z, 'Source : Insee, séries 001515333, 010760507 et 010760509 ; avis au Journal officiel du 16 octobre 2026.', ['l', 'r', 'r', 'r'])}
<p>On ne mélange pas les zones : un logement à Ajaccio se révise avec les deux valeurs corses, un logement à Saint-Denis de La Réunion avec les deux valeurs d’outre-mer. Le choix de la zone dans le calculateur change la série utilisée.</p>
<h2>Ce que donne la révision pour quelques loyers</h2>
${h.table(['Loyer hors charges', 'Après révision', 'Par mois', 'Sur douze mois'], loyers, 'Métropole, bail indexé sur le 3e trimestre, hors gel F/G. Calcul du moteur du site, arrondi au centime.', ['r', 'r', 'r', 'r'])}
<h2>Quels baux sont révisés d’octobre 2026 à janvier 2027</h2>
<p>Un bail sans trimestre désigné, révisé à sa date anniversaire entre le 16 octobre 2026 et la mi-janvier 2027, prend en principe le 3e trimestre. C’est la règle de ${h.src('spIrl', 'la fiche F13723 de service-public.fr')} : à défaut de mention dans le bail, on retient le dernier IRL publié à la signature. Pour une signature dans les jours qui entourent une publication, regardez la date exacte de parution au Journal officiel ; le détail mois par mois est sur ${h.a('fr-irl-2026', 'la page IRL 2026 par mois de révision')}.</p>
<p>Un bail qui désigne un autre trimestre ne bascule pas sur le 3e parce qu’il est le plus récent. Et un bail qui désigne le 3e trimestre l’applique même si sa révision tombe au printemps : la révision du printemps 2026 se faisait avec le ${h.trim(QA)} rapporté au ${h.trim('2024-Q3')}, celle du printemps 2027 prendra ${h.num(obs(h, 'irl', Q)!.v)} rapporté à ${h.num(obs(h, 'irl', QA)!.v)}. Les valeurs des années précédentes figurent sur ${h.src('inseeIrl', 'la série de l’Insee')}.</p>`;
  },
};
export default t;
