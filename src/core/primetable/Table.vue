<template>
  <DataTable
    :value="props.rows"
    showGridlines
    stripedRows
    scrollable
    scrollHeight="flex"
    selectionMode="single"
    v-model:selection="selected"
    @row-dblclick="onRowDblClick"
    class="border border-gray-400 rounded-sm"
    :class="props.class"
    size="small"
  >
    <Column v-for="col of props.cols" :key="col.field" :field="col.field" :header="col.title">
      <template #body="{ data, field }">
        <div v-if="!col.formatter" :class="col.class">
          {{ data[field] }}
        </div>
        <div v-else>
          <div v-html="col.formatter(data)"></div>
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<!-- Чет нет в нем особого прикола, потом вообще уберу -->

<script setup lang="ts">
import { Column, DataTable, DataTableRowDoubleClickEvent } from 'primevue'

const props = defineProps<{
  rows: Array<object>
  cols: Array<{ field: string; title: string; class?: string; formatter?: () => void }>
  class?: string
}>()

const emit = defineEmits(['row-dblclick'])

const onRowDblClick = (event: DataTableRowDoubleClickEvent) => {
  emit('row-dblclick', event)
}

const selected = defineModel()
</script>
