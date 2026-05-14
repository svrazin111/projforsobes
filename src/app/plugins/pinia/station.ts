import { defineStore } from 'pinia'
import { ref } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import { isMoreThanThreeDays } from '@/shared/date'
import { correctEsr } from '@/shared/esr'
import type { Station } from '@/types/station'

import localforage from '../localforage'

export const useStationStore = defineStore('station', () => {
  const version = ref('1.0')
  const stations = ref<Station[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('station')
    const saved_date: string | null = await localforage.getItem('station_date')
    const saved_version: string | null = await localforage.getItem('station_version')

    if (
      saved &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      stations.value = JSON.parse(saved)
    } else {
      stations.value = await load()

      await localforage.setItem('station', JSON.stringify(stations.value))
      await localforage.setItem('station_date', JSON.stringify(new Date()))
      await localforage.setItem('station_version', JSON.stringify(version.value))
    }
  }

  const load = async () => {
    // const data = await xmlQuery(
    //   'PFP_CNSI_Defs',
    //   'Get_TEX_STATIONS_WITH_POINTS',
    //   { RESULT_TYPE: 'JSON_Q' },
    //   {
    //     parse: 'json'
    //   }
    // )

    return [].map((item) => {
      item.esr = correctEsr(item.esr)
      item.full_name = `(${item.esr}) ${item.vname}`
      Object.freeze(item)

      return item
    })
  }

  const get = () => stations.value

  const getBy = (field: keyof Station, value: string | number) =>
    stations.value.filter((item) => item[field] == String(value) || item[field] == Number(value))

  const length = () => stations.value.length

  return { stations, init, load, get, getBy, length }
})
