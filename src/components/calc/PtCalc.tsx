/**
 * Atualização anual da renda (NRAU, art. 24.º e 25.º) : coeficiente do INE publicado no Diário da
 * República, recuperação dos coeficientes não aplicados (no máximo três), arredondamento ao cêntimo
 * superior, e a carta ao inquilino com 30 dias de antecedência, escrita no navegador.
 */
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { Frame, ResultPanel, Row2, Letter, tr, eur, nr, pc, useParams, type L } from './kit';
import { atualizarPt, anosCoeficientesPt } from '../../lib/engine/indexation';
import { COEF_PT, anosPt } from '../../lib/engine/donnees';
import { displayDate } from '../../lib/format';

interface Props { lang: L; ano?: number; methodHref?: string }

export default function PtCalc({ lang: l, ano = 2027, methodHref }: Props) {
  const anos = anosPt();
  const [v, set] = useParams({ renda: 650, ano, ult: ano - 1 });
  const usados = anosCoeficientesPt(v.ano, v.ult).filter((a) => COEF_PT[String(a)]);
  const coefs = usados.map((a) => COEF_PT[String(a)].valor);
  const r = coefs.length ? atualizarPt(v.renda, coefs) : null;
  const fator = coefs.reduce((a, c) => a * c, 1);
  const form = (
    <>
      <Row2>
        <NumberField id="pt-renda" label={tr(l, { pt: 'Renda mensal atual', en: 'Current monthly rent' })} value={v.renda} onChange={set('renda')} unit="€" max={30000} decimals={2} lang={l} />
        <SelectField id="pt-ano" label={tr(l, { pt: 'Ano da atualização', en: 'Year of the increase' })} value={String(v.ano)} onChange={(x) => set('ano')(Number(x))} options={anos.map((a) => ({ value: String(a), label: String(a) }))} />
      </Row2>
      <SelectField id="pt-ult" label={tr(l, { pt: 'Ano da última atualização (ou do início do contrato)', en: 'Year of the last increase (or when the lease began)' })} value={String(v.ult)} onChange={(x) => set('ult')(Number(x))} options={Array.from({ length: 10 }, (_, i) => v.ano - 1 - i).map((a) => ({ value: String(a), label: String(a) }))} />
    </>
  );
  if (!r) return <Frame form={form} result={<ResultPanel lang={l} head="—" value="—" rows={[]} copyText="" warn={tr(l, { pt: 'Sem coeficiente aplicável : a renda só pode ser atualizada um ano depois do início do contrato ou da última atualização.', en: 'No coefficient applies: rent can only go up a year after the lease began or after the last increase.' })} />} />;
  const carta = tr(l, {
    pt: `Exmo(a). Senhor(a) [nome do inquilino],\n\nNos termos dos artigos 24.º e 25.º da Lei n.º 6/2006 (NRAU), comunico que a renda mensal do locado sito em [morada] passa de ${eur(v.renda, l)} para ${eur(r.nouveauLoyer, l)}, a partir de [data, pelo menos 30 dias após a receção desta carta], por aplicação ${usados.length > 1 ? 'dos coeficientes' : 'do coeficiente'} ${usados.map((a) => `${nr(COEF_PT[String(a)].valor, l, 4)} (${a}, ${COEF_PT[String(a)].aviso})`).join(', ')}, publicado${usados.length > 1 ? 's' : ''} no Diário da República.\n\nCom os melhores cumprimentos,\n[nome do senhorio]\n[local e data]`,
    en: `Dear [tenant's name],\n\nUnder articles 24 and 25 of Law 6/2006 (NRAU), the monthly rent for [address] will change from ${eur(v.renda, l)} to ${eur(r.nouveauLoyer, l)} from [date, at least 30 days after this letter is received], applying the coefficient${usados.length > 1 ? 's' : ''} ${usados.map((a) => `${nr(COEF_PT[String(a)].valor, l, 4)} (${a})`).join(', ')} published in the Diário da República.\n\nYours sincerely,\n[landlord's name]\n[place and date]`,
  });
  return <Frame form={form} result={
    <ResultPanel lang={l} head={tr(l, { pt: `Nova renda em ${v.ano}`, en: `New rent in ${v.ano}` })} value={eur(r.nouveauLoyer, l)}
      sub={`+${eur(r.hausse, l)} ${tr(l, { pt: 'por mês', en: 'a month' })} · +${pc((fator - 1) * 100, l)}`}
      warn={usados.length > 1 ? tr(l, { pt: `Recupera ${usados.length - 1} coeficiente(s) de anos sem atualização.`, en: `Catches up ${usados.length - 1} coefficient(s) from years without an increase.` }) : undefined}
      rows={[
        ...usados.map((a) => ({ label: `${tr(l, { pt: 'Coeficiente', en: 'Coefficient' })} ${a} · ${COEF_PT[String(a)].aviso}`, value: nr(COEF_PT[String(a)].valor, l, 4) })),
        { label: tr(l, { pt: 'Aumento por ano', en: 'Increase over a year' }), value: eur(r.hausse * 12, l) },
        { label: tr(l, { pt: 'Nova renda', en: 'New rent' }), value: eur(r.nouveauLoyer, l), strong: true },
      ]}
      hyp={tr(l, { pt: `Coeficientes do INE publicados no Diário da República (o de ${v.ano} em ${displayDate(COEF_PT[String(v.ano)]?.data_dr ?? '2026-10-01', 'pt-PT')}). A renda arredonda-se ao cêntimo superior. O senhorio comunica o aumento por escrito com 30 dias de antecedência.`, en: 'INE coefficients published in the Diário da República. Rent is rounded up to the next cent. The landlord must give 30 days’ written notice.' })}
      methodHref={methodHref} copyText={`${eur(v.renda, l)} → ${eur(r.nouveauLoyer, l)} (${v.ano})`}>
    </ResultPanel>
  } after={<Letter lang={l} title={tr(l, { pt: 'Carta ao inquilino (gerada no seu navegador, nada é enviado)', en: 'Letter to the tenant (written in your browser, nothing is sent)' })} text={carta} />} />;
}
