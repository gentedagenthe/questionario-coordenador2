import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'genthe2026';

const s = {
  page: { minHeight: '100vh', background: '#f4f8fc', fontFamily: "'DM Sans', sans-serif" },
  header: { background: AZUL, padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoText: { fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '20px', color: '#fff' },
  logoSub: { fontFamily: "'Nunito', sans-serif", fontWeight: 600, fontSize: '10px', color: 'rgba(255,255,255,0.75)', letterSpacing: '2px', textTransform: 'uppercase' },
  body: { maxWidth: '1100px', margin: '0 auto', padding: '32px 20px' },
  card: { background: '#fff', borderRadius: '12px', boxShadow: '0 2px 12px rgba(27,111,171,0.09)', padding: '28px 24px', marginBottom: '20px' },
  input: { padding: '9px 13px', borderRadius: '8px', border: '1.5px solid #d1dce8', fontSize: '14px', outline: 'none', fontFamily: "'DM Sans', sans-serif", width: '100%', boxSizing: 'border-box' },
  botao: (cor) => ({ background: cor || AZUL, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 22px', fontSize: '14px', fontWeight: 700, fontFamily: "'Nunito', sans-serif", cursor: 'pointer' }),
  tag: (status) => {
    const cores = { novo: ['#eef5fb', AZUL], em_analise: ['#fff8e1', '#e67e00'], aprovado: ['#f0faf0', VERDE], reprovado: ['#fff3f3', '#c0392b'] };
    const [bg, fg] = cores[status] || ['#f0f0f0', '#555'];
    return { background: bg, color: fg, borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: 700 };
  },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '32px 16px' },
  modalCard: { background: '#fff', borderRadius: '14px', padding: '32px 28px', maxWidth: '740px', width: '100%', position: 'relative' },
  linha: { display: 'flex', borderBottom: '1px solid #eef0f4', padding: '9px 0', fontSize: '13.5px', gap: '12px' },
  linhaLabel: { fontWeight: 700, color: '#374151', minWidth: '200px', flexShrink: 0 },
  linhaValor: { color: '#555', flex: 1 },
  secTitle: { fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '14px', color: AZUL, borderBottom: `2px solid ${AZUL}`, paddingBottom: '4px', marginTop: '22px', marginBottom: '8px' },
};

const STATUS_LABELS = { novo: 'Novo', em_analise: 'Em análise', aprovado: 'Aprovado', reprovado: 'Reprovado' };

export default function AdminPanel() {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [candidatos, setCandidatos] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [selecionado, setSelecionado] = useState(null);
  const [obs, setObs] = useState('');
  const [salvando, setSalvando] = useState(false);

  const login = () => {
    if (senha === ADMIN_PASSWORD) { setLogado(true); carregar(); }
    else setErroLogin('Senha incorreta.');
  };

  const carregar = async () => {
    const { data } = await supabase.from('candidatos_dei').select('*').order('criado_em', { ascending: false });
    if (data) setCandidatos(data);
  };

  useEffect(() => { if (logado) carregar(); }, [logado]);

  const abrir = (c) => { setSelecionado(c); setObs(c.observacoes || ''); };
  const fechar = () => setSelecionado(null);

  const salvarObs = async () => {
    setSalvando(true);
    await supabase.from('candidatos_dei').update({ observacoes: obs }).eq('id', selecionado.id);
    setSelecionado(c => ({ ...c, observacoes: obs }));
    setCandidatos(cs => cs.map(c => c.id === selecionado.id ? { ...c, observacoes: obs } : c));
    setSalvando(false);
  };

  const alterarStatus = async (id, status) => {
    await supabase.from('candidatos_dei').update({ status }).eq('id', id);
    setCandidatos(cs => cs.map(c => c.id === id ? { ...c, status } : c));
    if (selecionado?.id === id) setSelecionado(c => ({ ...c, status }));
  };

  const filtrados = candidatos.filter(c => {
    const ok = filtroStatus === 'todos' || c.status === filtroStatus;
    const b = busca.toLowerCase();
    return ok && (!b || c.nome?.toLowerCase().includes(b) || c.email?.toLowerCase().includes(b));
  });

  const contagem = (s) => candidatos.filter(c => c.status === s).length;

  const campo = (label, valor) => valor ? (
    <div style={s.linha}>
      <span style={s.linhaLabel}>{label}</span>
      <span style={s.linhaValor}>{valor}</span>
    </div>
  ) : null;

  if (!logado) return (
    <div style={{ ...s.page, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ ...s.card, maxWidth: '380px', textAlign: 'center' }}>
        <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '22px', color: AZUL, marginBottom: '6px' }}>genthe</div>
        <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>Painel Administrativo — Processo DE&I</div>
        <input style={s.input} type="password" placeholder="Senha de acesso" value={senha} onChange={e => setSenha(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()} />
        {erroLogin && <div style={{ color: '#c0392b', fontSize: '13px', marginTop: '10px' }}>{erroLogin}</div>}
        <button style={{ ...s.botao(), marginTop: '16px', width: '100%' }} onClick={login}>Entrar</button>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.logoText}>genthe — Admin</div>
          <div style={s.logoSub}>Processo Seletivo DE&I | Varejo</div>
        </div>
        <button style={{ ...s.botao('#ffffff33'), fontSize: '13px', padding: '7px 16px' }} onClick={carregar}>↻ Atualizar</button>
      </div>

      <div style={s.body}>
        {/* Cards de resumo */}
        <div style={{ display: 'flex', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[['Todos', candidatos.length, '#1B6FAB'], ['Novos', contagem('novo'), '#1B6FAB'], ['Em Análise', contagem('em_analise'), '#e67e00'], ['Aprovados', contagem('aprovado'), VERDE], ['Reprovados', contagem('reprovado'), '#c0392b']].map(([label, n, cor]) => (
            <div key={label} style={{ background: '#fff', borderRadius: '10px', padding: '16px 22px', flex: '1', minWidth: '100px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', borderTop: `4px solid ${cor}` }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: cor, fontFamily: "'Nunito', sans-serif" }}>{n}</div>
              <div style={{ fontSize: '13px', color: '#666' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ ...s.card, padding: '16px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input style={{ ...s.input, maxWidth: '280px' }} placeholder="Buscar por nome ou e-mail..." value={busca} onChange={e => setBusca(e.target.value)} />
          <select style={{ ...s.input, maxWidth: '180px' }} value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)}>
            <option value="todos">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="em_analise">Em análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="reprovado">Reprovado</option>
          </select>
          <span style={{ fontSize: '13px', color: '#888' }}>{filtrados.length} resultado(s)</span>
        </div>

        {/* Tabela */}
        <div style={s.card}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${AZUL}`, color: AZUL }}>
                {['Nome', 'Telefone', 'Situação', 'Exp. R&S', 'Status', 'Ação'].map(h => (
                  <th key={h} style={{ padding: '10px 8px', textAlign: 'left', fontWeight: 700, fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eef0f4', cursor: 'pointer' }} onClick={() => abrir(c)}>
                  <td style={{ padding: '10px 8px', fontWeight: 600, color: '#1a1a2e' }}>{c.nome}</td>
                  <td style={{ padding: '10px 8px', color: '#555' }}>{c.telefone}</td>
                  <td style={{ padding: '10px 8px', color: '#555', fontSize: '12px' }}>{c.situacao_profissional?.split('(')[0].trim()}</td>
                  <td style={{ padding: '10px 8px', color: '#555', fontSize: '12px' }}>{c.anos_experiencia_rs}</td>
                  <td style={{ padding: '10px 8px' }}><span style={s.tag(c.status)}>{STATUS_LABELS[c.status] || c.status}</span></td>
                  <td style={{ padding: '10px 8px' }} onClick={e => e.stopPropagation()}>
                    <select style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '6px', border: '1.5px solid #d1dce8' }} value={c.status || 'novo'} onChange={e => alterarStatus(c.id, e.target.value)}>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
              {filtrados.length === 0 && (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#aaa' }}>Nenhum candidato encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selecionado && (
        <div style={s.modal} onClick={fechar}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <button onClick={fechar} style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#888' }}>✕</button>

            <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '20px', color: AZUL, marginBottom: '4px' }}>{selecionado.nome}</div>
            <span style={s.tag(selecionado.status)}>{STATUS_LABELS[selecionado.status]}</span>

            <div style={s.secTitle}>Dados Pessoais</div>
            {campo('CPF', selecionado.cpf)}
            {campo('E-mail', selecionado.email)}
            {campo('Telefone', selecionado.telefone)}
            {campo('Idade', selecionado.idade)}
            {campo('Estado civil', selecionado.estado_civil)}
            {campo('Filhos', selecionado.filhos)}
            {campo('Cidade / Bairro', [selecionado.cidade, selecionado.bairro].filter(Boolean).join(' — '))}
            {campo('Mora com', selecionado.mora_com)}

            <div style={s.secTitle}>Situação Profissional</div>
            {campo('Situação atual', selecionado.situacao_profissional)}
            {campo('Empresa atual', selecionado.empresa_atual)}
            {campo('Cargo atual', selecionado.cargo_atual)}
            {campo('Remuneração atual', selecionado.salario_atual)}
            {campo('Disponibilidade', selecionado.disponibilidade_inicio)}
            {campo('Atividades como autônomo(a)', selecionado.atividades_autonomo)}
            {campo('Possui CNPJ', selecionado.possui_cnpj)}

            <div style={s.secTitle}>Formação e Experiência</div>
            {campo('Formação', selecionado.formacao)}
            {campo('Curso', selecionado.curso)}
            {campo('Pós-graduação', selecionado.pos_graduacao)}
            {campo('Área da pós', selecionado.area_pos)}
            {campo('Anos em R&S', selecionado.anos_experiencia_rs)}
            {campo('Segmentos', selecionado.segmentos_atuados)}
            {campo('Sistemas de RH utilizados', selecionado.sistemas_rh)}

            <div style={s.secTitle}>Competências em Atração e Seleção</div>
            {campo('Volume de vagas gerenciado', selecionado.volume_vagas_gerenciado)}
            {campo('Tipos de vagas', selecionado.tipos_vagas)}
            {campo('Ferramentas ATS', selecionado.ferramentas_ats)}
            {campo('Metodologias de seleção', selecionado.metodologias_selecao)}
            {campo('Estratégia regional', selecionado.estrategia_regional)}
            {campo('Employer branding', selecionado.experiencia_employer_branding)}
            {campo('Maior desafio em R&S', selecionado.maior_desafio_rs)}

            <div style={s.secTitle}>Diversidade, Equidade e Inclusão</div>
            {campo('Experiência em DE&I', selecionado.experiencia_dei)}
            {campo('Programas afirmativos', selecionado.programas_afirmativos)}
            {campo('Grupos atendidos', selecionado.grupos_atendidos)}
            {campo('Comitê de D&I', selecionado.comite_diversidade)}
            {campo('Linguagem inclusiva', selecionado.linguagem_inclusiva)}
            {campo('Parcerias externas para captação', selecionado.parceiros_externos)}
            {campo('Como as parcerias funcionaram', selecionado.parceiros_externos_descricao)}

            <div style={s.secTitle}>Indicadores e Gestão</div>
            {campo('KPIs conhecidos', selecionado.kpis_conhecidos)}
            {campo('Time to fill médio', selecionado.time_to_fill_medio)}
            {campo('Custo por contratação', selecionado.custo_por_contratacao)}
            {campo('Taxa de conversão', selecionado.taxa_conversao)}
            {campo('Relatórios para diretoria', selecionado.relatorios_diretoria)}
            {campo('Gestão de dados DE&I', selecionado.gestao_dados_dei)}

            <div style={s.secTitle}>Perfil e Motivação</div>
            {campo('Motivação para a vaga', selecionado.motivacao_vaga)}
            {campo('Contribuição esperada', selecionado.contribuicao)}
            {campo('Pretensão salarial', selecionado.pretensao_salarial)}
            {campo('Expectativa de cargo', selecionado.expectativa_cargo)}

            <div style={s.secTitle}>Observações Internas (Genthe)</div>
            <textarea
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #d1dce8', fontSize: '13px', minHeight: '80px', resize: 'vertical', fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box', marginTop: '8px' }}
              value={obs}
              onChange={e => setObs(e.target.value)}
              placeholder="Registre observações internas sobre este candidato..."
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
              <button style={s.botao()} onClick={salvarObs} disabled={salvando}>
                {salvando ? 'Salvando...' : '💾 Salvar observações'}
              </button>
              <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #d1dce8', fontSize: '13px' }} value={selecionado.status || 'novo'} onChange={e => alterarStatus(selecionado.id, e.target.value)}>
                {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
