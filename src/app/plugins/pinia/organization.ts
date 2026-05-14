import { defineStore } from 'pinia'
import { ref } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import { isMoreThanThreeDays } from '@/shared/date'
import { Organization } from '@/types/organization'

import localforage from '../localforage'

export const useOrganizationStore = defineStore('organization', () => {
  const version = ref('1.0')
  const organization = ref<Organization[]>([])

  const init = async () => {
    const saved: string | null = await localforage.getItem('organization')
    const saved_date: string | null = await localforage.getItem('organization_date')
    const saved_version: string | null = await localforage.getItem('organization_version')

    if (
      saved &&
      saved_date &&
      !isMoreThanThreeDays(new Date(saved_date), new Date()) &&
      saved_version &&
      JSON.parse(saved_version) == version.value
    ) {
      organization.value = JSON.parse(saved)
    } else {
      organization.value = await load()

      await localforage.setItem('organization', JSON.stringify(organization.value))
      await localforage.setItem('organization_date', JSON.stringify(new Date()))
      await localforage.setItem('organization_version', JSON.stringify(version.value))
    }
  }

  const load = async () => {
    return [];
  }

  const get = () => {
    return organization.value
  }

  const getBy = (field: keyof Organization, value: string | number) => {
    return organization.value.filter(
      (item) => String(item[field]) == String(value) || Number(item[field]) == Number(value)
    )
  }

  return { organization, init, get, getBy }
})
