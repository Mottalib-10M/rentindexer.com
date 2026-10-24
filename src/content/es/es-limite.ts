import type { PageText } from '../../lib/types';

/** Topes de la subida : IRAV, Real Decreto-ley 29/2026, 2 % hasta el 31/12/2027 (« límite subida alquiler »). */
const t: PageText = {
  slug: 'limite-subida-alquiler',
  nav: 'Límite de subida del alquiler',
  card: 'Los topes legales a la actualización de la renta: el IRAV, la congelación por encima del índice de referencia y el 2 % hasta 2027.',
  title: 'Límite subida alquiler hasta 2027: 2 %, IRAV y congelación',
  description: 'Límite de subida del alquiler: el tope del IRAV, la congelación de rentas por encima del índice de referencia y el 2 % del RDL 29/2026 hasta finales de 2027.',
  h1: 'Límite de subida del alquiler: los topes que rigen hasta 2027',
  intro: 'Marca si tu renta supera el índice de precios de referencia: la calculadora aplica el tope que corresponde a tu aniversario.',
  resume: (h) => {
    const d = h.D.dernierEs();
    return `La subida anual de un alquiler de vivienda tiene hoy tres límites que se aplican uno detrás de otro. El primero es permanente: en los contratos firmados desde el 26 de mayo de 2023, la actualización no puede superar la variación del IRAV del mes de referencia (${h.pc(d.irav!)} en ${h.mois(d.p)}), dice el artículo 18 de la Ley de Arrendamientos Urbanos. Los otros dos son temporales y vienen de la disposición final sexta del Real Decreto-ley 29/2026, publicado en el BOE el 7 de octubre de 2026 y en vigor desde el día 8. Para las anualidades que se cumplan entre esa fecha y el 31 de diciembre de 2027, si la renta es superior al límite máximo que resulta del sistema estatal de índices de precios de referencia, no procede ningún incremento. En los demás casos, la subida es la que pacten de nuevo arrendador e inquilino y, sin ese pacto, no puede superar el 2 %. El decreto-ley tiene que ser convalidado por el Congreso; a 24 de octubre de 2026 sigue vigente.`;
  },
  faqs: () => [
    { q: '¿Cómo sé si mi renta está por encima del índice de precios de referencia?', a: 'El decreto-ley compara la renta con el límite máximo del precio aplicable según el sistema estatal de índices de precios de referencia. Ese límite depende de la vivienda y de su ubicación, y hay que consultarlo en el sistema oficial con los datos del piso. La calculadora no hace esa comprobación: te pide que indiques si la renta del contrato supera ese límite o no.' },
    { q: '¿El nuevo pacto puede fijar una subida superior al 2 %?', a: 'El decreto-ley dice que, fuera del caso de congelación, la subida es la que resulte del nuevo pacto entre las partes, y que solo a falta de pacto el máximo es el 2 %. En un contrato firmado desde el 26 de mayo de 2023, ese pacto sigue sin poder superar el IRAV, que la ley fija como límite en todo caso. La calculadora aplica el 2 % salvo que indiques otra cifra pactada.' },
    { q: '¿Qué pasa con las subidas ya aplicadas si el decreto-ley no se convalida?', a: 'El texto no regula ese supuesto. Si el decreto-ley se deroga, las anualidades que se cumplan después vuelven a las reglas del artículo 18 de la ley: índice del contrato y, en los contratos recientes, tope del IRAV. Lo que ocurra con una anualidad cumplida mientras estuvo vigente dependerá de lo que se publique; ante un conflicto, conviene consultar a un profesional.' },
  ],
  body: (h) => {
    const fases = [
      ['Hasta el 7 de octubre de 2026', 'Índice del contrato; IRAV como tope si el contrato es desde el 26/5/2023'],
      ['Del 8 de octubre de 2026 al 31 de diciembre de 2027', 'Además: sin subida si la renta supera el índice de referencia; si no, nuevo pacto o un 2 % como máximo'],
      ['Desde el 1 de enero de 2028', 'Vuelven solo las reglas del artículo 18 (índice del contrato e IRAV), salvo norma nueva'],
    ];
    const ex = h.E.actualizarEs({ renta: 1250, fechaContrato: '2023-11-01', fechaActualizacion: '2026-11-01', ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: '2026-09', pacto: 'ipc', rdl29Vigente: true });
    const ex2 = h.E.actualizarEs({ renta: 1250, fechaContrato: '2023-11-01', fechaActualizacion: '2026-11-01', ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: '2026-09', pacto: 'ipc', rdl29Vigente: true, rentaSobreIndiceReferencia: true });
    return `<h2>Tres periodos, tres juegos de reglas</h2>
${h.table(['Fecha del aniversario', 'Límite de la subida'], fases, `Fuentes: ${h.src('boeLau', 'Ley 29/1994, art. 18')} y ${h.src('boeRdl29', 'Real Decreto-ley 29/2026, disposición final sexta')}.`, ['l', 'l'])}
<h2>Un mismo piso, dos resultados</h2>
<p>Un contrato firmado en noviembre de 2023, con cláusula de IPC y 1.250 € de renta, cumple años el 1 de noviembre de 2026. El IPC de referencia (septiembre) es del ${h.pc(h.D.IPC_ES['2026-09'], 1)} y el IRAV del ${h.pc(h.D.IRAV_ES['2026-09'])}. Si la renta respeta el índice de referencia de la zona y no hay nuevo pacto, la subida se queda en ${h.pc(ex.taux)}: ${h.eur(ex.nouveauLoyer)} al mes. Si la renta está por encima de ese índice, se queda en ${h.eur(ex2.nouveauLoyer)}: ninguna subida este año y, si la renta sigue por encima, tampoco en el aniversario de noviembre de 2027.</p>
<h2>A quién no se aplica</h2>
<p>La limitación extraordinaria alcanza a los contratos de alquiler de vivienda sujetos a la Ley de Arrendamientos Urbanos. No afecta a los locales, oficinas y demás arrendamientos para uso distinto del de vivienda, que siguen lo pactado. Tampoco convierte en obligatoria una subida del 2 %: es un máximo. Y no crea una actualización donde el contrato no la preveía: sin cláusula, la renta sigue igual.</p>
<h2>El estado del decreto-ley</h2>
<p>El texto consolidado del BOE indica como última actualización la publicada el 7 de octubre de 2026, sin derogación a 24 de octubre. El Gobierno lo ha remitido al Congreso para su convalidación. Un decreto-ley anterior con la misma medida, el 26/2026, de 29 de septiembre, fue derogado el 2 de octubre. La calculadora aplica el 2 % mientras el 29/2026 siga vigente; si cambia, se actualizará con la fecha del BOE. Para el cálculo general, vuelve a ${h.a('es-home', 'la actualización de la renta por IPC o IRAV')}; para los valores del índice, a ${h.a('es-irav', 'la serie del IRAV')}.</p>`;
  },
};
export default t;
