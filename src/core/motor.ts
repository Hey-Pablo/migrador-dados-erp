import type { Layout } from '../layouts/tipos'
import type { Linha } from './leitura'
import { normalizarData, normalizarTexto, removerMascara } from './normalizadores'
import { validarCpf, validarCnpj, validarUf, validarCep, validarEmail, validarNcm } from './validadores'
export type Rejeitada = { linha: number; dados: Linha; erros: string[] }
export function processar(linhas: Linha[], mapa: Record<string, string>, layout: Layout) {
  const validas: Linha[] = [], comAviso: Linha[] = [], rejeitadas: Rejeitada[] = []
  const documentos = new Set<string>()
  linhas.forEach((original, indice) => {
    const dados: Linha = {}, erros: string[] = [], avisos: string[] = []
    for (const campo of layout.campos) {
      const valor = String(original[mapa[campo.nome]] ?? '').trim()
      if (!valor) { dados[campo.nome] = ''; if (campo.obrigatorio) erros.push(`${campo.nome}: obrigatório`); else if (mapa[campo.nome]) avisos.push(`${campo.nome}: vazio`); continue }
      let normalizado = valor
      let valido = true
      switch (campo.tipo) {
        case 'documento': normalizado = removerMascara(valor).toUpperCase(); valido = validarCpf(valor) || validarCnpj(valor); break
        case 'uf': normalizado = valor.toUpperCase(); valido = validarUf(normalizado); break
        case 'cep': normalizado = removerMascara(valor); valido = validarCep(valor); break
        case 'ncm': normalizado = removerMascara(valor); valido = validarNcm(valor); break
        case 'email': normalizado = valor.toLowerCase(); valido = validarEmail(valor); break
        case 'data': normalizado = normalizarData(valor) ?? valor; valido = normalizarData(valor) !== null; break
        case 'numero': normalizado = valor.replace(',', '.'); valido = /^\d+(\.\d{1,2})?$/.test(normalizado); break
        case 'texto': normalizado = normalizarTexto(valor); break
      }
      dados[campo.nome] = normalizado
      if (!valido) erros.push(`${campo.nome}: inválido`)
      if (normalizado.length > campo.tamanho) erros.push(`${campo.nome}: excede ${campo.tamanho} caracteres`)
      if (campo.tipo === 'documento' && valido) { if (documentos.has(normalizado)) erros.push(`${campo.nome}: duplicado`); documentos.add(normalizado) }
    }
    if (erros.length) rejeitadas.push({ linha: indice + 2, dados: original, erros }); else if (avisos.length) comAviso.push(dados); else validas.push(dados)
  })
  return { validas, comAviso, rejeitadas }
}
