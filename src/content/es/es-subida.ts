import type { PageText } from '../../lib/types';

/** Comparador : la misma renta con IPC, IRAV y 2 % (« subida alquiler ipc », « cuánto sube el alquiler »). */
const t: PageText = {
  slug: 'subida-alquiler-ipc',
  nav: 'Subida del alquiler: IPC, IRAV o 2 %',
  card: 'La misma renta con el IPC, con el IRAV y con el tope del 2 %, y cuál de las tres se aplica a tu contrato.',
  title: 'Subida alquiler IPC, IRAV o 2 %: cuánto sube tu renta',
  description: 'Subida del alquiler con IPC, con IRAV o con el tope del 2 %: las tres cifras para la misma renta, en euros al mes y al año, y cuál corresponde a tu contrato.',
  h1: 'Subida del alquiler: IPC, IRAV o 2 %, las tres cifras lado a lado',
  intro: 'Introduce tu renta y la fecha de firma: verás la subida con cada índice y, en la última línea, la que realmente se aplica.',
  resume: (h) => {
    const d = h.D.dernierEs();
    const r = (p: number) => Math.round(1000 * p) / 100;
    const orden = d.ipc > d.irav! && d.irav! > 2 ? 'el IPC da la subida más alta, el IRAV la intermedia y el 2 % la más baja' : 'el orden entre los tres porcentajes cambia según el mes';
    return `Para una misma renta, la subida anual puede tomar hoy tres valores. Con el último dato del INE, el de ${h.mois(d.p)}, una renta de 1.000 € al mes sube ${h.eur(r(d.ipc))} con el IPC general (${h.pc(d.ipc, 1)}), ${h.eur(r(d.irav!))} con el IRAV (${h.pc(d.irav!)}) y 20 € con el tope del 2 %; en este mes ${orden}. Cuál de los tres te corresponde depende de dos fechas. La de firma decide si el IRAV hace de tope: lo hace en los contratos firmados desde el 26 de mayo de 2023. La del aniversario decide si se aplica el Real Decreto-ley 29/2026: entre el 8 de octubre de 2026 y el 31 de diciembre de 2027, a falta de nuevo pacto, nadie sube más del 2 %, y una renta por encima del índice de precios de referencia no sube nada. Fuera de ese periodo, el contrato antiguo con IPC sube el IPC entero.`;
  },
  faqs: (h) => {
    const d = h.D.dernierEs();
    return [
      { q: '¿Cuánto supone al año la diferencia entre subir con el IPC y subir un 2 %?', a: `Con el IPC de ${h.mois(d.p)} (${h.pc(d.ipc, 1)}), una renta de 1.000 € al mes subiría ${h.eur(Math.round(120 * (d.ipc - 2)) / 10)} más al año que con el tope del 2 %. La cifra crece en proporción a la renta: el doble para 2.000 €. La calculadora muestra para tu renta la subida mensual y su equivalente anual, que es lo que conviene poner en la comunicación al inquilino.` },
      { q: '¿Puede el propietario elegir el índice que más le conviene?', a: 'No. El índice es el que fija el contrato; si el contrato prevé actualizar sin nombrar índice, la ley impone el IRAV. El propietario tampoco puede pasar a usar el IPC porque suba más. Lo que las partes sí pueden hacer, durante el periodo del Real Decreto-ley 29/2026, es acordar de nuevo la subida, y en un contrato posterior a mayo de 2023 ese acuerdo sigue limitado por el IRAV.' },
      { q: '¿Y si el IPC queda por debajo del 2 %?', a: 'Entonces el tope del 2 % no cambia nada: se aplica el índice del contrato, porque el decreto-ley fija un máximo, no una subida obligatoria. Un contrato con cláusula de IPC que se actualiza con un IPC del 1,5 % sube el 1,5 %. El 2 % solo pesa cuando el índice pactado, o el IRAV en los contratos recientes, lo supera.' },
    ];
  },
  body: (h) => {
    const d = h.D.dernierEs();
    const casos = [
      ['Firmado antes del 26/5/2023, cláusula de IPC', 'IPC del mes de referencia', 'Lo menor entre el IPC y el 2 %'],
      ['Firmado desde el 26/5/2023, cláusula de IPC', 'Lo menor entre IPC e IRAV', 'Lo menor entre IPC, IRAV y 2 %'],
      ['Cláusula sin índice', 'IRAV', 'Lo menor entre IRAV y 2 %'],
      ['Sin cláusula de actualización', 'Sin subida', 'Sin subida'],
      ['Renta por encima del índice de referencia', 'Según el contrato', 'Sin subida'],
    ];
    const rentas = [600, 900, 1200, 1800].map((r) => [h.eur(r, 0), h.eur(Math.round(r * d.ipc) / 100), h.eur(Math.round(r * d.irav!) / 100), h.eur(Math.round(r * 2) / 100)]);
    return `<h2>Qué cifra se aplica a cada contrato</h2>
${h.table(['Contrato de vivienda', 'Aniversario hasta el 7/10/2026', 'Aniversario del 8/10/2026 al 31/12/2027'], casos, 'Reglas del artículo 18 de la Ley de Arrendamientos Urbanos y de la disposición final sexta del Real Decreto-ley 29/2026, sin nuevo pacto entre las partes.', ['l', 'l', 'l'])}
<h2>Subida mensual con los datos de ${h.mois(d.p)}</h2>
${h.table(['Renta actual', `Con IPC (${h.pc(d.ipc, 1)})`, `Con IRAV (${h.pc(d.irav!)})`, 'Con el 2 %'], rentas, `Subida en euros al mes, redondeada al céntimo. Índices: ${h.src('ineIpc', 'INE, IPC')} y ${h.src('ineIrav', 'INE, IRAV')}.`, ['r', 'r', 'r', 'r'])}
<p>El comparador de arriba repite esta cuenta con tu renta y con el mes de referencia que corresponde a tu aniversario, que no siempre es el último publicado: un contrato que cumple años el 1 de diciembre usará el dato de octubre, aún pendiente a finales de octubre de 2026.</p>
<h2>Un tope que puede desaparecer</h2>
<p>El 2 % procede del ${h.src('boeRdl29', 'Real Decreto-ley 29/2026')}, en vigor desde el 8 de octubre de 2026 y pendiente de convalidación en el Congreso. Si no se convalidara, la tercera columna dejaría de aplicarse y volverían a regir solo el índice del contrato y el IRAV. Los detalles, en ${h.a('es-limite', 'el límite de subida del alquiler')}; el calendario de 2026, en ${h.a('es-ipc26', 'el IPC del alquiler mes a mes')}.</p>`;
  },
};
export default t;
