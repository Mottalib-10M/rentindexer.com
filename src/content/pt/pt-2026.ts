import type { PageText, Helpers } from '../../lib/types';

/** Aumento da renda em 2026 : coeficiente 1,0224, recuperação e carta (« aumento renda 2026 », « aumento da renda »). */
const c = (h: Helpers, a: number) => h.D.COEF_PT[String(a)];
const atual = (h: Helpers, renda: number, ano: number, ultimo: number) => {
  const anos = h.E.anosCoeficientesPt(ano, ultimo).filter((x) => c(h, x));
  return { anos, r: h.E.atualizarPt(renda, anos.map((x) => c(h, x).valor)) };
};

const t: PageText = {
  slug: 'aumento-da-renda',
  nav: 'Aumento da renda em 2026',
  card: 'O coeficiente 1,0224 de 2026, os aumentos que ainda se podem fazer este ano e os coeficientes de 2024 e 2025 por recuperar.',
  title: 'Aumento renda 2026: coeficiente 1,0224 e anos a recuperar',
  description: 'Aumento da renda em 2026 com o coeficiente 1,0224: contratos que ainda podem subir em novembro e dezembro, recuperação de 2024 e 2025 e a carta ao inquilino.',
  h1: 'Aumento da renda em 2026: o que ainda se pode aplicar este ano',
  intro: 'O simulador está em 2026: indique a renda e o ano do último aumento para ver o coeficiente ou os coeficientes que se aplicam.',
  resume: (h) => {
    const k = c(h, 2026);
    const ex = atual(h, 650, 2026, 2025), ex2 = atual(h, 650, 2026, 2023);
    return `O coeficiente de atualização das rendas para 2026 é ${h.num(k.valor, 4)}, publicado no ${k.aviso} no Diário da República de ${h.date(k.data_dr)}: um aumento máximo de ${h.pc((k.valor - 1) * 100)} sobre a renda em vigor, com arredondamento ao cêntimo superior. Uma renda de 650 € passa a ${h.eur(ex.r.nouveauLoyer)}. Em outubro de 2026, a maior parte dos aumentos deste ano já foi feita, mas não todos: um contrato que faz anos em novembro ou dezembro ainda se atualiza com o coeficiente de 2026, desde que a carta chegue ao inquilino com pelo menos 30 dias de antecedência. Quem não aumentou a renda em 2024 nem em 2025 pode juntar, ainda este ano, os coeficientes desses anos ao de 2026, até três coeficientes no total: 650 € passam então a ${h.eur(ex2.r.nouveauLoyer)}. A partir de janeiro de 2027 o coeficiente aplicável passa a ser o de 2027, já publicado. A regra vem dos artigos 24.º e 25.º do NRAU.`;
  },
  faqs: (h) => [
    { q: 'O meu contrato faz anos a 15 de dezembro de 2026: que coeficiente uso?', a: `O de 2026, ${h.num(c(h, 2026).valor, 4)}, porque o aumento produz efeitos ainda neste ano civil. A carta tem de chegar ao inquilino até meados de novembro, para cumprir os 30 dias de antecedência. Se a carta só puder seguir mais tarde, o aumento passa para janeiro, e aí o coeficiente aplicável já é o de 2027.` },
    { q: 'Se não aumentar a renda em 2026, perco este coeficiente?', a: 'Não de imediato. O coeficiente de 2026 pode ser recuperado num aumento posterior, desde que o total não passe de três coeficientes. Num aumento em 2027 pode juntar o de 2026 ao de 2027; em 2028, ainda pode juntá-lo aos de 2027 e 2028. A partir daí, o coeficiente de 2026 deixa de poder ser aplicado.' },
    { q: 'Que deve dizer a carta de aumento de 2026?', a: 'A identificação do senhorio e do inquilino, a morada do locado, a renda atual, o coeficiente ou coeficientes aplicados com o aviso que os publicou, a nova renda e a data a partir da qual é devida, pelo menos 30 dias depois da receção. O simulador escreve este texto com os valores calculados; falta completar os nomes, a morada e a data.' },
  ],
  body: (h) => {
    const casos: Array<[string, number]> = [['2025 (ou contrato iniciado em 2025)', 2025], ['2024', 2024], ['2023 ou antes', 2023]];
    const filas = casos.map(([lbl, u]) => { const x = atual(h, 800, 2026, u); return [lbl, x.anos.map((a) => `${h.num(c(h, a).valor, 4)} (${a})`).join(' × '), h.eur(x.r.nouveauLoyer), h.eur(x.r.hausse)]; });
    return `<h2>Recuperar coeficientes num aumento de 2026</h2>
${h.table(['Último aumento', 'Coeficientes aplicados', 'Renda de 800 € passa a', 'Aumento por mês'], filas, `Coeficientes: ${h.src('drCoef2026', 'Aviso n.º 23174/2025/2')} (2026), ${h.src('drCoef2025', 'Aviso n.º 23099/2024/2')} (2025) e Aviso n.º 20980-A/2023 (2024).`, ['l', 'l', 'r', 'r'])}
<p>A linha de baixo mostra o efeito do limite: quem não aumenta desde 2022 ou 2023 junta em 2026 os coeficientes de 2024, 2025 e 2026, e nada antes disso. O de 2024 (${h.num(c(h, 2024).valor, 4)}) é o que mais pesa, e só se pode recuperar até ao fim de 2026: num aumento em 2027 já fica de fora.</p>
<h2>Novembro e dezembro: o calendário apertado</h2>
<p>Para um aumento com efeito a 1 de dezembro de 2026, a carta tem de chegar ao inquilino até 1 de novembro. Para um aumento a 31 de dezembro, até 1 de dezembro. Depois disso, a nova renda passa a 2027 e o cálculo muda de coeficiente. Convém por isso enviar a carta por um meio que prove a data de receção.</p>
<h2>2026 em comparação</h2>
<p>O coeficiente de 2026 (${h.num(c(h, 2026).valor, 4)}) ficou perto do de 2025 (${h.num(c(h, 2025).valor, 4)}) e abaixo do de 2027 (${h.num(c(h, 2027).valor, 4)}). Os aumentos com efeito a partir de janeiro de 2027 são tratados em ${h.a('pt-home', 'aumento das rendas em 2027')}. Esta página descreve o regime legal; em caso de litígio, convém ouvir um advogado ou uma associação de inquilinos ou de proprietários.</p>`;
  },
};
export default t;
