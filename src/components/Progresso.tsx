import { useEstado, type Etapa } from '../ui/estado/EstadoContext'

const etapas: { id: Etapa; nome: string }[] = [
  { id: 'upload', nome: 'Upload' },
  { id: 'mapear', nome: 'Mapear' },
  { id: 'validar', nome: 'Validar' },
  { id: 'exportar', nome: 'Exportar' }
]

export function Progresso() {
  const { etapa } = useEstado()
  const indice = etapas.findIndex(e => e.id === etapa)

  return (
    <nav aria-label="Progresso da migração" className="progresso">
      <ol role="list" className="progresso-lista">
        {etapas.map((e, i) => (
          <li key={e.id} className={`progresso-item ${i === indice ? 'progresso-item--ativo' : i < indice ? 'progresso-item--completo' : ''}`}>
            <span className="progresso-numero" aria-hidden="true">{i + 1}</span>
            <span className="progresso-nome">{e.nome}</span>
          </li>
        ))}
      </ol>
    </nav>
  )
}