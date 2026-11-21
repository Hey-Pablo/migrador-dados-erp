import Papa from 'papaparse'
import * as XLSX from 'xlsx'
export type Linha = Record<string, string>
export async function lerArquivo(buffer: ArrayBuffer, nome: string): Promise<{ colunas: string[]; linhas: Linha[] }> {
  let matriz: string[][]
  if (/\.xlsx$/i.test(nome)) {
    const livro = XLSX.read(buffer, { type: 'array', cellDates: false })
    matriz = XLSX.utils.sheet_to_json<string[]>(livro.Sheets[livro.SheetNames[0]], { header: 1, raw: false, defval: '' })
  } else if (/\.csv$/i.test(nome)) {
    let texto: string
    const bytes = new Uint8Array(buffer)
    if (bytes[0] === 0xff && bytes[1] === 0xfe) texto = new TextDecoder('utf-16le').decode(buffer)
    else if (bytes[0] === 0xfe && bytes[1] === 0xff) texto = new TextDecoder('utf-16be').decode(buffer)
    else { try { texto = new TextDecoder('utf-8', { fatal: true }).decode(buffer) } catch { texto = new TextDecoder('windows-1252').decode(buffer) } }
    const resultado = Papa.parse<string[]>(texto.replace(/^\uFEFF/, ''), { skipEmptyLines: true })
    if (resultado.errors.length) throw new Error(resultado.errors.map(e => e.message).join('; '))
    matriz = resultado.data
  } else throw new Error('Formato não suportado: use CSV ou XLSX')
  const colunas = (matriz.shift() ?? []).map(String)
  if (!colunas.length || colunas.some(c => !c.trim()) || new Set(colunas).size !== colunas.length) throw new Error('Cabeçalho vazio ou duplicado')
  if (matriz.some(linha => linha.length > colunas.length)) throw new Error('Linha contém mais células que o cabeçalho')
  return { colunas, linhas: matriz.map(linha => Object.fromEntries(colunas.map((c, i) => [c, String(linha[i] ?? '')]))) }
}
