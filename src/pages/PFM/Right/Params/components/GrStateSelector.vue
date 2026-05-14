<template>
  <Selector
    label="Вид маршрута"
    :rows="rows"
    :columns="[
      { title: 'Код', field: 'gr_state' },
      { title: 'Наименование', field: 'gr_state_mnemo' }
    ]"
    required
    title_field="gr_state_mnemo"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import Selector from '@/components/selector/basic/Selector.vue'
import { GrState } from '@/types/filters/filters'

const rows = useFiltersStore().get().GR_STATE

const model = defineModel<GrState>()
</script>
