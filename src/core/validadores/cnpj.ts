// Receita Federal: https://www.gov.br/receitafederal/pt-br/centrais-de-conteudo/publicacoes/documentos-tecnicos/cnpj/manual-dv-cnpj.pdf
export function validarCnpj(valor: string): boolean {
  const entrada = valor.trim().toUpperCase()
  if (!/^(?:[A-Z0-9]{12}\d{2}|[A-Z0-9]{2}\.[A-Z0-9]{3}\.[A-Z0-9]{3}\/[A-Z0-9]{4}-\d{2})$/.test(entrada)) return false
  const cnpj = entrada.replace(/[./-]/g, '')
  if (/^(\d)\1{13}$/.test(cnpj)) return false
  const digito = (base: string): number => {
    let peso = 2
    let soma = 0
    for (let i = base.length - 1; i >= 0; i--) {
      soma += (base.charCodeAt(i) - 48) * peso
      peso = peso === 9 ? 2 : peso + 1
    }
    const resto = soma % 11
    return resto < 2 ? 0 : 11 - resto
  }
  const primeiro = digito(cnpj.slice(0, 12))
  return Number(cnpj[12]) === primeiro && Number(cnpj[13]) === digito(cnpj.slice(0, 12) + primeiro)
}
