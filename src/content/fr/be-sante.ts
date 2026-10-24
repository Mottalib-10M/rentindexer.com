import type { PageText } from '../../lib/types';

/** Indice santé : valeurs mensuelles de Statbel, bases 2013 et 2025 (« indice santé », « indice santé loyer »). */
const t: PageText = {
  slug: 'indice-sante',
  nav: 'Indice santé : valeurs mensuelles',
  card: 'Les derniers indices santé publiés par Statbel, en base 2013 et en base 2025, et la variation entre deux mois pour indexer un montant.',
  title: 'Indice santé de Statbel : valeurs du mois en base 2013',
  description: 'Indice santé publié par Statbel : dernier mois en base 2013 et 2025, douze derniers mois, date de parution et variation entre deux mois pour indexer un loyer.',
  h1: 'Indice santé : la valeur du mois et la variation entre deux mois',
  intro: 'Choisissez le mois recherché et un mois de comparaison : l’outil affiche les deux indices, leur écart et le montant indexé.',
  resume: (h) => {
    const d = h.D.dernierSante();
    const nx = ((y: number, m: number) => (m === 12 ? `${y + 1}-01` : `${y}-${String(m + 1).padStart(2, '0')}`))(Number(d.p.slice(0, 4)), Number(d.p.slice(5)));
    const m = h.D.moisSante();
    const a = m[12];
    const v = (d.v / h.D.indiceSante(a)! - 1) * 100;
    return `Le dernier indice santé publié par Statbel, l’office belge de statistique, est celui de ${h.mois(d.p)} : ${h.num(d.v)} en base 2013, la base qu’utilisent les calculateurs de loyer des Régions, et ${h.num(h.D.santeBase2025[d.p])} en base 2025. Sur douze mois, depuis ${h.mois(a)} (${h.num(h.D.indiceSante(a)!)}), il a progressé de ${h.pc(v)}. L’indice santé est l’indice des prix à la consommation dont on a retiré le tabac, les boissons alcoolisées et le carburant, à l’exception du LPG ; c’est lui qui sert à indexer les loyers d’habitation depuis 1994. Statbel publie l’indice d’un mois à la fin de ce même mois, vers le 25 selon la Wallonie : l’indice de ${h.mois(nx)} est donc à paraître à la fin de ${h.mois(nx)}. Pour un loyer, l’indice utile n’est jamais celui du mois de l’indexation, mais celui du mois qui la précède : une indexation au 1er novembre 2026 se calcule avec l’indice d’octobre 2026. Le tableau ci-dessous reprend les douze derniers mois dans les deux bases.`;
  },
  faqs: (h) => [
    { q: 'Base 2013 ou base 2025 : quelle série prendre pour mon loyer ?', a: 'Celle de votre indice de départ, pour les deux mois du calcul. Les calculateurs régionaux et l’outil de cette page travaillent en base 2013, ce qui permet de remonter à 1994. Si un document cite une valeur dans une autre base, prenez l’autre indice dans la même base : le rapport entre deux mois reste presque identique, à l’arrondi près, alors que mélanger deux bases fausse complètement le résultat.' },
    { q: 'L’indice santé du mois en cours n’est pas encore sorti : puis-je indexer quand même ?', a: `Pour une indexation de loyer, vous n’avez pas besoin de l’indice du mois en cours : on prend celui du mois précédant l’anniversaire, déjà publié. Si l’anniversaire tombe au 1er novembre 2026, il faut l’indice d’octobre 2026, que Statbel publie à la fin d’octobre. Le dernier publié est celui de ${h.mois(h.D.dernierSante().p)}. Attendre quelques jours ne fait rien perdre, puisque la demande peut remonter trois mois.` },
    { q: 'Puis-je reprendre les chiffres de l’indice santé sur mon propre document ?', a: 'Oui. Statbel publie ses données ouvertes sous licence Creative Commons Attribution 4.0 : on peut les reprendre, y compris dans une lettre ou un tableau, à condition d’en citer la source. Une mention comme « Statbel, indice santé, base 2013 » suivie du mois suffit en pratique pour un courrier d’indexation adressé au locataire.' },
  ],
  body: (h) => {
    const mois = h.D.moisSante().slice(0, 12);
    const rows = mois.map((m) => {
      const a = `${Number(m.slice(0, 4)) - 1}${m.slice(4)}`;
      return [h.mois(m), h.num(h.D.indiceSante(m)!), h.D.santeBase2025[m] !== undefined ? h.num(h.D.santeBase2025[m]) : '–', h.pc((h.D.indiceSante(m)! / h.D.indiceSante(a)! - 1) * 100)];
    });
    return `<h2>Les douze derniers indices santé</h2>
${h.table(['Mois', 'Base 2013', 'Base 2025', 'Sur un an'], rows, 'Source : Statbel (données ouvertes, CC BY 4.0), relu le 24 octobre 2026. Variation sur un an calculée en base 2013.', ['l', 'r', 'r', 'r'])}
<p>La série en base 2013 du calculateur remonte à janvier 1994, ce qui couvre aussi les baux très anciens. Les valeurs officielles sont sur ${h.src('statbelSante', 'la page de l’indice santé de Statbel')}, et en néerlandais sur ${h.src('statbelSanteNl')}.</p>
<h2>Quel mois chercher</h2>
<p>Pour indexer un loyer, deux mois comptent. Le nouvel indice est celui du mois qui précède l’anniversaire de l’entrée en vigueur du bail. L’indice de départ est celui du mois qui précède la signature à Bruxelles et en Wallonie, ou l’entrée en vigueur en Flandre. Un bail signé le 20 mars et entré en vigueur le 1er avril part donc de l’indice de février à Bruxelles et en Wallonie, de celui de mars en Flandre ; son nouvel indice sera chaque année celui de mars.</p>
<p>L’outil de cette page sert aussi à d’autres montants : il suffit d’entrer la somme et les deux mois. Pour un loyer, utilisez plutôt ${h.a('be-home', 'le calcul de l’indexation du loyer')}, qui choisit lui-même les mois et applique la correction énergétique de la Région, notamment ${h.a('be-bxl', 'à Bruxelles')} et ${h.a('be-vl', 'en Flandre')}.</p>`;
  },
};
export default t;
