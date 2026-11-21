const ufs = new Set('AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' '))
export function validarUf(valor: string): boolean {
  return ufs.has(valor.trim().toUpperCase())
}
