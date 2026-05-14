<template>
  <Selector
    label="Тип по прибытию"
    :rows="rows"
    :columns="cols"
    required
    title_field="type_nz_name"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import Selector from '@/components/selector/basic/Selector.vue'

const rows = useFiltersStore().get().TYPE_NZ

const cols = [
  { title: 'Код', field: 'type_nz' },
  { title: 'Наименование', field: 'type_nz_name' }
]

const model = defineModel<object>()
</script>
