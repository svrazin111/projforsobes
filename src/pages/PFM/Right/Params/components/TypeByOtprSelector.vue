<template>
  <Selector
    label="Тип по отправлению"
    :rows="rows"
    :columns="cols"
    required
    title_field="type_ot_name"
    v-model="model"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import Selector from '@/components/selector/basic/Selector.vue'
import { TypeOt } from '@/types/filters/filters'

const rows = useFiltersStore().get().TYPE_OT

const cols = [
  { title: 'Код', field: 'type_ot' },
  { title: 'Наименование', field: 'type_ot_name' },
]

const model = defineModel<TypeOt>()
</script>
