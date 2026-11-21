export function validarNcm(valor: string): boolean {
  return /^(?:\d{8}|\d{4}\.\d{2}\.\d{2})$/.test(valor.trim())
}
