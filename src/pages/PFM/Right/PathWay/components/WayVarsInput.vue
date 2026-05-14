<template>
  <div class="flex">
    <Table :rows="way_vars" :cols="cols" v-model="selected" style="height: 80px; width: 200px" />
    <div class="flex flex-col ml-0.5 gap-0.5">
      <Button2 @click="add" icon img="add" />
      <Button2 @click="remove" icon img="delete_16" :disabled="way_vars?.length == 1" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, watch } from 'vue'

import Table from '@/core/primetable/Table.vue'
import { WayVars } from '@/pages/PFM/const/types'
import Button2 from '@/shared/ui/button/Button2.vue'

const way_vars = defineModel<WayVars[]>()
const selected = defineModel<WayVars>('selected')

onMounted(() => updateNames())

watch(
  selected,
  () => {
    if (!selected.value || !selected.value.var_num) {
      if (!way_vars.value) return

      selected.value = way_vars.value[0]
    }
  },
  { deep: true }
)

const add = () => {
  if (!way_vars.value) return

  const last_row: WayVars = way_vars.value[way_vars.value.length - 1]

  way_vars.value.push({
    marsh_id: last_row.marsh_id,
    var_num: last_row.var_num + 1,
    var_name: var_names[last_row.var_num]
  })

  selected.value = {
    marsh_id: last_row.marsh_id,
    var_num: last_row.var_num + 1,
    var_name: var_names[last_row.var_num]
  }

  nextTick(() => updateNames())
}
const remove = () => {
  if (!selected.value || !way_vars.value || way_vars.value.length == 1) return

  way_vars.value = way_vars.value.filter((item) => item.var_num != selected.value.var_num)

  nextTick(() => updateNames())
}

const updateNames = () => {
  way_vars.value?.forEach((item, index) => {
    way_vars.value[index].var_name = var_names[index]
  })
}

const var_names = [
  'Основной',
  'Дополнительный 1',
  'Дополнительный 2',
  'Дополнительный 3',
  'Дополнительный 4',
  'Дополнительный 5',
  'Дополнительный 6',
  'Дополнительный 7',
  'Дополнительный 8'
]

const cols = [{ title: 'Наименование', field: 'var_name' }]
</script>
