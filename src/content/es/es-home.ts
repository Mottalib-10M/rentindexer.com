import type { PageText, Helpers } from '../../lib/types';

/** Raíz /es/ : actualización de la renta por IPC o IRAV (« actualización renta ipc », « subida alquiler ipc », « calcular ipc alquiler »). */
const ym = (y: number, m: number) => `${y}-${String(m).padStart(2, '0')}`;
const masMeses = (p: string, n: number) => { const t = Number(p.slice(0, 4)) * 12 + Number(p.slice(5, 7)) - 1 + n; return ym(Math.floor(t / 12), (t % 12) + 1); };
const act = (h: Helpers, o: { renta: number; firma: string; fecha: string; ref: string; pacto: 'ipc' | 'irav' | 'sin-indice' | 'ninguno'; sobre?: boolean }) =>
  h.E.actualizarEs({ renta: o.renta, fechaContrato: o.firma, fechaActualizacion: o.fecha, ipc: h.D.IPC_ES, irav: h.D.IRAV_ES, mesReferencia: o.ref, pacto: o.pacto, rdl29Vigente: true, rentaSobreIndiceReferencia: o.sobre });

const t: PageText = {
  slug: '',
  nav: 'Actualización de la renta',
  card: 'Actualizar el alquiler con el IPC o el IRAV del INE según la fecha de firma, con el tope del 2 % del Real Decreto-ley 29/2026.',
  title: 'Actualización renta IPC 2026: IRAV, tope del 2 % y cálculo',
  description: 'Actualización de la renta por IPC o IRAV: el índice que toca según la fecha de firma, el mes de referencia, el tope del 2 % del RDL 29/2026 y la nueva renta.',
  h1: 'Actualización de la renta por IPC o IRAV: cuánto sube tu alquiler',
  intro: 'Indica la renta, el mes y el año de firma y lo que dice el contrato: la calculadora elige el índice del INE, aplica los topes y da la nueva renta.',
  resume: (h) => {
    const d = h.D.dernierEs();
    const sig = masMeses(d.p, 1);
    const tope = d.ipc > 2 ? 'por encima del 2 %, de modo que en la mayoría de las anualidades del periodo manda ese tope' : 'por debajo del 2 %, de modo que el tope no llega a aplicarse';
    return `El último dato publicado por el INE es el de ${h.mois(d.p)}: el IPC general sube un ${h.pc(d.ipc, 1)} en un año y el IRAV, el índice propio de los alquileres de vivienda, un ${h.pc(d.irav!)}. El de ${h.mois(sig)} se publicará hacia mediados de ${h.mois(masMeses(d.p, 2))}. La actualización de la renta solo es posible si el contrato la prevé: sin cláusula, la renta no cambia; con una cláusula que no nombra índice, se usa el IRAV; y en los contratos firmados desde el 26 de mayo de 2023 la subida nunca puede superar el IRAV, aunque se haya pactado el IPC. Además, el Real Decreto-ley 29/2026, en vigor desde el 8 de octubre de 2026, limita las anualidades que se cumplan hasta el 31 de diciembre de 2027: si la renta supera el índice de precios de referencia no hay subida, y en los demás casos, salvo nuevo acuerdo entre las partes, la subida no puede pasar del 2 %. Hoy el IPC está ${tope}. El decreto-ley aún debe ser convalidado por el Congreso. La cuenta es renta actual × (1 + variación anual / 100), redondeada al céntimo.`;
  },
  faqs: (h) => {
    const d = h.D.dernierEs();
    return [
      { q: '¿Quién puede pedir la actualización de la renta, el casero o también el inquilino?', a: 'El artículo 18 de la Ley de Arrendamientos Urbanos dice que la renta puede actualizarla el arrendador o el arrendatario en la fecha en que se cumple cada año de contrato. En la práctica la pide casi siempre el propietario, porque los índices suben; pero si el índice pactado bajara, la misma cláusula permitiría al inquilino reclamar la renta actualizada a la baja.' },
      { q: '¿Desde qué mes se paga la renta actualizada?', a: 'Según el artículo 18.2 de la ley, la renta actualizada se puede exigir desde el mes siguiente a aquel en que una parte lo notifica por escrito a la otra, indicando el porcentaje aplicado. Vale una nota en el recibo de la mensualidad anterior. Si el propietario avisa tarde, la subida no se cobra con efecto retroactivo desde el aniversario, sino desde el mes siguiente al aviso.' },
      { q: '¿Puede el inquilino exigir un certificado del INE con el índice aplicado?', a: 'Sí. La ley prevé que la notificación vaya acompañada, si el arrendatario lo exige, de la certificación del Instituto Nacional de Estadística correspondiente. El INE publica en su web el IPC y el IRAV de cada mes, y el inquilino puede comprobar el porcentaje por sí mismo con el mes de referencia que indica la calculadora de esta página.' },
      { q: '¿Se suma la subida de varios años si el casero no actualizó a tiempo?', a: 'El artículo 18 habla de actualizar en la fecha en que se cumple cada año de vigencia, y la renta actualizada solo es exigible desde el mes siguiente a la notificación. No hay en la ley una regla de recuperación de años pasados como la de otros países. Si el contrato dice algo distinto o hay discusión sobre atrasos, conviene consultar a un profesional antes de reclamar.' },
      { q: '¿Cuántos decimales se usan y cómo se redondea la nueva renta?', a: `El INE publica la variación anual del IPC con un decimal (${h.pc(d.ipc, 1)} en ${h.mois(d.p)}) y la del IRAV con dos (${h.pc(d.irav!)}). Ese porcentaje se aplica tal cual, sin redondearlo más. La ley no fija un redondeo para la renta resultante; la calculadora la redondea al céntimo más próximo, que es la práctica habitual en los recibos. Una diferencia de un céntimo no cambia nada en la práctica.` },
      { q: '¿Las comunidades autónomas tienen su propio índice para actualizar la renta?', a: 'No para la actualización anual: el IPC y el IRAV son índices nacionales del INE y se aplican igual en toda España. Lo que varía según el territorio es el sistema de índices de precios de referencia de las zonas declaradas tensionadas, que el Real Decreto-ley 29/2026 usa para decidir si una renta, por estar por encima de ese límite, no puede subir en absoluto.' },
      { q: '¿Cuenta el mes de firma o la fecha de entrada en el piso?', a: 'La ley habla de la fecha en que se cumple cada año de vigencia del contrato. Si el contrato fija una fecha de inicio distinta de la firma, esa fecha de vigencia es la que marca el aniversario. La calculadora pide el mes de firma porque suele coincidir; si en tu contrato no es así, introduce el mes en que empezó a correr el arrendamiento.' },
    ];
  },
  body: (h) => {
    const d = h.D.dernierEs();
    const meses = h.D.moisEs().slice(0, 12);
    const filas = meses.map((m) => [h.mois(m), h.pc(h.D.IPC_ES[m], 1), h.D.IRAV_ES[m] !== undefined ? h.pc(h.D.IRAV_ES[m]) : '–']);
    const e1 = act(h, { renta: 950, firma: '2021-11-01', fecha: '2026-11-01', ref: '2026-09', pacto: 'ipc' });
    const e2 = act(h, { renta: 800, firma: '2024-03-01', fecha: '2026-03-01', ref: '2026-01', pacto: 'ipc' });
    const e3 = act(h, { renta: 950, firma: '2022-09-01', fecha: '2026-09-01', ref: '2026-07', pacto: 'ipc' });
    const e4 = h.D.IRAV_ES['2026-10'] !== undefined ? act(h, { renta: 1100, firma: '2024-12-01', fecha: '2026-12-01', ref: '2026-10', pacto: 'irav' }) : null;
    const mesesRef = [10, 11, 12, 1, 2, 3].map((m) => { const y = m >= 10 ? 2026 : 2027; const ref = masMeses(ym(y, m), -2); return [h.mois(ym(y, m)), h.mois(ref), h.D.IPC_ES[ref] !== undefined ? h.pc(h.D.IPC_ES[ref], 1) : 'pendiente', h.D.IRAV_ES[ref] !== undefined ? h.pc(h.D.IRAV_ES[ref]) : 'pendiente']; });
    const primerIrav = h.D.serieIravEs()[0];
    return `<h2>Las tres preguntas que deciden la actualización</h2>
<p>Antes de hacer ninguna cuenta hay que leer el contrato. El ${h.src('boeLau', 'artículo 18 de la Ley 29/1994, de Arrendamientos Urbanos')}, en la redacción que le dio el Real Decreto-ley 29/2026, separa tres situaciones, y cada una lleva a un resultado distinto:</p>
<ol>
<li><strong>El contrato no dice nada sobre actualizar la renta.</strong> En ese caso no hay actualización. La renta pactada se mantiene durante toda la vigencia, aunque los precios suban, y ninguna de las partes puede imponer una subida anual.</li>
<li><strong>El contrato prevé la actualización pero no nombra ningún índice.</strong> Frases como «la renta se actualizará anualmente» sin más detalle llevan, por ley, al IRAV: la variación anual del Índice de Referencia para la Actualización Anual de los Contratos de Arrendamiento de Vivienda.</li>
<li><strong>El contrato nombra un índice</strong>, casi siempre el IPC general. Se aplica ese índice, con un límite: el incremento no puede superar el resultado de aplicar el IRAV. Ese tope rige para los contratos firmados desde el 26 de mayo de 2023; los anteriores conservan el índice que pactaron.</li>
</ol>
<p>A esas tres reglas permanentes se suma, para las anualidades que se cumplen entre el 8 de octubre de 2026 y el 31 de diciembre de 2027, la limitación extraordinaria de la disposición final sexta del ${h.src('boeRdl29', 'Real Decreto-ley 29/2026')}: sin subida si la renta está por encima del índice de precios de referencia, y en los demás casos el nuevo pacto entre las partes o, sin pacto, un máximo del 2 %.</p>
<h2>IPC e IRAV de los últimos doce meses</h2>
${h.table(['Mes', 'IPC general, variación anual', 'IRAV, variación anual'], filas, `Fuente: INE, series IPC290750 e IRAV1, consultadas el 24 de octubre de 2026. Último mes publicado: ${h.mois(d.p)}.`, ['l', 'r', 'r'])}
<p>El IPC se publica con un decimal y el IRAV con dos. El IRAV existe desde ${h.mois(primerIrav.p)}, cuando el INE empezó a publicarlo; un contrato que remita al IRAV no puede actualizarse con un mes anterior. La metodología del índice está en la ${h.src('ineIrav', 'nota técnica del INE sobre el IRAV')}, y la serie del IPC en la ${h.src('ineIpc', 'página de últimos datos del IPC')}.</p>
<h2>Qué mes del IPC hay que usar</h2>
<p>La ley no dice «el IPC del mes del aniversario», sino el último índice que estuviera publicado en la fecha de actualización. Como el INE publica el dato de un mes hacia la mitad del mes siguiente, una actualización que cae a principios de mes usa el índice de dos meses antes. Si el aniversario cae después de la publicación (por ejemplo, el 20 del mes), puede usarse ya el del mes anterior; la calculadora toma el caso más frecuente, la actualización el día 1.</p>
${h.table(['Aniversario (día 1)', 'Mes de referencia', 'IPC', 'IRAV'], mesesRef, 'Mes de referencia según el mes del aniversario, de octubre de 2026 a marzo de 2027. «Pendiente»: dato aún no publicado por el INE.', ['l', 'l', 'r', 'r'])}
<h2>Cómo calcular el IPC del alquiler paso a paso</h2>
<p>El cálculo es una sola multiplicación. Se toma la renta mensual vigente, sin gastos de comunidad ni suministros repercutidos aparte, se multiplica por uno más la variación anual del índice dividida entre cien, y se redondea al céntimo. Con una variación del 3 %, una renta de 800 € pasa a 800 × 1,03 = 824 €. La variación es la que publica el INE para el mes de referencia; no hay que calcularla a partir de los índices en nivel, aunque el resultado sería el mismo salvo redondeos.</p>
<p>Luego se comprueban los topes, por orden: si el contrato es posterior al 25 de mayo de 2023, el porcentaje no puede superar el IRAV del mismo mes; si el aniversario cae dentro del periodo del Real Decreto-ley 29/2026, no puede superar el 2 % salvo nuevo pacto, y es cero si la renta está por encima del índice de referencia de la zona. El porcentaje que queda tras los topes es el que se aplica.</p>
<h2>Cuatro ejemplos con los datos del INE</h2>
<p><strong>Contrato de noviembre de 2021 con cláusula de IPC, aniversario el 1 de noviembre de 2026.</strong> El último dato publicado ese día es el de septiembre de 2026: IPC ${h.pc(h.D.IPC_ES['2026-09'], 1)}. Como el contrato es anterior a mayo de 2023, el IRAV no lo limita, pero la anualidad cae dentro del periodo del decreto-ley: sin nuevo pacto, la subida se queda en ${h.pc(e1.taux)}. Una renta de 950 € pasa a ${h.eur(e1.nouveauLoyer)}, ${h.eur(e1.hausse)} más al mes.</p>
<p><strong>Contrato de marzo de 2024 con cláusula de IPC, aniversario el 1 de marzo de 2026.</strong> Referencia: enero de 2026, IPC ${h.pc(h.D.IPC_ES['2026-01'], 1)} e IRAV ${h.pc(h.D.IRAV_ES['2026-01'])}. El contrato es posterior a mayo de 2023, así que manda el IRAV: 800 € pasan a ${h.eur(e2.nouveauLoyer)} (${h.pc(e2.taux)}). El decreto-ley aún no estaba en vigor.</p>
<p><strong>Contrato de septiembre de 2022 con cláusula de IPC, aniversario el 1 de septiembre de 2026.</strong> Referencia: julio de 2026, IPC ${h.pc(h.D.IPC_ES['2026-07'], 1)}. Ni el IRAV ni el decreto-ley (que entró en vigor el 8 de octubre) limitan esta actualización: 950 € pasan a ${h.eur(e3.nouveauLoyer)}.</p>
<p><strong>Contrato de diciembre de 2024 con cláusula de IRAV, aniversario el 1 de diciembre de 2026.</strong> Hará falta el IRAV de octubre de 2026, ${e4 ? `publicado: ${h.pc(h.D.IRAV_ES['2026-10'])}, con una renta de 1.100 € que pasa a ${h.eur(e4.nouveauLoyer)}` : 'que el INE publicará hacia mediados de noviembre de 2026; hasta entonces la calculadora indica que el dato está pendiente'}. En cualquier caso la subida no podrá pasar del 2 % sin nuevo acuerdo.</p>
<h2>La limitación del Real Decreto-ley 29/2026</h2>
<p>La disposición final sexta se aplica a los contratos de vivienda sujetos a la Ley de Arrendamientos Urbanos cuya anualidad se cumpla entre la entrada en vigor del decreto-ley, el 8 de octubre de 2026, y el 31 de diciembre de 2027. Prevé dos supuestos. Si la renta es superior al límite máximo del precio aplicable según el sistema de índices de precios de referencia, no procede ningún incremento. En los demás casos, la subida es la que acuerden de nuevo las partes y, a falta de ese nuevo acuerdo, no puede superar el 2 %. El detalle de los topes, con su calendario, está en ${h.a('es-limite', 'el límite de subida del alquiler')}, y la comparación de los tres porcentajes para una misma renta en ${h.a('es-subida', 'el comparador IPC, IRAV y 2 %')}.</p>
<p>Un real decreto-ley se aplica desde su entrada en vigor, pero el Gobierno lo ha remitido al Congreso de los Diputados para su convalidación. El texto consolidado del BOE, revisado el 24 de octubre de 2026, no recoge ninguna derogación. Un decreto-ley anterior con la misma limitación, el 26/2026, fue derogado el 2 de octubre de 2026. Si el 29/2026 corriera la misma suerte, el tope del 2 % dejaría de aplicarse a las anualidades posteriores; esta página y la calculadora se revisarán en cuanto el BOE publique la decisión.</p>
<h2>Cómo comunicar la subida</h2>
<p>La renta actualizada se puede exigir a partir del mes siguiente a aquel en que la parte interesada lo notifica por escrito a la otra, indicando el porcentaje de alteración aplicado. Vale una nota en el recibo de la mensualidad anterior. El inquilino puede pedir que se acompañe la certificación del INE. Lo más claro es indicar en la comunicación el índice (IPC o IRAV), el mes de referencia, el porcentaje y, si se ha aplicado, el tope del decreto-ley. La calculadora muestra esos datos en una línea que se puede copiar.</p>
<h2>Locales, garajes y otros contratos</h2>
<p>Todo lo anterior vale para el alquiler de vivienda. Los arrendamientos para uso distinto del de vivienda, como un local comercial o una oficina, se rigen por la voluntad de las partes (artículo 4.3 de la ley): se aplica el índice y el porcentaje que diga el contrato, sin el tope del IRAV ni la limitación del Real Decreto-ley 29/2026, que se refiere solo a la vivienda. Los contratos firmados antes de 1995, sujetos a regímenes transitorios, quedan fuera de esta calculadora.</p>
<h2>Las demás páginas sobre la renta en España</h2>
<ul>
<li>${h.a('es-irav', 'IRAV: valores mensuales y cuándo se aplica')}</li>
<li>${h.a('es-ipc26', 'IPC del alquiler en 2026, mes a mes')}</li>
<li>${h.a('es-subida', 'Subida del alquiler: IPC, IRAV o 2 %')}</li>
<li>${h.a('es-limite', 'Límite de subida del alquiler hasta 2027')}</li>
</ul>
<p>Esta página explica lo que dicen la ley y el decreto-ley; no resuelve un caso concreto. Ante un desacuerdo sobre la cláusula, la fecha o los atrasos, la oficina de vivienda de tu comunidad autónoma, una asociación de inquilinos o de propietarios, o un abogado pueden revisar el contrato.</p>`;
  },
};
export default t;
