import type { PageText } from '../../lib/types';

/** IRAV : serie mensual del índice y en qué contratos se aplica (« irav », « índice irav », « actualización renta irav »). */
const t: PageText = {
  slug: 'irav',
  nav: 'IRAV: valores y uso',
  card: 'Todos los valores del IRAV publicados por el INE desde su creación y los contratos de vivienda a los que se aplica.',
  title: 'IRAV: índice del INE para el alquiler, valores mes a mes',
  description: 'IRAV del último mes publicado por el INE, la serie desde su creación y los contratos a los que se aplica: cláusula sin índice y tope de los firmados desde 2023.',
  h1: 'IRAV: el índice del INE para actualizar los alquileres de vivienda',
  intro: 'La calculadora parte de una cláusula que remite al IRAV; cambia la opción si tu contrato nombra el IPC o no dice nada.',
  resume: (h) => {
    const s = h.D.serieIravEs();
    const u = s[s.length - 1];
    const min = s.reduce((a, o) => (o.v < a.v ? o : a)), max = s.reduce((a, o) => (o.v > a.v ? o : a));
    return `El Índice de Referencia para la Actualización Anual de los Contratos de Arrendamiento de Vivienda, el IRAV, es un índice que elabora el INE solo para los alquileres de vivienda. Su último valor publicado, el de ${h.mois(u.p)}, es una variación anual del ${h.pc(u.v)}, frente a un IPC general del ${h.pc(h.D.IPC_ES[u.p], 1)} el mismo mes. La serie empieza en ${h.mois(s[0].p)} con un ${h.pc(s[0].v)} y, desde entonces, se ha movido entre el ${h.pc(min.v)} de ${h.mois(min.p)} y el ${h.pc(max.v)} de ${h.mois(max.p)}: mucho menos que el IPC. El IRAV interviene de dos maneras según el artículo 18 de la Ley de Arrendamientos Urbanos. Primero, cuando el contrato prevé una actualización pero no dice con qué índice, la renta se actualiza con el IRAV. Segundo, en los contratos firmados desde el 26 de mayo de 2023, sea cual sea el índice pactado, la subida no puede superar el IRAV del mes de referencia, que es el último publicado en la fecha de actualización.`;
  },
  faqs: (h) => {
    const s = h.D.serieIravEs();
    const u = s[s.length - 1];
    return [
      { q: '¿En qué se diferencia el IRAV del IPC general?', a: `Son dos índices distintos del INE. El IPC mide la evolución del conjunto de los precios de consumo; el IRAV es un índice creado solo para actualizar los contratos de vivienda. Desde su creación ha variado bastante menos: en ${h.mois(u.p)} el IPC general sube un ${h.pc(h.D.IPC_ES[u.p], 1)} y el IRAV un ${h.pc(u.v)}. Su método de cálculo está en la nota metodológica del INE, enlazada al pie.` },
      { q: '¿Se aplica el IRAV a un contrato firmado en 2021 con cláusula de IPC?', a: 'No como índice ni como tope. Un contrato firmado antes del 26 de mayo de 2023 conserva el índice pactado, normalmente el IPC general. Solo si su cláusula no nombra ningún índice se actualiza con el IRAV. Eso sí, para anualidades entre el 8 de octubre de 2026 y el 31 de diciembre de 2027 el Real Decreto-ley 29/2026 lo limita igualmente al 2 % salvo nuevo pacto.' },
      { q: '¿El IRAV se publica con la misma fecha que el IPC?', a: `Sí, el INE lo difunde en las mismas fechas que el IPC, hacia mediados del mes siguiente al mes medido. El valor de ${h.mois(u.p)} ya está publicado; el del mes siguiente aún no. El IRAV tiene dos decimales, el IPC uno, y la calculadora usa siempre el mes de referencia que corresponde a la fecha del aniversario del contrato.` },
    ];
  },
  body: (h) => {
    const s = h.D.serieIravEs();
    const filas = [...s].reverse().map((o) => [h.mois(o.p), h.pc(o.v), h.pc(h.D.IPC_ES[o.p], 1)]);
    const u = s[s.length - 1];
    const sub = (p: number) => Math.round(1000 * p) / 100;
    return `<h2>Todos los valores del IRAV publicados</h2>
${h.table(['Mes', 'IRAV', 'IPC general'], filas, 'Fuente: INE, serie IRAV1 (total nacional, variación anual) y serie IPC290750. Consultadas el 24 de octubre de 2026.', ['l', 'r', 'r'])}
<h2>Qué cambia el IRAV en una renta de 1.000 €</h2>
<p>Con el último dato, una renta de 1.000 € al mes que se actualizara con el IRAV de ${h.mois(u.p)} subiría ${h.eur(sub(u.v))} al mes; con el IPC del mismo mes, ${h.eur(sub(h.D.IPC_ES[u.p]))}. La diferencia, multiplicada por doce, es lo que separa a un contrato firmado antes de mayo de 2023 de uno posterior con la misma cláusula de IPC. Para ver los tres porcentajes a la vez con tu renta, usa ${h.a('es-subida', 'el comparador de subida del alquiler')}.</p>
<h2>El IRAV y el tope del 2 %</h2>
<p>El IRAV no deja de aplicarse con el ${h.src('boeRdl29', 'Real Decreto-ley 29/2026')}: los dos topes se suman. En una anualidad que se cumple entre el 8 de octubre de 2026 y el 31 de diciembre de 2027, la subida de un contrato posterior a mayo de 2023 es la más baja de las tres cifras: el índice pactado, el IRAV y el 2 % (o el nuevo pacto). Si la renta supera el índice de precios de referencia de la zona, no hay subida. Las condiciones completas están en ${h.a('es-limite', 'la página del límite de subida')}.</p>
<p>La regla del IRAV figura en el ${h.src('boeLau', 'artículo 18.1 de la Ley de Arrendamientos Urbanos')}. Para un calendario mes a mes de las actualizaciones de este año, consulta ${h.a('es-ipc26', 'el IPC del alquiler en 2026')}.</p>`;
  },
};
export default t;
