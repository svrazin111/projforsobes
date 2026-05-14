import { keys } from 'lodash'

import { xmlQuery } from '@/app/plugins/ky'
import { emitter } from '@/app/plugins/mitt'
import { PfSt, WayFull, WayPfFull } from '@/pages/PFM/const/types'
import { toArray } from '@/shared/array'

// * Получить список станций по ПФ по двум станциям
export const getPfSt = async (st_ot_id: number | string, st_nz_id: number | string) => {
  // Станции по ПФ могут быть пустыми
  const params = {
    ST_OT: st_ot_id,
    ST_NZ: st_nz_id
  }
  const data = await xmlQuery('PFM2_Defs', 'Get_Route_PF', params)
  if (!data || !data.VFPDataSet || !data.VFPDataSet.PF_ST) {
    emitter.emit('toast', { detail: 'Список станций по ПФ не был найден' })
    return null
  }
  return <PfSt[]>toArray(data.VFPDataSet.PF_ST)
}

// * Получить путь следования по ПФ по двум станциям и станциям ПФ
export const getWaysPfFull = async (
  st_ot_id: number | string,
  st_nz_id: number | string,
  stations_pf: PfSt[]
) => {
  const params = {
    TAB_NAME: 'WAY_PF_FULL',
    byPF: 1,
    GR_POR: '',
    ROUTE: `${st_ot_id},${stations_pf.map((item) => item.st_id).join(',')},${st_nz_id}`,
    VES: `0,${stations_pf.map(() => 0).join(',')},0`,
    DLS: `0,${stations_pf.map(() => 0).join(',')},0`,
    PER: `0,${stations_pf.map((item) => item.type).join(',')},0`
  }
  const { VFPDataSet } = await xmlQuery('PFM2_Defs', 'Get_Route_URLB', params)
  return <Array<WayPfFull>>toArray(VFPDataSet.WAY_PF_FULL)
}

export const calcAdms = (ways: WayFull[] | WayPfFull[]) => {
  const adms = {}
  ways.forEach((item) => {
    if (adms[item.adm_name_2]) {
      adms[item.adm_name_2] += Number(item.len)
    } else {
      adms[item.adm_name_2] = Number(item.len)
    }
  })
  return keys(adms).map((key) => {
    return { adm: key, len: adms[key] }
  })
}
