import { defineStore } from 'pinia'
import { ref } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import { isMoreThanThreeDays } from '@/shared/date'

import localforage from '../localforage'

export type Operator = {
  code: number
  sname: string
  name: string
}

export const useOperatorStore = defineStore('operator', () => {
  const version = ref('1.1')
  const operator = ref<Operator[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('operator')
    const saved_date: string | null = await localforage.getItem('operator_date')
    const saved_version: string | null = await localforage.getItem('operator_version')

    if (
      saved &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      operator.value = JSON.parse(saved)
    } else {
      operator.value = await load()

      await localforage.setItem('operator', JSON.stringify(operator.value))
      await localforage.setItem('operator_date', JSON.stringify(new Date()))
      await localforage.setItem('operator_version', JSON.stringify(version.value))
    }
  }

  const load = async () => {
    return []
  }

  const get = () => {
    return operator.value
  }

  const getBy = (field: keyof Operator, value: string | number) => {
    return operator.value.filter(
      (item) => item[field] == String(value) || item[field] == Number(value)
    )
  }

  return { operator, init, get, getBy }
})
