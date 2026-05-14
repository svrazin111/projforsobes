import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { Right } from '@/pages/User.vue'

export const useUserStore = defineStore('user', () => {
  const rights = ref<Right[]>([])

  const id = computed(() => {
    if (!rights.value) return undefined
    return 2024082811404588
  })

  const road_view = computed(() => {
    return rights.value
      .filter((item) => item.access_type == 'ROAD' && item.role_type == 'ROAD_VIEW')
      .map((item) => item.access_descr)
  })

  const road_edit = computed(() => {
    return rights.value
      .filter((item) => item.access_type == 'ROAD' && item.role_type == 'ROAD_EDIT')
      .map((item) => item.access_descr)
  })

  const isCD = computed(() => {
    return road_edit.value.includes(99)
  })

  const name = computed(() => {
    const u = rights.value[0]
    if (!u) return ''
    return `${u.name_f} ${u.name_i} ${u.name_o}`
  })

  const info = computed(() => {
    const u = rights.value[0]
    if (!u) return ''
    return `${u.status} (${u.user_id})`
  })

  const days_left = computed(() => {
    if (!rights.value[0]) return 0
    const expiration_date = new Date(Date.parse(rights.value[0].ac_date_max))
    const today = new Date()
    return Math.round((expiration_date.getTime() - today.getTime()) / 1000 / 60 / 60 / 24)
  })

  const is_warning = computed(() => {
    const DAYS_UNTIL_WARN = 30
    return days_left.value < DAYS_UNTIL_WARN
  })

  const set = (new_rights) => {
    rights.value = new_rights
  }

  const getEditLevel = (rd_ot_code: number | string, rd_nz_code: number | string) => {
    if (isCD.value) return 'CD_EDIT'

    if (road_edit.value.includes(Number(rd_ot_code))) {
      if (Number(rd_ot_code) == Number(rd_nz_code)) return 'RD_IN_EDIT'
      else return 'RD_OUT_EDIT'
    }

    return 'NO_EDIT'
  }

  return {
    rights,
    id,
    road_view,
    road_edit,
    isCD,
    name,
    info,
    days_left,
    is_warning,
    set,
    getEditLevel
  }
})
