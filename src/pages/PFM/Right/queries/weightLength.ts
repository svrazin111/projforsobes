import { xmlQuery } from '@/app/plugins/ky'
import { toArray } from '@/shared/array'

import { PfmRow } from '../../const/types'

export const calcWeightLength = async (
  row: PfmRow,
  weight: string,
  len: string,
  usl_len_base: string,
  flag_usl: string
) => {
  const isOnlyNumbers = (str: string) => {
    return /^\d*$/.test(str)
  }

  const getUslPhis = (s: string) => {
    if (s == 'физ.') return '0'
    if (s == 'усл.') return '1'
    return ''
  }

  if (!row) return { len: '', weight: '' }

  if (!isOnlyNumbers(weight) || !isOnlyNumbers(len)) return { len: '', weight: '' }

  const params = {
    STAN_ID: row.st_ot_id,
    GR_POR: row.gr_state ?? '',
    RVAG: row.rod_vag ?? '',
    RODGR: row.rod_gr ?? '',
    GROUPGR: row.group_gr ?? '',
    KGR_TN: row.cod_gr ?? '',
    VES: weight,
    DLINA: len,
    USL: getUslPhis(flag_usl)
  }

  if (!params.DLINA.length) {
    params.DLINA = usl_len_base
    if (params.DLINA.length > 0) {
      params.USL = 'U'
    }
  }

  // Род вагона указываем только для порожних (1 - груженый, 0 - порожний)
  if (row.gr_state == '0') {
    params.RVAG = ''
  }

  const data = await xmlQuery('PFM2_Defs', 'Get_VES_DLINA', params, {
    parse: 'xml',
    silent: true
  })

  const possible_calcs = toArray(data?.VFPDataSet?.CURSOR) ?? []

  const calc = getMostFrequent(possible_calcs)

  if (calc) return calc as { len: string; weight: string }
  return { len: '', weight: '' }
}

const getMostFrequent = (arr: any[]) => {
  const map = new Map()

  for (const item of arr) {
    const key = JSON.stringify(item)

    if (!map.has(key)) {
      map.set(key, { count: 0, value: item })
    }

    map.get(key).count++
  }

  let max = 0
  let result = null

  for (const { count, value } of map.values()) {
    if (count > max) {
      max = count
      result = value
    }
  }

  return result
}
