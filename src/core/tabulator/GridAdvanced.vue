<template>
  <div class="h-full">
    <div class="flex absolute mt-0.5 ml-8" style="z-index: 1 !important">
      <button v-if="props.groups.length > 0" @click="toggleGroups(0)" class="group-btn">1</button>
      <button
        v-for="(item, index) in props.groups"
        :key="item"
        @click="toggleGroups(index + 1)"
        class="group-btn"
      >
        {{ index + 2 }}
      </button>
      <button v-if="show_unsort_btn" @click="unsort" class="group-btn" style="width: 100px">
        Снять сортировки
      </button>
      <button
        v-if="typeof props.excel_download_function === 'function'"
        v-tooltip.bottom="'Выгурузить в Excel'"
        @click="props.excel_download_function"
        class="group-btn flex"
        style="width: 44px"
      >
        <img :src="images.page_excel" />
        <span>Excel</span>
      </button>
    </div>
    <TabulatorTree
      ref="tabulator"
      :rows="props.rows"
      :columns="props.cols"
      :groupBy="props.groups"
      :avalible_groups="props.avalible_groups"
      :groupSortFields="props.groupSortFields"
      :height="props.height"
      :selectableRows="props.selectableRows"
      :rowFormatter="props.rowFormatter"
      :rowHeight="props.rowHeight"
      :initialSort="props.initialSort"
      @dataSorted="onSortChanged"
      @columnResized="onColumnResized"
      @rowSelectionChanged="
        (e) =>
          emit(
            'rowSelectionChanged',
            e.map((item) => item._row.data)
          )
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ColumnDefinition, RowComponent, Sorter, SorterFromTable } from 'tabulator-tables'
import { ref, useTemplateRef } from 'vue'

import images from '@/shared/images/imported_images'

import TabulatorTree from './TabulatorTree.vue'

const emit = defineEmits(['rowSelectionChanged', 'columnResized'])

const table = useTemplateRef<InstanceType<typeof TabulatorTree>>('tabulator')

const props = withDefaults(
  defineProps<{
    rows: any[]
    cols: ColumnDefinition[]
    groups?: string[]
    avalible_groups?: { id: number; label: string; value: string }[]
    groupSortFields?: string[]
    selectableRows?: number
    height?: number | null
    rowFormatter?: (row: RowComponent) => any
    rowHeight?: number | null
    initialSort?: Sorter[]
    excel_download_function?: () => void
  }>(),
  {
    groups: () => [],
    avalible_groups: () => [],
    groupSortFields: () => [],
    selectableRows: 1,
    height: null,
    rowFormatter: () => {},
    rowHeight: 22,
    initialSort: () => []
  }
)

const toggleGroups = (group_index: number) => {
  if (!table.value) return
  table.value.toggleTreeDepth(group_index)
}

const show_unsort_btn = ref(false)
const onSortChanged = (sorters: SorterFromTable[]) => {
  show_unsort_btn.value = sorters.length > 0
}
const unsort = () => {
  if (!table.value) return

  table.value.unsort()
}

const onColumnResized = (widths: number[]) => {
  emit('columnResized', widths)
}

defineExpose({ table })
</script>

<style scoped>
.group-btn {
  width: 16px;
  height: 16px;
  font-size: 10px;
  padding: 1px;
  margin-right: 2px;
  border: solid 1px gray;
  background-color: lightgray;
  cursor: pointer;
  transition: background-color ease-in-out 0.2s;
}
.group-btn:hover {
  background-color: lightyellow;
}
</style>
