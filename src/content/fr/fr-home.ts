import type { PageText, Helpers } from '../../lib/types';

/** Racine /fr/ : révision et indexation du loyer d’habitation par l’IRL (« révision loyer », « indexation loyer », « calcul révision loyer », « irl »). */
const serie = (h: Helpers, s: 'irl' | 'irl_corse' | 'irl_dom' = 'irl') => Object.fromEntries(h.D.serieFr(s).map((o) => [o.p, o.v])) as Record<string, number>;
const rev = (h: Helpers, loyer: number, q: string, zone: 'metropole' | 'corse' | 'dom' = 'metropole') =>
  h.E.reviserFr({ loyer, trimestre: q, irl: serie(h, zone === 'metropole' ? 'irl' : zone === 'corse' ? 'irl_corse' : 'irl_dom'), zone, dateBail: '2020-01-01' });

const t: PageText = {
  slug: '',
  nav: 'Révision du loyer',
  card: 'Le calcul de la révision annuelle d’un loyer d’habitation avec l’IRL, le gel des logements F et G et les délais à respecter.',
  title: 'Révision du loyer avec l’IRL : calcul et règles en 2026',
  description: 'Révision du loyer et indexation par l’IRL : calcul du nouveau loyer selon le trimestre du bail, gel F et G, délai d’un an, cas particuliers et chiffres 2026.',
  h1: 'Révision du loyer : le calcul avec l’IRL, étape par étape',
  intro: 'Entrez le loyer hors charges, le lieu du logement, le trimestre de référence du bail et la classe énergie : le nouveau loyer s’affiche avec son calcul.',
  resume: (h) => {
    const d = h.D.dernierFr('irl');
    const r = rev(h, 750, d.p);
    return `La révision d’un loyer d’habitation, qu’on appelle aussi indexation, se fait une fois par an si le bail contient une clause qui la prévoit. Le nouveau loyer se calcule ainsi : loyer hors charges actuel × IRL du trimestre de référence de l’année / IRL du même trimestre de l’année précédente, arrondi au centime. L’indice de référence des loyers (IRL) est publié chaque trimestre par l’Insee ; le dernier paru est celui du ${h.trim(d.p)}, qui vaut ${h.num(d.v)} en métropole, en hausse de ${h.pc(d.var!)} sur un an, publié au Journal officiel le ${h.date(d.jo!)}. Pour un loyer de 750 € indexé sur ce trimestre, la révision donne ${h.eur(r.nouveauLoyer)}, soit ${h.eur(r.hausse)} de plus par mois. Le trimestre à utiliser est celui que fixe le bail, ou à défaut le dernier IRL publié le jour de la signature. Le bailleur a un an après la date de révision pour la demander, sans effet rétroactif. Aucune révision n’est possible pour un logement classé F ou G si le bail a été signé, renouvelé ou reconduit depuis le 24 août 2022 en métropole, ou depuis le 1er juillet 2024 outre-mer.`;
  },
  faqs: (h) => {
    const d = h.D.dernierFr('irl');
    return [
      { q: 'Quelle différence entre révision du loyer et indexation du loyer ?', a: 'Dans le langage courant, aucune : les deux mots désignent la hausse annuelle du loyer en cours de bail selon l’IRL. Le texte de loi parle de révision, prévue par une clause du contrat. Le mot indexation est plutôt employé pour les baux commerciaux, les pensions alimentaires et les loyers belges. Dans tous les cas, on applique le rapport entre deux valeurs d’un même indice publié.' },
      { q: 'Le calcul de la révision se fait-il sur le loyer charges comprises ?', a: 'Non, sur le loyer hors charges. Les provisions pour charges suivent leur propre logique : elles sont ajustées lors de la régularisation annuelle, d’après les dépenses réelles. Seule exception, le meublé loué avec un forfait de charges : ce forfait peut être révisé chaque année avec la même formule. Si votre quittance mélange les deux, isolez d’abord le loyer avant d’utiliser le calculateur.' },
      { q: 'Le locataire peut-il refuser la révision du loyer ?', a: 'Pas si la clause existe, que le trimestre est le bon, que le calcul est juste et que la demande arrive dans l’année qui suit la date de révision. Il peut en revanche refuser une hausse supérieure au résultat de la formule, une révision réclamée pour des mois passés, ou une révision d’un logement F ou G gelé. En cas de doute, l’Adil du département renseigne les deux parties.' },
      { q: 'Faut-il un avenant au bail pour appliquer le nouveau loyer révisé ?', a: 'Non. La révision applique une clause déjà présente dans le bail : un courrier qui donne le calcul et la date d’effet suffit. Un avenant n’est nécessaire que pour modifier le contrat lui-même, par exemple pour changer le trimestre de référence ou ajouter une clause de révision qui n’existait pas, ce qui suppose l’accord des deux parties.' },
      { q: `Pourquoi mon loyer révisé diffère-t-il de quelques centimes de celui du bailleur ?`, a: `Le plus souvent, le bailleur a appliqué la variation publiée, arrondie à deux décimales (${h.pc(d.var!)} pour le ${h.trim(d.p)}), au lieu du rapport exact des deux indices. L’écart dépasse rarement un centime ou deux. La formule officielle utilise les valeurs d’indice ; un autre écart, plus large, vient presque toujours d’un mauvais trimestre ou d’une série d’une autre zone.` },
      { q: 'Un loyer peut-il être révisé deux fois dans la même année ?', a: 'Non, la révision est annuelle et intervient à la date prévue par le bail, ou à défaut à sa date anniversaire. Une demande tardive ne permet pas non plus de cumuler deux années : la révision qui n’a pas été demandée dans l’année est perdue. Seul un nouveau bail, avec un nouveau loyer de départ, repart sur un autre calendrier et, le cas échéant, sur un autre trimestre de référence.' },
      { q: 'Où trouver l’IRL officiel pour vérifier un calcul de révision ?', a: 'Sur la page de chaque série de l’Insee, une pour la métropole, une pour la Corse et une pour les départements d’outre-mer, et dans l’avis publié au Journal officiel après chaque trimestre. La fiche F13723 de service-public.fr reprend aussi les six derniers trimestres. Les liens figurent en bas de cette page, et le calculateur indique la date de la dernière relecture.' },
    ];
  },
  body: (h) => {
    const d = h.D.dernierFr('irl');
    const n1 = `${Number(d.p.slice(0, 4)) - 1}${d.p.slice(4)}`;
    const r = rev(h, 750, d.p);
    const qs = h.D.serieFr('irl').slice(-4).reverse();
    const rows = qs.map((o) => { const x = rev(h, 750, o.p); return [h.trim(o.p), h.pc(o.var!), h.eur(x.nouveauLoyer), `+${h.eur(x.hausse)}`]; });
    const zones = (['metropole', 'corse', 'dom'] as const).map((z) => {
      const s = z === 'metropole' ? 'irl' : z === 'corse' ? 'irl_corse' : 'irl_dom';
      const x = rev(h, 750, d.p, z);
      return [z === 'metropole' ? 'Métropole' : z === 'corse' ? 'Corse' : 'Outre-mer', h.num(h.D.valeurFr(s, n1)!), h.num(h.D.valeurFr(s, d.p)!), h.eur(x.nouveauLoyer)];
    });
    return `<h2>Le calcul de la révision en quatre étapes</h2>
<ol>
<li><strong>Le loyer de départ</strong> : le loyer mensuel hors charges payé aujourd’hui, complément de loyer compris s’il y en a un. C’est le loyer issu de la dernière révision, pas celui de la signature.</li>
<li><strong>Le trimestre de référence</strong> : celui que cite la clause de révision. S’il n’est pas écrit, on retient le dernier IRL publié par l’Insee au jour de la signature du bail, et ce trimestre reste le même chaque année.</li>
<li><strong>Les deux indices</strong> : la valeur de ce trimestre pour l’année en cours, et celle du même trimestre un an plus tôt, dans la série de la zone du logement.</li>
<li><strong>La proportion</strong> : loyer × nouvel indice / ancien indice, arrondi à la deuxième décimale la plus proche.</li>
</ol>
<p>Avec le ${h.trim(d.p)} : 750 × ${h.num(d.v)} / ${h.num(h.D.valeurFr('irl', n1)!)} = ${h.eur(r.nouveauLoyer)}. Le calculateur affiche cette fraction sous le résultat, ce qui permet de la recopier telle quelle dans un courrier.</p>
<h2>Un bail sans trimestre : l’exemple</h2>
<p>Un bail signé le 10 mars 2025 ne cite aucun trimestre. Ce jour-là, le dernier IRL paru au Journal officiel était celui du ${h.trim(h.D.trimestreParuLe('irl', '2025-03-10')!.p)} ; c’est donc ce trimestre qui sert pour toute la durée du bail. À la révision du 10 mars 2026, le calcul rapporte l’IRL du ${h.trim(h.D.trimestreParuLe('irl', '2026-03-10')!.p)} (${h.num(h.D.trimestreParuLe('irl', '2026-03-10')!.v)}) à celui de l’année précédente ; en mars 2027, il prendra le ${h.trim('2026-Q4')}, à paraître vers le 15 janvier 2027. Le trimestre ne glisse pas avec les années : il reste celui de la signature.</p>
<h2>Ce que donne chaque trimestre récent pour un loyer de 750 €</h2>
${h.table(['Trimestre de référence du bail', 'Variation sur un an', 'Loyer révisé', 'Hausse mensuelle'], rows, 'Métropole, logement non gelé. Calcul du moteur du site à partir des séries de l’Insee relues le 24 octobre 2026.', ['l', 'r', 'r', 'r'])}
<p>Deux baux au même loyer, l’un indexé sur le 1er trimestre, l’autre sur le 3e, n’augmentent donc pas du même montant la même année : seul compte le trimestre écrit dans le contrat. Le tableau mois par mois, pour savoir quel indice était paru à votre date de révision, se trouve sur ${h.a('fr-irl-2026', 'la page IRL 2026 par mois de révision')}.</p>
<h2>Métropole, Corse et outre-mer : trois séries distinctes</h2>
${h.table(['Zone', `IRL ${h.trim(n1)}`, `IRL ${h.trim(d.p)}`, 'Loyer de 750 € révisé'], zones, 'Les niveaux diffèrent mais la variation annuelle publiée est identique dans les trois zones.', ['l', 'r', 'r', 'r'])}
<p>Depuis 2022, la Corse et les départements d’outre-mer (Guadeloupe, Guyane, Martinique, La Réunion, Mayotte) ont leur propre IRL. Le calcul se fait toujours avec les deux valeurs d’une même série ; prendre l’indice de la métropole pour un logement corse fausse le résultat. Les valeurs sont sur les pages ${h.src('inseeIrl', 'IRL métropole')}, ${h.src('inseeIrlCorse', 'IRL Corse')} et ${h.src('inseeIrlDom', 'IRL outre-mer')} de l’Insee.</p>
<h2>Avant de calculer : quatre vérifications</h2>
<p><strong>La clause existe-t-elle ?</strong> Sans clause de révision, le loyer ne bouge pas en cours de bail, quelle que soit l’évolution de l’IRL. Relisez le contrat signé, pas un modèle : c’est la clause de votre bail qui compte.</p>
<p><strong>Quel trimestre ?</strong> Cherchez dans la clause une mention du type « IRL du 2e trimestre » ou « dernier indice connu à la date de signature ». La seconde formule renvoie au trimestre paru à la signature, qui ne change plus ensuite.</p>
<p><strong>Quelle zone ?</strong> Métropole continentale, Corse ou outre-mer : c’est le lieu du logement qui compte, pas l’adresse du bailleur.</p>
<p><strong>Quelle classe énergie ?</strong> Un diagnostic de performance énergétique F ou G peut interdire toute hausse, selon la date du bail. Le calculateur demande la classe et, pour F ou G, la date de signature, de renouvellement ou de reconduction.</p>
<h2>Le gel des logements classés F et G</h2>
<p>Depuis le 24 août 2022 en métropole, et depuis le 1er juillet 2024 en Guadeloupe, en Guyane, à la Martinique, à La Réunion et à Mayotte, le loyer d’un logement classé F ou G ne peut plus être révisé si le bail a été signé, renouvelé ou tacitement reconduit après cette date. Les trois événements comptent : un bail de 2019 tacitement reconduit en 2025 est gelé si le logement est classé F ou G. Le calculateur affiche alors « aucune hausse possible » et garde le loyer actuel. Cette règle figure sur ${h.src('spIrl', 'la fiche F13723 de service-public.fr')}, vérifiée le 15 octobre 2026.</p>
<h2>Le délai d’un an et l’absence d’effet rétroactif</h2>
<p>La révision ne se déclenche pas toute seule : le bailleur, ou l’agence qui gère le logement, doit la demander. Il a pour cela un an à compter de la date de révision prévue au bail. Prenons une date de révision au 1er septembre 2026 : la demande est possible jusqu’au 31 août 2027. Si elle arrive le 15 novembre 2026, le nouveau loyer s’applique à partir de cette date, et les loyers de septembre à mi-novembre restent dus à l’ancien montant. Si rien n’est demandé avant le 1er septembre 2027, la hausse de l’année est perdue, et la révision suivante repart du loyer non révisé. Ces deux règles viennent des articles 7-1 et 17-1 de ${h.src('loi1989', 'la loi du 6 juillet 1989')}.</p>
<h2>Révision, augmentation, encadrement : ne pas confondre</h2>
<p>La révision annuelle par l’IRL est la seule hausse possible en cours de bail dans le cas général. Elle se distingue de la hausse au renouvellement pour un loyer manifestement sous-évalué, qui suit une procédure propre, et de l’encadrement des loyers dans certaines villes, qui plafonne le loyer à la signature ou au renouvellement. Dans les villes où l’encadrement s’applique, un complément de loyer peut s’ajouter au loyer de base ; lors de la révision, c’est le total des deux qui est révisé. Ce que le bailleur peut réclamer en 2026, et la lettre qui l’accompagne, sont détaillés sur ${h.a('fr-augm', 'la page augmentation de loyer 2026')}.</p>
<h2>Les cas particuliers</h2>
<ul>
<li><strong>Logement meublé</strong> : même formule, même IRL ; le forfait de charges, s’il existe, se révise de la même façon.</li>
<li><strong>Bail mobilité</strong> : la révision du loyer est interdite pendant le bail.</li>
<li><strong>Logement social (HLM)</strong> : révision au 1er janvier, avec l’IRL du 2e trimestre de l’année précédente rapporté à celui de l’année d’avant.</li>
<li><strong>Logement conventionné avec l’Anah</strong> : révision possible si le bail la prévoit, de préférence au 1er janvier avec l’IRL du 2e trimestre ; le loyer révisé doit rester sous le loyer maximum de la convention.</li>
<li><strong>Loi de 1948</strong> : régime spécifique, non couvert par le calculateur.</li>
</ul>
<h2>Comment lire le résultat du calculateur</h2>
<p>Le panneau de résultat donne le loyer révisé, la hausse par mois et sur douze mois, et la fraction utilisée avec les deux trimestres. Changer de zone remplace la série ; choisir F ou G fait apparaître la question sur la date du bail. Les quarante derniers trimestres sont proposés ; un trimestre que l’Insee n’a pas encore publié n’apparaît pas, et le prochain, celui du 4e trimestre 2026, est à paraître vers le 15 janvier 2027. Le bouton de copie reprend le calcul en une ligne. Pour l’historique des valeurs et leurs dates de parution, voir ${h.a('fr-irl', 'IRL : valeurs et calcul')} ; pour les baux révisés en fin d’année, ${h.a('fr-irl-t3', 'l’IRL du 3e trimestre 2026')}.</p>
<h2>Les autres indices et la Belgique</h2>
<p>Un local commercial ou artisanal s’indexe avec l’${h.a('fr-ilc', 'indice des loyers commerciaux')}, des bureaux ou un cabinet libéral avec l’${h.a('fr-ilat', 'ILAT')}. Une pension alimentaire suit l’indice des prix hors tabac : voir ${h.a('fr-pension', 'l’indexation de la pension alimentaire')}. En Belgique, l’indexation du loyer suit l’indice santé et des règles différentes dans chaque Région : voir ${h.a('be-home', 'l’indexation du loyer en Belgique')}.</p>
<h2>Sources et mise à jour</h2>
<p>Les valeurs de l’IRL sont lues dans les séries de l’Insee, réutilisées selon ${h.src('inseeLicence', 'la Licence Ouverte 2.0')}, et vérifiées à chaque publication trimestrielle. Les règles de droit viennent de la fiche officielle de service-public.fr et de la loi du 6 juillet 1989. Ce site est édité par la société Radif Partners ; il n’est pas rattaché à l’Insee ni à une administration. Il donne le résultat de la formule ; il ne remplace pas la lecture de votre bail, et un litige se règle avec l’aide de l’Adil ou d’un professionnel du droit.</p>`;
  },
};
export default t;
