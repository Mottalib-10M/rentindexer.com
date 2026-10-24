# eu-rent-indexation — plan des pages (phase 1, 2026-10-24)

Langues : fr (France + Belgique francophone), es, it, pt, en. **Pas d'allemand** : six langues
dépasseraient 100 pages (chaque page locale a sa version anglaise, check-anglais) ; l'Autriche est
servie en anglais (2 pages) et dans l'outil. Pas de néerlandais (brief : fr + es + it + pt + en).

Budget : 5 × 5 pages de service (accueil, à propos, méthode, mentions légales, confidentialité ;
contact et politique éditoriale fondus dans « à propos », cookies dans « confidentialité ») = 25 ;
32 pages de contenu locales + 32 versions anglaises + 2 pages anglaises Autriche = 66 ;
**total 91 pages HTML** (404 exclue), 9 de marge. Pas de widget ni d'/embed/.

Requêtes : uniquement la liste fermée `reports/niches-2026-10-24/kp-eu.txt` (blocs EU1-FR, EU1-BE,
EU1-ES, EU1-IT, EU1-PT, EU1-AT). Les volumes réels décideront en phase 2 des fusions
(RECETTE §3, ajout du 2026-10-17 : retirer au volume mesuré, jamais à la taille).

Moteur : `src/lib/engine/indexation.ts` (pur TypeScript), tests `tests/indexation.test.ts`
(15 cas, dont les exemples officiels de service-public, Bruxelles Logement, vlaanderen.be, INE PT).
Données : `data/*.json` par `scripts/update-data.py` ; règles : `data/params-regles-2026.json`.

## Accueils (simulateur pilier en tête, pays présélectionné selon la langue)

| URL | Requête visée | Simulateur |
|---|---|---|
| /fr/ | indexation loyer · révision loyer | Pays (France / Belgique + région) → loyer, date du bail, trimestre ou mois, DPE/PEB → nouveau loyer, indices cités, règle appliquée, lettre |
| /es/ | actualizacion renta ipc | Fecha de firma → IPC o IRAV, tope RDL 29/2026, renta sobre índice de referencia → nueva renta + carta |
| /it/ | aggiornamento istat affitto | Tipo di contratto (libero, concordato, commerciale, cedolare) → mese FOI, quota 75/100 % → nuovo canone + lettera |
| /pt/ | coeficiente atualização rendas | Renda, último aumento → coeficiente(s) aplicáveis (até 3 anos) → nova renda + carta com 30 dias |
| /en/ | (anglais, six pays) rent indexation | Sélecteur de pays (6) → même moteur ; termes locaux expliqués |

## France (fr) — 9 pages

| URL | Requête (kp) | Mini-simulateur |
|---|---|---|
| /fr/irl/ | irl · indice de référence des loyers · irl insee | Tableau IRL depuis 2002 (métropole, Corse, DOM) + calcul trimestre → trimestre |
| /fr/revision-loyer/ | révision loyer · calcul révision loyer · simulateur révision loyer · révision loyer irl | Simulateur complet + gel F/G + lettre au locataire |
| /fr/irl-2026/ | irl 2026 · indice irl 2026 | Les quatre trimestres 2026 (T4 « à paraître mi-janvier 2027 ») + hausse max par trimestre |
| /fr/irl-3e-trimestre-2026/ | irl 3ème trimestre 2026 (+ irl 2ème trimestre 2026 en section) | 148,06 (+1,57 %), Corse 143,80, DOM 145,21 ; révisions d'octobre à décembre |
| /fr/augmentation-loyer-2026/ | augmentation loyer 2026 · calcul augmentation loyer | Loyer actuel → hausse maximale selon le mois d'anniversaire |
| /fr/augmentation-loyer-annuelle/ | augmentation de loyer annuelle | Arbre de décision : clause, DPE F/G, délai d'un an, rétroactivité |
| /fr/indexation-loyer-commercial/ | indexation loyer commercial · indice ilc | ILC (T2 2026 : 137,16) ; indexation triennale / annuelle, plafonnement |
| /fr/indice-ilat/ | indice ilat | ILAT (T2 2026 : 138,01) bureaux et activités tertiaires |
| /fr/indexation-pension-alimentaire/ | indexation pension alimentaire · calcul indexation pension alimentaire | IPC hors tabac (base 2025 raccordée à la base 2015, coefficient 1,198183) |

## Belgique (fr) — 5 pages

| URL | Requête (kp) | Mini-simulateur |
|---|---|---|
| /fr/belgique/indexation-loyer/ | indexation loyer (BE) · calcul indexation loyer · indexation loyer 2026 | Région → indice de départ et nouvel indice (1994 → sept. 2026), facteurs |
| /fr/belgique/indice-sante/ | indice santé · indice santé loyer · indice santé octobre 2026 | Tableau base 2013 / 2025, « octobre 2026 : à paraître fin octobre » |
| /fr/belgique/indexation-loyer-bruxelles/ | indexation loyer bruxelles | Facteur de correction PEB E/F/G (baux avant le 14/10/2022) |
| /fr/belgique/indexation-loyer-wallonie/ | indexation loyer wallonie | Loyer adapté 2022-2023 (D 75 %, E 50 %, F/G 0 %) puis nouvelle base |
| /fr/belgique/indexation-loyer-flandre/ | indexation loyer flandre | Correctiefactor par mois (EPC D / E-F-sans) |

## Espagne (es) — 7 pages

| URL | Requête (kp) | Mini-simulateur |
|---|---|---|
| /es/actualizacion-renta-ipc/ | actualizacion renta ipc · actualizar alquiler ipc · calcular ipc alquiler | IPC del mes → nueva renta, con tope IRAV si el contrato es posterior al 26/05/2023 |
| /es/irav/ | irav · indice irav · actualizacion renta irav | Serie IRAV desde nov. 2024 (sept. 2026 : 2,54 %) |
| /es/ipc-alquiler-2026/ | ipc alquiler 2026 · actualizacion alquiler 2026 | Mes de aniversario 2026 → índice aplicable |
| /es/subida-alquiler-2027/ | subida alquiler 2027 | Anualidades 2027 bajo el RDL 29/2026 (2 % sin nuevo pacto) |
| /es/limite-subida-alquiler/ | limite subida alquiler | Renta por encima del índice de referencia → sin subida ; estado de convalidación |
| /es/ipc-alquiler-local-comercial/ | ipc alquiler local comercial | Local : libertad de pacto, IPC general |
| /es/cuanto-sube-el-alquiler/ | cuanto sube el alquiler · subida alquiler ipc · calculadora ipc alquiler | Comparador IPC / IRAV / 2 % para la misma renta |

## Italie (it) — 6 pages

| URL | Requête (kp) | Mini-simulateur |
|---|---|---|
| /it/aggiornamento-istat-affitto/ | aggiornamento istat affitto · adeguamento istat canone · calcolo istat affitto | Simulatore completo + lettera |
| /it/indice-foi/ | indice istat foi · indice foi | Serie FOI senza tabacchi (sett. 2026 : +4,0 %), raccordo base 2015/2025 |
| /it/istat-affitto-2026/ | istat affitto 2026 · aggiornamento istat canone locazione | Mese di aggiornamento 2026 → variazione |
| /it/istat-canone-75/ | istat canone 75% | Commerciale e concordato : 75 % della variazione |
| /it/rivalutazione-monetaria/ | rivalutazione monetaria · calcolo rivalutazione monetaria · rivalutazione istat | Somma × coefficiente FOI tra due mesi (coefficienti di raccordo Istat) |
| /it/rivalutazione-assegno-mantenimento/ | rivalutazione assegno di mantenimento · adeguamento istat assegno mantenimento | Assegno × variazione FOI (100 %) |

## Portugal (pt) — 5 pages

| URL | Requête (kp) | Mini-simulateur |
|---|---|---|
| /pt/coeficiente-atualizacao-rendas/ | coeficiente atualização rendas · coeficiente rendas 2027 | Coeficientes por ano (só os com aviso DR verificado) |
| /pt/aumento-rendas-2027/ | aumento rendas 2027 · atualização rendas 2027 | Renda × 1,0256 ; anos em atraso |
| /pt/aumento-renda-2026/ | aumento renda 2026 | Coeficiente 2026 + recuperação |
| /pt/simulador-aumento-renda/ | simulador aumento renda · calcular aumento renda · aumento da renda · atualização da renda | Simulador completo |
| /pt/carta-aumento-renda/ | carta aumento renda | Carta gerada no navegador (30 dias), nada enviado |

## Autriche (en seulement) — 2 pages

| URL | Requête (kp, en anglais faute de page de) | Mini-simulateur |
|---|---|---|
| /en/austria-rent-indexation/ | (indexanpassung miete · mieweg · wertsicherung miete — traitées en anglais) | MieWeG : moyenne VPI, demi-part au-delà de 3 %, plafonds MRG 1 % / 2 %, première valorisation au prorata |
| /en/austria-cpi-vpi/ | (verbraucherpreisindex österreich · vpi 2020) | VPI 2020 chaîné au VPI 2025 |

## Anglais (en) — 32 versions des pages locales

Une version anglaise par page locale ci-dessus (expatrié qui loue dans le pays : termes locaux
expliqués, montants en euros, format numérique de la langue anglaise), hreflang par paire.

## À faire en phase 2 avant d'écrire les chiffres concernés

- Portugal : relire au Diário da República les avisos des coefficients 2022 → 2026 (et le texte de
  la Lei n.º 19/2022) ; un coefficient sans aviso relu ne se publie pas.
- Espagne : relire le BOE le jour de la construction (convalidation ou dérogation du RDL 29/2026,
  délai ≈ début novembre 2026) ; prévoir la bascule `rdl29Vigente`.
- Italie : lire et citer sur Normattiva l'art. 32 de la L. 392/1978, la L. 431/1998 et l'art. 3 du
  D.Lgs. 23/2011 (cedolare secca) ; relire le fichier Istat des coefficients de raccordement.
- Belgique : licence Statbel à relire (portail derrière un défi anti-robot ; texte non lu le
  2026-10-24) ; saut d'index wallon de 2016 à documenter ; règle flamande « indice du mois de la
  demande » à confirmer sur le texte du décret.
- Indices à paraître : IRL T4 2026 (mi-janvier 2027), indice santé d'octobre 2026 (fin octobre),
  IPC/IRAV et FOI d'octobre (mi-novembre) : affichés « à paraître » avec leur date attendue.
