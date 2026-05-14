<template>
  <DataTable
    :value="rows"
    class="w-wull mr-1 !min-h-20 !max-h-50 border border-gray-400 rounded-sm"
    scrollable
    scrollHeight="flex"
    showGridlines
    @rowReorder="reorder"
    size="small"
  >
    <Column rowReorder />
    <Column field="checkbox" style="padding: 0px; width: 26px">
      <template #body="{ data }: { data: Option }">
        <Checkbox binary v-model="data.checkbox" />
      </template>
    </Column>
    <Column field="title" header="Показатели" />
  </DataTable>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Checkbox } from 'primevue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { onMounted, ref, watch } from 'vue'

interface Option {
  title: string
  field: string
  width: number
  checkbox: boolean
}

const props = defineProps<{
  options: Option[]
}>()

const rows = ref<Option[]>([])

watch(
  () => rows,
  () => {
    model.value = rows.value.filter((item) => item.checkbox)
  },
  { deep: true }
)

onMounted(() => (rows.value = cloneDeep(props.options)))

const reorder = (reordered: { dragIndex: number; dropIndex: number; value: Option[] }) => {
  rows.value = reordered.value
}

const model = defineModel<Option[]>({ default: [] })
</script>
