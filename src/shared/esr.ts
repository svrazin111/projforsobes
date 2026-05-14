import { replaceAllSafe } from './string'
import { valid } from './valid_esrs'

export const correctEsr = (esr: string | number) => {
  if (String(esr).length == 2) return `000${esr}`
  if (String(esr).length == 3) return `00${esr}`
  if (String(esr).length == 4) return `0${esr}`
  return String(esr)
}

/**
 * @param diapasones 1000 - 2000 \n 3000 - 4000...
 */
export const isDiapasonesValid = (diapasones: string, strong = false) => {
  if (!diapasones.length) return false

  const digitsOnly = (str: string) => [...str].every((c) => '0123456789 -'.includes(c))
  const min_esr = 100
  const max_esr = 99999

  const rows = diapasones.split('\n')
  for (let row of rows) {
    if (!row) return false
    if (!digitsOnly(row)) return false

    row = replaceAllSafe(row, ' ', '')

    const first_esr = Number(row.split('-')[0])
    const second_esr = Number(row.split('-')[1])

    if ((strong && !valid.includes(first_esr)) || !valid.includes(second_esr)) return false

    if (!first_esr) return false
    if (!second_esr) return false

    if (first_esr < min_esr || first_esr > max_esr) return false
    if (second_esr < min_esr || second_esr > max_esr) return false

    if (first_esr > second_esr) return false
  }

  return true
}
