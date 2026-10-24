import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Loyer indexé, éditeur et engagements : Radif Partners',
    description: 'Qui publie Loyer indexé, d’où viennent les indices, comment les pages sont relues et corrigées, et comment signaler une erreur : la société Radif Partners.',
    h1: 'Qui publie Loyer indexé',
    body: (h) => `<p>Loyer indexé est publié par la société Radif Partners. Le site fait une seule chose : appliquer à un bail l’indice officiel que la loi de son pays désigne, avec les règles qui limitent ou bloquent la hausse, et montrer chaque chiffre avec sa source et sa date. Il couvre la France (IRL, ILC, ILAT et indice des prix pour les pensions alimentaires), la Belgique (indice santé et règles des trois Régions), et, dans leurs langues, l’Espagne, l’Italie, le Portugal et l’Autriche.</p>
<p>Le site n’est rattaché à aucune administration, à aucun office statistique ni à aucun professionnel de l’immobilier. Il ne vend rien, ne collecte aucune coordonnée et ne transmet aucune demande à un tiers : les calculs se font dans votre navigateur.</p>
<h2>Éditeur</h2>
<!--identite-->
<h2 id="editorial">Politique éditoriale</h2>
<p>Chaque indice est relu à sa source : la série de l’Insee pour l’IRL, l’ILC et l’ILAT, Statbel pour l’indice santé, l’Istat, l’INE espagnol, le Diário da República et Statistik Austria pour les autres pays. Les fichiers de données sont régénérés par un script qui interroge ces sources directement, et chaque page affiche la date de la dernière relecture. Une règle de droit n’est écrite qu’après lecture du texte officiel qui la porte (loi, décret, page de l’administration régionale), dont le lien figure en bas de page.</p>
<p>Quand un chiffre n’est pas encore publié, la page le dit et n’en invente pas : le calculateur indique « à paraître » plutôt qu’une estimation présentée comme officielle. Les exemples chiffrés sont produits par le moteur de calcul du site, testé automatiquement sur les exemples publiés par les administrations, et non recopiés à la main.</p>
<p>Les pages sont revues au moins une fois par an, et à chaque nouvelle valeur d’indice pour les tableaux. Une correction de fond est datée en bas de la page concernée.</p>
<h2 id="contact">Contact et signalement d’une erreur</h2>
<p>Un indice faux, une règle mal comprise ou un cas que le calculateur ne traite pas : écrivez à <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> en indiquant l’adresse de la page et, si possible, la source qui vous paraît contredire la page. Nous ne répondons pas aux questions sur un litige particulier : pour cela, l’ADIL de votre département, un avocat ou, en Belgique, un service d’information sur le logement sont les bons interlocuteurs.</p>
<p>Le détail du calcul pour chaque pays est sur la page ${h.a('method', 'méthode et sources')}.</p>`,
  },
  method: {
    title: 'Indexation des loyers : méthode, sources et limites',
    description: 'Formules appliquées pays par pays, séries officielles utilisées, règles d’arrondi, mise à jour des indices et limites connues des calculateurs de Loyer indexé.',
    h1: 'Méthode et sources des calculs',
    body: (h) => `<p>Chaque calculateur applique la formule que le texte du pays prévoit, avec la série publiée par l’office statistique compétent. Le résultat est arrondi comme le texte le demande. Voici, pays par pays, ce que fait le calcul et ce qu’il ne fait pas.</p>
<h2>France</h2>
<p>Révision d’un loyer d’habitation : loyer hors charges × IRL du trimestre de référence de l’année / IRL du même trimestre de l’année précédente, arrondi au centime (${h.src('loi1989', 'loi du 6 juillet 1989, art. 17-1')}). Les trois séries de l’Insee (métropole, Corse, outre-mer) sont distinctes. Le gel des logements classés F ou G est appliqué à partir du 24 août 2022 en métropole et du 1er juillet 2024 outre-mer. Pour un bail commercial, la même proportion est faite avec l’ILC ou l’ILAT ; pour une pension alimentaire, avec l’indice des prix à la consommation hors tabac, base 2025, prolongé en arrière par l’Insee.</p>
<h2>Belgique</h2>
<p>Loyer de base × nouvel indice santé / indice de départ (base 2013, ${h.src('statbelSante', 'Statbel')}). L’indice de départ est celui du mois précédant la signature à Bruxelles et en Wallonie, celui du mois précédant l’entrée en vigueur en Flandre ; le nouvel indice est celui du mois précédant l’anniversaire. Les facteurs de correction bruxellois et flamands et la limitation wallonne de 2022-2023 suivent les pages officielles des Régions. Le saut d’index de 2016 n’est pas modélisé.</p>
<h2>Autres pays</h2>
<p>Espagne : variation annuelle de l’IPC ou de l’IRAV du dernier mois publié par l’INE, avec les plafonds de la loi et du décret-loi 29/2026. Italie : variation annuelle de l’indice FOI hors tabac, à 75 % ou 100 % selon le contrat, et coefficients de raccordement de l’Istat entre bases. Portugal : coefficients publiés au Diário da República, jusqu’à trois années rattrapées, arrondi au centime supérieur. Autriche : variation moyenne du VPI de l’année précédente selon la loi MieWeG, avec la moitié de la part au-delà de 3 %.</p>
<h2>Mise à jour et limites</h2>
<p>Les séries sont régénérées par un script qui interroge les API officielles (Insee, Statbel, INE, Istat, Statistik Austria) et vérifié à chaque nouvelle publication. Le calcul ne remplace pas la lecture du bail : une clause particulière (indice différent, plancher, date propre) l’emporte sur le cas général, et un juge peut trancher autrement un cas litigieux.</p>`,
    faqs: (h) => [
      { q: 'D’où viennent exactement les valeurs d’indice affichées ?', a: 'Elles sont lues directement dans les séries publiées par l’Insee, Statbel, l’INE espagnol, l’Istat, Statistik Austria et, pour le Portugal, dans les avis du Diário da República. Un script les télécharge par les interfaces officielles, compare chaque valeur avec la précédente et signale tout écart. Aucune valeur n’est saisie à la main, et la date de la dernière lecture figure sur chaque page.' },
      { q: 'Comment le site arrondit-il le loyer révisé ?', a: 'Au centime le plus proche dans la plupart des pays, comme l’imposent les textes français, belges, espagnols, italiens et autrichiens. Le Portugal fait exception : la loi demande d’arrondir la nouvelle renda au centime supérieur. Les indices eux-mêmes ne sont jamais arrondis avant le calcul ; seule la variation affichée l’est, pour la lecture.' },
      { q: 'Que fait le calculateur quand l’indice du mois n’est pas encore paru ?', a: 'Il ne l’invente pas. Il signale que la valeur est à paraître, rappelle à quel moment l’office statistique la publie d’habitude et, quand c’est utile, propose le dernier indice connu en le présentant comme tel. Une révision calculée sur une estimation n’aurait aucune valeur pour le bailleur comme pour le locataire.' },
    ],
  },
};
export default s;
