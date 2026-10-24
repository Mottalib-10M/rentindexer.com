import type { PageText, Helpers } from '../../lib/types';

/** IPC del alquiler en 2026 : qué índice toca según el mes del aniversario (« ipc alquiler 2026 », « actualización alquiler 2026 »). */
const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
const ref = (m: number) => (m <= 2 ? ym(2025, m + 10) : ym(2026, m - 2));
const pct = (h: Helpers, m: number, firma: string) => {
  const r = ref(m);
  if (h.D.IPC_ES[r] === undefined || h.D.IRAV_ES[r] === undefined) return null;
  return h.E.actualizarEs({ renta: 1000, fechaContrato: firma, fechaActualizacion: `${ym(2026, m)}-01`, ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: r, pacto: 'ipc', rdl29Vigente: true }).taux;
};

const t: PageText = {
  slug: 'ipc-alquiler',
  nav: 'IPC del alquiler en 2026',
  card: 'Para cada mes de 2026, el IPC que corresponde al aniversario del contrato y la subida máxima que resulta.',
  title: 'IPC alquiler 2026: el dato que toca según el aniversario',
  description: 'IPC alquiler 2026 mes a mes: el dato del INE que corresponde a cada aniversario, la subida con IPC o IRAV y el tope del 2 % desde el 8 de octubre de 2026.',
  h1: 'IPC del alquiler en 2026: qué dato corresponde a cada mes',
  intro: 'Elige el mes en que tu contrato cumple años en 2026: la calculadora busca el último IPC publicado ese día y aplica los topes.',
  resume: (h) => {
    const d = h.D.dernierEs();
    return `En 2026 el IPC que sirve para actualizar un alquiler no es el del mes del aniversario, sino el último publicado en esa fecha. Como el INE da a conocer cada mes hacia la mitad del mes siguiente, una actualización el día 1 usa el dato de dos meses antes: enero de 2026 tomó el IPC de noviembre de 2025 (${h.pc(h.D.IPC_ES['2025-11'], 1)}), marzo el de enero (${h.pc(h.D.IPC_ES['2026-01'], 1)}), septiembre el de julio (${h.pc(h.D.IPC_ES['2026-07'], 1)}) y noviembre el de septiembre (${h.pc(h.D.IPC_ES['2026-09'], 1)}). El último dato publicado es el de ${h.mois(d.p)}. El año tiene dos tramos. Hasta el 7 de octubre solo había dos límites: el índice del contrato y, para los firmados desde el 26 de mayo de 2023, el IRAV. Desde el 8 de octubre de 2026 rige además el Real Decreto-ley 29/2026: sin nuevo pacto, ninguna anualidad sube más del 2 %, y no sube nada si la renta supera el índice de precios de referencia. Un aniversario el 1 de octubre quedó, por una semana, fuera del tope.`;
  },
  faqs: (h) => [
    { q: 'Mi contrato cumple años el 15 de octubre de 2026: ¿se aplica ya el tope del 2 %?', a: 'Sí. El Real Decreto-ley 29/2026 entró en vigor el 8 de octubre de 2026 y su limitación alcanza a las anualidades que se cumplen desde ese día hasta el 31 de diciembre de 2027. Un aniversario el 15 de octubre cae dentro: sin nuevo acuerdo con el inquilino, la subida no puede pasar del 2 %, aunque el IPC de referencia sea más alto.' },
    { q: 'Si no actualicé la renta en marzo de 2026, ¿puedo hacerlo ahora con el IPC de marzo?', a: 'La ley sitúa la actualización en la fecha en que se cumple cada año del contrato y hace exigible la nueva renta desde el mes siguiente a la notificación por escrito. Notificar en noviembre una actualización de marzo no permite cobrar los meses pasados. Qué índice usar en ese caso puede discutirse; ante la duda, lo prudente es consultar a un profesional antes de reclamar.' },
    { q: `¿Cuándo se sabrá el IPC de diciembre de 2026?`, a: 'El INE publica el dato de cada mes hacia mediados del mes siguiente, así que el IPC y el IRAV de diciembre de 2026 se conocerán a mediados de enero de 2027. Servirán para los contratos que cumplan años el 1 de febrero de 2027 aproximadamente. Mientras tanto, la calculadora indica que el dato está pendiente en lugar de estimarlo.' },
  ],
  body: (h) => {
    const filas = Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
      const r = ref(m);
      const a = pct(h, m, '2021-06-01'), b = pct(h, m, '2024-06-01');
      return [h.mois(ym(2026, m)), h.mois(r), h.D.IPC_ES[r] !== undefined ? h.pc(h.D.IPC_ES[r], 1) : 'pendiente', h.D.IRAV_ES[r] !== undefined ? h.pc(h.D.IRAV_ES[r]) : 'pendiente', a !== null ? h.pc(a) : 'pendiente', b !== null ? h.pc(b) : 'pendiente'];
    });
    const nov = pct(h, 11, '2021-06-01');
    return `<h2>Los doce aniversarios de 2026</h2>
${h.table(['Aniversario el día 1', 'Mes de referencia', 'IPC', 'IRAV', 'Subida, contrato de 2021 con IPC', 'Subida, contrato de 2024 con IPC'], filas, 'Datos del INE consultados el 24 de octubre de 2026. Subida sin nuevo pacto y con una renta que no supera el índice de referencia. «Pendiente»: dato aún no publicado.', ['l', 'l', 'r', 'r', 'r', 'r'])}
<p>La penúltima columna corresponde a un contrato firmado antes del 26 de mayo de 2023 con cláusula de IPC: hasta octubre sube con el IPC entero; desde noviembre la frena el decreto-ley${nov !== null ? ` (${h.pc(nov)} en noviembre)` : ''}. La última columna es un contrato posterior a esa fecha: el IRAV lo limita todo el año, y el 2 % se suma desde el 8 de octubre.</p>
<h2>Cuándo el aniversario no cae el día 1</h2>
<p>La tabla supone que la actualización se hace el primer día del mes. Si tu contrato cumple años, por ejemplo, el 20 de mayo, el último IPC publicado ese día puede ser ya el de abril, y no el de marzo: el INE lo publica hacia mediados de mes. El ${h.src('boeLau', 'artículo 18 de la Ley de Arrendamientos Urbanos')} manda tomar el último índice publicado en la fecha de actualización, así que en ese caso conviene comprobar la fecha exacta de publicación en la ${h.src('ineIpc', 'página de últimos datos del INE')}.</p>
<h2>Y a partir de enero de 2027</h2>
<p>El tope del 2 % sigue durante todo 2027, hasta el 31 de diciembre, siempre que el Congreso convalide el decreto-ley. El detalle de esa limitación está en ${h.a('es-limite', 'el límite de subida del alquiler')}; los valores del índice propio de la vivienda, en ${h.a('es-irav', 'la serie del IRAV')}.</p>`;
  },
};
export default t;
