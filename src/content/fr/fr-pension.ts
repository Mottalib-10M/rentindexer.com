import type { PageText, Helpers } from '../../lib/types';

/** Indexation de la pension alimentaire par l’indice des prix hors tabac (« indexation pension alimentaire »). */
/** Dernier indice mensuel paru au Journal officiel à une date (AAAA-MM-JJ). */
const paruLe = (h: Helpers, date: string) => [...h.D.ipcFr.obs].reverse().find((o) => o.jo && o.jo <= date)!;

const t: PageText = {
  slug: 'indexation-pension-alimentaire',
  nav: 'Indexation de la pension alimentaire',
  card: 'La revalorisation annuelle d’une pension alimentaire avec l’indice des prix hors tabac de l’Insee, base 2025, et l’indice à retenir au 1er janvier 2026.',
  title: 'Indexation pension alimentaire : indice Insee et calcul 2026',
  description: 'Indexation de la pension alimentaire : indice des prix hors tabac de l’Insee en base 2025, valeur au 1er janvier 2026, formule, rattrapage des années oubliées.',
  h1: 'Indexation de la pension alimentaire : l’indice et le calcul',
  intro: 'Choisissez le mois de l’indice de référence (celui du jugement) et le dernier indice paru à la date de revalorisation.',
  resume: (h) => {
    const j = paruLe(h, '2026-01-01');
    const d = h.D.dernierIpcFr();
    return `Sauf clause contraire du jugement ou de la convention, une pension alimentaire indexée se revalorise chaque année avec la formule suivante : montant de la pension × dernier indice publié à la date de revalorisation / dernier indice publié à la date du jugement. L’indice par défaut est l’indice des prix à la consommation hors tabac de l’ensemble des ménages, publié par l’Insee en base 2025. Pour une revalorisation au 1er janvier 2026, le dernier indice paru était celui de ${h.mois(j.p)} : ${h.num(j.v)}. Le plus récent publié à ce jour est celui de ${h.mois(d.p)}, ${h.num(d.v)}, paru au Journal officiel le ${h.date(d.jo!)}. La date de revalorisation est celle que fixe la décision, souvent le 1er janvier, le 1er juillet ou l’anniversaire du jugement. C’est au parent qui verse la pension de faire le calcul et de payer le nouveau montant, sans attendre qu’on le lui demande ; aucun nouveau passage devant le juge n’est nécessaire. Si le jugement cite un autre indice, celui des ménages urbains dont le chef est ouvrier ou employé par exemple, ce sont ses valeurs qu’il faut prendre.`;
  },
  faqs: (h) => [
    { q: 'Le parent qui verse la pension a oublié de l’indexer pendant trois ans : que peut-on réclamer ?', a: 'Les arriérés de revalorisation se réclament sur les cinq dernières années, selon la fiche officielle qui renvoie à l’article 2224 du Code civil. Chaque année, l’arriéré est la différence entre ce qui a été versé et ce qui aurait dû l’être. Le parent qui reçoit la pension peut faire le calcul et le communiquer ; en cas de refus de payer, il peut s’adresser à un commissaire de justice.' },
    { q: 'Faut-il arrondir le montant de la pension revalorisée à l’euro ?', a: 'Seulement si la décision le prévoit. La fiche de service-public.fr indique qu’on arrondit à l’euro supérieur ou le plus proche lorsque le jugement ou la convention le demande ; sinon, le montant se garde au centime. Le calculateur donne le résultat au centime : appliquez ensuite l’arrondi éventuellement prévu par votre décision.' },
    { q: 'La Caf verse ma pension par intermédiation : dois-je faire le calcul moi-même ?', a: 'Non. Quand la pension passe par l’intermédiation financière, la revalorisation est faite par la Caf, ou la MSA, qui applique l’indice et la date prévus. Le calcul de cette page reste utile pour vérifier le montant annoncé, avec les deux mêmes indices, mais il n’y a aucune démarche à faire pour déclencher la revalorisation.' },
    { q: 'Le jugement est muet sur l’indice ou la date : comment s’en sortir ?', a: 'Si un élément manque, la fiche officielle conseille une requête en interprétation devant le juge aux affaires familiales du tribunal qui a rendu la décision. Si la formule contient une erreur évidente, par exemple deux indices identiques, c’est une requête en rectification d’erreur matérielle. Avec plusieurs décisions successives, on suit la dernière qui a modifié le montant.' },
  ],
  body: (h) => {
    const jug = paruLe(h, '2023-06-04');
    const rev = paruLe(h, '2026-01-01');
    const ex = h.E.indexerSomme(300, jug.v, rev.v);
    const rows = ['2025-07-01', '2026-01-01', '2026-07-01'].map((dt) => { const o = paruLe(h, dt); return [h.date(dt), h.mois(o.p), h.num(o.v), h.date(o.jo!)]; });
    rows.push([h.date('2027-01-01'), h.mois('2026-11'), 'à paraître', 'mi-décembre 2026']);
    return `<h2>L’indice à retenir aux dates de revalorisation courantes</h2>
${h.table(['Revalorisation au', 'Dernier indice paru', 'Valeur (base 2025)', 'Paru le'], rows, 'Indice des prix à la consommation hors tabac, ensemble des ménages, France, série Insee 011814056.', ['l', 'l', 'r', 'l'])}
<p>La base 2025 a remplacé l’ancienne base en 2026 ; l’Insee a recalculé la série vers le passé, de sorte qu’un jugement ancien se traite avec des valeurs comparables. Le calculateur remonte à janvier 1996. Le rapport entre deux mois reste le même quelle que soit la base, à l’arrondi près ; si votre décision cite des valeurs d’une ancienne base, le résultat peut différer de quelques centimes.</p>
<h2>Un calcul pas à pas</h2>
<p>Une pension de 300 € par mois est fixée par un jugement du 4 juin 2023. Le dernier indice publié à cette date est celui de ${h.mois(jug.p)} : ${h.num(jug.v)} en base 2025. À la revalorisation du 1er janvier 2026, le dernier indice paru est celui de ${h.mois(rev.p)} : ${h.num(rev.v)}. La pension devient 300 × ${h.num(rev.v)} / ${h.num(jug.v)} = ${h.eur(ex.nouveauLoyer)}, soit ${h.eur(ex.hausse)} de plus par mois.</p>
<p>La règle et les cas particuliers sont décrits par ${h.src('spPension', 'la fiche F2010 de service-public.fr')} ; ${h.src('inseePension', 'la page de l’Insee')} précise quelle série choisir selon l’indice cité et donne les identifiants des séries d’outre-mer. Les valeurs mensuelles sont sur ${h.src('inseeIpc', 'la série 011814056')}.</p>
<p>Ce calcul ne modifie pas le montant fixé par le juge : il l’actualise selon la formule de la décision. Pour obtenir un autre montant, parce que les ressources ou les besoins ont changé, il faut saisir le juge aux affaires familiales. Pour une pension fixée en Italie, la règle est différente : voir ${h.a('it-assegno', 'la rivalutazione dell’assegno di mantenimento')}.</p>`;
  },
};
export default t;
