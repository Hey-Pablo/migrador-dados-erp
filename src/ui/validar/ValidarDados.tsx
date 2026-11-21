import { useEstado } from '../estado/EstadoContext'

export function ValidarDados() {
  const estado = useEstado()
  const { linhas, setEtapa } = estado
  const validasCountVal = estado.linhasValidas.length
  const rejeitadasCountVal = estado.linhasRejeitadas.length
  const total = linhas.length

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
        <div className="resumo-item"><span className="resumo-numero">{estado.linhasAviso.length}</span><span className="resumo-rotulo">com aviso</span></div>
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
        <button onClick={() => setEtapa('exportar')}>Exportar</button>
      </div>
    </section>
  )
}