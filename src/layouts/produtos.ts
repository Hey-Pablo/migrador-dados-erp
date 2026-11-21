import type { Layout } from './tipos'
export const produtos: Layout = { tabela: 'produtos', campos: [
  { nome: 'codigo', tipo: 'texto', obrigatorio: true, tamanho: 30, aliases: ['cod', 'sku'] },
  { nome: 'descricao', tipo: 'texto', obrigatorio: true, tamanho: 120, aliases: ['produto', 'nome'] },
  { nome: 'ncm', tipo: 'ncm', obrigatorio: true, tamanho: 8 },
  { nome: 'preco', tipo: 'numero', obrigatorio: true, tamanho: 20, aliases: ['valor'] },
] }
