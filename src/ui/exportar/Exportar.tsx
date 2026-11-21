import { useEstado } from '../estado/EstadoContext'
import { csvLimpo, sqlInsert, csvRejeitados } from '../../core/exportadores'

export function ExportarDados() {
  const { linhasValidas, linhasRejeitadas, layoutClientes } = useEstado()
  const layout = layoutClientes
  const tabela = layout.tabela

  const baixar = (conteudo: string, nome: string, type: string) => {
    const blob = new Blob([conteudo], { type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = nome
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportarCsv = () => {
    baixar(csvLimpo(linhasValidas, layout), 'dados-limpo.csv', 'text/csv')
  }

  const exportarSql = () => {
    baixar(sqlInsert(linhasValidas, layout), `insert-${tabela}.sql`, 'text/plain')
  }

  const exportarRejeitadas = () => {
    baixar(csvRejeitados(linhasRejeitadas), 'rejeitadas.csv', 'text/csv')
  }

  return (
    <section className="etapa">
      <h2>Exportar Dados</h2>
      <p>Selecione o formato de saída para os {linhasValidas.length} registros válidos.</p>

      <div className="resumo">
        <div className="resumo-item resumo-item--validas">
          <span className="resumo-numero">{linhasValidas.length}</span>
          <span className="resumo-rotulo">registros válidos</span>
        </div>
        <div className="resumo-item resumo-item--rejeitadas">
          <span className="resumo-numero">{linhasRejeitadas.length}</span>
          <span className="resumo-rotulo">linhas rejeitadas</span>
        </div>
      </div>

      <div className="exportar-acoes">
        <button onClick={exportarCsv} disabled={!linhasValidas.length}>CSV Limpo</button>
        <button onClick={exportarSql} disabled={!linhasValidas.length}>SQL (INSERT)</button>
        <button onClick={exportarRejeitadas} disabled={!linhasRejeitadas.length}>CSV Rejeitadas</button>
      </div>

      <details className="preview">
        <summary>Antes e Depois</summary>
        <div className="preview-exemplo">
          <div>
            <h4>Antes (da planilha original)</h4>
            <pre className="exemplo">{`nome;documento;uf
João Silva;123.456.789-00;SP
Empresa X;00/000.000/0000-00;RJ`}</pre>
          </div>
          <div>
            <h4>Depois (CSV limpo)</h4>
            <pre className="exemplo">{`nome,documento,uf
João Silva,12345678900,SP
Empresa X,000000000000,RJ`}</pre>
          </div>
        </div>
      </details>
    </section>
  )
}