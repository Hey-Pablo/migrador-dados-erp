import { it, expect } from 'vitest'
import { processar } from '../src/core/motor'
import { produtos } from '../src/layouts/produtos'
it('mede processamento de 10 mil produtos', () => {
  const linhas = Array.from({ length: 10_000 }, (_, i) => ({ codigo: String(i), descricao: 'Produto fictício', ncm: '12345678', preco: '12,50' }))
  const inicio = performance.now()
  const resultado = processar(linhas, { codigo: 'codigo', descricao: 'descricao', ncm: 'ncm', preco: 'preco' }, produtos)
  const tempo = performance.now() - inicio
  console.log(`Motor: 10000 linhas em ${tempo.toFixed(1)} ms (Node, sem leitura ou worker)`)
  expect(resultado.validas).toHaveLength(10_000)
})
