<template>
  <Selector
    label="Накопление маршрута"
    :rows="rows"
    :columns="cols"
    title_field="ways_private_name"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import Selector from '@/components/selector/basic/Selector.vue'
import { TypeForm } from '@/types/filters/filters'

const rows = useFiltersStore().get().TYPE_FORM
const cols = [
  { title: 'Код', field: 'ways_private' },
  { title: 'Наименование', field: 'ways_private_name' },
]

const model = defineModel<TypeForm>()
</script>
