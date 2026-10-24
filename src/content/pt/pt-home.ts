import type { PageText, Helpers } from '../../lib/types';

/** Raiz /pt/ : aumento das rendas em 2027 com o coeficiente 1,0256 (« aumento rendas 2027 », « coeficiente atualização rendas »). */
const c = (h: Helpers, a: number) => h.D.COEF_PT[String(a)];
const atual = (h: Helpers, renda: number, ano: number, ultimo: number) => {
  const anos = h.E.anosCoeficientesPt(ano, ultimo).filter((x) => c(h, x));
  return { anos, r: h.E.atualizarPt(renda, anos.map((x) => c(h, x).valor)) };
};

const t: PageText = {
  slug: '',
  nav: 'Aumento das rendas em 2027',
  card: 'O coeficiente de 2027, a nova renda arredondada ao cêntimo superior, a recuperação de anos sem aumento e a carta ao inquilino.',
  title: 'Aumento rendas 2027: coeficiente 1,0256 e a nova renda',
  description: 'Aumento das rendas em 2027 com o coeficiente 1,0256 do INE: nova renda ao cêntimo superior, anos em atraso que se podem recuperar e carta com 30 dias de aviso.',
  h1: 'Aumento das rendas em 2027: o coeficiente e a nova renda',
  intro: 'Indique a renda atual e o ano do último aumento: o simulador aplica o coeficiente de 2027 e, se for o caso, os dos anos em falta.',
  resume: (h) => {
    const k = c(h, 2027), k26 = c(h, 2026);
    const ex = atual(h, 650, 2027, 2026);
    return `O coeficiente de atualização das rendas para 2027 é ${h.num(k.valor, 4)}, publicado pelo INE no ${k.aviso}, no Diário da República de ${h.date(k.data_dr)}. Significa que, em 2027, uma renda habitacional ou não habitacional sujeita ao regime legal de atualização pode subir no máximo ${h.pc((k.valor - 1) * 100)}: 650 € por mês passam a ${h.eur(ex.r.nouveauLoyer)}. É um pouco mais do que em 2026, quando o coeficiente foi de ${h.num(k26.valor, 4)}. A conta é renda atual × coeficiente, arredondada ao cêntimo imediatamente superior, como manda o artigo 25.º do NRAU. O primeiro aumento só é possível um ano depois do início do contrato, e cada aumento seguinte um ano depois do anterior. O senhorio tem de comunicar por escrito o coeficiente e a nova renda com pelo menos 30 dias de antecedência. Se não atualizou a renda em anos anteriores, pode ainda aplicar os coeficientes desses anos, até um máximo de três coeficientes contando com o do ano em curso. O coeficiente é apurado pelo INE e deve ser publicado no Diário da República até 30 de outubro de cada ano.`;
  },
  faqs: (h) => {
    const k = c(h, 2027);
    return [
      { q: 'O aumento de 2027 é obrigatório para o senhorio?', a: 'Não. O coeficiente é o máximo que a lei permite aplicar num ano; o senhorio pode aplicar menos ou não aplicar nenhum. Se não o aplicar, a renda mantém-se, e esse coeficiente ainda poderá ser recuperado mais tarde, dentro do limite de três coeficientes. O inquilino não pode ser obrigado a pagar mais do que resulta do coeficiente publicado.' },
      { q: 'Posso aumentar a renda em janeiro de 2027 se o contrato começou em setembro de 2026?', a: 'Não. A primeira atualização só pode ser exigida um ano depois do início do contrato. Um contrato iniciado em setembro de 2026 pode ter o primeiro aumento a partir de setembro de 2027, com o coeficiente de 2027 e o aviso escrito com 30 dias de antecedência. O simulador indica quando ainda não há coeficiente aplicável.' },
      { q: 'O que acontece se o senhorio comunicar o aumento com menos de 30 dias?', a: 'A lei exige que a comunicação seja feita por escrito com a antecedência mínima de 30 dias. Uma carta enviada mais tarde não permite cobrar a nova renda a partir da data indicada; o aumento só se pode exigir depois de decorrido o prazo. Em caso de dúvida sobre uma carta já enviada, convém pedir conselho a um profissional ou a uma associação.' },
      { q: 'O coeficiente aplica-se também a lojas e escritórios?', a: `O aviso do INE refere o coeficiente de atualização anual dos diversos tipos de arrendamento, o que abrange também os não habitacionais. Para uma loja ou um escritório cuja renda siga o regime legal, o aumento máximo de 2027 é o mesmo, ${h.num(k.valor, 4)}. Se o contrato tiver uma cláusula própria de atualização, convém confirmar com um profissional qual das regras prevalece.` },
      { q: 'Como se arredonda a nova renda?', a: 'Sempre para cima, ao cêntimo seguinte. O artigo 25.º do NRAU manda arredondar a renda atualizada para a unidade cêntimo imediatamente superior. Uma renda de 700 € com um coeficiente que desse 717,921 € passa a 717,93 €, e não a 717,92 €. O simulador faz este arredondamento, ao contrário de uma conta de calculadora comum.' },
      { q: 'O inquilino pode recusar o aumento?', a: 'Se o aumento respeitar o coeficiente publicado, o prazo de um ano e o aviso escrito com 30 dias de antecedência, é o regime previsto na lei e o inquilino deve passar a pagar a nova renda. Se a carta tiver um erro de cálculo, aplicar coeficientes a que o senhorio já não tem direito ou chegar fora de prazo, o inquilino pode contestá-la por escrito.' },
      { q: 'A carta gerada pelo simulador é enviada ao inquilino?', a: 'Não. A carta é escrita no seu navegador com os valores do cálculo e fica apenas no seu ecrã: o site não recebe nomes, moradas nem montantes. Copie o texto, complete os campos entre parênteses retos, imprima e envie-a pelo meio que lhe permita provar a data de receção, como a carta registada com aviso de receção.' },
      { q: 'Quando sai o coeficiente de 2028?', a: 'O INE apura o coeficiente e publica-o em aviso no Diário da República até 30 de outubro do ano anterior. O coeficiente de 2028 deverá, portanto, ser conhecido até ao final de outubro de 2027. Até lá não existe valor oficial, e o simulador só propõe os anos cujo aviso já foi publicado e lido.' },
    ];
  },
  body: (h) => {
    const anos = h.D.anosPt();
    const filas = anos.map((a) => { const k = c(h, a); return [String(a), h.num(k.valor, 4), h.pc((k.valor - 1) * 100), k.aviso, h.date(k.data_dr)]; });
    const r1 = atual(h, 650, 2027, 2026), r2 = atual(h, 650, 2027, 2025), r3 = atual(h, 650, 2027, 2024), r4 = atual(h, 650, 2027, 2020);
    const rendas = [400, 650, 900, 1200, 1500].map((v) => { const x = h.E.atualizarPt(v, [c(h, 2027).valor]); return [h.eur(v), h.eur(x.nouveauLoyer), h.eur(x.hausse), h.eur(x.hausse * 12)]; });
    const lista = (a: number[]) => a.map((x) => h.num(c(h, x).valor, 4)).join(' × ');
    return `<h2>O coeficiente de 2027 e os dos anos anteriores</h2>
${h.table(['Ano', 'Coeficiente', 'Aumento máximo', 'Publicação', 'Diário da República'], filas, 'Coeficientes lidos nos avisos do INE publicados no Diário da República e, para 2023, na Lei n.º 19/2022. Consultados a 24 de outubro de 2026.', ['l', 'r', 'r', 'l', 'l'])}
<p>O valor de 2027 está no ${h.src('drCoef2027', 'Aviso n.º 24199/2026/2')}; o de 2026 no ${h.src('drCoef2026', 'Aviso n.º 23174/2025/2')}; o de 2025 no ${h.src('drCoef2025', 'Aviso n.º 23099/2024/2')}; o de 2024 no ${h.src('drCoef2024', 'Aviso n.º 20980-A/2023')}. Em 2023 o coeficiente apurado pelo INE não se aplicou: a ${h.src('drLei19', 'Lei n.º 19/2022')} fixou para esse ano um coeficiente de 1,02. O de 2024, de ${h.num(c(h, 2024).valor, 4)}, foi o mais alto da série recente.</p>
<h2>Quanto sobe a sua renda em 2027</h2>
${h.table(['Renda atual', 'Nova renda em 2027', 'Aumento por mês', 'Aumento por ano'], rendas, `Coeficiente ${h.num(c(h, 2027).valor, 4)}, renda arredondada ao cêntimo superior.`, ['r', 'r', 'r', 'r'])}
<h2>A regra do NRAU, passo a passo</h2>
<p>O ${h.src('drCoef2026', 'aviso do INE')} lembra a base legal: o artigo 24.º da Lei n.º 6/2006, que aprova o Novo Regime do Arrendamento Urbano (NRAU), atribui ao INE o apuramento do coeficiente de atualização anual de renda dos diversos tipos de arrendamento, a publicar no Diário da República até 30 de outubro. O mesmo coeficiente serve também para o arrendamento rural, por remissão do regime próprio. Aplicá-lo segue quatro passos:</p>
<ol>
<li><strong>Verificar o prazo.</strong> Tem de ter passado pelo menos um ano desde o início do contrato ou desde a última atualização.</li>
<li><strong>Escolher o coeficiente.</strong> É o do ano civil em que o aumento produz efeitos: em 2027, ${h.num(c(h, 2027).valor, 4)}. Se houver anos sem aumento, podem juntar-se os coeficientes desses anos, no máximo três ao todo.</li>
<li><strong>Calcular.</strong> Renda atual × coeficiente (ou produto dos coeficientes), com arredondamento ao cêntimo imediatamente superior, como manda o artigo 25.º.</li>
<li><strong>Comunicar.</strong> Por escrito, com pelo menos 30 dias de antecedência, indicando o coeficiente e a nova renda.</li>
</ol>
<h2>Recuperar os anos em que não houve aumento</h2>
<p>Muitos senhorios não atualizaram a renda em 2023 ou 2024. A lei permite aplicar mais tarde os coeficientes não usados, mas com um limite: no total, no máximo três coeficientes, contando com o do próprio ano. O simulador aplica esta regra a partir do ano do último aumento (ou do início do contrato).</p>
${h.table(['Último aumento (ou início)', 'Coeficientes aplicados em 2027', 'Renda de 650 € passa a'], [
      ['2026', lista(r1.anos), h.eur(r1.r.nouveauLoyer)],
      ['2025', lista(r2.anos), h.eur(r2.r.nouveauLoyer)],
      ['2024', lista(r3.anos), h.eur(r3.r.nouveauLoyer)],
      ['2020 ou antes', lista(r4.anos), h.eur(r4.r.nouveauLoyer)],
    ], 'Recuperação de coeficientes não aplicados, limitada a três coeficientes no total.', ['l', 'l', 'r'])}
<p>Um contrato sem aumento desde 2024 recupera em 2027 os coeficientes de 2025 e 2026 e junta-lhes o de 2027: ${h.eur(650)} × ${lista(r3.anos)} = ${h.eur(r3.r.nouveauLoyer)}. Um contrato parado desde 2020 não recupera mais do que isso: os coeficientes de 2021 a 2024 perderam-se, e o mais alto deles, o de 2024, fica de fora. É por isso que adiar um aumento por vários anos custa ao senhorio mais do que parece.</p>
<h2>Três exemplos concretos</h2>
<p><strong>Contrato iniciado em março de 2025, sem aumento até agora.</strong> Em março de 2026 o senhorio podia ter aplicado ${h.num(c(h, 2026).valor, 4)}. Não o fez. Em março de 2027 pode aplicar os coeficientes de 2026 e 2027, porque o do ano de início, 2025, não se aplica: o contrato ainda não tinha um ano. Para 650 €: ${h.eur(r2.r.nouveauLoyer)}.</p>
<p><strong>Contrato com aumento em junho de 2026.</strong> O próximo aumento só pode ocorrer a partir de junho de 2027, com o coeficiente de 2027. Uma renda de 650 € atualizada em 2026 passa a ${h.eur(r1.r.nouveauLoyer)}.</p>
<p><strong>Contrato antigo, sem aumentos desde 2019.</strong> Em 2027 aplicam-se no máximo três coeficientes, os de 2025, 2026 e 2027: ${h.eur(r4.r.nouveauLoyer)} para uma renda de 650 €. Não se pode ir buscar o coeficiente de 2024, mesmo sendo o mais alto.</p>
<h2>A carta ao inquilino</h2>
<p>A comunicação deve ser escrita e chegar ao inquilino com pelo menos 30 dias de antecedência sobre a data em que a nova renda passa a ser devida. Deve indicar o coeficiente aplicado e a nova renda. Por baixo do simulador, a carta é preenchida no seu navegador com os valores calculados: basta acrescentar os nomes, a morada e a data. Nada é enviado a ninguém. Na prática, a carta registada com aviso de receção permite provar a data de entrega.</p>
<h2>Calendário do aumento de 2027</h2>
<ul>
<li><strong>Até 30 de outubro de 2026:</strong> publicação do coeficiente de 2027 no Diário da República (feita a ${h.date(c(h, 2027).data_dr)}).</li>
<li><strong>Novembro de 2026:</strong> envio das cartas para os aumentos com efeito a 1 de janeiro de 2027, que têm de chegar com pelo menos 30 dias de antecedência.</li>
<li><strong>Durante todo o ano de 2027:</strong> cada contrato atualiza-se no seu aniversário, ou um ano depois do último aumento, com o coeficiente de 2027.</li>
<li><strong>Até 30 de outubro de 2027:</strong> publicação do coeficiente de 2028.</li>
</ul>
<h2>Para o inquilino: como conferir a carta</h2>
<p>Quem recebe uma carta de aumento pode confirmar o valor em poucos minutos, com o simulador acima e com cinco perguntas:</p>
<ol>
<li><strong>Passou um ano?</strong> Desde o início do contrato ou desde o último aumento tem de ter decorrido pelo menos um ano.</li>
<li><strong>O coeficiente é o do ano certo?</strong> Para um aumento com efeito em 2027, o coeficiente é ${h.num(c(h, 2027).valor, 4)}; uma carta que use um valor diferente, sem explicar que recupera anos anteriores, tem um erro.</li>
<li><strong>Os anos recuperados são possíveis?</strong> No máximo três coeficientes ao todo, e só de anos em que a renda não foi aumentada.</li>
<li><strong>A conta está certa?</strong> Renda atual × coeficiente, com arredondamento ao cêntimo superior. Uma diferença de um cêntimo para cima é normal; mais do que isso, não.</li>
<li><strong>O prazo foi respeitado?</strong> A carta deve chegar pelo menos 30 dias antes da data da nova renda.</li>
</ol>
<p>Se a resposta a todas for sim, o aumento segue o regime legal. Se alguma falhar, o inquilino pode responder por escrito ao senhorio, indicando o ponto em causa e o valor que considera correto.</p>
<h2>Erros que se repetem todos os anos</h2>
<ul>
<li><strong>Somar percentagens em vez de multiplicar coeficientes.</strong> Recuperar 2025, 2026 e 2027 não é somar ${h.pc((c(h, 2025).valor - 1) * 100)}, ${h.pc((c(h, 2026).valor - 1) * 100)} e ${h.pc((c(h, 2027).valor - 1) * 100)}: multiplica-se ${lista([2025, 2026, 2027])}, o que dá um pouco mais.</li>
<li><strong>Arredondar ao cêntimo mais próximo.</strong> O NRAU manda arredondar sempre para cima, ao cêntimo seguinte.</li>
<li><strong>Usar o coeficiente do ano de início do contrato.</strong> No primeiro ano não há aumento; o primeiro coeficiente aplicável é o do ano em que o contrato completa um ano.</li>
<li><strong>Esquecer o aviso.</strong> Uma nova renda cobrada sem carta escrita, ou com menos de 30 dias de antecedência, não segue o regime legal.</li>
<li><strong>Aplicar o coeficiente às despesas.</strong> O coeficiente aplica-se à renda; despesas de condomínio ou outros encargos acordados à parte seguem o que o contrato diz sobre eles.</li>
</ul>
<h2>O que o simulador não faz</h2>
<p>O simulador aplica o regime legal de atualização anual. Não trata as rendas de contratos antigos sujeitos a regimes de transição, as rendas condicionadas ou apoiadas, nem atualizações previstas no próprio contrato com outra fórmula. Também não decide litígios: se senhorio e inquilino discordam do cálculo ou do prazo, a leitura do contrato por um advogado, ou o apoio de uma associação de inquilinos ou de proprietários, é o caminho certo. Os dados do INE estão também nos ${h.src('inePt', 'destaques do INE')}.</p>
<p>Para os aumentos feitos ainda em 2026, com o coeficiente ${h.num(c(h, 2026).valor, 4)}, veja ${h.a('pt-2026', 'o aumento da renda em 2026')}. Para comparar com a regra espanhola, que limita a subida de 2026 e 2027 a 2 %, veja ${h.a('es-home', 'a atualização das rendas em Espanha')}.</p>`;
  },
};
export default t;
