import { tratamentos, type Tratamento } from "@/data/tratamentos";
import type { AvaliacaoSecao, TratamentoId } from "@/app/types/simulador";

type ObjetivoTratamento = {
  id: string;
  pontos: number;
  descricaoAcerto: string;
  descricaoFalta: string;
  obrigatorio?: boolean;
  corresponde: (tratamento: Tratamento) => boolean;
};

type PenalizacaoTratamento = {
  id: string;
  pontos: number;
  descricaoErro: string;
  justificacao: string;
  aplica: (selecionados: Tratamento[]) => boolean;
};

type PerfilAvaliacaoTratamento = {
  nome: string;
  maximo: number;
  objetivos: ObjetivoTratamento[];
  penalizacoes?: PenalizacaoTratamento[];
  limiteSelecaoExcessiva?: {
    limite: number;
    penalizacao: number;
    mensagemExcesso: string;
    justificacao: string;
  };
};

const tratamentoPorId = new Map(tratamentos.map((tratamento) => [tratamento.id, tratamento]));

function criarSecaoTratamento(nome: string, maximo: number): AvaliacaoSecao {
  return {
    nome,
    pontuacao: 0,
    maximo,
    acertou: [],
    errou: [],
    faltou: [],
    excesso: [],
    justificacaoPerda: [],
  };
}

function validarTratamentos(idsSelecionados: TratamentoId[]) {
  const selecionados: Tratamento[] = [];
  const desconhecidos: string[] = [];

  for (const id of idsSelecionados) {
    const tratamento = tratamentoPorId.get(id);
    if (tratamento) {
      selecionados.push(tratamento);
    } else {
      desconhecidos.push(id);
    }
  }

  return { selecionados, desconhecidos };
}

function temFuncao(...funcoes: string[]) {
  return (tratamento: Tratamento) =>
    funcoes.some((funcao) => tratamento.funcoes.includes(funcao));
}

function avaliarTratamentos(
  idsSelecionados: TratamentoId[],
  perfil: PerfilAvaliacaoTratamento
): AvaliacaoSecao {
  const secao = criarSecaoTratamento(perfil.nome, perfil.maximo);
  const { selecionados, desconhecidos } = validarTratamentos(idsSelecionados);

  if (desconhecidos.length > 0) {
    secao.errou.push(
      `Foram ignorados tratamentos não reconhecidos na lista atual: ${desconhecidos.join(", ")}.`
    );
    secao.justificacaoPerda.push(
      "Perdeste pontuação potencial porque alguns itens não existem em data/tratamentos.ts."
    );
  }

  for (const objetivo of perfil.objetivos) {
    const encontrou = selecionados.some(objetivo.corresponde);

    if (encontrou) {
      secao.pontuacao += objetivo.pontos;
      secao.acertou.push(objetivo.descricaoAcerto);
      continue;
    }

    if (objetivo.obrigatorio) {
      secao.faltou.push(objetivo.descricaoFalta);
      secao.justificacaoPerda.push(`Perdeste pontuação por não cumprir: ${objetivo.id}.`);
    }
  }

  for (const penalizacao of perfil.penalizacoes ?? []) {
    if (!penalizacao.aplica(selecionados)) continue;

    secao.pontuacao -= penalizacao.pontos;
    secao.errou.push(penalizacao.descricaoErro);
    secao.justificacaoPerda.push(penalizacao.justificacao);
  }

  if (selecionados.length === 0) {
    secao.faltou.push("Não selecionaste qualquer tratamento.");
    secao.justificacaoPerda.push(
      "Sem uma decisão terapêutica não é possível atingir boa pontuação clínica."
    );
  }

  if (
    perfil.limiteSelecaoExcessiva &&
    selecionados.length > perfil.limiteSelecaoExcessiva.limite
  ) {
    secao.pontuacao -= perfil.limiteSelecaoExcessiva.penalizacao;
    secao.excesso.push(perfil.limiteSelecaoExcessiva.mensagemExcesso);
    secao.justificacaoPerda.push(perfil.limiteSelecaoExcessiva.justificacao);
  }

  return secao;
}

const casoUmPerfil: PerfilAvaliacaoTratamento = {
  nome: "Escolha do tratamento",
  maximo: 50,
  objetivos: [
    {
      id: "controlo_exsudado",
      pontos: 30,
      obrigatorio: true,
      descricaoAcerto: "Selecionaste material adequado para controlo do exsudado.",
      descricaoFalta:
        "Faltou escolher um tratamento com função de controlo de exsudado/absorção.",
      corresponde: temFuncao("controlo_exsudado", "absorcao"),
    },
    {
      id: "protecao_perilesional",
      pontos: 15,
      obrigatorio: true,
      descricaoAcerto: "Incluíste proteção da pele perilesional.",
      descricaoFalta: "Faltou proteger a pele perilesional.",
      corresponde: temFuncao("protecao_perilesional", "barreira_cutanea", "hidratacao_pele"),
    },
    {
      id: "desbridamento_contextual",
      pontos: 5,
      descricaoAcerto: "Consideraste uma opção de desbridamento que pode ser útil se indicado.",
      descricaoFalta: "",
      corresponde: temFuncao("desbridamento"),
    },
  ],
  penalizacoes: [
    {
      id: "antissepticos-contraindicados",
      pontos: 12,
      descricaoErro:
        "Selecionaste um antisséptico contraindicado para o leito da ferida (ex.: álcool 70%/água oxigenada).",
      justificacao:
        "Perdeste pontuação por escolher produtos citotóxicos/contraindicados em feridas crónicas.",
      aplica: (selecionados) =>
        selecionados.some((tratamento) =>
          (tratamento.contraindicacoes ?? []).some((item) =>
            ["ferida_cronica", "tecido_viavel", "leito_da_ferida"].includes(item)
          )
        ),
    },
    {
      id: "anti-inflamatorio-fora-prioridade",
      pontos: 8,
      descricaoErro: "Selecionaste anti-inflamatório tópico sem ser prioridade clínica do caso.",
      justificacao: "Perdeste pontuação por uma decisão terapêutica pouco alinhada com o objetivo principal.",
      aplica: (selecionados) => selecionados.some(temFuncao("anti_inflamatorio_topico")),
    },
    {
      id: "cauterizacao-fora-indicacao",
      pontos: 6,
      descricaoErro: "Selecionaste cauterização química sem indicação de hipergranulação.",
      justificacao: "Perdeste pontuação por abordagem não indicada para o problema dominante.",
      aplica: (selecionados) => selecionados.some(temFuncao("cauterizacao_quimica")),
    },
  ],
  limiteSelecaoExcessiva: {
    limite: 5,
    penalizacao: 5,
    mensagemExcesso: "Selecionaste tratamentos em excesso para o mesmo objetivo terapêutico.",
    justificacao: "Perdeste pontuação por falta de foco terapêutico na seleção final.",
  },
};

const casoDoisPerfil: PerfilAvaliacaoTratamento = {
  nome: "Escolha do tratamento",
  maximo: 50,
  objetivos: [
    {
      id: "controlo_infeccao",
      pontos: 20,
      obrigatorio: true,
      descricaoAcerto:
        "Incluíste cobertura antimicrobiana adequada para suspeita de infeção local.",
      descricaoFalta: "Faltou incluir uma opção com controlo microbiano.",
      corresponde: temFuncao("controlo_microbiano", "prata", "antisseptico"),
    },
    {
      id: "controlo_exsudado",
      pontos: 15,
      obrigatorio: true,
      descricaoAcerto: "Selecionaste tratamento orientado para controlo do exsudado.",
      descricaoFalta: "Faltou controlar exsudado com material absorvente adequado.",
      corresponde: temFuncao("controlo_exsudado", "absorcao"),
    },
    {
      id: "desbridamento",
      pontos: 15,
      obrigatorio: true,
      descricaoAcerto: "Valorizaste desbridamento perante tecido desvitalizado/fibrina.",
      descricaoFalta: "Faltou considerar estratégia de desbridamento.",
      corresponde: temFuncao("desbridamento", "desbridamento_enzimatico", "desbridamento_autolitico"),
    },
  ],
  penalizacoes: [
    {
      id: "antissepticos-contraindicados",
      pontos: 10,
      descricaoErro:
        "Selecionaste antisséptico contraindicado para o leito da ferida (ex.: álcool 70%/água oxigenada).",
      justificacao: "Perdeste pontuação por utilização de produto lesivo para tecido viável.",
      aplica: (selecionados) =>
        selecionados.some((tratamento) =>
          (tratamento.contraindicacoes ?? []).some((item) =>
            ["ferida_cronica", "tecido_viavel", "leito_da_ferida"].includes(item)
          )
        ),
    },
    {
      id: "anti-inflamatorio-fora-prioridade",
      pontos: 8,
      descricaoErro: "Selecionaste anti-inflamatório tópico fora da prioridade do caso.",
      justificacao: "Perdeste pontuação por decisão desajustada ao contexto de infeção/exsudado.",
      aplica: (selecionados) => selecionados.some(temFuncao("anti_inflamatorio_topico")),
    },
    {
      id: "hidratacao-isolada",
      pontos: 4,
      descricaoErro:
        "Privilegiaste apenas hidratação (hidrogel) num contexto em que exsudado/infeção são prioritários.",
      justificacao: "Perdeste pontuação por priorização terapêutica inadequada.",
      aplica: (selecionados) =>
        selecionados.some(temFuncao("hidratacao")) &&
        !selecionados.some(temFuncao("controlo_exsudado", "absorcao")),
    },
  ],
  limiteSelecaoExcessiva: {
    limite: 6,
    penalizacao: 5,
    mensagemExcesso: "Selecionaste demasiados tratamentos para o mesmo plano de penso.",
    justificacao: "Perdeste pontuação por excesso de materiais e menor coerência terapêutica.",
  },
};


const casoTresPerfil: PerfilAvaliacaoTratamento = {
  nome: "Escolha do tratamento",
  maximo: 50,
  objetivos: [
    {
      id: "controlo_infeccao",
      pontos: 18,
      obrigatorio: true,
      descricaoAcerto:
        "Incluíste cobertura antimicrobiana adequada para infeção local.",
      descricaoFalta: "Faltou incluir opção com controlo microbiano.",
      corresponde: temFuncao("controlo_microbiano", "prata", "antisseptico"),
    },
    {
      id: "controlo_exsudado",
      pontos: 14,
      obrigatorio: true,
      descricaoAcerto: "Selecionaste material absorvente para exsudado abundante.",
      descricaoFalta: "Faltou selecionar material para gestão do exsudado.",
      corresponde: temFuncao("controlo_exsudado", "absorcao"),
    },
    {
      id: "desbridamento",
      pontos: 10,
      obrigatorio: true,
      descricaoAcerto: "Selecionaste estratégia de desbridamento adequada.",
      descricaoFalta: "Faltou considerar desbridamento perante tecido desvitalizado.",
      corresponde: temFuncao("desbridamento", "desbridamento_enzimatico", "desbridamento_autolitico"),
    },
    {
      id: "protecao_perilesional",
      pontos: 8,
      obrigatorio: true,
      descricaoAcerto: "Incluíste proteção da pele perilesional.",
      descricaoFalta: "Faltou proteção da pele perilesional.",
      corresponde: temFuncao("protecao_perilesional", "barreira_cutanea", "hidratacao_pele"),
    },
  ],
  penalizacoes: [
    {
      id: "antissepticos-contraindicados",
      pontos: 10,
      descricaoErro:
        "Selecionaste antisséptico contraindicado para o leito da ferida (ex.: álcool 70%/água oxigenada).",
      justificacao: "Perdeste pontuação por utilização de produto lesivo para tecido viável.",
      aplica: (selecionados) =>
        selecionados.some((tratamento) =>
          (tratamento.contraindicacoes ?? []).some((item) =>
            ["ferida_cronica", "tecido_viavel", "leito_da_ferida"].includes(item)
          )
        ),
    },
    {
      id: "hidrogel-fora-prioridade",
      pontos: 6,
      descricaoErro:
        "Selecionaste hidrogel num contexto em que exsudado abundante e maceração exigem prioridade absorvente.",
      justificacao: "Perdeste pontuação por priorização terapêutica inadequada.",
      aplica: (selecionados) => selecionados.some((tratamento) => tratamento.id === "hidrogel"),
    },
    {
      id: "redundancia-prata",
      pontos: 8,
      descricaoErro:
        "Selecionaste simultaneamente hidrofibra com prata e alginato com prata (redundância terapêutica).",
      justificacao: "Perdeste pontuação por redundância de materiais com função semelhante.",
      aplica: (selecionados) => {
        const ids = new Set(selecionados.map((item) => item.id));
        return ids.has("aquacel-ag") && ids.has("silvercel");
      },
    },
  ],
  limiteSelecaoExcessiva: {
    limite: 6,
    penalizacao: 5,
    mensagemExcesso: "Selecionaste demasiados tratamentos para o mesmo plano de penso.",
    justificacao: "Perdeste pontuação por excesso de materiais e menor coerência terapêutica.",
  },
};

export function calcularPontuacaoTratamentoCaso1(idsSelecionados: TratamentoId[]): AvaliacaoSecao {
  return avaliarTratamentos(idsSelecionados, casoUmPerfil);
}

export function calcularPontuacaoTratamentoCaso2(idsSelecionados: TratamentoId[]): AvaliacaoSecao {
  return avaliarTratamentos(idsSelecionados, casoDoisPerfil);
}
export function calcularPontuacaoTratamentoCaso3(idsSelecionados: TratamentoId[]): AvaliacaoSecao {
  const secao = avaliarTratamentos(idsSelecionados, casoTresPerfil);

  const idsSelecionadosSet = new Set(idsSelecionados);
  const temPrincipalCorreto = idsSelecionadosSet.has("aquacel-ag") || idsSelecionadosSet.has("silvercel");

  if (!temPrincipalCorreto) {
    secao.pontuacao = 0;
    secao.faltou.push("Não selecionaste nenhum tratamento principal correto para controlo de infeção/exsudado.");
    secao.justificacaoPerda.push(
      "Regra especial do caso: sem tratamento principal correto, a pontuação da secção de tratamento é 0."
    );
  }

  return secao;
}