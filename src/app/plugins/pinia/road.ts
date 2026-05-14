import { defineStore } from 'pinia'
import { ref } from 'vue'

import { query, xmlQuery } from '@/app/plugins/ky'
import { isMoreThanThreeDays } from '@/shared/date'
import { Road } from '@/types/road'

import localforage from '../localforage'
import { road_temp } from './road_temp'

// Иностранные дороги нам тут не нужны
const roads_to_igrone = [255, 256, 275, 296, 230, 231, 200, 210, 233, 253, 90]

export const useRoadStore = defineStore('road', () => {
  const version = ref('1.2')
  const roads = ref<Road[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('road')
    const saved_date: string | null = await localforage.getItem('road_date')
    const saved_version: string | null = await localforage.getItem('road_version')

    if (
      saved &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      roads.value = JSON.parse(saved)
    } else {
      roads.value = await load()

      await localforage.setItem('road', JSON.stringify(roads.value))
      await localforage.setItem('road_date', JSON.stringify(new Date()))
      await localforage.setItem('road_version', JSON.stringify(version.value))
    }
  }

  const load = async () => {
    // const data = await xmlQuery('PFM2_Defs', 'Get_FILTER_LISTS')

    const road_ids = []

    const temp = []

    road_ids.forEach((id) => {
      temp.push(road_temp.filter((item) => item.code == id)[0])
    })

    return temp
  }

  const get = () => roads.value

  const getBy = (field: keyof Road, value: string | number) => {
    return roads.value.filter(
      (item) => item[field] == String(value) || item[field] == Number(value)
    )
  }

  const length = () => roads.value.length

  return { roads, init, get, getBy, length }
})
