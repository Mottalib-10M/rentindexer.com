import { describe, expect, it } from 'vitest';
import regles from '../data/params-regles-2026.json';
import fr from '../data/fr-indices.json';
import be from '../data/be-indice-sante.json';
import es from '../data/es-indices.json';
import at from '../data/at-vpi.json';
import pt from '../data/pt-coeficientes.json';
import {
  reviserFr, indexerFlandre, indexerBruxelles, anniversairesCorrectionBxl, actualizarEs, aggiornaIt,
  atualizarPt, mieWegProzent, valorisierenAt, moisPrecedent, trimestreN1,
} from '../src/lib/engine/indexation';

const serie = (obs: { p: string; v: number }[]) => Object.fromEntries(obs.map((o) => [o.p, o.v]));

describe('France — IRL', () => {
  const irl = serie(fr.irl.obs);
  it('valeurs publiées (service-public F13723, vérifié le 15/10/2026)', () => {
    expect(irl['2026-Q3']).toBe(148.06);
    expect(irl['2026-Q2']).toBe(148.37);
    expect(irl['2025-Q2']).toBe(146.68);
    expect(serie(fr.irl_corse.obs)['2026-Q3']).toBe(143.8);
    expect(serie(fr.irl_dom.obs)['2026-Q3']).toBe(145.21);
  });
  it('exemple officiel : 600 € × 148,37 / 146,68 = 606,91 €', () => {
    const r = reviserFr({ loyer: 600, trimestre: '2026-Q2', irl, zone: 'metropole', dateBail: '2021-07-01' });
    expect(r.nouveauLoyer).toBe(606.91);
  });
  it('gel des logements F et G (bail depuis le 24/08/2022)', () => {
    const r = reviserFr({ loyer: 800, trimestre: '2026-Q3', irl, zone: 'metropole', dpe: 'G', dateBail: '2023-01-01' });
    expect(r.bloque).toBe(true);
    expect(r.nouveauLoyer).toBe(800);
  });
  it('trimestre N-1', () => expect(trimestreN1('2026-Q3')).toBe('2025-Q3'));
});

describe('Belgique — indice santé', () => {
  const b13 = be.base2013 as Record<string, number>;
  it('indices recoupés avec be.STAT et les exemples officiels bruxellois', () => {
    expect(b13['2020-01']).toBe(109.72);
    expect(b13['2024-01']).toBe(130.19);
    expect(b13['2026-09']).toBe(140.67);
  });
  it('mois précédent', () => expect(moisPrecedent('2026-01-15')).toBe('2025-12'));
  it('Flandre : exemple officiel EPC D, anniversaire novembre = 692,02 €', () => {
    const r = indexerFlandre({ loyerBase: 600, indiceDepart: 108.98, nouvelIndice: 132.96, moisAnniversaire: '11', epc: 'D',
      entreeVigueur: '2019-11-01', facteurs: regles.be.flandre.correctiefactor.par_mois_anniversaire });
    expect(r.nouveauLoyer).toBe(692.02);
  });
  it('Bruxelles : exemple officiel PEB E, bail du 01/02/2020 = 1 141,19 €', () => {
    const [y1, y2] = anniversairesCorrectionBxl('2020-02-01');
    expect([y1, y2]).toEqual([2022, 2023]);
    const r = indexerBruxelles({ loyerBase: 1000, indiceDepart: b13['2020-01'], nouvelIndice: b13['2024-01'], peb: 'E',
      entreeVigueur: '2020-02-01', indicesCorrection: [b13['2022-01'], b13['2023-01']] });
    expect(r.nouveauLoyer).toBe(1141.19);
  });
});

describe('Espagne — IPC, IRAV et RDL 29/2026', () => {
  const ipc = serie(es.ipc_variacion_anual.obs); const irav = serie(es.irav_variacion_anual.obs);
  it('séries INE de septembre 2026', () => { expect(ipc['2026-09']).toBe(4.9); expect(irav['2026-09']).toBe(2.54); });
  it('contrat de 2024 indexé à l\'IPC : plafonné à l\'IRAV avant le 08/10/2026', () => {
    const r = actualizarEs({ renta: 1000, fechaContrato: '2024-03-01', fechaActualizacion: '2026-09-01', ipc, irav,
      mesReferencia: '2026-07', pacto: 'ipc', rdl29Vigente: true });
    expect(r.nouveauLoyer).toBe(1024.9);
    expect(r.plafond).toBe('es-tope-irav');
  });
  it('anniversaire de novembre 2026 sans nouveau pacte : 2 %', () => {
    const r = actualizarEs({ renta: 1000, fechaContrato: '2020-11-01', fechaActualizacion: '2026-11-01', ipc, irav,
      mesReferencia: '2026-09', pacto: 'ipc', rdl29Vigente: true });
    expect(r.nouveauLoyer).toBe(1020);
  });
  it('loyer au-dessus de l\'indice de référence : aucune hausse', () => {
    const r = actualizarEs({ renta: 1000, fechaContrato: '2020-11-01', fechaActualizacion: '2026-11-01', ipc, irav,
      mesReferencia: '2026-09', pacto: 'ipc', rentaSobreIndiceReferencia: true, rdl29Vigente: true });
    expect(r.bloque).toBe(true);
  });
});

describe('Italie, Portugal, Autriche', () => {
  it('ISTAT : 800 € × 4 % × 75 % = 824 € (commerciale)', () => {
    expect(aggiornaIt(800, 4, 'commerciale', 1).nouveauLoyer).toBe(824);
    expect(aggiornaIt(800, 4, 'cedolare').bloque).toBe(true);
  });
  it('Portugal 2027 : 750 € × 1,0256 = 769,20 €', () => {
    expect(atualizarPt(750, [pt.coeficientes['2027'].valor]).nouveauLoyer).toBe(769.2);
  });
  it('MieWeG : 2025 (VPI 2020 128,2 / 123,8) gedämpft, MRG-Deckel 1 %', () => {
    const p = mieWegProzent(at.vpi2020['2025'], at.vpi2020['2024'], { jahr: 2025, mrgBeschraenkt: false });
    expect(p).toBeCloseTo(3 + ((128.2 / 123.8 - 1) * 100 - 3) / 2, 10);
    expect(mieWegProzent(at.vpi2020['2025'], at.vpi2020['2024'], { jahr: 2025, mrgBeschraenkt: true })).toBe(1);
    expect(valorisierenAt(700, 1).nouveauLoyer).toBe(707);
  });
});

import { rivalutaIt, centimoSuperior, anosCoeficientesPt, indexerWallonie, anniversaire2223, wertsichernAt, indexerSomme } from '../src/lib/engine/indexation';
import { foi, raccordiTra, COEF_PT, vpi, verkettungZwischen, trimestreParuLe, valeurFr, indiceSante } from '../src/lib/engine/donnees';

describe('Phase 2 — nouvelles règles', () => {
  it('Istat, esempio 1 e 3 : gennaio 2009 → gennaio 2026 = +33,6 %, coefficiente 1,336', () => {
    expect(foi('2009-01')?.indice).toBe(134.2);
    expect(foi('2026-01')?.indice).toBe(100.4);
    const r = rivalutaIt(1000, foi('2009-01')!.indice, foi('2026-01')!.indice, raccordiTra('2009-01', '2026-01'));
    expect(raccordiTra('2009-01', '2026-01')).toEqual([1.373, 1.071, 1.214]);
    expect(r.variazione).toBe(33.6);
    expect(r.coefficiente).toBe(1.336);
    expect(r.rivalutato).toBe(1336);
  });
  it('Portugal : coefficients relus au Diário da República', () => {
    expect(COEF_PT['2027'].valor).toBe(1.0256);
    expect(COEF_PT['2026'].valor).toBe(1.0224);
    expect(COEF_PT['2025'].valor).toBe(1.0216);
    expect(COEF_PT['2024'].valor).toBe(1.0694);
    expect(COEF_PT['2023'].valor).toBe(1.02);
  });
  it('Portugal : arrondi au cent supérieur (NRAU art. 25.º) et rattrapage de trois coefficients', () => {
    expect(centimoSuperior(340.7965)).toBe(340.8);
    expect(centimoSuperior(820.48)).toBe(820.48);
    expect(atualizarPt(800, [COEF_PT['2027'].valor]).nouveauLoyer).toBe(820.48);
    expect(anosCoeficientesPt(2026, 2023)).toEqual([2024, 2025, 2026]);
    expect(anosCoeficientesPt(2027, 2026)).toEqual([2027]);
    expect(anosCoeficientesPt(2027, 2020)).toEqual([2025, 2026, 2027]);
    expect(anosCoeficientesPt(2026, 2026)).toEqual([]);
    const k = [2024, 2025, 2026].reduce((a, y) => a * COEF_PT[String(y)].valor, 1);
    expect(k).toBeGreaterThan(1.11); // DECO : « mais de 11 % » en rattrapant 2024 à 2026
  });
  it('Wallonie : loyer adapté 2022-2023 puis indexation sur cette base', () => {
    const ev = '2019-03-01';
    expect(anniversaire2223(ev)).toBe('2023-03-01');
    const dep = indiceSante('2019-02')!, a = indiceSante('2023-02')!, b = indiceSante('2022-02')!, n = indiceSante('2026-02')!;
    const parts = { A: 1, B: 1, C: 1, D: 0.75, E: 0.5, F: 0, G: 0, sans: 0 };
    const pleine = indexerWallonie({ loyerBase: 700, indiceDepart: dep, nouvelIndice: n, peb: 'C', entreeVigueur: ev }, parts);
    const d = indexerWallonie({ loyerBase: 700, indiceDepart: dep, nouvelIndice: n, peb: 'D', entreeVigueur: ev, indiceAnniv2223: a, indiceAnnivPrecedent: b }, parts);
    const g = indexerWallonie({ loyerBase: 700, indiceDepart: dep, nouvelIndice: n, peb: 'G', entreeVigueur: ev, indiceAnniv2223: a, indiceAnnivPrecedent: b }, parts);
    expect(pleine.nouveauLoyer).toBeCloseTo((700 * n) / dep, 2);
    expect(g.nouveauLoyer).toBeCloseTo(((700 * b) / dep) * n / a, 2);
    expect(d.nouveauLoyer).toBeGreaterThan(g.nouveauLoyer);
    expect(d.nouveauLoyer).toBeLessThan(pleine.nouveauLoyer);
  });
  it('Autriche : Verkettung VPI 2015 → 2020 → 2025', () => {
    expect(vpi('2018-05')?.basis).toBe(2015);
    expect(verkettungZwischen('2018-05', '2026-09')).toHaveLength(2);
    const w = wertsichernAt(1000, vpi('2018-05')!.wert, vpi('2026-09')!.wert, verkettungZwischen('2018-05', '2026-09'));
    expect(w.faktor).toBeCloseTo((vpi('2026-09')!.wert / vpi('2018-05')!.wert) * 1.082 * 1.282, 6);
  });
  it('France : trimestre paru au JO à une date, ILC', () => {
    expect(trimestreParuLe('irl', '2026-10-24')?.p).toBe('2026-Q3');
    expect(trimestreParuLe('irl', '2026-10-01')?.p).toBe('2026-Q2');
    expect(indexerSomme(2000, valeurFr('ilc', '2025-Q2')!, valeurFr('ilc', '2026-Q2')!).nouveauLoyer).toBeGreaterThan(2000);
  });
});
