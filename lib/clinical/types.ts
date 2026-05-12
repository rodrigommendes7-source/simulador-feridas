// ─── Variáveis clínicas numéricas ───────────────────────────────────────────

/** Representação numérica do estado da ferida. Utilizada na avaliação por material. */
export type VariaveisFerida = {
  /** 1=ausente  2=ligeiro  3=moderado  4=abundante */
  exsudado: 1 | 2 | 3 | 4;
  /** 0=ausente  1=local  2=marcada  3=sistémica */
  infeccao: 0 | 1 | 2 | 3;
  /** 1=necrose  2=fibrina  3=granulação  4=epitelização  5=hipergranulação */
  tecido: 1 | 2 | 3 | 4 | 5;
  /** 0=ausente  1=ligeiro  2=moderado  3=intenso */
  odor: 0 | 1 | 2 | 3;
  /** 1=seca  2=ligeira  3=moderada  4=maceração */
  humidade: 1 | 2 | 3 | 4;
  /** 1=superficial  2=moderada  3=profunda  4=cavidade */
  profundidade: 1 | 2 | 3 | 4;
  /** 1=indefinidos  2=irregulares  3=regulares  4=em epitelização */
  bordos: 1 | 2 | 3 | 4;
  /** 1=macerada  2=frágil  3=eritematosa  4=íntegra */
  pele_perilesional: 1 | 2 | 3 | 4;
  /** 0=ausente  1=ligeira  2=moderada  3=intensa */
  dor: 0 | 1 | 2 | 3;
  /** 0=ausente  1=ligeira  2=moderada  3=abundante */
  hemorragia: 0 | 1 | 2 | 3;
  /** 1=pressão  2=venosa  3=arterial  4=diabética  5=traumática  6=cirúrgica  7=queimadura */
  etiologia: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  /** 0=comprometida  1=adequada */
  perfusao: 0 | 1;
};

/** @deprecated Use VariaveisFerida */
export type WoundVariables = VariaveisFerida;

/**
 * Condição de avaliação: cada chave mapeia para lista de valores válidos.
 * Uma condição com objecto vazio {} corresponde a "aplicável a qualquer ferida".
 * A lógica é AND: todas as chaves presentes têm de corresponder.
 */
export type CondicaoVariavelFerida = Partial<Record<keyof VariaveisFerida, number[]>>;

/** @deprecated Use CondicaoVariavelFerida */
export type WoundVariableCondition = CondicaoVariavelFerida;

/** Regras clínicas de um material ou técnica. */
export type RegrasClinicas = {
  /** Condições para classificação "correto" — deve satisfazer todas as chaves */
  condicoes_ideais: CondicaoVariavelFerida;
  /** Condições para classificação "parcial" (opcional) */
  condicoes_parciais?: CondicaoVariavelFerida;
  /** Lista de condições de contraindicação — basta uma corresponder para "incorreto" */
  contraindicacoes: CondicaoVariavelFerida[];
  /** Condições para bónus adicional de 0,25 pts */
  bonus?: CondicaoVariavelFerida;
};

/** @deprecated Use RegrasClinicas */
export type MaterialRules = RegrasClinicas;

/** Classificação por material no novo sistema de avaliação */
export type ClassificacaoMaterial = "correto" | "parcial" | "incorreto";

/** @deprecated Use ClassificacaoMaterial */
export type MaterialClassification = ClassificacaoMaterial;

/** Resultado da avaliação de um material individual */
export type PontuacaoMaterial = {
  idMaterial: string;
  rotulo: string;
  nome_comercial?: string | null;
  substancia_ativa?: string;
  classificacao: ClassificacaoMaterial;
  /** 1.0 = correto  |  0.5 = parcial  |  0 = incorreto  (+ 0.25 se temBonus) */
  pontuacao: number;
  temBonus: boolean;
  justificacao: string;
};

/** @deprecated Use PontuacaoMaterial */
export type MaterialScore = PontuacaoMaterial;

/** Item de feedback por material */
export type ItemFeedbackMaterial = {
  material: string;
  justificacao: string;
};

/** @deprecated Use ItemFeedbackMaterial */
export type MaterialFeedbackItem = ItemFeedbackMaterial;

/** Feedback estruturado gerado após avaliação de materiais */
export type FeedbackMaterial = {
  corretos: ItemFeedbackMaterial[];
  parciais: ItemFeedbackMaterial[];
  incorretos: ItemFeedbackMaterial[];
  /** Materiais não selecionados que seriam ideais para esta ferida */
  sugestoes: ItemFeedbackMaterial[];
};

/** @deprecated Use FeedbackMaterial */
export type MaterialFeedback = FeedbackMaterial;

// ─── Tipos existentes ────────────────────────────────────────────────────────

export type FuncaoTratamento =
  | "limpar"
  | "antisseptico"
  | "absorver"
  | "controlar-bioburden"
  | "desbridar"
  | "proteger-perilesional"
  | "hidratar"
  | "cobertura-atraumatica"
  | "gerir-odor"
  | "aliviar-pressao";

/** @deprecated Use FuncaoTratamento */
export type TreatmentFunction = FuncaoTratamento;

export type IntencaoClinica =
  | "controlar-exsudado"
  | "controlar-bioburden"
  | "desbridamento"
  | "proteger-perilesional"
  | "proteger-pele"
  | "gerir-odor"
  | "aliviar-pressao"
  | "cobertura-atraumatica"
  | "limpar-ferida"
  | "compressao-venosa"
  | "referenciar-medico";

/** @deprecated Use IntencaoClinica */
export type ClinicalIntent = IntencaoClinica;

export type ClassificacaoAvaliacao =
  | "essencial"
  | "adequado"
  | "redundante"
  | "inadequado";

/** @deprecated Use ClassificacaoAvaliacao */
export type EvaluationClassification = ClassificacaoAvaliacao;

export type IdObservacao =
  | "imagem"
  | "dimensoes"
  | "exsudado"
  | "cheiro"
  | "tecidos"
  | "bordos"
  | "pele_perilesional";

/** @deprecated Use IdObservacao */
export type ObservationId = IdObservacao;

export type IdDialogo =
  | "dor"
  | "duracao"
  | "posicao"
  | "pensos"
  | "febre"
  | "mobilidade";

/** @deprecated Use IdDialogo */
export type DialogueId = IdDialogo;

export type IdAplicacao =
  | "direto_seco"
  | "penso_rapido"
  | "penso_simples"
  | "ligadura"
  | "penso_impermeavel"
  | "terapia_compressiva"
  | "sem_protecao";

/** @deprecated Use IdAplicacao */
export type ApplicationId = IdAplicacao;

export type ReferenciaEvidencia = {
  id: string;
  titulo: string;
  url: string;
  resumo: string;
};

/** @deprecated Use ReferenciaEvidencia */
export type EvidenceReference = ReferenciaEvidencia;

export type DefinicaoTratamento = {
  id: string;
  rotulo: string;
  canonicalId: string;
  equivalenceGroup: string;
  category: string;
  subCategory: string;
  funcoes: FuncaoTratamento[];
  indicacoes: string[];
  avisos_contraindicacao: string[];
  refsEvidencia: string[];
  learningTopicIds: string[];
  etiquetas: string[];
  /** Nome comercial de referência (ex: "Aquacel®"); null quando não existe nome comercial relevante */
  nome_comercial?: string | null;
  /** Substância ativa ou denominação comum (ex: "Carboximetilcelulose sódica") */
  substancia_ativa?: string;
  /** Categoria para o sistema de avaliação por material */
  categoria_clinica?: "apositos" | "liquidos" | "pomadas" | "outros";
  /** Regras clínicas para avaliação correto/parcial/incorreto */
  regras?: RegrasClinicas;
};

/** @deprecated Use DefinicaoTratamento */
export type TreatmentDefinition = DefinicaoTratamento;

export type ErroComum = {
  id: string;
  titulo: string;
  explicacao: string;
  idsTratamentoRelacionado?: string[];
};

/** @deprecated Use ErroComum */
export type CommonMistake = ErroComum;

/** Linha de uma tabela clínica (pares chave/valor em colunas). */
export type LinhaTabelaClinica = {
  /** Valores das colunas, na mesma ordem de `cabecalhos`. */
  celulas: string[];
};

/** @deprecated Use LinhaTabelaClinica */
export type ClinicalTableRow = LinhaTabelaClinica;

/** Tabela clínica estruturada (ex: tecidos × ação clínica). */
export type TabelaClinica = {
  id: string;
  titulo: string;
  /** Descrição breve do propósito da tabela (1-2 frases). */
  descricao?: string;
  /** Cabeçalhos das colunas. */
  cabecalhos: string[];
  linhas: LinhaTabelaClinica[];
};

/** @deprecated Use TabelaClinica */
export type ClinicalTable = TabelaClinica;

/** Destaque clínico — conceito chave ou regra prática. */
export type ConceitoChave = {
  id: string;
  titulo: string;
  corpo: string;
};

/** @deprecated Use ConceitoChave */
export type KeyConcept = ConceitoChave;

/** Alerta clínico — bandeira vermelha, sinais sistémicos, escalamento. */
export type AlertaClinico = {
  id: string;
  /** Gravidade visual — afeta a cor do destaque na UI. */
  gravidade: "informacao" | "aviso" | "critico";
  titulo: string;
  corpo: string;
};

/** @deprecated Use AlertaClinico */
export type ClinicalAlert = AlertaClinico;

export type TemaAprendizagem = {
  id: string;
  titulo: string;
  dificuldade: "base" | "intermedio" | "avancado";
  definition: string;
  indicacoes: string[];
  avisos_contraindicacao: string[];
  sinais_alerta: string[];
  erros_comuns: ErroComum[];
  idsEvidencia: string[];
  idsTratamento: string[];
  idsCaso: string[];
  idsTopicoRelacionado: string[];
  /** Tabelas clínicas estruturadas (opcional). */
  tabelas?: TabelaClinica[];
  /** Conceitos-chave ou regras práticas (opcional). */
  conceitosChave?: ConceitoChave[];
  /** Alertas clínicos / bandeiras vermelhas (opcional). */
  alertas?: AlertaClinico[];
};

/** @deprecated Use TemaAprendizagem */
export type LearningTopic = TemaAprendizagem;

export type DefinicaoObservacao = {
  id: IdObservacao;
  rotulo: string;
  prioridade: "essencial" | "adequado";
  instrucao: string;
  idsTemas: string[];
};

/** @deprecated Use DefinicaoObservacao */
export type ObservationDefinition = DefinicaoObservacao;

export type PerguntaDialogo = {
  id: IdDialogo;
  rotulo: string;
  pergunta: string;
  prioridade: "essencial" | "adequado";
  idsTemas: string[];
};

/** @deprecated Use PerguntaDialogo */
export type DialoguePrompt = PerguntaDialogo;

export type OpcaoAplicacao = {
  id: IdAplicacao;
  rotulo: string;
  idsTemas: string[];
  /** Regras clínicas para avaliação da técnica (correto/parcial/incorreto) */
  regras?: RegrasClinicas;
};

/** @deprecated Use OpcaoAplicacao */
export type ApplicationOption = OpcaoAplicacao;

export type CorrespondenciaObjetivo = {
  idsTratamento?: string[];
  funcoesTratamento?: FuncaoTratamento[];
  idsAplicacao?: IdAplicacao[];
};

/** @deprecated Use CorrespondenciaObjetivo */
export type GoalMatcher = CorrespondenciaObjetivo;

export type ObjetivoCaso = {
  id: string;
  rotulo: string;
  intencao: IntencaoClinica;
  prioridade: "essencial" | "adequado";
  justificativa: string;
  idsTemas: string[];
  correspondencia: CorrespondenciaObjetivo;
};

/** @deprecated Use ObjetivoCaso */
export type CaseGoal = ObjetivoCaso;

export type RegraAvaliacao = {
  id: string;
  alvo: "treatment" | "application";
  aplicavelAIds: string[];
  classificacao: ClassificacaoAvaliacao;
  motivo: string;
  idsTemas: string[];
};

/** @deprecated Use RegraAvaliacao */
export type EvaluationRule = RegraAvaliacao;

export type EstadoFerida = {
  /**
   * Escala de exsudado (5 níveis — Lev-Tov et al., 2025 / WRAHPS):
   * - nenhum:    penso seco após uso
   * - escasso:   vestígios no penso (< 25% da cobertura)
   * - ligeiro:   < 50% da cobertura impregnada
   * - moderado:  50–75% da cobertura impregnada
   * - abundante: > 75% da cobertura impregnada (ou saturação)
   */
  exsudado: "nenhum" | "escasso" | "ligeiro" | "moderado" | "abundante";
  /**
   * Alinhado com IWII Wound Infection Continuum 2022.
   * - contaminacao: micro-organismos presentes, sem multiplicação
   * - colonizacao: multiplicação sem resposta do hospedeiro
   * - infecao-local-encoberta: sinais subtis (granulação friável, odor, estagnação)
   * - infecao-local-evidente: sinais clássicos (eritema, dor, calor, exsudado purulento)
   * - infecao-em-propagacao: eritema >2 cm, extensão para tecidos profundos, linfangite
   * - infecao-sistemica: febre, sépsis
   */
  infeccao:
    | "contaminacao"
    | "colonizacao"
    | "infecao-local-encoberta"
    | "infecao-local-evidente"
    | "infecao-em-propagacao"
    | "infecao-sistemica";
  tecido: "granulacao" | "granulacao-fibrina" | "fibrina" | "desvitalizado" | "hipergranulacao" | "necrose-fibrina" | "necrose-mista";
  perilesional: "integra" | "fragil" | "macerada" | "eritematosa";
  odor: "ausente" | "ligeiro" | "presente" | "fetido" | "intenso";
};

/** @deprecated Use EstadoFerida */
export type WoundState = EstadoFerida;

export type DetalheObservacao = {
  detalhe: string;
  prioridade?: "essencial" | "adequado";
};

/** @deprecated Use DetalheObservacao */
export type ObservationDetail = DetalheObservacao;

export type ModeloCaso = {
  id: string;
  slug: string;
  tituloAbreviado: string;
  title: string;
  tituloCenario: string;
  descricao: string;
  competencias: string;
  difficulty: "introdutorio" | "intermedio" | "avancado";
  ordem: number;
  minutosEstimados: number;
  status: "disponivel" | "preparacao";
  srcImagem: string;
  altImagem: string;
  resumoIntro: string;
  objetivo: string;
  definicoesObservacao: DefinicaoObservacao[];
  promptsDialogo: PerguntaDialogo[];
  definicoesAplicacao: OpcaoAplicacao[];
  contextoPaciente: string;
  bannerPaciente: string;
  estadoFerida: EstadoFerida;
  variavelFerida?: VariaveisFerida;
  objetivosVisuais: ObjetivosIdentificacaoVisual;
  detalhesObservacao: Record<IdObservacao, DetalheObservacao>;
  respostasDialogo: Record<IdDialogo, string>;
  tratamentosDisponiveis: string[];
  opcoesAplicacao: IdAplicacao[];
  objetivosClinicosAlvo: ObjetivoCaso[];
  regrasAvaliacao: RegraAvaliacao[];
  zonasTecido?: ZonaTecido[];
  justificacoesOverride?: Record<string, SubstituicaoJustificacao>;
  urlImagemDepois?: string;
  legendaEvolucao?: string;
  idsTemas: string[];
  planoRecomendado: {
    minimo: string[];
    otimizado: string[];
  };
};

/** @deprecated Use ModeloCaso */
export type CaseTemplate = ModeloCaso;

export type EntradaTentativa = {
  idsObservacao: IdObservacao[];
  submissaoVisual: SubmissaoIdentificacaoVisual;
  marcadoresTecido?: MarcadorTecido[];
  idsDialogo: IdDialogo[];
  idsTratamento: string[];
  idsAplicacao: IdAplicacao[];
  respostasJustificacao?: RespostaJustificacao[];
};

/** @deprecated Use EntradaTentativa */
export type AttemptInput = EntradaTentativa;

export type ItemAvaliacao = {
  id: string;
  idOrigem?: string;
  rotulo: string;
  classificacao: ClassificacaoAvaliacao;
  explicacao: string;
  idsTemas: string[];
  justificacaoCorreta?: boolean | null;
  /** Peso explícito que sobrepõe pesosClassificacao para este item */
  pesoOverride?: number;
};

/** @deprecated Use ItemAvaliacao */
export type EvaluationItem = ItemAvaliacao;

export type EstadoRevisao = "correto" | "incorreto" | "omitido" | null;

/** @deprecated Use EstadoRevisao */
export type ReviewStatus = EstadoRevisao;

export type RevisaoTentativa = {
  tentativaIdeal: EntradaTentativa;
  estadoObservacao: Partial<Record<IdObservacao, EstadoRevisao>>;
  estadoDialogo: Partial<Record<IdDialogo, EstadoRevisao>>;
  estadoTratamento: Record<string, EstadoRevisao>;
  estadoAplicacao: Partial<Record<IdAplicacao, EstadoRevisao>>;
};

/** @deprecated Use RevisaoTentativa */
export type AttemptReview = RevisaoTentativa;

// ─── Anotação de tecidos ───────────────────────────────────────────────────

/** Tipo de tecido anotável — alinhado com os valores de OpcaoTecidoVisual */
export type TipoTecidoAnotavel =
  | "necrose"
  | "fibrina"
  | "granulacao"
  | "epitelial"
  | "hipergranulacao";

/** @deprecated Use TipoTecidoAnotavel */
export type AnnotatableTissueType = TipoTecidoAnotavel;

/** Retângulo em coordenadas relativas à imagem (0-1) */
export type RetanguloRelativo = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** @deprecated Use RetanguloRelativo */
export type RelativeRect = RetanguloRelativo;

/** Zona ground truth para um tipo de tecido na imagem da variante */
export type ZonaTecido = {
  tipoTecido: TipoTecidoAnotavel;
  retangulo: RetanguloRelativo;
};

/** @deprecated Use ZonaTecido */
export type TissueZone = ZonaTecido;

/** Pin colocado pelo aluno na imagem */
export type MarcadorTecido = {
  id: string;
  tipoTecido: TipoTecidoAnotavel;
  x: number;
  y: number;
};

/** @deprecated Use MarcadorTecido */
export type TissuePin = MarcadorTecido;

// ─── Justificação clínica por escolha múltipla ───────────────────────────────

export type OpcaoJustificacao = {
  id: string;
  texto: string;
};

/** @deprecated Use OpcaoJustificacao */
export type JustificationOption = OpcaoJustificacao;

export type PerguntaJustificacao = {
  idTratamento: string;
  rotuloTratamento: string;
  opcoes: OpcaoJustificacao[];
  idOpcaoCorreta: string;
  tipo: "correspondencia-ideal" | "contraindicado" | "redundante" | "sem-correspondencia";
};

/** @deprecated Use PerguntaJustificacao */
export type JustificationQuestion = PerguntaJustificacao;

export type SubstituicaoJustificacao = {
  opcoes: OpcaoJustificacao[];
  idOpcaoCorreta: string;
};

/** @deprecated Use SubstituicaoJustificacao */
export type JustificationOverride = SubstituicaoJustificacao;

export type RespostaJustificacao = {
  idTratamento: string;
  idOpcaoSelecionada: string;
};

/** @deprecated Use RespostaJustificacao */
export type JustificationAnswer = RespostaJustificacao;

// ─── Identificação Visual ──────────────────────────────────────────────────

export type OpcaoTecidoVisual =
  | "granulacao"
  | "fibrina"
  | "necrose"
  | "epitelial"
  | "hipergranulacao";

/** @deprecated Use OpcaoTecidoVisual */
export type VisualTissueOption = OpcaoTecidoVisual;

export type OpcaoExsudadoVisual =
  | "seroso"
  | "hematico"
  | "purulento";

/** @deprecated Use OpcaoExsudadoVisual */
export type VisualExudateOption = OpcaoExsudadoVisual;

export type OpcaoBordosVisual =
  | "maceracao"
  | "rubor"
  | "hiperqueratose"
  | "pele-seca"
  | "integra";

/** @deprecated Use OpcaoBordosVisual */
export type VisualEdgeOption = OpcaoBordosVisual;

export interface DefinicaoOpcaoVisual<T extends string> {
  id: T;
  rotulo: string;
  description?: string;
}

/** @deprecated Use DefinicaoOpcaoVisual */
export type VisualOptionDefinition<T extends string> = DefinicaoOpcaoVisual<T>;

export interface ObjetivosIdentificacaoVisual {
  tecidos: OpcaoTecidoVisual[];
  exsudado: OpcaoExsudadoVisual[];
  bordos: OpcaoBordosVisual[];
}

/** @deprecated Use ObjetivosIdentificacaoVisual */
export type VisualIdentificationTargets = ObjetivosIdentificacaoVisual;

export interface SubmissaoIdentificacaoVisual {
  tecidos: OpcaoTecidoVisual[];
  exsudado: OpcaoExsudadoVisual[];
  bordos: OpcaoBordosVisual[];
}

/** @deprecated Use SubmissaoIdentificacaoVisual */
export type VisualIdentificationSubmission = SubmissaoIdentificacaoVisual;

// ──────────────────────────────────────────────────────────────────────────────

export type SeccaoAvaliacao = {
  id:
    | "observacao"
    | "identificacao-visual"
    | "avaliacao"
    | "plano-terapeutico"
    | "tecnica-aplicacao";
  title: string;
  pontuacao: number;
  pontuacaoMaxima: number;
  itens: ItemAvaliacao[];
};

/** @deprecated Use SeccaoAvaliacao */
export type EvaluationSection = SeccaoAvaliacao;

export type ComparacaoPlanoRecomendado = {
  minimo: string[];
  otimizado: string[];
  diferencas: string[];
};

/** @deprecated Use ComparacaoPlanoRecomendado */
export type RecommendedPlanComparison = ComparacaoPlanoRecomendado;

export type RecomendacaoAprendizagem = {
  idTema: string;
  titulo: string;
  motivo: string;
  prioridade: "alta" | "media";
};

/** @deprecated Use RecomendacaoAprendizagem */
export type LearningRecommendation = RecomendacaoAprendizagem;

export type AvaliacaoCaso = {
  pontuacao: number;
  penalizacaoJustificacao: number;
  justificacoesErradas: number;
  seccoes: SeccaoAvaliacao[];
  resumoRaciocinio: {
    leitura: string;
    essenciais: string[];
    corretos: string[];
    redundantes: string[];
    inadequados: string[];
    proximoPasso: string;
  };
  planoRecomendado: ComparacaoPlanoRecomendado;
  recomendacoesAprendizagem: RecomendacaoAprendizagem[];
};

/** @deprecated Use AvaliacaoCaso */
export type CaseEvaluation = AvaliacaoCaso;

export type RegistoTentativa = {
  version: 3;
  id: string;
  idCaso: string;
  tituloCaso: string;
  pontuacao: number;
  melhorPontuacaoAnteriorCaso: number | null;
  pontuacoesPorSeccao: Record<string, number>;
  codigosErro: string[];
  recomendacoesAprendizagem: string[];
  idsTemasCaso: string[];
  idsProximosCasos: string[];
  temasFracosDominantes: string[];
  observacoesSeleccionadas: IdObservacao[];
  dialogosSeleccionados: IdDialogo[];
  tratamentosSeleccionados: string[];
  aplicacoesSeleccionadas: IdAplicacao[];
  resumo: string;
  data: string;
  duracaoSegundos: number;
};

/** @deprecated Use RegistoTentativa */
export type AttemptRecord = RegistoTentativa;

export type MestriaTema = {
  idTema: string;
  titulo: string;
  pontuacaoMestria: number;
  contadorRecomendacoes: number;
  contadorSinalFraco: number;
  contadorExposicao: number;
};

/** @deprecated Use MestriaTema */
export type TopicMastery = MestriaTema;

export type CasoRecomendado = {
  idModelo: string;
  titulo: string;
  tituloAbreviado: string;
  difficulty: ModeloCaso["difficulty"];
  motivo: string;
  topicosCorrespondentes: string[];
  pontuacaoMedia: number | null;
  tentativas: number;
};

/** @deprecated Use CasoRecomendado */
export type RecommendedCase = CasoRecomendado;

export type ProgressoCaso = {
  idModelo: string;
  titulo: string;
  tentativas: number;
  pontuacaoMedia: number | null;
  melhorPontuacao: number | null;
  ultimaPontuacao: number | null;
  melhorPontuacaoAnterior: number | null;
  concluido: boolean;
};

/** @deprecated Use ProgressoCaso */
export type CaseProgress = ProgressoCaso;
