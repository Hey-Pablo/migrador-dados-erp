import { useEstado } from '../estado/EstadoContext'

export function TipoUpload() {
  const { setTipo, setEtapa } = useEstado()
  const handleTipo = (tipo: 'clientes' | 'produtos') => {
    setTipo(tipo)
    setEtapa('upload') // Mantém na etapa de upload, mas agora mostra UploadArquivo
  }
  return (
    <section className="etapa">
      <h2>Selecionar Tipo de Dados</h2>
      <p>Que tipo de planilha você quer migrar?</p>

      <div className="tipo-selector">
        <button onClick={() => handleTipo('clientes')} type="button" className="tipo-botao">
          <h3>Clientes</h3>
          <p>Nome, documento,UF,CEP,e-mail, data de cadastro</p>
        </button>
        <button onClick={() => handleTipo('produtos')} type="button" className="tipo-botao">
          <h3>Produtos</h3>
          <p>Código, descrição, NCM, preço</p>
        </button>
      </div>
    </section>
  )
}