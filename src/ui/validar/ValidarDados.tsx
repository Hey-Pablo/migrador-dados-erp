import { useEstado } from '../estado/EstadoContext'
import { processar } from '../../core/motor'

export function ValidarDados() {
  const estado = useEstado()
  const { linhas, mapa, setEtapa, setLinhasValidas, setLinhasRejeitadas, setCarregando, setErro, layoutClientes } = estado
  const layout = layoutClientes
  const validasCountVal = estado.linhasValidas.length
  const rejeitadasCountVal = estado.linhasRejeitadas.length
  const total = linhas.length

  const validar = () => {
    setCarregando(true)
    setErro(undefined)
    try {
      const resultado = processar(linhas, mapa, layout)
      setLinhasValidas(resultado.validas)
      setLinhasRejeitadas(resultado.rejeitadas)
      setEtapa('exportar')
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro na validação')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <section className="etapa">
      <h2>Validar Dados</h2>
      <p>Verifique os resultados da validação.</p>

      <div className="resumo">
        <div className="resumo-item">
          <span className="resumo-numero">{total}</span>
          <span className="resumo-rotulo">total de linhas</span>
        </div>
        <div className="resumo-item resumo-item--validas">
          <span className="resumo-numero">{validasCountVal}</span>
          <span className="resumo-rotulo">válidas</span>
        </div>
        <div className="resumo-item resumo-item--rejeitadas">
          <span className="resumo-numero">{rejeitadasCountVal}</span>
          <span className="resumo-rotulo">rejeitadas</span>
        </div>
      </div>

      {rejeitadasCountVal > 0 && (
        <details className="rejeitadas-lista">
          <summary>Ver linhas rejeitadas ({rejeitadasCountVal})</summary>
          <table className="tabela-rejeitadas">
            <thead>
              <tr><th>Linha</th><th>Motivos</th></tr>
            </thead>
            <tbody>
              {estado.linhasRejeitadas.slice(0, 10).map(r => (
                <tr key={r.linha}>
                  <td>{r.linha}</td>
                  <td><ul>{r.erros.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul></td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      )}

      <div className="validar-acoes">
        <button onClick={() => setEtapa('mapear')} type="button">Voltar</button>
        <button onClick={validar} disabled>Validar</button>
      </div>
    </section>
  )
}