import { lerArquivo } from './core/leitura'
import { processar } from './core/motor'
import { clientes } from './layouts/clientes'
import { produtos } from './layouts/produtos'
self.onmessage = async (evento: MessageEvent<{ buffer: ArrayBuffer; nome: string; tipo: 'clientes' | 'produtos'; mapa: Record<string, string> }>) => {
  try {
    const { buffer, nome, tipo, mapa } = evento.data
    const dados = await lerArquivo(buffer, nome)
    self.postMessage({ sucesso: true, ...processar(dados.linhas, mapa, tipo === 'clientes' ? clientes : produtos) })
  } catch (erro) { self.postMessage({ sucesso: false, erro: erro instanceof Error ? erro.message : String(erro) }) }
}
