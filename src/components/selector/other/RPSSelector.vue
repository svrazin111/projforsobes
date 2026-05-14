<template>
  <MultiSelector
    label="Род подвижного состава"
    class="w-full"
    :rows="rows"
    :columns="cols"
    select
    :rows_to_highlight="props.rows_to_highlight"
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import MultiSelector from '@/components/selector/basic/MultiSelector.vue'

const props = withDefaults(
  defineProps<{
    rows_to_highlight?: object[]
  }>(),
  {
    rows_to_highlight: () => [],
  }
)

const rows = useFiltersStore().get().ROD_VAG
const cols = [
  { title: 'Код', field: 'rod_vag' },
  { title: 'Наименование', field: 'rod_vag_fname' },
]

const selected = defineModel<Array<object>>()
</script>
