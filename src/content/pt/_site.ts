import type { SiteText } from '../../lib/types';
import { CONTACT_EMAIL } from '../../data/site-config';

const s: SiteText = {
  about: {
    title: 'Renda atualizada: editor e regras editoriais da Radif',
    description: 'Quem publica a Renda atualizada, de onde vêm os coeficientes, como as páginas são revistas e corrigidas e como comunicar um erro: a sociedade Radif Partners.',
    h1: 'Quem publica a Renda atualizada',
    body: (h) => `<p>A Renda atualizada é publicada pela sociedade Radif Partners. O site faz uma só coisa: aplica a um contrato o índice ou coeficiente oficial que a lei indica, com as regras que limitam o aumento, e mostra cada valor com a fonte e a data. Em Portugal trata-se do coeficiente anual de atualização das rendas, apurado pelo INE e publicado por aviso no Diário da República, e das regras do NRAU. Os mesmos simuladores existem para França, Bélgica, Espanha, Itália e Áustria.</p>
<p>O site não tem ligação ao INE, a qualquer entidade pública nem a mediadores imobiliários. Não vende nada, não pede contactos e não transmite nada a terceiros: todos os cálculos são feitos no seu navegador.</p>
<h2>Editor</h2>
<!--identite-->
<h2 id="editorial">Política editorial</h2>
<p>Cada coeficiente é lido no aviso do Diário da República que o publicou, cujo número aparece junto do valor. Os índices dos outros países vêm diretamente dos respetivos institutos de estatística, através de um programa que os descarrega e compara com os valores anteriores. Cada página indica a data da última revisão. Uma regra jurídica só é explicada depois de lido o texto legal em vigor.</p>
<p>Se um coeficiente ainda não foi publicado, a página di-lo e não o inventa. Os exemplos com números são produzidos pelo motor de cálculo do site, testado automaticamente, e não copiados à mão. A carta ao inquilino é um modelo gerado no seu navegador: confirme-a com o contrato antes de a enviar.</p>
<h2 id="contact">Contacto e comunicação de erros</h2>
<p>Um coeficiente errado, uma regra mal interpretada ou um caso que o simulador não trata: escreva para <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> com o endereço da página e, se possível, a fonte que a contradiz. Não respondemos a questões sobre um litígio concreto; para isso, uma associação de inquilinos ou de proprietários ou um advogado são os interlocutores adequados.</p>
<p>O detalhe do cálculo está em ${h.a('method', 'método e fontes')}.</p>`,
  },
  method: {
    title: 'Atualização das rendas: método, fontes e limites do cálculo',
    description: 'A fórmula de cada país, as séries e coeficientes oficiais usados, os arredondamentos, a atualização dos dados e os limites conhecidos dos simuladores.',
    h1: 'Como são feitos os cálculos',
    body: (h) => `<p>Cada simulador aplica a fórmula prevista na lei do país, com os dados publicados pela entidade competente, e arredonda como o texto exige.</p>
<h2>Portugal</h2>
<p>Nova renda = renda atual × coeficiente do ano (× coeficientes dos anos não aplicados, quando a lei permite recuperá-los), arredondada ao cêntimo imediatamente superior, como manda o artigo 25.º do NRAU. Os coeficientes vêm dos avisos do INE no Diário da República: ${h.src('drCoef2027', 'Aviso n.º 24199/2026/2')} para 2027 e ${h.src('drCoef2026', 'Aviso n.º 23174/2025/2')} para 2026. O aumento comunica-se por escrito com pelo menos 30 dias de antecedência.</p>
<h2>Outros países</h2>
<p>França: renda × IRL do trimestre de referência / IRL do ano anterior. Bélgica: renda de base × novo índice de saúde / índice inicial. Espanha: variação anual do IPC ou do IRAV com os limites legais. Itália: variação anual do índice FOI, a 75 % ou 100 %. Áustria: variação média do índice de preços segundo a lei MieWeG.</p>
<h2>Atualização e limites</h2>
<p>Os dados são revistos a cada nova publicação oficial. Um cálculo não substitui a leitura do contrato: uma cláusula própria (atualização diferente, renda condicionada, regime especial) prevalece sobre o caso geral, e um tribunal pode decidir de outra forma um caso controverso.</p>`,
    faqs: (h) => [
      { q: 'Porque é que o site arredonda a renda para cima?', a: 'Porque o artigo 25.º do NRAU, na redação da Lei n.º 31/2012, manda arredondar a renda atualizada para a unidade de cêntimo imediatamente superior. Os outros países arredondam ao cêntimo mais próximo, mas em Portugal um resultado de 664,5612 € passa a 664,57 €. A diferença é pequena, mas é a que a lei prevê.' },
      { q: 'Onde posso confirmar o coeficiente que o simulador usa?', a: 'No aviso do INE publicado no Diário da República, cujo número aparece ao lado de cada coeficiente no resultado e na lista de fontes desta página. O coeficiente de cada ano é publicado até 30 de outubro do ano anterior. Se o aviso de um ano ainda não saiu, o simulador não propõe esse ano.' },
      { q: 'A carta gerada pelo simulador é enviada a alguém?', a: 'Não. A carta é escrita no seu navegador com os valores que introduziu e só sai de lá se a copiar. Complete os dados em falta, como os nomes e a morada, confirme o coeficiente com o contrato e envie-a por carta registada com aviso de receção, com pelo menos 30 dias de antecedência sobre a data do aumento.' },
    ],
  },
};
export default s;
