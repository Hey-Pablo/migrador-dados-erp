export function validarCep(valor: string): boolean {
  return /^(?:\d{8}|\d{5}-\d{3})$/.test(valor.trim())
}
