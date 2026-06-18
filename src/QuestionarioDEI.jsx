import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const AZUL = '#1B6FAB';
const VERDE = '#6BBF4E';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f4f8fc',
    fontFamily: "'DM Sans', sans-serif",
    padding: '0 0 60px 0',
  },
  header: {
    background: AZUL,
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoText: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: '22px',
    color: '#fff',
    letterSpacing: '1px',
  },
  logoSub: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 16px rgba(27,111,171,0.10)',
    padding: '32px 28px',
    maxWidth: '680px',
    margin: '32px auto 0',
  },
  titulo: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: '20px',
    color: AZUL,
    marginBottom: '6px',
  },
  subtitulo: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  etapaBar: {
    display: 'flex',
    gap: '6px',
    marginBottom: '28px',
  },
  etapaItem: (ativa, concluida) => ({
    flex: 1,
    height: '5px',
    borderRadius: '3px',
    background: concluida ? VERDE : ativa ? AZUL : '#dde6ef',
    transition: 'background 0.3s',
  }),
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
    marginTop: '18px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #d1dce8',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #d1dce8',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    background: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    appearance: 'none',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1.5px solid #d1dce8',
    fontSize: '14px',
    color: '#1a1a2e',
    outline: 'none',
    boxSizing: 'border-box',
    minHeight: '90px',
    resize: 'vertical',
    fontFamily: "'DM Sans', sans-serif",
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  radioItem: (sel) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? AZUL : '#d1dce8'}`,
    background: sel ? '#eef5fb' : '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.2s',
  }),
  checkGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '6px',
  },
  checkItem: (sel) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1.5px solid ${sel ? VERDE : '#d1dce8'}`,
    background: sel ? '#f0faf0' : '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
    transition: 'all 0.2s',
  }),
  botao: {
    background: AZUL,
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '13px 32px',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer',
    marginTop: '28px',
    width: '100%',
    transition: 'background 0.2s',
  },
  botaoSec: {
    background: 'transparent',
    color: AZUL,
    border: `1.5px solid ${AZUL}`,
    borderRadius: '8px',
    padding: '11px 24px',
    fontSize: '14px',
    fontWeight: '600',
    fontFamily: "'Nunito', sans-serif",
    cursor: 'pointer',
    marginTop: '28px',
    marginRight: '12px',
  },
  erro: {
    background: '#fff3f3',
    border: '1px solid #f5c2c2',
    borderRadius: '8px',
    color: '#c0392b',
    fontSize: '13px',
    padding: '10px 14px',
    marginTop: '16px',
  },
  lgpd: {
    background: '#f4f8fc',
    borderRadius: '8px',
    padding: '14px 16px',
    fontSize: '12.5px',
    color: '#555',
    lineHeight: '1.7',
    marginTop: '18px',
    border: '1px solid #dde6ef',
  },
  secTitle: {
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 800,
    fontSize: '15px',
    color: AZUL,
    marginTop: '24px',
    marginBottom: '4px',
    borderBottom: `2px solid ${AZUL}`,
    paddingBottom: '4px',
  },
};

const ETAPAS = [
  'Dados Pessoais',
  'Situação Profissional',
  'Formação e Experiência',
  'Competências em Atração e Seleção',
  'Diversidade, Equidade e Inclusão',
  'Indicadores e Gestão',
  'Perfil e Motivação',
];

const inicial = {
  // Tela LGPD
  lgpd_tela: false,
  // Etapa 1
  nome: '', cpf: '', email: '', telefone: '', idade: '',
  estado_civil: '', filhos: '', cidade: '', bairro: '', mora_com: '',
  // Etapa 2
  situacao_profissional: '', empresa_atual: '', cargo_atual: '',
  salario_atual: '', disponibilidade_inicio: '',
  atividades_autonomo: '', possui_cnpj: '',
  // Etapa 3
  formacao: '', curso: '', pos_graduacao: '', area_pos: '',
  anos_experiencia_rs: '', segmentos_atuados: '',
  // Etapa 4
  volume_vagas_gerenciado: '', tipos_vagas: [], ferramentas_ats: '',
  metodologias_selecao: [], estrategia_regional: '',
  experiencia_employer_branding: '',
  maior_desafio_rs: '',
  // Etapa 5
  experiencia_dei: '', programas_afirmativos: [],
  grupos_atendidos: [], comite_diversidade: '',
  linguagem_inclusiva: '', parceiros_externos: '', parceiros_externos_descricao: '',
  sistemas_rh: '',
  // Etapa 6
  kpis_conhecidos: [], time_to_fill_medio: '',
  custo_por_contratacao: '', taxa_conversao: '',
  relatorios_diretoria: '', gestao_dados_dei: '',
  // Etapa 7
  motivacao_vaga: '', contribuicao: '',
  pretensao_salarial: '', expectativa_cargo: '',

};

export default function QuestionarioDEI() {
  const [tela, setTela] = useState('capa');
  const [lgpdAceite, setLgpdAceite] = useState(false);
  const [lgpdErro, setLgpdErro] = useState(false);
  const [etapa, setEtapa] = useState(0);
  const [form, setForm] = useState(inicial);
  const [erro, setErro] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const set = (campo, valor) => setForm(f => ({ ...f, [campo]: valor }));

  const toggleArray = (campo, valor) => {
    setForm(f => {
      const arr = f[campo] || [];
      return { ...f, [campo]: arr.includes(valor) ? arr.filter(v => v !== valor) : [...arr, valor] };
    });
  };

  const validar = () => {
    if (etapa === 0) {
      if (!form.nome.trim()) return 'Informe o nome completo.';
      if (!form.cpf.trim()) return 'Informe o CPF.';
      if (!form.email.trim()) return 'Informe o e-mail.';
      if (!form.telefone.trim()) return 'Informe o telefone.';
      if (!form.idade.trim()) return 'Informe a idade.';
      if (!form.estado_civil) return 'Informe o estado civil.';
      if (!form.filhos) return 'Informe se possui filhos.';
      if (!form.cidade.trim()) return 'Informe a cidade.';
      if (!form.bairro.trim()) return 'Informe o bairro.';
      if (!form.mora_com.trim()) return 'Informe com quem mora atualmente.';
    }
    if (etapa === 1) {
      if (!form.situacao_profissional) return 'Informe a situação profissional atual.';
      if ((form.situacao_profissional === 'Autônomo(a) / Empreendedor(a)' || form.situacao_profissional === 'Trabalhando como PJ (sem vínculo CLT)') && !form.atividades_autonomo.trim()) return 'Descreva em quais atividades atua como autônomo(a).';
      if ((form.situacao_profissional === 'Autônomo(a) / Empreendedor(a)' || form.situacao_profissional === 'Trabalhando como PJ (sem vínculo CLT)') && !form.possui_cnpj) return 'Informe se possui CNPJ.';
      if (!form.disponibilidade_inicio) return 'Informe a disponibilidade para início.';
      if (!form.disponibilidade_viagens) return 'Informe sua disponibilidade para viagens.';
    }
    if (etapa === 2) {
      if (!form.formacao) return 'Informe a formação acadêmica.';
      if (!form.curso.trim()) return 'Informe o curso de graduação.';
      if (!form.anos_experiencia_rs) return 'Informe os anos de experiência em R&S.';
      if (!form.segmentos_atuados.trim()) return 'Informe os segmentos em que atuou.';
      if (!form.sistemas_rh.trim()) return 'Descreva os sistemas de RH que utilizou.';
    }
    if (etapa === 3) {
      if (!form.volume_vagas_gerenciado) return 'Informe o volume de vagas gerenciado.';
      if (form.tipos_vagas.length === 0) return 'Selecione ao menos um tipo de vaga.';
      if (!form.ferramentas_ats.trim()) return 'Informe as ferramentas de ATS que utilizou.';
      if (form.metodologias_selecao.length === 0) return 'Selecione ao menos uma metodologia de seleção.';
      if (!form.estrategia_regional.trim()) return 'Descreva sua experiência com vagas em regiões desafiadoras.';
      if (!form.experiencia_employer_branding.trim()) return 'Descreva sua atuação em employer branding.';
      if (!form.maior_desafio_rs.trim()) return 'Compartilhe sua visão sobre o maior desafio em R&S.';
    }
    if (etapa === 4) {
      if (!form.experiencia_dei.trim()) return 'Descreva sua experiência em DE&I.';
      if (!form.comite_diversidade) return 'Informe sua experiência com Comitê de Diversidade.';
      if (!form.linguagem_inclusiva.trim()) return 'Descreva como aplica linguagem inclusiva.';
      if (!form.parceiros_externos) return 'Informe sobre parcerias externas para captação.';
    }
    if (etapa === 5) {
      if (form.kpis_conhecidos.length === 0) return 'Selecione ao menos um KPI que acompanha.';
      if (!form.time_to_fill_medio) return 'Informe o time to fill médio.';
      if (!form.custo_por_contratacao) return 'Informe sobre custo por contratação.';
      if (!form.relatorios_diretoria) return 'Informe sobre elaboração de relatórios para diretoria.';
      if (!form.gestao_dados_dei.trim()) return 'Descreva como organiza dados de DE&I.';
    }
    if (etapa === 6) {
      if (!form.motivacao_vaga.trim()) return 'Descreva sua motivação para esta vaga.';
      if (!form.contribuicao.trim()) return 'Descreva como pretende contribuir.';
      if (!form.pretensao_salarial.trim()) return 'Informe a pretensão salarial.';
    }
    return '';
  };

  const avancar = () => {
    const e = validar();
    if (e) { setErro(e); return; }
    setErro('');
    setEtapa(et => et + 1);
    window.scrollTo(0, 0);
  };

  const voltar = () => { setErro(''); setEtapa(et => et - 1); window.scrollTo(0, 0); };

  const enviar = async () => {
    const e = validar();
    if (e) { setErro(e); return; }
    setEnviando(true);
    try {
      const payload = {
        nome: form.nome, cpf: form.cpf, email: form.email,
        telefone: form.telefone, idade: form.idade,
        estado_civil: form.estado_civil, filhos: form.filhos,
        cidade: form.cidade, bairro: form.bairro, mora_com: form.mora_com,
        situacao_profissional: form.situacao_profissional,
        empresa_atual: form.empresa_atual, cargo_atual: form.cargo_atual,
        salario_atual: form.salario_atual, disponibilidade_inicio: form.disponibilidade_inicio,
        formacao: form.formacao, curso: form.curso,
        pos_graduacao: form.pos_graduacao, area_pos: form.area_pos,
        anos_experiencia_rs: form.anos_experiencia_rs,
        segmentos_atuados: form.segmentos_atuados, sistemas_rh: form.sistemas_rh,
        volume_vagas_gerenciado: form.volume_vagas_gerenciado,
        tipos_vagas: form.tipos_vagas.join(', '),
        ferramentas_ats: form.ferramentas_ats,
        metodologias_selecao: form.metodologias_selecao.join(', '),
        estrategia_regional: form.estrategia_regional,
        experiencia_employer_branding: form.experiencia_employer_branding,
        maior_desafio_rs: form.maior_desafio_rs,
        atividades_autonomo: form.atividades_autonomo,
        possui_cnpj: form.possui_cnpj,
        experiencia_dei: form.experiencia_dei,
        programas_afirmativos: form.programas_afirmativos.join(', '),
        grupos_atendidos: form.grupos_atendidos.join(', '),
        comite_diversidade: form.comite_diversidade,
        linguagem_inclusiva: form.linguagem_inclusiva,
        parceiros_externos: form.parceiros_externos,
        parceiros_externos_descricao: form.parceiros_externos_descricao,
        kpis_conhecidos: form.kpis_conhecidos.join(', '),
        time_to_fill_medio: form.time_to_fill_medio,
        custo_por_contratacao: form.custo_por_contratacao,
        taxa_conversao: form.taxa_conversao,
        relatorios_diretoria: form.relatorios_diretoria,
        gestao_dados_dei: form.gestao_dados_dei,
        motivacao_vaga: form.motivacao_vaga, contribuicao: form.contribuicao,
        pretensao_salarial: form.pretensao_salarial, expectativa_cargo: form.expectativa_cargo,
        lgpd_aceite: true, status: 'novo',
        criado_em: new Date().toISOString(),
      };
      const { error } = await supabase.from('candidatos_dei2').insert([payload]);
      if (error) throw error;
      setEnviado(true);
      window.scrollTo(0, 0);
    } catch (err) {
      const msg = err?.message || err?.details || err?.hint || JSON.stringify(err) || 'Erro desconhecido';
      setErro(`Erro ao enviar: ${msg}`);
      console.error('Erro Supabase:', err);
    }
    setEnviando(false);
  };

  if (tela === 'capa') {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.logoText}>genthe</div>
            <div style={styles.logoSub}>gente que entende de gente</div>
          </div>
        </div>
        <div style={{ ...styles.card, maxWidth: '620px' }}>
          <div style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: '22px', color: AZUL, marginBottom: '18px', lineHeight: '1.3' }}>
            Processo Seletivo<br />
            <span style={{ color: VERDE }}>Coordenador(a) de Diversidade, Equidade e Inclusão</span>
          </div>

          <div style={{ background: '#f4f8fc', borderRadius: '10px', padding: '20px 22px', marginBottom: '20px', border: '1px solid #dde6ef' }}>
            {[
              ['📍', 'Cidade', 'Campo Grande/MS'],
              ['🏢', 'Segmento', 'Varejo'],
              ['🧭', 'Departamento', 'Gestão'],
              ['📄', 'Contratação', 'CLT'],
              ['🏢', 'Local de trabalho', 'Presencial em Campo Grande/MS'],
              ['💰', 'Salário', 'R$ 13.000,00'],
              ['🎁', 'Benefícios', 'Informados na entrevista'],
            ].map(([emoji, label, valor]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: '1px solid #e8eef5' }}>
                <span style={{ fontSize: '16px', minWidth: '22px' }}>{emoji}</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#374151', minWidth: '140px' }}>{label}</span>
                <span style={{ fontSize: '13px', color: '#555' }}>{valor}</span>
              </div>
            ))}
          </div>

          <div style={{ background: '#eef5fb', borderRadius: '8px', padding: '14px 16px', fontSize: '13px', color: '#374151', lineHeight: '1.7', marginBottom: '20px', borderLeft: `4px solid ${AZUL}` }}>
            <strong style={{ color: AZUL }}>Sobre o processo seletivo</strong><br />
            Esta é uma vaga sigilosa. O nome da empresa contratante será revelado apenas na etapa de entrevista presencial.<br />
            O processo seletivo é conduzido pela <strong>Genthe Consultoria</strong> e inclui avaliação de questionário, teste comportamental e entrevistas presenciais com a liderança.
          </div>

          <button
            style={{ ...styles.botao, marginTop: '0' }}
            onClick={() => { setTela('lgpd'); window.scrollTo(0, 0); }}
          >
            Quero participar →
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#999' }}>
          📧 contato@genthe.com.br &nbsp;|&nbsp; 🌐 www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
        </div>
      </div>
    );
  }

  if (tela === 'lgpd') {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.logoText}>genthe</div>
            <div style={styles.logoSub}>gente que entende de gente</div>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textAlign: 'right' }}>
            Processo Seletivo<br />
            <strong style={{ color: '#fff' }}>Varejo | Campo Grande/MS</strong>
          </div>
        </div>
        <div style={{ ...styles.card, maxWidth: '620px' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
          <div style={styles.titulo}>Proteção de Dados — LGPD</div>
          <div style={{ ...styles.lgpd, marginTop: '12px', fontSize: '14px' }}>
            As informações fornecidas neste questionário serão utilizadas exclusivamente para fins de seleção e recrutamento pela <strong>Genthe Consultoria</strong>, em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>.<br /><br />
            Seus dados serão tratados com segurança, sigilo e responsabilidade. Não serão compartilhados com terceiros sem sua autorização prévia e expressa, exceto com a empresa contratante vinculada a este processo seletivo, para fins exclusivos de avaliação de candidatura.<br /><br />
            Você poderá solicitar a correção, atualização ou exclusão dos seus dados a qualquer momento pelo e-mail <strong>contato@genthe.com.br</strong>.<br /><br />
            Ao continuar, você declara ter lido e concordado com o tratamento dos seus dados pessoais para participação neste processo seletivo, nos termos da LGPD.
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '14px 16px', borderRadius: '8px', marginTop: '20px',
              border: `1.5px solid ${lgpdAceite ? VERDE : '#d1dce8'}`,
              background: lgpdAceite ? '#f0faf0' : '#fff',
              cursor: 'pointer', fontSize: '14px', color: '#374151',
            }}
            onClick={() => { setLgpdAceite(v => !v); setLgpdErro(false); }}
          >
            <span style={{ marginTop: '1px', fontSize: '16px' }}>{lgpdAceite ? '✅' : '⬜'}</span>
            Li e concordo com o tratamento dos meus dados pessoais para participação neste processo seletivo, conforme a LGPD.
          </div>
          {lgpdErro && <div style={styles.erro}>⚠️ É necessário concordar com os termos para continuar.</div>}
          <button
            style={{ ...styles.botao, marginTop: '20px' }}
            onClick={() => {
              if (!lgpdAceite) { setLgpdErro(true); return; }
              setTela('form'); window.scrollTo(0, 0);
            }}
          >
            Iniciar questionário →
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#999' }}>
          📧 contato@genthe.com.br &nbsp;|&nbsp; 🌐 www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
        </div>
      </div>
    );
  }

  if (enviado) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <div style={styles.logoText}>genthe</div>
            <div style={styles.logoSub}>gente que entende de gente</div>
          </div>
        </div>
        <div style={{ ...styles.card, textAlign: 'center', padding: '48px 32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <div style={{ ...styles.titulo, fontSize: '22px', marginBottom: '12px' }}>
            Questionário enviado com sucesso!
          </div>
          <p style={{ color: '#555', fontSize: '15px', lineHeight: '1.7' }}>
            Obrigada pela sua participação no processo seletivo.<br />
            Nossa equipe analisará suas respostas e entrará em contato em breve.
          </p>
          <p style={{ color: '#888', fontSize: '13px', marginTop: '24px' }}>
            📧 contato@genthe.com.br &nbsp;|&nbsp; 🌐 www.genthe.com.br
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <div style={styles.logoText}>genthe</div>
          <div style={styles.logoSub}>gente que entende de gente</div>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', textAlign: 'right' }}>
          Processo Seletivo<br />
          <strong style={{ color: '#fff' }}>Varejo | Campo Grande/MS</strong>
        </div>
      </div>

      <div style={styles.card}>
        {/* Barra de progresso */}
        <div style={styles.etapaBar}>
          {ETAPAS.map((_, i) => (
            <div key={i} style={styles.etapaItem(i === etapa, i < etapa)} />
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          Etapa {etapa + 1} de {ETAPAS.length} — <strong style={{ color: AZUL }}>{ETAPAS[etapa]}</strong>
        </div>

        {/* ───── ETAPA 0: Dados Pessoais ───── */}
        {etapa === 0 && (
          <>
            <div style={styles.titulo}>👤 Dados Pessoais</div>
            <div style={styles.subtitulo}>Preencha seus dados de identificação e contato.</div>

            <label style={styles.label}>Nome completo *</label>
            <input style={styles.input} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" />

            <label style={styles.label}>CPF *</label>
            <input style={styles.input} value={form.cpf} onChange={e => set('cpf', e.target.value)} placeholder="000.000.000-00" />

            <label style={styles.label}>E-mail *</label>
            <input style={styles.input} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />

            <label style={styles.label}>Telefone / WhatsApp *</label>
            <input style={styles.input} value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(67) 99999-0000" />

            <label style={styles.label}>Idade *</label>
            <input style={styles.input} value={form.idade} onChange={e => set('idade', e.target.value)} placeholder="Ex: 32" />

            <label style={styles.label}>Estado civil *</label>
            <div style={styles.radioGroup}>
              {['Solteiro(a)', 'Casado(a)', 'União estável', 'Divorciado(a)', 'Viúvo(a)'].map(op => (
                <div key={op} style={styles.radioItem(form.estado_civil === op)} onClick={() => set('estado_civil', op)}>
                  <span>{form.estado_civil === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Possui filhos? *</label>
            <div style={styles.radioGroup}>
              {['Não', 'Sim, 1 filho', 'Sim, 2 filhos', 'Sim, 3 ou mais filhos'].map(op => (
                <div key={op} style={styles.radioItem(form.filhos === op)} onClick={() => set('filhos', op)}>
                  <span>{form.filhos === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Cidade *</label>
            <input style={styles.input} value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Campo Grande/MS" />

            <label style={styles.label}>Bairro *</label>
            <input style={styles.input} value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Seu bairro" />

            <label style={styles.label}>Com quem mora atualmente? *</label>
            <textarea style={styles.textarea} value={form.mora_com} onChange={e => set('mora_com', e.target.value)} placeholder="Ex: com os pais, sozinho(a), com cônjuge e filhos..." />
          </>
        )}

        {/* ───── ETAPA 1: Situação Profissional ───── */}
        {etapa === 1 && (
          <>
            <div style={styles.titulo}>💼 Situação Profissional Atual</div>
            <div style={styles.subtitulo}>Informe sua situação atual e pretensão salarial.</div>

            <label style={styles.label}>Situação profissional atual *</label>
            <div style={styles.radioGroup}>
              {['Empregado(a) com carteira assinada (CLT)', 'Autônomo(a) / Empreendedor(a)', 'Trabalhando como PJ (sem vínculo CLT)', 'Desempregado(a)'].map(op => (
                <div key={op} style={styles.radioItem(form.situacao_profissional === op)} onClick={() => set('situacao_profissional', op)}>
                  <span style={{ fontSize: '16px' }}>{form.situacao_profissional === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            {form.situacao_profissional === 'Empregado(a) com carteira assinada (CLT)' && (
              <>
                <label style={styles.label}>Empresa atual</label>
                <input style={styles.input} value={form.empresa_atual} onChange={e => set('empresa_atual', e.target.value)} placeholder="Nome da empresa" />

                <label style={styles.label}>Cargo atual</label>
                <input style={styles.input} value={form.cargo_atual} onChange={e => set('cargo_atual', e.target.value)} placeholder="Seu cargo" />

                <label style={styles.label}>Remuneração atual (bruta)</label>
                <input style={styles.input} value={form.salario_atual} onChange={e => set('salario_atual', e.target.value)} placeholder="R$ 0.000,00" />
              </>
            )}

            {(form.situacao_profissional === 'Autônomo(a) / Empreendedor(a)' || form.situacao_profissional === 'Trabalhando como PJ (sem vínculo CLT)') && (
              <>
                <label style={styles.label}>Descreva em quais atividades atua *</label>
                <textarea style={styles.textarea} value={form.atividades_autonomo} onChange={e => set('atividades_autonomo', e.target.value)} placeholder="Ex: consultoria em RH, recrutamento freelance, treinamentos corporativos..." />

                <label style={styles.label}>Já abriu ou possui CNPJ? *</label>
                <div style={styles.radioGroup}>
                  {['Sim, possuo CNPJ ativo', 'Sim, mas está encerrado', 'Nunca abri CNPJ'].map(op => (
                    <div key={op} style={styles.radioItem(form.possui_cnpj === op)} onClick={() => set('possui_cnpj', op)}>
                      <span>{form.possui_cnpj === op ? '🔵' : '⚪'}</span> {op}
                    </div>
                  ))}
                </div>

                <label style={styles.label}>Remuneração média mensal atual</label>
                <input style={styles.input} value={form.salario_atual} onChange={e => set('salario_atual', e.target.value)} placeholder="R$ 0.000,00 (média mensal)" />
              </>
            )}

            <label style={styles.label}>Disponibilidade para início</label>
            <div style={styles.radioGroup}>
              {['Imediata', 'Em até 15 dias', 'Em até 30 dias', 'Necessito de aviso prévio (30 dias)'].map(op => (
                <div key={op} style={styles.radioItem(form.disponibilidade_inicio === op)} onClick={() => set('disponibilidade_inicio', op)}>
                  <span>{form.disponibilidade_inicio === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ───── ETAPA 2: Formação e Experiência ───── */}
        {etapa === 2 && (
          <>
            <div style={styles.titulo}>🎓 Formação e Experiência</div>
            <div style={styles.subtitulo}>Conte sobre sua formação acadêmica e trajetória profissional.</div>

            <label style={styles.label}>Formação acadêmica *</label>
            <select style={styles.select} value={form.formacao} onChange={e => set('formacao', e.target.value)}>
              <option value="">Selecione</option>
              <option>Superior completo</option>
              <option>Superior incompleto</option>
              <option>Pós-graduação / MBA</option>
              <option>Mestrado</option>
              <option>Doutorado</option>
            </select>

            <label style={styles.label}>Curso de graduação</label>
            <input style={styles.input} value={form.curso} onChange={e => set('curso', e.target.value)} placeholder="Ex: Psicologia, Administração, Gestão de RH..." />

            <label style={styles.label}>Possui pós-graduação, MBA ou especialização?</label>
            <div style={styles.radioGroup}>
              {['Sim', 'Não', 'Em andamento'].map(op => (
                <div key={op} style={styles.radioItem(form.pos_graduacao === op)} onClick={() => set('pos_graduacao', op)}>
                  <span>{form.pos_graduacao === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            {(form.pos_graduacao === 'Sim' || form.pos_graduacao === 'Em andamento') && (
              <>
                <label style={styles.label}>Área da pós-graduação / especialização</label>
                <input style={styles.input} value={form.area_pos} onChange={e => set('area_pos', e.target.value)} placeholder="Ex: Diversidade e Inclusão, Gestão de Pessoas..." />
              </>
            )}

            <label style={styles.label}>Anos de experiência em Recrutamento e Seleção *</label>
            <select style={styles.select} value={form.anos_experiencia_rs} onChange={e => set('anos_experiencia_rs', e.target.value)}>
              <option value="">Selecione</option>
              <option>Menos de 2 anos</option>
              <option>Entre 2 e 4 anos</option>
              <option>Entre 5 e 7 anos</option>
              <option>Mais de 8 anos</option>
            </select>

            <label style={styles.label}>Segmentos em que atuou (empresas e ramos)</label>
            <textarea style={styles.textarea} value={form.segmentos_atuados} onChange={e => set('segmentos_atuados', e.target.value)} placeholder="Ex: Varejo, Saúde, Logística, Serviços Financeiros..." />

            <label style={styles.label}>Quais sistemas de gestão de RH você já utilizou? Descreva as ferramentas e como as utilizou no dia a dia</label>
            <textarea style={styles.textarea} value={form.sistemas_rh} onChange={e => set('sistemas_rh', e.target.value)} placeholder="Descreva os sistemas de RH, ATS e ferramentas de gestão de pessoas que já utilizou e como aplicou cada um..." />
          </>
        )}

        {/* ───── ETAPA 3: Competências em A&S ───── */}
        {etapa === 3 && (
          <>
            <div style={styles.titulo}>🎯 Competências em Atração e Seleção</div>
            <div style={styles.subtitulo}>Precisamos entender sua experiência operacional e estratégica em R&S.</div>

            <div style={styles.secTitle}>Capacidade Operacional</div>

            <label style={styles.label}>Qual o maior volume de vagas que gerenciou simultaneamente?</label>
            <div style={styles.radioGroup}>
              {['Até 10 vagas', 'Entre 11 e 30 vagas', 'Entre 31 e 60 vagas', 'Entre 61 e 100 vagas', 'Mais de 100 vagas'].map(op => (
                <div key={op} style={styles.radioItem(form.volume_vagas_gerenciado === op)} onClick={() => set('volume_vagas_gerenciado', op)}>
                  <span>{form.volume_vagas_gerenciado === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Tipos de vagas que já recrutou (selecione todos que se aplicam)</label>
            <div style={styles.checkGroup}>
              {['Operacional / Chão de fábrica / Varejo', 'Administrativo / Suporte', 'Técnico especializado', 'Liderança / Coordenação', 'Alta gestão / C-Level', 'TI e Tecnologia', 'Comercial / Vendas'].map(op => (
                <div key={op} style={styles.checkItem(form.tipos_vagas.includes(op))} onClick={() => toggleArray('tipos_vagas', op)}>
                  <span style={{ marginTop: '1px' }}>{form.tipos_vagas.includes(op) ? '✅' : '⬜'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Ferramentas de ATS / sistemas de seleção que utilizou</label>
            <textarea style={styles.textarea} value={form.ferramentas_ats} onChange={e => set('ferramentas_ats', e.target.value)} placeholder="Ex: Gupy, Kenoby, Greenhouse, SAP SuccessFactors, planilhas próprias..." />

            <div style={styles.secTitle}>Metodologias e Estratégia</div>

            <label style={styles.label}>Metodologias de seleção que aplica (selecione todos que se aplicam)</label>
            <div style={styles.checkGroup}>
              {['Entrevista por competências (CBI)', 'Assessment comportamental (DISC, MBTI, outros)', 'Dinâmicas de grupo', 'Testes técnicos / provas situacionais', 'Entrevista estruturada em painel', 'Mapeamento por hunting (abordagem ativa)'].map(op => (
                <div key={op} style={styles.checkItem(form.metodologias_selecao.includes(op))} onClick={() => toggleArray('metodologias_selecao', op)}>
                  <span>{form.metodologias_selecao.includes(op) ? '✅' : '⬜'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Já atuou na atração de vagas em regiões com escassez de mão de obra ou baixo SLA de preenchimento? Como abordou?</label>
            <textarea style={styles.textarea} value={form.estrategia_regional} onChange={e => set('estrategia_regional', e.target.value)} placeholder="Descreva sua experiência com vagas em regiões desafiadoras e as estratégias que utilizou..." />

            <label style={styles.label}>Descreva sua atuação em employer branding e atração de talentos</label>
            <textarea style={styles.textarea} value={form.experiencia_employer_branding} onChange={e => set('experiencia_employer_branding', e.target.value)} placeholder="Ex: criação de conteúdo, gestão de marca empregadora, parcerias com universidades..." />

            <label style={styles.label}>Na sua visão, qual é o maior desafio real de quem trabalha com Recrutamento e Seleção hoje? Como você lida com ele? *</label>
            <textarea style={{ ...styles.textarea, minHeight: '110px' }} value={form.maior_desafio_rs} onChange={e => set('maior_desafio_rs', e.target.value)} placeholder="Compartilhe sua perspectiva com base na sua experiência prática..." />
          </>
        )}

        {/* ───── ETAPA 4: DE&I ───── */}
        {etapa === 4 && (
          <>
            <div style={styles.titulo}>🌎 Diversidade, Equidade e Inclusão</div>
            <div style={styles.subtitulo}>Conte sobre sua experiência prática com projetos e iniciativas de DE&I.</div>

            <label style={styles.label}>Descreva sua experiência com projetos, iniciativas ou estratégias de DE&I em ambientes corporativos *</label>
            <textarea style={{ ...styles.textarea, minHeight: '120px' }} value={form.experiencia_dei} onChange={e => set('experiencia_dei', e.target.value)} placeholder="Descreva de forma objetiva o que implementou, em qual empresa, qual foi o impacto gerado..." />

            <label style={styles.label}>Já estruturou ou geriu programas afirmativos de vagas? (selecione todos que se aplicam)</label>
            <div style={styles.checkGroup}>
              {['Vagas afirmativas para PCDs', 'Vagas afirmativas para pessoas negras', 'Programa de liderança feminina / mulheres em cargos de decisão', 'Processo seletivo inclusivo para LGBTQIA+', 'Ainda não tive essa experiência, mas tenho formação na área'].map(op => (
                <div key={op} style={styles.checkItem(form.programas_afirmativos.includes(op))} onClick={() => toggleArray('programas_afirmativos', op)}>
                  <span>{form.programas_afirmativos.includes(op) ? '✅' : '⬜'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Para quais grupos já desenvolveu estratégias de inclusão? (selecione todos que se aplicam)</label>
            <div style={styles.checkGroup}>
              {['Pessoas com deficiência (PCD)', 'Pessoas negras e pardas', 'Mulheres em cargos de liderança', 'Comunidade LGBTQIA+', 'Pessoas 50+', 'Pessoas em situação de vulnerabilidade social', 'Comunidades indígenas ou quilombolas'].map(op => (
                <div key={op} style={styles.checkItem(form.grupos_atendidos.includes(op))} onClick={() => toggleArray('grupos_atendidos', op)}>
                  <span>{form.grupos_atendidos.includes(op) ? '✅' : '⬜'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Já participou da criação ou coordenação de um Comitê de Diversidade e Inclusão?</label>
            <div style={styles.radioGroup}>
              {['Sim, fui responsável pela criação', 'Sim, participei ativamente', 'Participei de forma pontual', 'Não tive essa experiência'].map(op => (
                <div key={op} style={styles.radioItem(form.comite_diversidade === op)} onClick={() => set('comite_diversidade', op)}>
                  <span>{form.comite_diversidade === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Como você aplica linguagem neutra e inclusiva em comunicações de recrutamento?</label>
            <textarea style={styles.textarea} value={form.linguagem_inclusiva} onChange={e => set('linguagem_inclusiva', e.target.value)} placeholder="Descreva sua abordagem prática para garantir comunicações acessíveis e sem vieses..." />

            <label style={styles.label}>Já estabeleceu parcerias externas para ampliar o acesso de pessoas aos processos seletivos?</label>
            <div style={styles.radioGroup}>
              {[
                'Sim, com ONGs voltadas a grupos sub-representados',
                'Sim, com instituições de ensino (universidades, cursos técnicos, EJA)',
                'Sim, com órgãos públicos (SINE, Secretarias, programas sociais)',
                'Sim, com comunidades ou coletivos focados em diversidade',
                'Sim, com mais de um tipo de parceiro acima',
                'Ainda não, mas tenho contatos e interesse em desenvolver',
                'Nunca trabalhei com parcerias externas para captação',
              ].map(op => (
                <div key={op} style={styles.radioItem(form.parceiros_externos === op)} onClick={() => set('parceiros_externos', op)}>
                  <span>{form.parceiros_externos === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Descreva como essas parcerias funcionaram na prática: quais parceiros, que resultado geraram e como ampliaram o acesso de candidatos diversos</label>
            <textarea style={{ ...styles.textarea, minHeight: '110px' }} value={form.parceiros_externos_descricao} onChange={e => set('parceiros_externos_descricao', e.target.value)} placeholder="Ex: parceria com o SINE local para vagas afirmativas PCD, triplicou o volume de candidatos com deficiência em 3 meses..." />
          </>
        )}

        {/* ───── ETAPA 5: Indicadores e Gestão ───── */}
        {etapa === 5 && (
          <>
            <div style={styles.titulo}>📊 Indicadores e Gestão Estratégica</div>
            <div style={styles.subtitulo}>Avaliamos o domínio sobre métricas e resultados da área.</div>

            <label style={styles.label}>Quais KPIs de recrutamento você acompanha regularmente? (selecione todos que se aplicam)</label>
            <div style={styles.checkGroup}>
              {[
                'Time to fill (tempo de preenchimento da vaga)',
                'Time to hire (tempo desde a candidatura até a contratação)',
                'Custo por contratação (cost per hire)',
                'Taxa de conversão do funil de seleção',
                'Qualidade das contratações (retenção em 90 dias)',
                'Taxa de aceite de ofertas (offer acceptance rate)',
                'NPS do candidato (experiência no processo)',
                'Indicadores de representatividade (% por grupo)',
                'SLA de atendimento por gestor (business partner)',
              ].map(op => (
                <div key={op} style={styles.checkItem(form.kpis_conhecidos.includes(op))} onClick={() => toggleArray('kpis_conhecidos', op)}>
                  <span>{form.kpis_conhecidos.includes(op) ? '✅' : '⬜'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Qual era o time to fill médio nas suas últimas experiências (dias corridos)?</label>
            <div style={styles.radioGroup}>
              {['Até 15 dias', 'Entre 16 e 30 dias', 'Entre 31 e 45 dias', 'Acima de 45 dias', 'Variava muito conforme o perfil'].map(op => (
                <div key={op} style={styles.radioItem(form.time_to_fill_medio === op)} onClick={() => set('time_to_fill_medio', op)}>
                  <span>{form.time_to_fill_medio === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Já calculou ou acompanhou custo por contratação?</label>
            <div style={styles.radioGroup}>
              {['Sim, com metodologia estruturada', 'Sim, de forma estimada', 'Não, mas conheço o conceito', 'Nunca trabalhei com esse indicador'].map(op => (
                <div key={op} style={styles.radioItem(form.custo_por_contratacao === op)} onClick={() => set('custo_por_contratacao', op)}>
                  <span>{form.custo_por_contratacao === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Qual a taxa de conversão média do seu funil de seleção (candidatos inscritos vs. contratados)?</label>
            <input style={styles.input} value={form.taxa_conversao} onChange={e => set('taxa_conversao', e.target.value)} placeholder="Ex: 1 contratado a cada 20 candidatos / aproximadamente 5%..." />

            <label style={styles.label}>Já elaborou relatórios estratégicos ou apresentações de R&S para diretoria ou alta gestão?</label>
            <div style={styles.radioGroup}>
              {['Sim, com frequência (mensal ou trimestral)', 'Sim, pontualmente quando solicitado', 'Não tive essa responsabilidade'].map(op => (
                <div key={op} style={styles.radioItem(form.relatorios_diretoria === op)} onClick={() => set('relatorios_diretoria', op)}>
                  <span>{form.relatorios_diretoria === op ? '🔵' : '⚪'}</span> {op}
                </div>
              ))}
            </div>

            <label style={styles.label}>Como você organiza e apresenta dados de DE&I para evidenciar avanços na representatividade?</label>
            <textarea style={styles.textarea} value={form.gestao_dados_dei} onChange={e => set('gestao_dados_dei', e.target.value)} placeholder="Descreva a metodologia, ferramentas ou dashboards que utilizou para monitorar indicadores de diversidade..." />
          </>
        )}

        {/* ───── ETAPA 6: Perfil e Motivação ───── */}
        {etapa === 6 && (
          <>
            <div style={styles.titulo}>💡 Perfil e Motivação</div>
            <div style={styles.subtitulo}>Compartilhe o que te move e o que espera desta oportunidade.</div>

            <label style={styles.label}>Por que você se candidatou a esta vaga? O que te atraiu nela?</label>
            <textarea style={{ ...styles.textarea, minHeight: '100px' }} value={form.motivacao_vaga} onChange={e => set('motivacao_vaga', e.target.value)} placeholder="Seja objetivo(a): o que te motivou a candidatar?" />

            <label style={styles.label}>De que forma você acredita que pode contribuir para a estratégia de atração e diversidade desta empresa?</label>
            <textarea style={{ ...styles.textarea, minHeight: '100px' }} value={form.contribuicao} onChange={e => set('contribuicao', e.target.value)} placeholder="Descreva sua contribuição esperada com base na sua trajetória..." />

            <label style={styles.label}>Pretensão salarial</label>
            <input style={styles.input} value={form.pretensao_salarial} onChange={e => set('pretensao_salarial', e.target.value)} placeholder="R$ 0.000,00" />

            <label style={styles.label}>Qual cargo ou nível hierárquico você almeja nos próximos 3 anos?</label>
            <textarea style={styles.textarea} value={form.expectativa_cargo} onChange={e => set('expectativa_cargo', e.target.value)} placeholder="Descreva suas expectativas de crescimento profissional..." />
          </>
        )}



        {/* Erros */}
        {erro && <div style={styles.erro}>⚠️ {erro}</div>}

        {/* Navegação */}
        <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
          {etapa > 0 && (
            <button style={styles.botaoSec} onClick={voltar}>← Voltar</button>
          )}
          {etapa < ETAPAS.length - 1 ? (
            <button style={{ ...styles.botao, marginTop: '0', flex: 1 }} onClick={avancar}>
              Continuar →
            </button>
          ) : (
            <button
              style={{ ...styles.botao, marginTop: '0', flex: 1, background: enviando ? '#888' : VERDE }}
              onClick={enviar}
              disabled={enviando}
            >
              {enviando ? 'Enviando...' : '✅ Enviar Questionário'}
            </button>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '12px', color: '#999' }}>
        📧 contato@genthe.com.br &nbsp;|&nbsp; 🌐 www.genthe.com.br &nbsp;|&nbsp; @gentheconsultoria
      </div>
    </div>
  );
}
