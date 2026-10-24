# Ajouter ou modifier une page (eu-rent-indexation)

Le site applique à un bail l'indice officiel de son pays (FR, BE, ES, IT, PT, AT). Une page = une fiche + un texte par langue.

## 1. La fiche : `src/content/pages.ts`

```ts
{ id: 'fr-ilc', pays: 'fr', order: 6, tool: 'fr-somme', toolProps: { serie: 'ilc' },
  related: ['fr-ilat', 'fr-irl', 'fr-home'], sources: ['inseeIlc', 'inseeIrl'] }
```

- `tool` : le calculateur (`src/components/Tool.astro` fait le lien avec `src/components/calc/*.tsx`).
- `toolProps` : réglages propres à la page (mode, série, région, année).
- `sources` : clés de `src/data/sources.ts` (ajouter une source = son adresse officielle, ouverte et lue, et son libellé).

## 2. Le texte : `src/content/<langue>/<id>.ts`

Une page n'existe que dans les langues où ce fichier existe ; hreflang, menu, sélecteur de langue et sitemap suivent
d'eux-mêmes (`src/i18n/routes.ts`). Toute page locale doit avoir sa version `en/` (check-anglais). Slug vide = racine
de la langue (`/fr/`, `/nl/`, `/es/`, `/it/`, `/pt/`, `/de/`, `/en/`). Modèle : `src/content/fr/fr-irl.ts`.

Les chiffres viennent de `h.D` (données officielles) et `h.E` (moteur), jamais tapés à la main ; `h.src(clé)` pour
citer une source, `h.a(id, texte)` pour un lien interne, `h.table(...)` pour un tableau.

Bornes (contrôlées par `npx vitest run src/content/textes.test.ts`, puis par `npm run check`) :

- titre 50-60 caractères, description 150-160, terme-clé en tête (ni pays, ni mot d'outil, ni question) ;
- bloc citable (`resume`) : un paragraphe d'au moins 125 mots ;
- FAQ : réponses de 40 à 90 mots, aucune question reprise ailleurs sur le site ;
- page outil 450-850 mots ; racine de langue au moins 1 900 mots et trois sources officielles ;
- pas plus de 30 % de ressemblance entre deux pages ; au plus 100 pages HTML en tout.

## 3. Les données : `data/*.json`

`npm run update-data` (`scripts/update-data.py`) relit Insee, Statbel, INE, Istat et Statistik Austria par leurs API et
n'écrit un fichier que si la lecture est complète. Le workflow `.github/workflows/deploy.yml` le lance chaque jour
ouvrable, puis teste, enregistre et publie. Le coefficient portugais se saisit à la main dans
`data/pt-coeficientes.json` dès que l'aviso paraît au Diário da República (au plus tard le 30 octobre), avec son
numéro, sa date et son adresse. Les règles de droit vivent dans `data/params-regles-2026.json` et dans le moteur
(`src/lib/engine/indexation.ts`, testé par `tests/indexation.test.ts`) ; chaque changement de règle se lit d'abord
dans le texte officiel, enregistré dans `sources/`.

## 4. Avant de livrer

`npm run check` à 0 défaut (Playwright : un seul à la fois, verrou `~/Documents/GitHub/.playwright.lock`), puis
arrêt du serveur par son port : `lsof -ti tcp:5681 | xargs kill`.
