import { tratamentos, type Tratamento } from "@/data/tratamentos";
import type { TratamentoId } from "../types/simulador";
import type { GrupoMaterialConfig, ItemMaterialConfig } from "../types/caso-config";

export function obterTratamentoPorId(id: string): Tratamento | undefined {
  return tratamentos.find((t) => t.id === id);
}

export function obterTratamentosPorCategoria(categoria: string): Tratamento[] {
  return tratamentos.filter((t) => t.categoria === categoria);
}

export function obterTratamentosPorSubcategoria(
  categoria: string,
  subcategoria: string
): Tratamento[] {
  return tratamentos.filter(
    (t) => t.categoria === categoria && t.subcategoria === subcategoria
  );
}

export function obterTodasCategorias(): string[] {
  const categorias = new Set(tratamentos.map((t) => t.categoria));
  return Array.from(categorias);
}

export function obterTratamentosPorFuncao(funcao: string): Tratamento[] {
  return tratamentos.filter((t) => t.funcoes.includes(funcao));
}

const mapeamentoCasoIds: Record<string, string> = {
  "cloreto-sodio-09": "limpeza_basica",
  "colagenase": "colagenase",
  "hidrogel": "hidrogel",
  "iodopovidona-solucao": "iodo",
  "iodopovidona-pomada": "iodo",
  "inadine": "iodo",
  "cadexomero-iodo": "iodo",
  "fibrosol-10x10": "hidrofibra",
  "aquacel-simples-15x15": "hidrofibra",
  "aquacel-ag-10x10": "hidrofibra",
  "vari-hesive-sem-rebordo-15x15": "carboximetilcelulose",
  "sulfadiazina-prata-50g": "prata",
  "sulfadiazina-prata-500g": "prata",
  "allevyn-ag-10x10": "prata",
  "actisorb-plus-prata": "prata",
  "silvercel": "prata",
  "urgotul-ag": "prata",
  "nitrato-prata-lapis": "nitrato_prata",
  "oxido-zinco": "emolientes_ags",
  "creme-gordo": "emolientes_ags",
  "creme-hidratante": "emolientes_ags",
  "parafina-liquida": "emolientes_ags",
  "l-mesitran": "mel",
  "betametasona": "betametasona",
  "alcool-70": "alcool",
  "gaze-seca": "gaze_seca",
};

export function obterTratamentosParaCaso(idsEsperados: TratamentoId[]): GrupoMaterialConfig[] {
  const grupos: Record<string, ItemMaterialConfig[]> = {};

  for (const tratamento of tratamentos) {
    const casoId = mapeamentoCasoIds[tratamento.id];

    if (casoId && idsEsperados.includes(casoId as TratamentoId)) {
      const categoria = tratamento.categoria;

      if (!grupos[categoria]) {
        grupos[categoria] = [];
      }

      const jaExiste = grupos[categoria].some(
        (item) => item.id === casoId
      );

      if (!jaExiste) {
        grupos[categoria].push({
          id: casoId as TratamentoId,
          nome: tratamento.nome,
        });
      }
    }
  }

  return Object.entries(grupos).map(([categoria, itens]) => ({
    categoria,
    itens,
  }));
}

export function obterNomesTratamentos(ids: TratamentoId[]): Record<TratamentoId, string> {
  const nomes: Partial<Record<TratamentoId, string>> = {};

  for (const id of ids) {
    const tratamento = tratamentos.find((t) => mapeamentoCasoIds[t.id] === id);
    if (tratamento) {
      nomes[id] = tratamento.nome;
    } else {
      const nomesFixos: Partial<Record<TratamentoId, string>> = {
        colagenase: "Colagenase",
        hidrogel: "Hidrogel",
        prata: "Prata",
        iodo: "Iodo (povidona-iodo)",
        hidrofibra: "Hidrofibra",
        carboximetilcelulose: "Carboximetilcelulose",
        nitrato_prata: "Nitrato de prata",
        emolientes_ags: "Emolientes (ácidos gordos essenciais)",
        mel: "Mel",
        betametasona: "Betametasona",
        alcool: "Aplicação de álcool",
        gaze_seca: "Gaze seca",
      };

      if (nomesFixos[id]) {
        nomes[id] = nomesFixos[id];
      }
    }
  }

  return nomes as Record<TratamentoId, string>;
}

export function agruparTratamentosPorCategoria(): Record<string, Tratamento[]> {
  const grupos: Record<string, Tratamento[]> = {};

  for (const tratamento of tratamentos) {
    const categoria = tratamento.categoria;

    if (!grupos[categoria]) {
      grupos[categoria] = [];
    }

    grupos[categoria].push(tratamento);
  }

  return grupos;
}

export function agruparTratamentosPorSubcategoria(): Record<string, Record<string, Tratamento[]>> {
  const grupos: Record<string, Record<string, Tratamento[]>> = {};

  for (const tratamento of tratamentos) {
    const categoria = tratamento.categoria;
    const subcategoria = tratamento.subcategoria;

    if (!grupos[categoria]) {
      grupos[categoria] = {};
    }

    if (!grupos[categoria][subcategoria]) {
      grupos[categoria][subcategoria] = [];
    }

    grupos[categoria][subcategoria].push(tratamento);
  }

  return grupos;
}
