<template>
  <MultiSelector
    class="w-full"
    label="Владелец/Оператор подвижного состава"
    :rows="temp"
    :columns="[
      { title: 'Код', field: 'rps_owner_okpo' },
      { title: 'Краткое наименование', field: 'rps_owner_name' },
      { title: 'Наименование', field: 'rps_owner_fname' }
    ]"
    select
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import { useOperatorStore } from '@/app/plugins/pinia/operators'
import MultiSelector from '@/components/selector/basic/MultiSelector.vue'
import { RpsOwner } from '@/types/filters/filters'

const rows = useFiltersStore().get().RPS_OWNER

const rows2 = useOperatorStore().get()

const ids = rows.map((item) => Number(item.rps_owner_okpo))

const temp = rows2
  .filter((item) => ids.includes(item.code))
  .map((item) => {
    return {
      rps_owner_okpo: item.code,
      rps_owner_name: item.sname,
      rps_owner_fname: item.name
    }
  })

const selected = defineModel<RpsOwner[]>()
</script>
