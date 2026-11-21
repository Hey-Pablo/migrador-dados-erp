export function validarEmail(valor: string): boolean {
  const email = valor.trim()
  if (email.length > 254) return false
  const partes = email.split('@')
  if (partes.length !== 2) return false
  const [local, dominio] = partes
  if (local.length > 64 || !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/.test(local)) return false
  return dominio.split('.').length >= 2 && dominio.split('.').every(parte => /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)$/.test(parte))
}
