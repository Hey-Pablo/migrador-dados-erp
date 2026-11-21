import type { Layout } from './tipos'
export const clientes: Layout = { tabela: 'clientes', campos: [
  { nome: 'nome', tipo: 'texto', obrigatorio: true, tamanho: 120, aliases: ['razao social', 'cliente'] },
  { nome: 'documento', tipo: 'documento', obrigatorio: true, tamanho: 14, aliases: ['cpf', 'cnpj', 'cpf cnpj'] },
  { nome: 'uf', tipo: 'uf', obrigatorio: true, tamanho: 2, aliases: ['estado'] },
  { nome: 'cep', tipo: 'cep', obrigatorio: false, tamanho: 8 },
  { nome: 'email', tipo: 'email', obrigatorio: false, tamanho: 254 },
  { nome: 'data_cadastro', tipo: 'data', obrigatorio: false, tamanho: 10 },
] }
