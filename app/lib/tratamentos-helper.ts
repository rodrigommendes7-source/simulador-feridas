import { tratamentos, type Tratamento } from "@/data/tratamentos";
import type { TratamentoId } from "../types/simulador";
import type { GrupoMaterialConfig } from "../types/caso-config";

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

export function agruparTratamentosPorCategoria(): Record<string, Tratamento[]> {
  return tratamentos.reduce(
    (acc, tratamento) => {
      if (!acc[tratamento.categoria]) {
        acc[tratamento.categoria] = [];
      }

      acc[tratamento.categoria].push(tratamento);
      return acc;
    },
    {} as Record<string, Tratamento[]>
  );
}

export function obterTratamentosParaCaso(idsEsperados: TratamentoId[]): GrupoMaterialConfig[] {
 const tratamentosDoCaso = tratamentos.filter((t) => idsEsperados.includes(t.id));

 const grupos = new Map<string, { id: TratamentoId; nome: string }[]>();

   for (const tratamento of tratamentosDoCaso) {
    if (!grupos.has(tratamento.categoria)) {
      grupos.set(tratamento.categoria, []);
    }

    grupos.get(tratamento.categoria)?.push({
      id: tratamento.id as TratamentoId,
      nome: tratamento.nome,
    });
  }

  return Array.from(grupos.entries()).map(([categoria, itens]) => ({    
    categoria,
    itens,
  }));
}

export function obterNomesTratamentos(ids: TratamentoId[]): Record<TratamentoId, string> {
  const nomes: Record<TratamentoId, string> = {} as Record<TratamentoId, string>;

  for (const id of ids) {
    const tratamento = obterTratamentoPorId(id);    
    if (tratamento) {
      nomes[id] = tratamento.nome;
    }
  }

  return nomes;
}

export function agruparTratamentosPorCategoriaESubcategoria(): Record<
  string,
  Record<string, Tratamento[]>
> {  
  return tratamentos.reduce((acc, tratamento) => {
    const { categoria, subcategoria } = tratamento;

    if (!acc[categoria]) {
      acc[categoria] = {};
    }

    if (!acc[categoria][subcategoria]) {
      acc[categoria][subcategoria] = [];
    }

    acc[categoria][subcategoria].push(tratamento);

    return acc;
  }, {} as Record<string, Record<string, Tratamento[]>>);
}