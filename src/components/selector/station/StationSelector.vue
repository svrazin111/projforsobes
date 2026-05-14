<template>
  <Selector
    :label="props.label"
    :rows="stations"
    :columns="columns"
    :required="required"
    title_field="full_name"
    :small="props.small"
    :disabled="props.disabled"
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useStationStore } from '@/app/plugins/pinia/station'
import { Station } from '@/types/station'

import Selector from '../basic/Selector.vue'

const props = withDefaults(
  defineProps<{
    label: string
    required?: boolean
    small?: boolean
    disabled?: boolean
  }>(),
  {
    required: false,
    small: false,
    disabled: false
  }
)

const stations = useStationStore().get()

const columns = [
  { title: 'ЕСР', field: 'esr' },
  { title: 'Наименование', field: 'vname' },
  { title: 'Кр. наименование', field: 'name' },
  { title: 'Дорога', field: 'road_name' },
  { title: 'Ст. ПФ', field: 'flag_pf_name' },
  { title: 'Стык', field: 'stk_type_name' }
]

const selected = defineModel<Station>({ required: true })
</script>
