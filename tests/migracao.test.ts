import { describe, it, expect } from 'vitest'
import { lerArquivo } from '../src/core/leitura'
import { sugerirMapeamento } from '../src/core/mapeamento'
import { processar } from '../src/core/motor'
import { clientes } from '../src/layouts/clientes'
import { csvLimpo, sqlInsert, csvRejeitados } from '../src/core/exportadores'

describe('migração', () => {
  it('lê CSV com ponto e vírgula e sugere colunas', async () => {
    const dados = await lerArquivo(new TextEncoder().encode('Nome;CPF;UF\nAna;123;XX').buffer, 'dados.csv')
    expect(dados.colunas).toEqual(['Nome', 'CPF', 'UF'])
    expect(sugerirMapeamento(dados.colunas, clientes)).toMatchObject({ nome: 'Nome', documento: 'CPF', uf: 'UF' })
  })
  it('acumula erros e identifica documentos repetidos normalizados', () => {
    const resultado = processar([{ Nome: 'Ana', CPF: '529.982.247-25', UF: 'SP' }, { Nome: '', CPF: '52998224725', UF: 'XX' }], { nome: 'Nome', documento: 'CPF', uf: 'UF' }, clientes)
    expect(resultado.validas).toHaveLength(1)
    expect(resultado.rejeitadas[0].erros.join(';')).toMatch(/nome/i)
    expect(resultado.rejeitadas[0].erros.join(';')).toMatch(/uf/i)
    expect(resultado.rejeitadas[0].erros.join(';')).toMatch(/duplicado/i)
    expect(csvLimpo(resultado.validas, clientes)).toContain('52998224725')
    expect(sqlInsert(resultado.validas, clientes)).toContain('INSERT INTO')
    expect(csvRejeitados(resultado.rejeitadas)).toContain('duplicado')
  })
})

import * as XLSX from 'xlsx'
import { produtos } from '../src/layouts/produtos'

it('lê XLSX e CSV em Windows-1252', async () => {
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet([['Nome', 'UF'], ['José', 'SP']]), 'Dados')
  const bytes = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' }) as ArrayBuffer
  expect((await lerArquivo(bytes, 'dados.xlsx')).linhas[0].Nome).toBe('José')
  const csv = Uint8Array.from([78, 111, 109, 101, 59, 85, 70, 10, 74, 111, 115, 233, 59, 83, 80])
  expect((await lerArquivo(csv.buffer, 'dados.csv')).linhas[0].Nome).toBe('José')
})
it('valida produtos e escapa SQL e fórmulas CSV', () => {
  const mapa = { codigo: 'codigo', descricao: 'descricao', ncm: 'ncm', preco: 'preco' }
  const r = processar([{ codigo: '=1+1', descricao: "D'agua", ncm: '12345678', preco: '12,50' }], mapa, produtos)
  expect(r.validas).toHaveLength(1)
  expect(sqlInsert(r.validas, produtos)).toContain("D''AGUA")
  expect(csvLimpo(r.validas, produtos)).toContain("'=1+1")
})
it('rejeita cabeçalhos duplicados', async () => {
  await expect(lerArquivo(new TextEncoder().encode('a;a\n1;2').buffer, 'x.csv')).rejects.toThrow(/duplicado/)
})
