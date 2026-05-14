import { defineStore } from 'pinia'
import { ref } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import { isMoreThanThreeDays } from '@/shared/date'
import { Filters, TypeForm } from '@/types/filters/filters'

import localforage from '../localforage'

type RpsOwnerType = {
  code: number
  name: string
}

export const useFiltersStore = defineStore('filters', () => {
  const version = ref('1.1')
  const filters = ref<Filters>()
  const rps_owner_types = ref<RpsOwnerType[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('filters')
    const saved_rps_owner_types: string | null = await localforage.getItem(
      'filters_rps_owner_types'
    )
    const saved_date: string | null = await localforage.getItem('filters_date')
    const saved_version: string | null = await localforage.getItem('filters_version')

    if (
      saved &&
      saved_rps_owner_types &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      filters.value = JSON.parse(saved)
      rps_owner_types.value = JSON.parse(saved_rps_owner_types)
    } else {
      filters.value = await load()
      rps_owner_types.value = [];

      await localforage.setItem('filters', JSON.stringify(filters.value))
      await localforage.setItem('filters_rps_owner_types', JSON.stringify(rps_owner_types.value))
      await localforage.setItem('filters_date', JSON.stringify(new Date()))
      await localforage.setItem('filters_version', JSON.stringify(version.value))
    }
  }

  const load = async () => {
    // const { VFPDataSet } = await xmlQuery('PFM2_Defs', 'Get_FILTER_LISTS')

    return {
      ROAD: [],
      ROAD_NZ: [],
      ST_OT: [],
      ST_NZ: [],
      MARSH_STATUS: [],
      AGREEMENT_STATUS: [],
      TYPE_SOOB: [],
      TYPE_FORM: [],
      MOVED: [],
      CORE: [],
      GR_STATE: [],
      TYPE_OT: [],
      TYPE_NZ: [],
      FROM_ETRAN: [],
      INNO_VAG: [],
      ROD_VAG: [],
      ROD_GR: [],
      RPS_OWNER: [],
      OTPR: []
    }
  }

  const get = () => {
    return filters.value
  }

  const getRpsOwnerTypes = () => {
    return rps_owner_types.value
  }

  return { filters, rps_owner_types, init, get, getRpsOwnerTypes }
})
