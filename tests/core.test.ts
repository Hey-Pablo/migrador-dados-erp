import { describe, it, expect } from 'vitest'
import { validarCpf, validarCnpj, validarCep, validarUf, validarNcm, validarEmail } from '../src/core/validadores'
import { removerMascara, normalizarTexto, normalizarData } from '../src/core/normalizadores'

describe('validadores', () => {
  it('valida CPF com e sem máscara e rejeita dígitos inválidos e repetidos', () => {
    expect(validarCpf('529.982.247-25')).toBe(true)
    expect(validarCpf('52998224725')).toBe(true)
    for (const valor of ['52998224724', '11111111111', '123', '529x98224725']) expect(validarCpf(valor)).toBe(false)
  })
  it('valida CNPJ numérico e exemplo alfanumérico oficial', () => {
    expect(validarCnpj('12.ABC.345/01DE-35')).toBe(true)
    expect(validarCnpj('12abc34501de35')).toBe(true)
    expect(validarCnpj('11.222.333/0001-81')).toBe(true)
    for (const valor of ['12ABC34501DE36', '11111111111111', '12ABC34501DE3A', '12@ABC34501DE35']) expect(validarCnpj(valor)).toBe(false)
  })
  it('valida o formato do CEP', () => {
    expect(validarCep('01001-000')).toBe(true)
    expect(validarCep('01001000')).toBe(true)
    for (const valor of ['1234567', '12345x678', '1234-5678']) expect(validarCep(valor)).toBe(false)
  })
  it('aceita apenas UFs brasileiras', () => {
    expect(validarUf(' sp ')).toBe(true)
    expect(validarUf('DF')).toBe(true)
    expect(validarUf('XX')).toBe(false)
  })
  it('valida formato de NCM sem afirmar existência na tabela fiscal', () => {
    expect(validarNcm('1234.56.78')).toBe(true)
    expect(validarNcm('12345678')).toBe(true)
    expect(validarNcm('1234567')).toBe(false)
    expect(validarNcm('1234x56x78')).toBe(false)
  })
  it('valida sintaxe básica de e-mail', () => {
    expect(validarEmail('pessoa@example.com')).toBe(true)
    for (const valor of ['a@', '@example.com', 'a..b@example.com', 'a@example', 'a b@example.com']) expect(validarEmail(valor)).toBe(false)
  })
})
describe('normalizadores', () => {
  it('remove pontuação de máscara sem remover letras', () => expect(removerMascara('12.ABC.345/01DE-35')).toBe('12ABC34501DE35'))
  it('remove espaços excedentes e converte texto para maiúsculas', () => expect(normalizarTexto('  José   da Silva  ')).toBe('JOSÉ DA SILVA'))
  it('converte datas válidas para ISO e rejeita datas impossíveis', () => {
    expect(normalizarData('29/02/2024')).toBe('2024-02-29')
    expect(normalizarData('2024-02-29')).toBe('2024-02-29')
    expect(normalizarData('29/02/2023')).toBeNull()
    expect(normalizarData('2024-13-01')).toBeNull()
    expect(normalizarData('1/2/2024')).toBeNull()
  })
})
