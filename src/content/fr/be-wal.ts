import type { PageText, Helpers } from '../../lib/types';

/** Indexation du loyer en Wallonie : limitation 2022-2023 selon le PEB et loyer adapté (« indexation loyer wallonie »). */
const s = (h: Helpers, m: string) => h.D.indiceSante(m)!;
/** Bail de 800 € signé en août 2020, entré en vigueur le 1er septembre 2020 : anniversaire de 2023 dans la période limitée. */
const ex = (h: Helpers, peb: string, an = 2026) => h.E.indexerWallonie({ loyerBase: 800, indiceDepart: s(h, '2020-07'), nouvelIndice: s(h, `${an}-08`), peb: peb as 'A', entreeVigueur: '2020-09-01', indiceAnniv2223: s(h, '2023-08'), indiceAnnivPrecedent: s(h, '2022-08') }, h.D.regles.be.wallonie.limitation_2022_2023.part_indexation);

const t: PageText = {
  slug: 'indexation-loyer-wallonie',
  nav: 'Indexation du loyer en Wallonie',
  card: 'Le calcul wallon : indice santé, bail enregistré, limitation de 2022-2023 selon le PEB et loyer adapté qui sert de base depuis novembre 2023.',
  title: 'Indexation loyer Wallonie : PEB, loyer adapté et calcul',
  description: 'Indexation du loyer en Wallonie : indice santé, bail enregistré, limitation 2022-2023 (D 75 %, E 50 %, F et G 0 %) et loyer adapté devenu la base du calcul.',
  h1: 'Indexation du loyer en Wallonie : la règle du loyer adapté',
  intro: 'La Région est réglée sur la Wallonie : entrez le loyer de base, les mois de signature et d’entrée en vigueur et le label PEB.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const p = h.D.regles.be.wallonie.limitation_2022_2023.part_indexation;
    return `En Wallonie, le loyer d’un bail d’habitation s’indexe une fois par an, au plus tôt à l’anniversaire de son entrée en vigueur, avec la formule loyer de base × nouvel indice / indice de départ. Le loyer de base est celui du contrat, hors frais et charges ; l’indice de départ est l’indice santé du mois qui précède la signature, le nouvel indice celui du mois qui précède l’anniversaire. Le dernier indice publié est celui de ${h.mois(d.p)} : ${h.num(d.v)}. Depuis le 1er septembre 2018, un bail de résidence principale doit être enregistré pour pouvoir être indexé. Entre le 1er novembre 2022 et le 31 octobre 2023, l’indexation a été limitée selon le certificat PEB : entière pour A, B et C, à ${h.pc(p.D * 100, 0)} pour D, à ${h.pc(p.E * 100, 0)} pour E, nulle pour F, G ou sans certificat. Cette mesure a un effet durable : le loyer « adapté » cette année-là devient le nouveau loyer de base, et l’indice de son anniversaire le nouvel indice de départ. Le saut d’index de 2016 n’est pas calculé par l’outil.`;
  },
  faqs: (h) => [
    { q: 'En Wallonie, la demande d’indexation doit-elle partir en recommandé ?', a: 'Non. La page officielle de la Wallonie précise que la demande doit être écrite, mais qu’un courrier normal, un SMS ou un e-mail suffisent. Ce qui compte, c’est de pouvoir prouver l’envoi et sa date, puisque les arriérés d’indexation sont limités aux trois mois qui précèdent celui de la demande.' },
    { q: 'Le loyer adapté reste-t-il la base même si le logement obtient un meilleur PEB ?', a: 'La page wallonne indique que le loyer adapté sert de loyer de base pour les indexations suivantes pendant toute la durée du bail, et ne prévoit pas de retour au calcul d’origine avec un nouveau certificat. Un nouveau bail repart en revanche de son propre loyer et de son propre indice de départ. Pour un cas où le certificat a changé, un service Info-Conseils Logement peut confirmer le calcul.' },
    { q: 'Mon bail était déjà en cours en avril 2016 : le saut d’index me concerne-t-il ?', a: 'Pour les baux de résidence principale en cours au 1er avril 2016, la Wallonie demande de tenir compte du saut d’index sur les loyers. Ce mécanisme, issu d’un décret de 2016 puis d’un décret de 2018, n’est pas modélisé par le calculateur : le résultat affiché suppose une indexation normale depuis la signature. Pour ce type de bail, faites vérifier le montant par un service Info-Conseils Logement.' },
  ],
  body: (h) => {
    const plein = 800 * s(h, '2026-08') / s(h, '2020-07');
    const du = 800 * s(h, '2022-08') / s(h, '2020-07'), ind = 800 * s(h, '2023-08') / s(h, '2020-07');
    const rows = ['C', 'D', 'E', 'F'].map((l) => {
      const r = ex(h, l);
      const part = (h.D.regles.be.wallonie.limitation_2022_2023.part_indexation as Record<string, number>)[l];
      return [l, h.pc(part * 100, 0), h.eur(du + (ind - du) * part), h.eur(r.nouveauLoyer)];
    });
    return `<h2>Un bail de 2020 traversant la période limitée</h2>
<p>Un logement est loué 800 € par mois ; le bail est signé en août 2020 et entre en vigueur le 1er septembre 2020. Indice de départ : juillet 2020 (${h.num(s(h, '2020-07'))}). Au 1er septembre 2022, le loyer dû était de ${h.eur(du)}. Au 1er septembre 2023, anniversaire tombé dans la période du 1er novembre 2022 au 31 octobre 2023, l’indexation complète aurait donné ${h.eur(ind)} ; la limitation ne laisse passer qu’une part de la différence, selon le PEB.</p>
${h.table(['PEB', 'Part de l’indexation 2023', 'Loyer adapté en 2023', 'Loyer de septembre 2026'], rows, `Indices santé de Statbel, base 2013 ; nouvel indice d’août 2026 (${h.num(s(h, '2026-08'))}). Sans limitation, le loyer de septembre 2026 serait de ${h.eur(plein)}. Calcul du moteur du site.`, ['l', 'r', 'r', 'r'])}
<p>Depuis le 1er novembre 2023, le calcul repart du loyer adapté, avec comme indice de départ celui d’août 2023 (${h.num(s(h, '2023-08'))}), le mois qui précède l’anniversaire de 2023. C’est pour cela que l’écart avec un logement bien classé ne se résorbe pas avec le temps. La part se calcule ainsi : (loyer indexé − loyer dû) × 75 ou 50 / 100, comme l’explique ${h.src('walIndexer', 'la page « Indexer un loyer » de wallonie.be')}.</p>
<h2>Les hypothèses de l’outil</h2>
<p>Le calculateur suppose que le loyer avait bien été indexé à l’anniversaire précédant la période, puisque le « loyer dû » est le loyer indexé de l’année d’avant, même si l’indexation n’a pas été demandée. Il ne calcule ni le saut d’index de 2016 ni les baux qui excluent l’indexation. Les indices viennent de ${h.src('statbelSante', 'Statbel')} ; la comparaison avec les autres Régions est sur ${h.a('be-home', 'la page Belgique')} et la règle bruxelloise sur ${h.a('be-bxl', 'l’indexation à Bruxelles')}.</p>`;
  },
};
export default t;
