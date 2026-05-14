<template>
  <div style="height: 100%">
    <div class="p-1 bg-gray-300 font-semibold text-[#0000BB]">{{ user.name }} {{ user.info }}</div>
    <GridAdvanced
      :rows="rights"
      :cols="columns"
      :groups="['group_name']"
      style="height: calc(100% - 24px)"
    />
  </div>
</template>

<script setup lang="ts">
import { ColumnDefinition } from 'tabulator-tables'
import { onMounted, ref } from 'vue'

import { useUserStore } from '@/app/plugins/pinia/user'
import { treeExpander } from '@/core/tabulator/grid_cell_renderers'
import GridAdvanced from '@/core/tabulator/GridAdvanced.vue'

export type Right = {
  user_id: number
  login: string
  password: string
  name_f: string
  name_i: string
  name_o: string
  status: string
  subunit: string
  tel: string
  ac_date_min: string
  ac_date_max: string
  ac_time_min: string
  ac_time_max: string
  group_id: number
  group_name: string
  group_descr: string
  app_name: string
  role_id: number
  role_type: string
  role_name: string
  role_descr: string
  access_type: string
  access_descr: number
  ip_addr: string
  lock_count: number
  lock_period: number
  ip_inuse: string
}

const user = useUserStore()
const rights = ref<Right[]>([])

onMounted(() => {
  rights.value = user.rights
  if (user.is_warning) {
    rights.value.forEach((right) => {
      right.ac_date_max = `<h4 style="color: red">${right.ac_date_max}</h4>`
    })
  }
})

const columns: ColumnDefinition[] = [
  {
    title: 'Группа/роль',
    field: 'role_name',
    formatter: (cell) => treeExpander(cell, 'role_name')
  },
  { title: 'Дата начала', field: 'ac_date_min', width: 90 },
  { title: 'Дата окончания', field: 'ac_date_max', width: 90, formatter: 'html' },
  { title: 'Переменная', field: 'access_type', width: 120 },
  { title: 'Значение', field: 'access_descr', width: 100 },
  { title: 'ID группы', field: 'group_id', width: 110 },
  { title: 'Тип роли', field: 'role_type', width: 100 },
  { title: 'ID роли', field: 'role_id', width: 110 }
]
</script>
