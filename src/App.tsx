import { useEstado } from './ui/estado/EstadoContext'
import { ProvedorEstado } from './ui/estado/EstadoContext'
import { Progresso } from './components/Progresso'
import { MapearColunas } from './ui/mapear/MapearColunas'
import { ValidarDados } from './ui/validar/ValidarDados'
import { ExportarDados } from './ui/exportar/Exportar'
import { TipoUpload } from './ui/upload/TipoUpload'
import { clientes } from './layouts/clientes'
import { produtos } from './layouts/produtos'

function App() {
  return (
    <ProvedorEstado layoutClientes={clientes} layoutProdutos={produtos}>
      <Conteudo />
    </ProvedorEstado>
  )
}

function Conteudo() {
  const { etapa } = useEstado()
  return (
    <main>
      <h1>Migrador de Dados para ERP</h1>
      <p>Ferramenta web para migrar planilhas para banco de dados.</p>
      <Progresso />

      {etapa === 'upload' && <TipoUpload />}
      {etapa === 'mapear' && <MapearColunas />}
      {etapa === 'validar' && <ValidarDados />}
      {etapa === 'exportar' && <ExportarDados />}
    </main>
  )
}

export default App