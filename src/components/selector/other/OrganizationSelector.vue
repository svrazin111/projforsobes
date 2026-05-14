<template>
  <Selector
    :label="props.label"
    :rows="organizations"
    :columns="[
      { title: 'ОКПО', field: 'code' },
      { title: 'Наименование', field: 'name' }
    ]"
    title_field="full_name"
    v-model="selected"
  />
</template>

<script setup lang="ts">
import { useOrganizationStore } from '@/app/plugins/pinia/organization'
import Selector from '@/components/selector/basic/Selector.vue'
import { Organization } from '@/types/organization'

const props = defineProps<{
  label: string
}>()

const organizations = useOrganizationStore().get()

const selected = defineModel<Organization>()
</script>
