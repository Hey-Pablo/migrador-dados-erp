import { createContext, useContext, useState, type ReactNode } from 'react'
import type { Linha } from '../../core/leitura'
import type { Layout } from '../../layouts/tipos'

export type Etapa = 'upload' | 'mapear' | 'validar' | 'exportar'

export type EstadoMigracao = {
  etapa: Etapa
  tipo: 'clientes' | 'produtos' | null
  colunas: string[]
  linhas: Linha[]
  linhasValidas: Linha[]
  linhasAviso: Linha[]
  linhasRejeitadas: Array<{ linha: number; dados: Linha; erros: string[] }>
  mapa: Record<string, string>
  erro?: string
  carregando: boolean
}

export type EstadoProviderProps = {
  children: ReactNode
  layoutClientes: Layout
  layoutProdutos: Layout
}

export type EstadoContexto = EstadoMigracao & {
  setEtapa: (e: Etapa) => void
  setTipo: (t: EstadoMigracao['tipo']) => void
  setColunas: (c: string[]) => void
  setLinhas: (l: Linha[]) => void
  setMapa: (m: Record<string, string>) => void
  setLinhasValidas: (l: Linha[]) => void
  setLinhasAviso: (l: Linha[]) => void
  setLinhasRejeitadas: (l: EstadoMigracao['linhasRejeitadas']) => void
  setErro: (e?: string) => void
  setCarregando: (c: boolean) => void
  resetar: () => void
  layoutClientes: Layout
  layoutProdutos: Layout
}

const EstadoContexto = createContext<EstadoContexto | null>(null)

export function ProvedorEstado({ children, layoutClientes, layoutProdutos }: EstadoProviderProps) {
  const [estado, setEstado] = useState<EstadoMigracao>({
    etapa: 'upload',
    tipo: null,
    colunas: [],
    linhas: [],
    linhasValidas: [],
    linhasAviso: [],
    linhasRejeitadas: [],
    mapa: {},
    carregando: false
  })

  const setEtapa = (e: Etapa) => setEstado(s => ({ ...s, etapa: e }))
  const setTipo = (t: EstadoMigracao['tipo']) => setEstado(s => ({ ...s, tipo: t }))
  const setColunas = (c: string[]) => setEstado(s => ({ ...s, colunas: c }))
  const setLinhas = (l: Linha[]) => setEstado(s => ({ ...s, linhas: l }))
  const setMapa = (m: Record<string, string>) => setEstado(s => ({ ...s, mapa: m }))
  const setLinhasValidas = (l: Linha[]) => setEstado(s => ({ ...s, linhasValidas: l }))
  const setLinhasAviso = (l: Linha[]) => setEstado(s => ({ ...s, linhasAviso: l }))
  const setLinhasRejeitadas = (l: EstadoMigracao['linhasRejeitadas']) => setEstado(s => ({ ...s, linhasRejeitadas: l }))
  const setErro = (e?: string) => setEstado(s => ({ ...s, erro: e }))
  const setCarregando = (c: boolean) => setEstado(s => ({ ...s, carregando: c }))

  const resetar = () => setEstado({
    etapa: 'upload',
    tipo: null,
    colunas: [],
    linhas: [],
    linhasValidas: [],
    linhasAviso: [],
    linhasRejeitadas: [],
    mapa: {},
    carregando: false
  })

  return (
    <EstadoContexto.Provider value={{
      ...estado,
      setEtapa,
      setTipo,
      setColunas,
      setLinhas,
      setMapa,
      setLinhasValidas,
      setLinhasAviso,
      setLinhasRejeitadas,
      setErro,
      setCarregando,
      resetar,
      layoutClientes,
      layoutProdutos
    }}>
      {children}
    </EstadoContexto.Provider>
  )
}

export function useEstado() {
  const ctx = useContext(EstadoContexto)
  if (!ctx) throw new Error('useEstado deve ser usado dentro de ProvedorEstado')
  return ctx
}