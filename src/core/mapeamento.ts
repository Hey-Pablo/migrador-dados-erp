import type { Layout } from '../layouts/tipos'
const chave = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
export function sugerirMapeamento(colunas: string[], layout: Layout): Record<string, string> {
  const usados = new Set<string>()
  const resultado: Record<string, string> = {}
  for (const campo of layout.campos) {
    const nomes = [campo.nome, ...(campo.aliases ?? [])].map(chave)
    const coluna = colunas.find(c => !usados.has(c) && nomes.includes(chave(c)))
    if (coluna) { resultado[campo.nome] = coluna; usados.add(coluna) }
  }
  return resultado
}
