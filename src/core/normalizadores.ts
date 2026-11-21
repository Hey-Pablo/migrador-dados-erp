export function removerMascara(valor: string): string {
  return valor.replace(/[.\-/\s]/g, '')
}
export function normalizarTexto(valor: string): string {
  return valor.trim().replace(/\s+/g, ' ').toUpperCase()
}
export function normalizarData(valor: string): string | null {
  const entrada = valor.trim()
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(entrada)
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(entrada)
  if (!br && !iso) return null
  const ano = Number(br ? br[3] : iso![1])
  const mes = Number(br ? br[2] : iso![2])
  const dia = Number(br ? br[1] : iso![3])
  if (ano < 1 || mes < 1 || mes > 12 || dia < 1) return null
  const dias = [31, ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (dia > dias[mes - 1]) return null
  return `${String(ano).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
}
