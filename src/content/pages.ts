/**
 * Fiches des pages : pays, outil et réglages, pages liées, sources.
 * Les textes sont dans `content/<langue>/<id>.ts` ; une page existe dans une langue si son texte existe.
 * Racines de langue (slug vide) : fr-home (/fr/), be-home (/nl/), es-home, it-home, pt-home,
 * at-home (/de/), hub (/en/).
 */
import type { PageMeta } from '../lib/types';

export const META: PageMeta[] = [
  { id: 'hub', pays: 'eu', order: 0, tool: 'hub', related: ['fr-home', 'be-home', 'es-home', 'it-home', 'pt-home', 'at-home'], sources: ['inseeIrl', 'statbelSanteEn', 'ineIpc', 'istatFoi', 'drCoef2027', 'risMieWeG', 'statistikVpi'] },
  // France
  { id: 'fr-home', pays: 'fr', order: 1, tool: 'fr-irl', related: ['fr-irl', 'fr-augm', 'fr-ilc', 'be-home'], sources: ['inseeIrl', 'spIrl', 'loi1989', 'inseeIrlCorse', 'inseeIrlDom', 'inseeLicence'] },
  { id: 'fr-irl', pays: 'fr', order: 2, tool: 'fr-irl', related: ['fr-irl-2026', 'fr-irl-t3', 'fr-home'], sources: ['inseeIrl', 'inseeIrlCorse', 'inseeIrlDom', 'spIrl'] },
  { id: 'fr-irl-2026', pays: 'fr', order: 3, tool: 'fr-irl', toolProps: { mode: 'anniversaire' }, related: ['fr-irl', 'fr-irl-t3', 'fr-augm'], sources: ['inseeIrl', 'spIrl', 'loi1989'] },
  { id: 'fr-irl-t3', pays: 'fr', order: 4, tool: 'fr-irl', toolProps: { trimestre: '2026-Q3' }, related: ['fr-irl-2026', 'fr-irl', 'fr-home'], sources: ['inseeIrl', 'spIrl'] },
  { id: 'fr-augm', pays: 'fr', order: 5, tool: 'fr-irl', toolProps: { mode: 'anniversaire' }, related: ['fr-home', 'fr-irl-2026', 'fr-pension'], sources: ['spIrl', 'loi1989', 'inseeIrl'] },
  { id: 'fr-ilc', pays: 'fr', order: 6, tool: 'fr-somme', toolProps: { serie: 'ilc' }, related: ['fr-ilat', 'fr-irl', 'fr-home'], sources: ['inseeIlc', 'inseeIrl'] },
  { id: 'fr-ilat', pays: 'fr', order: 7, tool: 'fr-somme', toolProps: { serie: 'ilat' }, related: ['fr-ilc', 'fr-home', 'fr-irl'], sources: ['inseeIlat', 'inseeIlc'] },
  { id: 'fr-pension', pays: 'fr', order: 8, tool: 'fr-somme', toolProps: { serie: 'ipc' }, related: ['fr-augm', 'it-assegno', 'fr-home'], sources: ['spPension', 'inseePension', 'inseeIpc'] },
  // Belgique
  { id: 'be-home', pays: 'be', order: 10, tool: 'be', toolProps: { region: 'bruxelles' }, related: ['be-sante', 'be-bxl', 'be-wal', 'be-vl'], sources: ['statbelSante', 'statbelSanteNl', 'bxlCorrection', 'walIndexer', 'vlCorrectie'] },
  { id: 'be-sante', pays: 'be', order: 11, tool: 'be-indice', related: ['be-home', 'be-bxl', 'be-vl'], sources: ['statbelSante', 'statbelSanteNl'] },
  { id: 'be-bxl', pays: 'be', order: 12, tool: 'be', toolProps: { region: 'bruxelles' }, related: ['be-home', 'be-wal', 'be-sante'], sources: ['bxlCorrection', 'statbelSante'] },
  { id: 'be-wal', pays: 'be', order: 13, tool: 'be', toolProps: { region: 'wallonie' }, related: ['be-home', 'be-bxl', 'be-sante'], sources: ['walIndexer', 'statbelSante'] },
  { id: 'be-vl', pays: 'be', order: 14, tool: 'be', toolProps: { region: 'flandre' }, related: ['be-home', 'be-sante', 'be-bxl'], sources: ['vlCorrectie', 'statbelSanteNl'] },
  // España
  { id: 'es-home', pays: 'es', order: 20, tool: 'es', related: ['es-irav', 'es-ipc26', 'es-subida', 'es-limite'], sources: ['boeLau', 'boeRdl29', 'ineIpc', 'ineIrav'] },
  { id: 'es-irav', pays: 'es', order: 21, tool: 'es', toolProps: { pacto: 1 }, related: ['es-home', 'es-limite', 'es-subida'], sources: ['ineIrav', 'boeLau'] },
  { id: 'es-ipc26', pays: 'es', order: 22, tool: 'es', toolProps: { pacto: 0 }, related: ['es-subida', 'es-home', 'es-irav'], sources: ['ineIpc', 'boeLau'] },
  { id: 'es-subida', pays: 'es', order: 23, tool: 'es', toolProps: { vista: 'comparador' }, related: ['es-ipc26', 'es-limite', 'es-home'], sources: ['ineIpc', 'ineIrav', 'boeRdl29'] },
  { id: 'es-limite', pays: 'es', order: 24, tool: 'es', toolProps: { pacto: 1 }, related: ['es-irav', 'es-subida', 'es-home'], sources: ['boeRdl29', 'boeLau'] },
  // Italia
  { id: 'it-home', pays: 'it', order: 30, tool: 'it', toolProps: { modo: 'rivaluta' }, related: ['it-affitto', 'it-foi', 'it-rival', 'it-assegno'], sources: ['istatFoi', 'istatRivaluta', 'l392', 'l431', 'dlgs23'] },
  { id: 'it-affitto', pays: 'it', order: 31, tool: 'it', toolProps: { modo: 'affitto' }, related: ['it-home', 'it-foi', 'it-rival'], sources: ['l392', 'dlgs23', 'istatFoi'] },
  { id: 'it-foi', pays: 'it', order: 32, tool: 'it', toolProps: { modo: 'affitto' }, related: ['it-affitto', 'it-home', 'it-rival'], sources: ['istatFoi', 'istatRivaluta'] },
  { id: 'it-rival', pays: 'it', order: 33, tool: 'it', toolProps: { modo: 'rivaluta' }, related: ['it-home', 'it-assegno', 'it-foi'], sources: ['istatFoi', 'istatRivaluta'] },
  { id: 'it-assegno', pays: 'it', order: 34, tool: 'it', toolProps: { modo: 'assegno' }, related: ['it-rival', 'it-home', 'fr-pension'], sources: ['istatFoi', 'istatRivaluta'] },
  // Portugal
  { id: 'pt-home', pays: 'pt', order: 40, tool: 'pt', toolProps: { ano: 2027 }, related: ['pt-2026', 'es-home', 'hub'], sources: ['drCoef2027', 'drCoef2026', 'drCoef2025', 'drCoef2024', 'drLei19', 'inePt'] },
  { id: 'pt-2026', pays: 'pt', order: 41, tool: 'pt', toolProps: { ano: 2026 }, related: ['pt-home', 'es-home', 'hub'], sources: ['drCoef2026', 'drCoef2025'] },
  // Österreich
  { id: 'at-home', pays: 'at', order: 50, tool: 'at', toolProps: { modo: 'mieweg' }, related: ['at-vpi', 'hub', 'it-home'], sources: ['risMieWeG', 'risMrg', 'statistikVpi'] },
  { id: 'at-vpi', pays: 'at', order: 51, tool: 'at', toolProps: { modo: 'wert' }, related: ['at-home', 'hub', 'it-rival'], sources: ['statistikVpi', 'risMieWeG'] },
];
