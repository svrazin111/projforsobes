import { defineStore } from 'pinia'
import { ref } from 'vue'

import { isMoreThanThreeDays } from '@/shared/date'

import { xmlQuery } from '../ky'
import localforage from '../localforage'

type Cargo = {
  id: number
  code: number
  class: number
  sname: string
  name: string
  group_code: number
  group_name: string
  rod_code: number
  rod_name: string
}

type CargoGroup = {
  group_code: number
  group_name: string
  rod_code: number
  rod_name: string
}

type CargoKind = {
  code: number
  mnemo: string
  name: string
}

export const useCargoStore = defineStore('cargo', () => {
  const version = ref('1.2')
  const cargo = ref<Cargo[]>([])
  const cargo_group = ref<CargoGroup[]>([])
  const cargo_kind = ref<CargoKind[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('cargo')
    const saved_group: string | null = await localforage.getItem('cargo_group')
    const saved_kind: string | null = await localforage.getItem('cargo_kind')
    const saved_date: string | null = await localforage.getItem('cargo_date')
    const saved_version: string | null = await localforage.getItem('cargo_version')

    if (
      saved &&
      saved_group &&
      saved_kind &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      cargo.value = JSON.parse(saved)
      cargo_group.value = JSON.parse(saved_group)
      cargo_kind.value = JSON.parse(saved_kind)
    } else {
      cargo.value = await load('cargo')
      cargo_group.value = await load('group')
      cargo_kind.value = await load('kind')

      await localforage.setItem('cargo', JSON.stringify(cargo.value))
      await localforage.setItem('cargo_group', JSON.stringify(cargo_group.value))
      await localforage.setItem('cargo_kind', JSON.stringify(cargo_kind.value))
      await localforage.setItem('cargo_date', JSON.stringify(new Date()))
      await localforage.setItem('cargo_version', JSON.stringify(version.value))
    }
  }

  const load = async (type: 'cargo' | 'group' | 'kind') => {
    if (type == 'cargo') {
      return []
    }
    if (type == 'group') {
      return []
    }
    if (type == 'kind') {
      return []
    }
    return []
  }

  const getCargo = () => cargo.value

  const getGroups = () => cargo_group.value

  const getKinds = () => cargo_kind.value

  return { cargo, cargo_group, cargo_kind, init, getCargo, getGroups, getKinds }
})
