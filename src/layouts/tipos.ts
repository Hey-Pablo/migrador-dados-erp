export type Campo = { nome: string; obrigatorio: boolean; tamanho: number; tipo: 'texto' | 'documento' | 'uf' | 'cep' | 'email' | 'ncm' | 'data' | 'numero'; aliases?: string[] }
export type Layout = { tabela: string; campos: Campo[] }
