/**
 * Contrôle des textes avant build (npx vitest run src/content/textes.test.ts).
 * Mêmes bornes que check-seo / check-unique / RECETTE : titre 50-60 caractères, description 150-160,
 * terme-clé en tête (ni pays, ni mot d'outil, ni rubrique, ni question), bloc citable ≥ 125 mots en un
 * paragraphe, réponses FAQ 40-90 mots, questions uniques sur tout le site, pas de tiret long, pas de
 * date machine, longueur selon le type (racine de langue : ≥ 1900 mots de texte ; page outil : 450 à
 * 800), aucun nom de concurrent ni de moteur de recherche.
 */
import { describe, it, expect } from 'vitest';
import { META } from './pages';
import { helpers } from '../lib/helpers';
import type { PageText, SiteText, Lang } from '../lib/types';

const textes = import.meta.glob<{ default: PageText }>(['./*/*.ts', '!./*/_*.ts'], { eager: true });
const sites = import.meta.glob<{ default: SiteText }>('./*/_site.ts', { eager: true });
const mots = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const LANGS: Lang[] = ['fr', 'nl', 'es', 'it', 'pt', 'de', 'en'];
const PAYS_TETE = /^(france|french|belgi|belgique|belgië|belgium|españa|spain|spanish|espagne|ital|portugal|portugu|austria|österreich|autriche|oostenrijk|frankrijk|spanje)/i;
const OUTIL_TETE = /^(calcul|calculateur|calculadora|calcolatore|calculator|simulateur|simulador|simulatore|rechner|rekenhulp|tool|outil|guide|guía|guida|faq|à propos|about|comment|how|what|quel|qué|cómo|come|como|wie|was|hoe|wat)\b/i;
const INTERDITS = /google|premier résultat|first result|primer resultado|primo risultato|idealista|fotocasa|immobiliare\.it|anil\.org|pap\.fr|seloger|immoweb|zimmo|bricks|wohnnet|willhaben/i;
const questions = new Map<string, string>();
const titres = new Map<string, string>();

for (const lang of LANGS) {
  const H = helpers(lang);
  if (!Object.keys(textes).some((k) => k.startsWith(`./${lang}/`)) && !sites[`./${lang}/_site.ts`]) continue;
  describe(`textes ${lang}`, () => {
    for (const m of META) {
      const mod = textes[`./${lang}/${m.id}.ts`];
      if (!mod) continue;
      it(m.id, () => {
        const t = mod.default;
        const id = `${lang}/${m.id}`;
        const racine = t.slug === '';
        expect(t.slug, `${id} slug avec année`).not.toMatch(/20\d\d/);
        expect(t.title.length, `${id} titre « ${t.title} » ${t.title.length}`).toBeGreaterThanOrEqual(50);
        expect(t.title.length, `${id} titre « ${t.title} » ${t.title.length}`).toBeLessThanOrEqual(60);
        expect(t.title, `${id} titre ouvert par le pays`).not.toMatch(PAYS_TETE);
        expect(t.title, `${id} titre ouvert par un mot générique`).not.toMatch(OUTIL_TETE);
        expect(titres.get(t.title), `${id} titre déjà pris par ${titres.get(t.title)}`).toBeUndefined();
        titres.set(t.title, id);
        expect(t.description.length, `${id} description ${t.description.length}`).toBeGreaterThanOrEqual(150);
        expect(t.description.length, `${id} description ${t.description.length}`).toBeLessThanOrEqual(160);
        const r = t.resume(H);
        expect(mots(r), `${id} bloc citable ${mots(r)} mots`).toBeGreaterThanOrEqual(125);
        expect(r, `${id} bloc citable en un seul paragraphe, sans HTML de bloc`).not.toMatch(/<\/?(p|div|ul|ol|li|h\d|br)\b/);
        const f = t.faqs(H);
        expect(f.length, `${id} nombre de FAQ`).toBeGreaterThanOrEqual(racine ? 5 : 3);
        for (const x of f) {
          const n = x.a.split(/\s+/).filter(Boolean).length;
          expect(n >= 40 && n <= 90, `${id} FAQ « ${x.q} » ${n} mots`).toBe(true);
          const k = x.q.toLowerCase().replace(/[¿?¡!.,:;«»"“”'’\s]+/g, ' ').trim();
          expect(questions.get(k), `${id} question déjà posée sur ${questions.get(k)} : « ${x.q} »`).toBeUndefined();
          questions.set(k, id);
        }
        const b = t.body(H);
        const tout = `${t.title} ${t.description} ${t.h1} ${t.intro} ${t.card} ${r} ${b} ${f.map((x) => x.q + ' ' + x.a).join(' ')}`;
        expect(tout, `${id} tiret long (—)`).not.toMatch(/—/);
        expect(tout, `${id} NaN/undefined`).not.toMatch(/NaN|undefined|Infinity/);
        expect(tout.replace(/href="[^"]*"/g, ""), `${id} date au format machine`).not.toMatch(/\b20\d\d-\d\d-\d\d\b/);
        expect(tout, `${id} nom interdit (moteur, concurrent)`).not.toMatch(INTERDITS);
        const total = mots(`${r} ${b} ${f.map((x) => x.q + ' ' + x.a).join(' ')}`);
        if (racine) expect(total, `${id} racine de langue : ${total} mots`).toBeGreaterThanOrEqual(1900);
        else {
          expect(total, `${id} page outil : ${total} mots`).toBeGreaterThanOrEqual(450);
          expect(total, `${id} page outil : ${total} mots, max. 850`).toBeLessThanOrEqual(850);
        }
      });
    }
    const s = sites[`./${lang}/_site.ts`];
    if (s) it('_site', () => {
      const a = s.default.about, me = s.default.method;
      for (const [k, x] of [['about', a], ['method', me]] as const) {
        expect(x.title.length >= 50 && x.title.length <= 60, `${lang}/${k} titre ${x.title.length}`).toBe(true);
        expect(x.description.length >= 150 && x.description.length <= 160, `${lang}/${k} description ${x.description.length}`).toBe(true);
        expect(x.body(H), `${lang}/${k} tiret long`).not.toMatch(/—/);
        expect(x.body(H), `${lang}/${k} nom interdit`).not.toMatch(INTERDITS);
      }
      expect(a.body(H)).toContain('<!--identite-->');
      expect(a.body(H)).toContain('id="editorial"');
      expect(a.body(H)).toContain('id="contact"');
      for (const f of me.faqs(H)) {
        const n = f.a.split(/\s+/).length;
        expect(n >= 40 && n <= 90, `${lang}/method FAQ ${n}`).toBe(true);
        const k = f.q.toLowerCase().replace(/[¿?¡!.,:;«»"“”'’\s]+/g, ' ').trim();
        expect(questions.get(k), `${lang}/method question déjà posée sur ${questions.get(k)}`).toBeUndefined();
        questions.set(k, `${lang}/method`);
      }
    });
  });
}
