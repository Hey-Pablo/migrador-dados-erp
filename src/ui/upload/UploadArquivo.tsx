import { useRef } from 'react'
import { useEstado } from '../estado/EstadoContext'
import { lerArquivo } from '../../core/leitura'
import { sugerirMapeamento } from '../../core/mapeamento'

export function UploadArquivo() {
  const { tipo, setEtapa, setColunas, setLinhas, setMapa, setCarregando, setErro, layoutClientes, layoutProdutos } = useEstado()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setCarregando(true)
    setErro(undefined)
    try {
      const buffer = await file.arrayBuffer()
      const dados = await lerArquivo(buffer, file.name)
      setColunas(dados.colunas)
      setLinhas(dados.linhas)

      const layout = tipo === 'clientes' ? layoutClientes : layoutProdutos
      const mapa = sugerirMapeamento(dados.colunas, layout)
      setMapa(mapa)
      setEtapa('mapear')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao ler o arquivo')
    } finally {
      setCarregando(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
  }

  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <section className="etapa">
      <h2>Upload de Arquivo</h2>
      <p>Selecione uma planilha CSV ou XLSX com {tipo === 'clientes' ? 'dados de clientes' : 'dados de produtos'}.</p>

      <div className="upload-dropzone" onDrop={onDrop} onDragOver={onDragOver} onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".csv,.xlsx" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} className="upload-input" />
        <div className="upload-content">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <p>Arraste ou clique para selecionar</p>
          <small>CSV ou XLSX (máximo 10MB)</small>
        </div>
      </div>
    </section>
  )
}