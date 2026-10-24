import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Renta actualizada: editor y normas editoriales de Radif',
    description: 'Quién publica Renta actualizada, de dónde salen los índices, cómo se revisan y corrigen las páginas y cómo avisar de un error: la sociedad Radif Partners.',
    h1: 'Quién publica Renta actualizada',
    body: (h) => `<p>Renta actualizada es una publicación de la sociedad Radif Partners. El sitio hace una sola cosa: aplicar a un contrato de alquiler el índice oficial que señala la ley, con los topes que limitan o impiden la subida, y mostrar cada cifra con su fuente y su mes. En España eso significa el IPC y el IRAV que publica el INE, el artículo 18 de la Ley de Arrendamientos Urbanos y la limitación temporal del Real Decreto-ley 29/2026. Las mismas calculadoras existen para Francia, Bélgica, Italia, Portugal y Austria.</p>
<p>El sitio no tiene relación con ninguna administración, con el INE ni con ninguna inmobiliaria. No vende nada, no pide datos de contacto y no transmite nada a terceros: todos los cálculos se hacen en tu navegador.</p>
<h2>Editor</h2>
<!--identite-->
<h2 id="editorial">Política editorial</h2>
<p>Cada índice se comprueba en su fuente: la base de datos del INE para el IPC y el IRAV, y las oficinas estadísticas de los demás países. Un programa descarga por sus API oficiales las series del INE, del Insee, del Istat, de Statistik Austria y los 13 últimos meses de Statbel, y comprueba la coherencia de cada serie; solo el índice belga se compara con una segunda fuente. Se introducen a mano, tras leer el texto oficial, los coeficientes portugueses, los factores de corrección flamencos y los coeficientes de enlace del Istat. Cada página indica cuándo se revisaron las cifras por última vez. Una norma solo se explica después de leer el texto publicado en el BOE, cuyo enlace aparece al pie de la página.</p>
<p>Si un dato aún no se ha publicado, la página lo dice y no lo inventa: la calculadora muestra «pendiente de publicación» en lugar de una estimación presentada como oficial. Los ejemplos con cifras los produce el motor de cálculo del sitio, que se prueba automáticamente; no se copian a mano. Cuando una norma está pendiente de convalidación, como el Real Decreto-ley 29/2026, la página lo advierte y se revisa en cuanto el BOE publica un cambio.</p>
<h2 id="contact">Contacto y errores</h2>
<p>Un índice equivocado, una norma mal entendida o un caso que la calculadora no resuelve: escribe a <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> con la dirección de la página y, si puedes, la fuente que la contradice. No respondemos consultas sobre un conflicto concreto; para eso, la oficina de vivienda de tu comunidad autónoma, una asociación de inquilinos o un abogado son los interlocutores adecuados.</p>
<p>El detalle del cálculo está en ${h.a('method', 'método y fuentes')}.</p>`,
  },
  method: {
    title: 'Actualización de la renta: método, fuentes y límites',
    description: 'La fórmula de cada país, las series oficiales usadas, el redondeo, la actualización de los índices y los límites conocidos de las calculadoras del sitio.',
    h1: 'Cómo se hacen los cálculos',
    body: (h) => `<p>Cada calculadora aplica la fórmula que fija la norma del país, con la serie que publica su oficina estadística, y redondea como pide el texto.</p>
<h2>España</h2>
<p>Renta actual × (1 + variación anual del índice pactado), redondeada al céntimo. El mes de referencia es el último índice publicado en la fecha de actualización: el INE publica el IPC y el IRAV de un mes hacia la mitad del mes siguiente, de modo que en una anualidad de noviembre se usa en general el dato de septiembre (${h.src('ineIpc', 'INE')}). Sin cláusula de actualización, la renta no se actualiza; con una cláusula que no nombra índice se aplica el IRAV; en los contratos firmados desde el 26 de mayo de 2023 la subida no puede superar el IRAV (${h.src('boeLau', 'Ley 29/1994, art. 18')}). Para las anualidades que vencen entre el 8 de octubre de 2026 y el 31 de diciembre de 2027 se aplica además la limitación del ${h.src('boeRdl29', 'Real Decreto-ley 29/2026')}.</p>
<h2>Otros países</h2>
<p>Francia: renta × IRL del trimestre de referencia / IRL del año anterior. Bélgica: renta de base × nuevo índice de salud / índice inicial. Italia: variación anual del índice FOI, al 75 % o al 100 %. Portugal: coeficientes anuales del Diário da República, redondeo al céntimo superior. Austria: variación media del IPC según la ley MieWeG.</p>
<h2>Actualización y límites</h2>
<p>Las series del INE se descargan de su API oficial. En cada actualización, el mismo programa consulta en la API del BOE el estado del Real Decreto-ley 29/2026: si figura como derogado, la actualización falla y el sitio deja de publicarse hasta corregir el cálculo. Un cálculo no sustituye la lectura del contrato: una cláusula particular prevalece sobre el caso general, y un juez puede resolver de otra forma un caso discutido.</p>`,
    faqs: (h) => [
      { q: '¿Por qué la calculadora usa el dato de dos meses antes?', a: 'Porque la ley toma el último índice publicado en la fecha de actualización, y el INE publica el IPC y el IRAV de cada mes hacia la mitad del mes siguiente. El día 1 de un mes, el último dato disponible suele ser el de dos meses antes. Si el contrato fija otro mes de referencia, ese mes manda: elige entonces la fecha que corresponda.' },
      { q: '¿Qué pasa si el Congreso no convalida el Real Decreto-ley 29/2026?', a: 'Un real decreto-ley que no se convalida queda derogado y deja de aplicarse desde ese momento, como ocurrió con el Real Decreto-ley 26/2026 el 2 de octubre de 2026. En ese caso desaparecería el tope del 2 % y volverían a regir solo la cláusula del contrato y el límite del IRAV. En cada actualización, el sitio consulta el estado del decreto-ley en la API del BOE: si figura como derogado, la publicación se detiene hasta que el cálculo se corrija.' },
      { q: '¿El sitio guarda los datos de mi contrato?', a: 'No. La renta, las fechas y la cláusula que introduces se quedan en tu navegador y no se envían a ningún servidor. Si usas el botón de copiar, el enlace incluye tus valores en la dirección para que puedas enviarlo a la otra parte del contrato; nadie más lo recibe salvo que tú lo compartas.' },
    ],
  },
};
export default s;
