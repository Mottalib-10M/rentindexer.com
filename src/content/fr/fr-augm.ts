import type { PageText, Helpers } from '../../lib/types';

/** Augmentation de loyer en 2026 : ce que le bailleur peut demander (« augmentation loyer 2026 », « calcul augmentation loyer »). */
const serie = (h: Helpers) => Object.fromEntries(h.D.serieFr('irl').map((o) => [o.p, o.v])) as Record<string, number>;

const t: PageText = {
  slug: 'augmentation-loyer',
  nav: 'Augmentation de loyer en 2026',
  card: 'Ce que le bailleur peut réclamer en 2026 : plafond de l’IRL, délai d’un an, pas d’effet rétroactif, gel des logements F et G, lettre au locataire.',
  title: 'Augmentation de loyer 2026 : plafond IRL, délai et lettre',
  description: 'Augmentation de loyer 2026 : la hausse maximale permise par l’IRL, le délai d’un an pour la demander, sans effet rétroactif, le gel F et G, la lettre à envoyer.',
  h1: 'Augmentation de loyer en 2026 : ce que le bailleur peut demander',
  intro: 'Indiquez le mois de révision prévu en 2026 et la classe énergie : l’outil dit si la hausse est permise et de combien.',
  resume: (h) => {
    const d = h.D.dernierFr('irl');
    const ex = h.E.reviserFr({ loyer: 700, trimestre: d.p, irl: serie(h), zone: 'metropole', dateBail: '2020-01-01' });
    return `En cours de bail, un loyer d’habitation ne peut augmenter qu’une fois par an, à la date prévue par le contrat, et seulement si le bail contient une clause de révision. La hausse ne peut pas dépasser la variation de l’indice de référence des loyers sur un an : avec l’IRL du ${h.trim(d.p)} (${h.num(d.v)}, ${h.pc(d.var!)}), un loyer de 700 € hors charges passe au plus à ${h.eur(ex.nouveauLoyer)}, soit ${h.eur(ex.hausse)} par mois. Le bailleur doit la demander : elle ne joue pas toute seule. Il dispose d’un an à compter de la date de révision et la hausse ne vaut que pour l’avenir, à partir de sa demande ; une année oubliée ne se rattrape pas. Aucune hausse n’est possible pour un logement classé F ou G au diagnostic de performance énergétique si le bail a été signé, renouvelé ou tacitement reconduit depuis le 24 août 2022 en métropole, ou depuis le 1er juillet 2024 en Guadeloupe, en Guyane, à la Martinique, à La Réunion et à Mayotte.`;
  },
  faqs: (h) => [
    { q: 'Le bailleur peut-il réclamer les hausses des années où il n’a rien demandé ?', a: 'Non. Chaque révision annuelle doit être demandée dans l’année qui suit sa date ; au-delà, elle est perdue pour de bon. En revanche, lors d’une révision demandée à temps, le calcul se fait toujours avec le trimestre du bail de l’année en cours rapporté au même trimestre de l’année précédente, sur le loyer effectivement payé : l’indexation oubliée ne s’ajoute pas.' },
    { q: 'Mon logement est classé F : le bailleur peut-il quand même augmenter le loyer en 2026 ?', a: 'Pas si le bail a été signé, renouvelé ou reconduit tacitement depuis le 24 août 2022 en métropole : la révision est alors interdite. Le texte vise trois événements, la signature, le renouvellement et la reconduction tacite : un bail plus ancien qui n’a connu aucun des trois depuis cette date n’est pas touché par le gel. Le calculateur pose la question dès que vous choisissez F ou G.' },
    { q: 'Le bailleur doit-il envoyer sa demande en recommandé ?', a: 'La fiche officielle n’exige pas de forme particulière, mais elle insiste sur la date de la demande : c’est à partir d’elle que le nouveau loyer est dû. Un courrier recommandé avec avis de réception, ou un écrit remis contre signature, permet de prouver cette date en cas de désaccord.' },
    { q: 'Le complément de loyer augmente-t-il en même temps que le loyer de base ?', a: 'Oui. Dans les villes où les loyers sont encadrés, un complément peut s’ajouter au loyer de base pour un logement aux caractéristiques particulières. Selon la fiche F13723, le montant à réviser est alors la somme des deux : on applique le rapport des IRL au total, pas au seul loyer de base. Saisissez donc ce total dans le champ du loyer hors charges du calculateur.' },
  ],
  body: (h) => {
    const d = h.D.dernierFr('irl');
    const s = serie(h);
    const r = h.E.reviserFr({ loyer: 920, trimestre: d.p, irl: s, zone: 'metropole', dateBail: '2020-01-01' });
    const rows: string[][] = [
      ['Le bail ne contient aucune clause de révision', 'Aucune hausse en cours de bail'],
      ['Logement F ou G, bail signé, renouvelé ou reconduit depuis le 24 août 2022 (métropole)', 'Révision interdite'],
      ['Même cas outre-mer, depuis le 1er juillet 2024', 'Révision interdite'],
      ['Bail mobilité', 'Révision interdite pendant le bail'],
      ['Clause présente, demande faite dans l’année qui suit la date de révision', 'Hausse plafonnée par l’IRL, due à partir de la demande'],
      ['Clause présente, plus d’un an après la date de révision', 'Révision de l’année perdue'],
      ['Logement social (HLM)', 'Révision au 1er janvier, IRL du 2e trimestre de l’année précédente'],
    ];
    return `<h2>Le parcours d’une hausse en 2026</h2>
${h.table(['Situation', 'Ce que dit le texte'], rows, 'D’après la fiche F13723 de service-public.fr (vérifiée le 15 octobre 2026) et la loi du 6 juillet 1989, articles 7-1, 17-1 et 25-16.')}
<p>Le meublé suit les mêmes règles que le logement vide ; s’il est loué avec des charges au forfait, ce forfait peut lui aussi être révisé chaque année de la même façon. Un logement relevant de la loi de 1948 a son propre régime.</p>
<h2>Un exemple de demande tardive</h2>
<p>Un bail prévoit une révision le 13 mars 2026. Le bailleur peut la demander jusqu’au 12 mars 2027. S’il ne le fait que le 13 juin 2026, le nouveau loyer n’est dû qu’à partir de cette date : les loyers de mars à mai restent à l’ancien montant. C’est l’exemple que donne ${h.src('spIrl', 'service-public.fr')}, qui renvoie à l’article 7-1 de ${h.src('loi1989', 'la loi du 6 juillet 1989')}.</p>
<h2>Ce que contient la lettre au locataire</h2>
<p>La demande tient en quelques lignes, mais elle doit permettre au locataire de vérifier le calcul. Elle cite la clause du bail, le trimestre de référence et les deux valeurs d’IRL, le loyer actuel hors charges, le nouveau loyer et la date à partir de laquelle il est dû. Avec l’IRL du ${h.trim(d.p)} et 920 € de loyer : 920 × ${h.num(r.indiceNouveau!)} / ${h.num(r.indiceAncien!)} = ${h.eur(r.nouveauLoyer)}. Le résultat du calculateur se copie d’un clic pour être collé dans le courrier.</p>
<p>Si vous êtes locataire et que la hausse demandée dépasse ce calcul, vous pouvez répondre par écrit avec le détail ; l’Adil de votre département renseigne les deux parties, et un désaccord persistant relève du juge. Pour le choix du trimestre selon le mois, voir ${h.a('fr-irl-2026', 'l’IRL 2026 mois par mois')} ; pour une pension alimentaire, l’indice est différent : voir ${h.a('fr-pension', 'l’indexation de la pension alimentaire')}.</p>`;
  },
};
export default t;
