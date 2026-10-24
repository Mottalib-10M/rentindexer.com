import type { PageText, Helpers } from '../../lib/types';

/** Indexation du loyer en Flandre : indice du mois avant l’entrée en vigueur et correctiefactor EPC (« indexation loyer flandre »). */
const F = (h: Helpers) => h.D.regles.be.flandre.correctiefactor.par_mois_anniversaire as Record<string, { D: number; EFsans: number }>;
const vl = (h: Helpers, base: number, dep: string, nouv: string, mois: string, epc: string, entree: string) =>
  h.E.indexerFlandre({ loyerBase: base, indiceDepart: h.D.indiceSante(dep)!, nouvelIndice: h.D.indiceSante(nouv)!, moisAnniversaire: mois, epc: epc as 'A', entreeVigueur: entree, facteurs: F(h) });

const t: PageText = {
  slug: 'indexation-loyer-flandre',
  nav: 'Indexation du loyer en Flandre',
  card: 'Le calcul flamand : indice santé du mois avant l’entrée en vigueur, correctiefactor pour les EPC D, E, F ou sans EPC, et demande tardive.',
  title: 'Indexation loyer Flandre : correctiefactor et EPC en 2026',
  description: 'Indexation du loyer en Flandre : indice du mois avant l’entrée en vigueur, correctiefactor pour un EPC D, E, F ou absent, exemple officiel et demande tardive.',
  h1: 'Indexation du loyer en Flandre : indice de départ et correctiefactor',
  intro: 'La Région est réglée sur la Flandre : indiquez le loyer de base, le mois d’entrée en vigueur et le label EPC du logement.',
  resume: (h) => {
    const ex = vl(h, 600, '2019-10', '2024-10', '11', 'D', '2019-11-01');
    const d = h.D.dernierSante();
    return `En Flandre, le loyer d’habitation peut être indexé une fois par an à partir de l’anniversaire du bail, c’est-à-dire de la date à laquelle il a pris effet, sauf si le contrat exclut expressément l’indexation. La formule est la même qu’ailleurs en Belgique, mais l’indice de départ est celui du mois qui précède l’entrée en vigueur du bail, et non sa signature. Dans l’exemple de vlaanderen.be, un bail signé le 15 octobre 2019 et entré en vigueur le 1er novembre 2019, au loyer de base de 600 €, part de l’indice d’octobre 2019 (${h.num(h.D.indiceSante('2019-10')!)}) ; en novembre 2024, avec l’indice d’octobre 2024 (${h.num(h.D.indiceSante('2024-10')!)}), il atteint ${h.eur(600 * h.D.indiceSante('2024-10')! / h.D.indiceSante('2019-10')!)} à pleine indexation. Le logement ayant un EPC D et le bail datant d’avant le 1er octobre 2022, un correctiefactor de ${h.num(F(h)['11'].D, 9)} s’applique : le loyer exigible est de ${h.eur(ex.nouveauLoyer)}. Le dernier indice santé connu est celui de ${h.mois(d.p)}, ${h.num(d.v)}. L’indexation n’est jamais automatique et doit être demandée par écrit.`;
  },
  faqs: (h) => [
    { q: 'Le bailleur flamand demande l’indexation avec quatre mois de retard : quel indice et quels mois ?', a: 'Selon vlaanderen.be, une demande tardive se calcule avec l’indice santé du moment de la demande écrite, et ne peut rétroagir que sur trois mois. Pour un bail qui a démarré le 1er mars 2025, une demande envoyée le 1er juillet 2026 permet de réclamer la hausse à partir du 1er avril 2026 seulement. Le calculateur, lui, prend l’indice du mois qui précède l’anniversaire : pour une demande tardive, choisissez l’indice du mois concerné sur la page de l’indice santé.' },
    { q: 'Un EPC périmé compte-t-il comme un EPC D en Flandre ?', a: 'Non, il compte comme une absence d’EPC, donc avec le correctiefactor le plus bas, celui de la colonne « E, F ou sans EPC ». Le bailleur qui obtient un nouvel attest avec un label A, B ou C peut indexer normalement à partir du jour où il en dispose, au prorata pour le mois concerné, mais sans remonter trois mois avant cette date.' },
    { q: 'Les baux étudiants ont-ils échappé au gel flamand des loyers ?', a: 'La Cour constitutionnelle a décidé le 21 mars 2024 que la mesure aurait dû s’appliquer aussi aux baux étudiants. Les étudiants qui louaient un kot énergivore sous un contrat antérieur au 1er octobre 2022 peuvent donc, selon vlaanderen.be, réclamer une partie du loyer payé. Le calculateur ne traite pas ce cas particulier ; adressez-vous au service logement compétent.' },
  ],
  body: (h) => {
    const rows = [['A, B ou C', 'C'], ['D', 'D'], ['E, F ou sans EPC', 'E']].map(([n, l]) => {
      const r = vl(h, 700, '2021-02', '2026-02', '03', l, '2021-03-01');
      return [n, r.plafond ? h.num(l === 'D' ? F(h)['03'].D : F(h)['03'].EFsans, 9) : '–', h.eur(r.nouveauLoyer)];
    });
    return `<h2>Un bail de mars 2021 indexé en mars 2026</h2>
${h.table(['Label EPC', 'Correctiefactor (mars)', 'Loyer exigible'], rows, `Loyer de base 700 €, entrée en vigueur le 1er mars 2021 : indice de départ de février 2021 (${h.num(h.D.indiceSante('2021-02')!)}), nouvel indice de février 2026 (${h.num(h.D.indiceSante('2026-02')!)}). Calcul du moteur du site.`, ['l', 'r', 'r'])}
<p>Le correctiefactor dépend du mois anniversaire et du label ; le tableau complet des douze mois est publié par ${h.src('vlCorrectie', 'vlaanderen.be')} et repris dans le calculateur. Il s’applique à chaque indexation, tant que le logement n’a pas de meilleur EPC ou qu’un nouveau bail n’a pas commencé.</p>
<h2>Qui est concerné</h2>
<ul>
<li>Un logement loué comme résidence principale sur le marché privé ; les logements sociaux en sont exclus, mais le bail principal d’un logement loué par une woonmaatschappij est visé.</li>
<li>Un bail entré en vigueur avant le 1er octobre 2022, selon la loi fédérale sur les baux à loyer ou le décret flamand sur la location d’habitations ; après cette date, l’indexation est normale.</li>
<li>Un EPC D, E ou F, ou pas d’EPC valable. Sans label sur l’attest, on lit le score en kWh par mètre carré et par an pour retrouver la classe.</li>
</ul>
<p>Un bail conclu avant le 1er janvier 2019 reste soumis à la loi fédérale pour le reste de ses règles. Les textes officiels sont en néerlandais ; la version de Statbel de l’indice est sur ${h.src('statbelSanteNl')}. Pour comparer avec Bruxelles, voir ${h.a('be-bxl', 'l’indexation à Bruxelles')} ; pour la valeur du mois, ${h.a('be-sante', 'l’indice santé')}.</p>`;
  },
};
export default t;
