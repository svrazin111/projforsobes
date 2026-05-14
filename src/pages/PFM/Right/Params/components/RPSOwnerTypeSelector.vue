<template>
  <Selector
    label="Тип собственности подвижного состава"
    :rows="rps_owner_types"
    :columns="[
      { title: 'Код', field: 'code' },
      { title: 'Наименование', field: 'name' },
    ]"
    title_field="name"
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import Selector from '@/components/selector/basic/Selector.vue'

const rps_owner_types = useFiltersStore().getRpsOwnerTypes()

type RpsOwnerType = {
  code: number
  name: string
}

const selected = defineModel<RpsOwnerType>()
</script>
