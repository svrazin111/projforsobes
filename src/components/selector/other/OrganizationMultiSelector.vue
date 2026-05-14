<template>
  <MultiSelector
    class="w-full"
    :label="props.label"
    :rows="organizations"
    :columns="[
      { title: 'ОКПО', field: 'code', width: 60 },
      { title: 'Наименование', field: 'name' },
    ]"
    select
    :rows_to_highlight="props.rows_to_highlight"
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useOrganizationStore } from '@/app/plugins/pinia/organization'
import MultiSelector from '@/components/selector/basic/MultiSelector.vue'
import { Organization } from '@/types/organization'

const props = withDefaults(
  defineProps<{
    label: string
    rows_to_highlight?: object[]
  }>(),
  {
    rows_to_highlight: () => [],
  }
)

const organizations = useOrganizationStore().get()

const selected = defineModel<Organization[]>()
</script>
