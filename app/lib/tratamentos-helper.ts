import type { Tratamento } from "@/data/tratamentos";
import {
  getTreatmentById,
  getTreatmentsByCategory,
  getTreatmentsByFunction,
  getTreatmentsBySubcategory,
  groupTreatmentsByCategory,
  groupTreatmentsByCategoryAndSubcategory,
  listTreatments,
} from "@/lib/treatments";
import type { TratamentoId } from "../types/simulador";
import type { GrupoMaterialConfig } from "../types/caso-config";

export function obterTratamentoPorId(id: string): Tratamento | undefined {
  return getTreatmentById(id);
}

export function obterTratamentosPorCategoria(categoria: string): Tratamento[] {
  return getTreatmentsByCategory(categoria);
}

export function obterTratamentosPorSubcategoria(
  categoria: string,
  subcategoria: string
): Tratamento[] {
  return getTreatmentsBySubcategory(categoria, subcategoria);
}

export function obterTodasCategorias(): string[] {
  const categorias = new Set(listTreatments().map((t) => t.categoria));
  return Array.from(categorias);
}

export function obterTratamentosPorFuncao(funcao: string): Tratamento[] {
  return getTreatmentsByFunction(funcao);
}

export function agruparTratamentosPorCategoria(): Record<string, Tratamento[]> {
  return groupTreatmentsByCategory();
}

export function obterTratamentosParaCaso(idsEsperados: TratamentoId[]): GrupoMaterialConfig[] {
 const tratamentosDoCaso = listTreatments().filter((t) => idsEsperados.includes(t.id));

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
  return groupTreatmentsByCategoryAndSubcategory();
}
