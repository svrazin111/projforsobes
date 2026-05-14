<template>
  <div class="w-full">
    <div
      v-if="props.label"
      class="font-semibold text-[#0000BB] text-[11px] whitespace-nowrap"
      style="overflow: hidden"
    >
      {{ props.label }}
    </div>
    <div class="flex w-full">
      <DataTable
        :value="model"
        class="w-full border border-gray-400 rounded-sm"
        style="min-height: 80px !important; max-height: 200px !important"
        scrollable
        scrollHeight="flex"
        showGridlines
        selectionMode="single"
        v-model:selection="selected_item"
        :editMode="props.input ? 'cell' : ''"
        @cell-edit-complete="onCellEditComplete"
        @rowReorder="onRowReorder"
        :rowStyle="highlightRow"
        size="small"
        :pt="{
          column: {
            bodycell: ({ state }) => ({
              class: [{ '!py-0': state['d_editing'] }]
            })
          }
        }"
      >
        <Column v-if="props.reorder" rowReorder />
        <Column
          v-for="col in props.columns"
          :key="col.field"
          :field="col.field"
          :header="col.title"
        >
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" autofocus fluid size="small" class="h-6" />
          </template>
        </Column>
      </DataTable>
      <div v-if="!props.locked" class="flex flex-col gap-0.5 ml-0.5 w-[22px]">
        <img :src="images.add" @click="addRow" v-if="props.input" class="img-btn" />
        <img
          :src="images.table_selection_row"
          @click="openSelectMenu"
          v-if="props.select"
          class="img-btn"
        />
        <slot name="addition_btn"></slot>
        <img :src="images.delete_16" @click="deleteRow" class="img-btn" />
        <img :src="images.clean" @click="clear" class="img-btn" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash'
import { InputText } from 'primevue'
import Column, { ColumnProps } from 'primevue/column'
import DataTable, { DataTableCellEditCompleteEvent } from 'primevue/datatable'
import { ref } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import { filterDuplicates } from '@/shared/array'
import images from '@/shared/images/imported_images'
import { createUserAction } from '@/shared/promises'

const props = withDefaults(
  defineProps<{
    label?: string
    rows?: any[]
    columns: ColumnProps[]
    select?: boolean
    input?: boolean
    reorder?: boolean
    locked?: boolean
    rows_to_highlight?: any[]
  }>(),
  {
    label: '',
    rows: () => [],
    select: false,
    input: false,
    reorder: false,
    locked: false,
    rows_to_highlight: () => []
  }
)

const highlightRow = (data) => {
  let highlight = false
  props.rows_to_highlight.forEach((item) => {
    if (isEqual(data, item)) highlight = true
  })
  if (highlight) {
    return { 'background-color': '#F1FF7A' }
  }
}

const selected_item = ref(undefined)

const onCellEditComplete = ({ data, newValue, field }: DataTableCellEditCompleteEvent) => {
  data[field] = newValue
}

const onRowReorder = (event) => {
  model.value = event.value
}

const addRow = () => {
  model.value.push({ id: model.value.length + 1 })
}

const openSelectMenu = () => {
  const userAction = createUserAction()
  emitter.emit('new-filter', {
    title: props.label,
    rows: props.rows,
    columns: props.columns,
    promise: userAction,
    single: false
  })

  userAction.wait().then((data) => {
    model.value = model.value.concat(data)
    setTimeout(() => {
      model.value = filterDuplicates(model.value)
    }, 100)
  })
}

const deleteRow = () => {
  if (!selected_item.value) return

  const index = ref(-1)
  model.value?.forEach((item, id) => {
    if (item.id == selected_item.value.id) {
      index.value = id
    }
  })
  if (index.value > -1) {
    model.value?.splice(index.value, 1)
  }
}

const clear = () => {
  model.value = []
}

const model = defineModel<any[]>({ default: [] })
</script>
