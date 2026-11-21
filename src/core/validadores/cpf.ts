export function validarCpf(valor: string): boolean {
  const entrada = valor.trim()
  if (!/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(entrada)) return false
  const cpf = entrada.replace(/[.-]/g, '')
  if (/^(\d)\1{10}$/.test(cpf)) return false
  for (let posicao = 9; posicao < 11; posicao++) {
    let soma = 0
    for (let i = 0; i < posicao; i++) soma += Number(cpf[i]) * (posicao + 1 - i)
    const resto = (soma * 10) % 11
    if (Number(cpf[posicao]) !== (resto === 10 ? 0 : resto)) return false
  }
  return true
}
