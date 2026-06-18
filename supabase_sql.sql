-- Execute no Supabase > SQL Editor

CREATE TABLE candidatos_dei (
  id                        BIGSERIAL PRIMARY KEY,
  -- Dados pessoais
  nome                      TEXT,
  cpf                       TEXT,
  email                     TEXT,
  telefone                  TEXT,
  idade                     TEXT,
  estado_civil              TEXT,
  filhos                    TEXT,
  cidade                    TEXT,
  bairro                    TEXT,
  mora_com                  TEXT,
  -- Situação profissional
  situacao_profissional     TEXT,
  empresa_atual             TEXT,
  cargo_atual               TEXT,
  salario_atual             TEXT,
  disponibilidade_inicio    TEXT,
  atividades_autonomo       TEXT,
  possui_cnpj               TEXT,
  -- Formação e experiência
  formacao                  TEXT,
  curso                     TEXT,
  pos_graduacao             TEXT,
  area_pos                  TEXT,
  anos_experiencia_rs       TEXT,
  segmentos_atuados         TEXT,
  sistemas_rh               TEXT,
  -- Competências A&S
  volume_vagas_gerenciado   TEXT,
  tipos_vagas               TEXT,
  ferramentas_ats           TEXT,
  metodologias_selecao      TEXT,
  estrategia_regional       TEXT,
  experiencia_employer_branding TEXT,
  maior_desafio_rs          TEXT,
  -- DE&I
  experiencia_dei           TEXT,
  programas_afirmativos     TEXT,
  grupos_atendidos          TEXT,
  comite_diversidade        TEXT,
  linguagem_inclusiva       TEXT,
  parceiros_externos        TEXT,
  parceiros_externos_descricao TEXT,
  -- Indicadores
  kpis_conhecidos           TEXT,
  time_to_fill_medio        TEXT,
  custo_por_contratacao     TEXT,
  taxa_conversao            TEXT,
  relatorios_diretoria      TEXT,
  gestao_dados_dei          TEXT,
  -- Motivação
  motivacao_vaga            TEXT,
  contribuicao              TEXT,
  pretensao_salarial        TEXT,
  expectativa_cargo         TEXT,
  -- Controle interno
  lgpd_aceite               BOOLEAN DEFAULT TRUE,
  status                    TEXT DEFAULT 'novo',
  observacoes               TEXT,
  criado_em                 TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS para leitura e inserção via anon key
ALTER TABLE candidatos_dei ENABLE ROW LEVEL SECURITY;

CREATE POLICY insert_anon ON candidatos_dei FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY select_anon ON candidatos_dei FOR SELECT TO anon USING (true);
CREATE POLICY update_anon ON candidatos_dei FOR UPDATE TO anon USING (true);
