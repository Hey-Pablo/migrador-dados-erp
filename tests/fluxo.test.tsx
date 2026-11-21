// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import App from '../src/App'

afterEach(cleanup)

describe.each(['csv', 'xlsx'])('fluxo de clientes com %s', (extensao) => {
  it('importa, valida e permite exportar os resultados', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Clientes/ }))
    expect(screen.getByText('Upload de Arquivo')).toBeTruthy()
    const bytes = readFileSync(`exemplos/clientes-sujos.${extensao}`)
    const arquivo = new File([bytes], `clientes-sujos.${extensao}`)
    Object.defineProperty(arquivo, 'arrayBuffer', { value: async () => new Uint8Array([...bytes]).buffer })
    fireEvent.change(document.querySelector('input[type=file]')!, { target: { files: [arquivo] } })
    expect(await screen.findByText('Mapear Colunas')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Prosseguir para Validação/ }))
    expect(await screen.findByText('Validar Dados')).toBeTruthy()
    expect(screen.getByText('rejeitadas').previousElementSibling?.textContent).toBe('1')
    expect(screen.getByText('válidas').previousElementSibling?.textContent).toBe('1')
    fireEvent.click(screen.getByRole('button', { name: /Exportar/ }))
    expect(screen.getByRole('button', { name: 'CSV Limpo' }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: 'SQL (INSERT)' }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByRole('button', { name: 'CSV Rejeitadas' }).hasAttribute('disabled')).toBe(false)
  })
})

it('usa o layout de produtos e valida os dados', async () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /Produtos/ }))
  const bytes = readFileSync('exemplos/produtos-sujos.csv')
  const arquivo = new File([bytes], 'produtos-sujos.csv')
  Object.defineProperty(arquivo, 'arrayBuffer', { value: async () => new Uint8Array([...bytes]).buffer })
  fireEvent.change(document.querySelector('input[type=file]')!, { target: { files: [arquivo] } })
  expect(await screen.findByText('Mapear Colunas')).toBeTruthy()
  expect(screen.getByText('codigo')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Prosseguir para Validação/ }))
  expect(screen.getByText('válidas').previousElementSibling?.textContent).toBe('1')
  expect(screen.getByText('rejeitadas').previousElementSibling?.textContent).toBe('1')
})

it('conta campo opcional mapeado vazio como aviso exportável', async () => {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /Clientes/ }))
  const conteudo = 'Nome;CPF;UF;email\nAna;52998224725;SP;\n'
  const arquivo = new File([conteudo], 'clientes.csv')
  Object.defineProperty(arquivo, 'arrayBuffer', { value: async () => new TextEncoder().encode(conteudo).buffer })
  fireEvent.change(document.querySelector('input[type=file]')!, { target: { files: [arquivo] } })
  expect(await screen.findByText('Mapear Colunas')).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Prosseguir para Validação/ }))
  expect(screen.getByText('com aviso').previousElementSibling?.textContent).toBe('1')
  expect(screen.getByText('válidas').previousElementSibling?.textContent).toBe('0')
  fireEvent.click(screen.getByRole('button', { name: 'Exportar' }))
  expect(screen.getByRole('button', { name: 'CSV Limpo' }).hasAttribute('disabled')).toBe(false)
})
