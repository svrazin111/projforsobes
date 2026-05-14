import { jsonrepair } from 'jsonrepair'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import { isMoreThanThreeDays } from '@/shared/date'
import { LineItem, MapItem, MapStation } from '@/types/map/map'

import { xmlQuery } from '../ky'
import localforage from '../localforage'

export const useMapStore = defineStore('map', () => {
  const version = ref('1.0')
  const map_station = ref<MapStation[]>([])
  const map_item = ref<MapItem[]>([])
  const map_line = ref<LineItem[]>([])

  const init = async () => {
    const saved_station: string | null = await localforage.getItem('map_station')
    const saved_item: string | null = await localforage.getItem('map_item')
    const saved_line: string | null = await localforage.getItem('map_line')
    const saved_date: string | null = await localforage.getItem('map_date')
    const saved_version: string | null = await localforage.getItem('map_version')

    if (
      saved_station &&
      saved_item &&
      saved_line &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      map_station.value = JSON.parse(saved_station)
      map_item.value = JSON.parse(saved_item)
      map_line.value = JSON.parse(saved_line)
    } else {
      map_station.value = await load('station')
      map_item.value = await load('item')
      map_line.value = await load('line')

      await localforage.setItem('map_station', JSON.stringify(map_station.value))
      await localforage.setItem('map_item', JSON.stringify(map_item.value))
      await localforage.setItem('map_line', JSON.stringify(map_line.value))
      await localforage.setItem('map_date', JSON.stringify(new Date()))
      await localforage.setItem('map_version', JSON.stringify(version.value))
    }

    if (saved_station && saved_item && saved_line && saved_date) {
      map_station.value = JSON.parse(saved_station)
      map_item.value = JSON.parse(saved_item)
      map_line.value = JSON.parse(saved_line)
    }
  }

  const load = async (type: 'station' | 'item' | 'line') => {
    if (type == 'station') {
      // const data = await xmlQuery(
      //   'IERTmapsV2',
      //   'GET_STATION',
      //   { RESULT_TYPE: 'JSON_Q' },
      //   { parse: 'json' }
      // )
      return []
    }
    if (type == 'item') {
      // let data = await xmlQuery(
      //   'IERTmapsV2',
      //   'GET_MAP',
      //   { RESULT_TYPE: 'JSON_Q' },
      //   { parse: 'text' }
      // )
      // data = jsonrepair(data)
      // data = JSON.parse(data)
      return []
    }
    if (type == 'line') {
      // let data = await xmlQuery(
      //   'IERTmapsV2',
      //   'GET_LINE_GEOJSON',
      //   { RESULT_TYPE: 'JSON_Q' },
      //   { parse: 'text' }
      // )
      // data = jsonrepair(data)
      // data = JSON.parse(data)
      return []
    }
    return []
  }

  const getStation = () => map_station.value

  const getMap = () => map_item.value

  const getLine = () => map_line.value

  const getBy = (field: keyof MapStation, value: string | number) => {
    return map_station.value.filter(
      (item) => String(item[field]) == String(value) || Number(item[field]) == Number(value)
    )
  }

  return { init, getStation, getMap, getLine, getBy }
})
