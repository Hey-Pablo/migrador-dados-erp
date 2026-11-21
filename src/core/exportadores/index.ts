import Papa from 'papaparse'
import type { Layout } from '../../layouts/tipos'
import type { Linha } from '../leitura'
import type { Rejeitada } from '../motor'
export function csvLimpo(linhas: Linha[], layout: Layout): string {
  return Papa.unparse({ fields: layout.campos.map(c => c.nome), data: linhas.map(l => layout.campos.map(c => l[c.nome] ?? '')) }, { escapeFormulae: true })
}
export function csvRejeitados(linhas: Rejeitada[]): string {
  return Papa.unparse(linhas.map(l => ({ linha: l.linha, dados: JSON.stringify(l.dados), motivos: l.erros.join('; ') })), { escapeFormulae: true })
}
export function sqlInsert(linhas: Linha[], layout: Layout, lote = 500): string {
  if (!Number.isInteger(lote) || lote < 1) throw new Error('Lote inválido')
  const campos = layout.campos.map(c => c.nome)
  const comandos: string[] = []
  for (let i = 0; i < linhas.length; i += lote) {
    const valores = linhas.slice(i, i + lote).map(l => `(${campos.map(c => l[c] ? `'${l[c].replace(/'/g, "''")}'` : 'NULL').join(', ')})`)
    comandos.push(`INSERT INTO ${layout.tabela} (${campos.join(', ')}) VALUES\n${valores.join(',\n')};`)
  }
  return comandos.join('\n\n')
}
