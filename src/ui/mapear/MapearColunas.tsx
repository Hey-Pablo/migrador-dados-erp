import { useEstado } from '../estado/EstadoContext'
import { processar } from '../../core/motor'
import type { Campo } from '../../layouts/tipos'

export function MapearColunas() {
  const { colunas, mapa, setMapa, setEtapa, linhasValidas, setLinhasValidas, linhasRejeitadas, setLinhasRejeitadas, layoutClientes, layoutProdutos, tipo, linhas, setLinhasAviso } = useEstado()
  const campos: Campo[] = (tipo === 'clientes' ? layoutClientes : layoutProdutos).campos

  const handleChange = (campoNome: string, coluna: string) => {
    setMapa({ ...mapa, [campoNome]: coluna })
  }

  const salvarMapa = () => {
    // Validar: todos os campos obrigatórios devem ter coluna mapeada
    const faltando = campos.filter(c => c.obrigatorio && !mapa[c.nome]).map(c => c.nome)
    if (faltando.length) {
      alert(`Campos obrigatórios sem mapeamento: ${faltando.join(', ')}`)
      return
    }
    const resultado = processar(linhas, mapa, tipo === 'clientes' ? layoutClientes : layoutProdutos)
    setLinhasValidas(resultado.validas)
    setLinhasAviso(resultado.comAviso)
    setLinhasRejeitadas(resultado.rejeitadas)
    setEtapa('validar')
  }

  return (
    <section className="etapa">
      <h2>Mapear Colunas</h2>
      <p>Relacione as colunas da sua planilha com os campos do sistema.</p>

      <p className="mapear-resumo">
        Encontradas {colunas.length} colunas • {linhasValidas.length || linhasRejeitadas.length > 0 ? `${linhasValidas.length} linhas válidas, ${linhasRejeitadas.length} rejeitadas` : 'Nenhum dado processado'}
      </p>

      <table className="mapear-tabela">
        <thead>
          <tr>
            <th>Campo do Sistema</th>
            <th>Coluna da Planilha</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
          {campos.map(campo => (
            <tr key={campo.nome}>
              <td>{campo.nome}</td>
              <td>
                <select
                  value={mapa[campo.nome] || ''}
                  onChange={e => handleChange(campo.nome, e.target.value)}
                >
                  <option value="">-- Selecione --</option>
                  {colunas.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </td>
              <td><span className={`tag tag-${campo.tipo}`}>{campo.tipo}</span></td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mapear-acoes">
        <button onClick={() => setEtapa('upload')} type="button">Voltar</button>
        <button onClick={salvarMapa} disabled={campos.some(c => c.obrigatorio && !mapa[c.nome])}>
          {linhasValidas.length || linhasRejeitadas.length ? 'Reprocessar' : 'Prosseguir para Validação'}
        </button>
      </div>
    </section>
  )
}