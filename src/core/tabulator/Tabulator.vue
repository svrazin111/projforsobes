<template>
  <div class="h-full relative">
    <div class="flex absolute mt-0.5 ml-8" style="z-index: 1 !important">
      <button v-if="groups.length > 0" @click="toggleTreeDepth(0)" class="group-btn">1</button>

      <button
        v-for="(item, index) in groups"
        :key="item"
        @click="toggleTreeDepth(index + 1)"
        class="group-btn"
      >
        {{ index + 2 }}
      </button>

      <button
        v-if="show_unsort_btn && props.headerVisible"
        @click="unsort"
        class="group-btn"
        :class="custom_sort_btn_class"
        style="width: 100px"
      >
        Снять сортировки
      </button>

      <button
        v-if="typeof excel_download_function === 'function'"
        @click="excel_download_function"
        class="group-btn flex"
        style="width: 44px"
      >
        <img :src="images.page_excel" />
        <span>Excel</span>
      </button>
    </div>

    <div class="tabulator-main border border-gray-400" ref="grid" style="width: 100%"></div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import {
  ColumnDefinition,
  Filter,
  RowComponent,
  Sorter,
  SorterFromTable,
  TabulatorFull as Tabulator
} from 'tabulator-tables'
import { nextTick, onMounted, ref, watch } from 'vue'

import images from '@/shared/images/imported_images'

import { columns_for_groupping } from './columns_for_groupping'
import { filterColumns, getHierarchyTitleForExpanderColumn, groupToTree } from './groupToTree'

const emit = defineEmits(['rowDblClick', 'rowSelectionChanged', 'update:modelValue', 'rowClick'])

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
    modelValue?: any[]
    headerVisible?: boolean
    manualFilters?: Filter[]
    alwaysSelect?: boolean
    custom_sort_btn_class?: string
  }>(),
  {
    groups: () => [],
    avalible_groups: () => [],
    groupSortFields: () => [],
    selectableRows: 1,
    height: null,
    rowFormatter: () => {},
    rowHeight: 22,
    initialSort: () => [],
    modelValue: () => [],
    headerVisible: true,
    manualFilters: () => [],
    alwaysSelect: false,
    custom_sort_btn_class: ''
  }
)

const grid = ref<HTMLElement | null>(null)
const show_unsort_btn = ref(false)

let isProgrammaticSelection = false

let table: Tabulator | undefined

watch(
  () => props.manualFilters,
  () => {
    if (!props.manualFilters.length) {
      table?.clearFilter(true)
      return
    }

    table?.setFilter(props.manualFilters)
  },
  { deep: true }
)

onMounted(() => {
  if (!grid.value) return

  table = new Tabulator(grid.value, {
    index: 'marsh_id',
    maxHeight: '100%',
    rowHeight: props.rowHeight,
    dataTree: true,
    dataTreeStartExpanded: false,
    dataTreeChildIndent: 18,
    selectableRows: props.selectableRows,
    columns: props.cols,
    sortOrderReverse: true,
    movableColumns: true,
    layout: 'fitColumns',
    columnDefaults: {
      widthShrink: 0,
      headerWordWrap: true,
      headerSortTristate: true
    },
    headerVisible: props.headerVisible,
    renderVerticalBuffer: 20,
    reactiveData: true,
    resizableColumnFit: false,
    dataTreeBranchElement: false,
    rowFormatter: props.rowFormatter,
    selectableCheck: function (row: { isSelected: () => any }) {
      // ? Prevent deselection if already selected
      return !row.isSelected()
    }
  })

  table.on('rowDblClick', (e, row) => {
    emit('rowDblClick', row, e)
  })

  table.on('rowSelectionChanged', (data) => {
    if (isProgrammaticSelection) return

    emit('update:modelValue', data)
    emit('rowSelectionChanged', data)
  })

  if (props.alwaysSelect) {
    table.on('rowClick', (e, row) => {
      row.select()

      emit('rowClick', row)
    })
  }

  table.on('dataSorted', (sorters: SorterFromTable[]) => {
    if (!table) return

    table.getColumns().forEach((col) => {
      const colEl = col.getElement()
      const badge = colEl.querySelector('.sort-order-badge')
      if (badge) badge.remove()
    })

    sorters.forEach((sort, i) => {
      const col = table?.getColumn(sort.field)
      if (!col) return

      const colEl = col.getElement()
      const header = colEl.querySelector('.tabulator-col-title')

      if (header) {
        const badge = document.createElement('span')
        badge.className = 'sort-order-badge'
        badge.textContent = String(i + 1)
        header.appendChild(badge)
      }
    })

    show_unsort_btn.value = sorters.length > 0
  })

  nextTick(() => {
    if (!grid.value) return

    grid.value.style.height = props.height == null ? `calc(100% - 0px)` : `${props.height}px`
  })

  setTimeout(() => {
    table?.setData([])
    nextTick(() => table?.setSort(props.initialSort))
  }, 250)
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (!table) return

    isProgrammaticSelection = true

    table.deselectRow()

    if (newVal && newVal.length && newVal.length > 0) {
      const ids = newVal.map((row) => row.marsh_id)
      ids.forEach((id) => {
        table.selectRow(id)
      })
    }

    isProgrammaticSelection = false
  },
  { deep: true }
)

watch(
  () => props.rows,
  () => {
    setTimeout(() => {
      if (!table) return

      nextTick(() => {
        if (!table) return

        table.blockRedraw()

        table.replaceData(
          groupToTree(
            cloneDeep(props.rows),
            props.groups,
            columns_for_groupping,
            props.groupSortFields
          )
        )

        table.restoreRedraw()

        nextTick(() => toggleTreeDepth(1))
      })
    }, 500)
  },
  { deep: true }
)

watch(
  () => props.cols,
  () => {
    setTimeout(() => {
      if (!table) return
      table.setColumns(props.cols)
    }, 500)
  },
  { deep: true }
)

watch(
  () => props.groups,
  () => {
    setTimeout(() => {
      if (!table) return

      table.blockRedraw()

      let columns_to_hide = props.groups.filter(
        (item) => item && item !== '' && item !== props.cols[0]?.field
      )

      if (columns_to_hide.includes('st_ot_name')) columns_to_hide.push('st_ot_esr')
      if (columns_to_hide.includes('st_nz_name')) columns_to_hide.push('st_nz_esr')
      if (columns_to_hide.includes('last_st_name')) columns_to_hide.push('last_st_esr')
      if (columns_to_hide.includes('st_oper_name')) columns_to_hide.push('st_oper_esr')
      if (columns_to_hide.includes('st_nazn_name')) columns_to_hide.push('st_nazn_esr')
      if (columns_to_hide.includes('stik_out_name')) columns_to_hide.push('stik_out_esr')
      if (columns_to_hide.includes('stik_in_name')) columns_to_hide.push('stik_in_esr')
      if (columns_to_hide.includes('type_ot_name')) columns_to_hide.push('type_ot_mnemo')
      if (columns_to_hide.includes('type_nz_name')) columns_to_hide.push('type_nz_mnemo')

      const new_columns = filterColumns(props.cols, columns_to_hide)

      if (props.avalible_groups.length) {
        new_columns.forEach((item: any) => {
          if (item.formatterType === 'treeExpander') {
            item.title = getHierarchyTitleForExpanderColumn(props.groups, props.avalible_groups)
            item.headerHozAlign = 'left'
          }
        })
      }

      table.setColumns(new_columns)

      table.replaceData(
        groupToTree(
          cloneDeep(props.rows),
          props.groups,
          columns_for_groupping,
          props.groupSortFields
        )
      )

      table.restoreRedraw()

      nextTick(() => toggleTreeDepth(1))
    }, 500)
  },
  { deep: true }
)

const unsort = () => {
  table?.setSort([])
}

const toggleTreeDepth = (depth: number) => {
  if (!table) return

  table.blockRedraw()

  const processRow = (row: RowComponent, currentLevel: number) => {
    if (currentLevel < depth) {
      row.treeExpand()
    } else {
      row.treeCollapse()
    }

    const children = row.getTreeChildren()
    if (children?.length) {
      for (const child of children) {
        processRow(child, currentLevel + 1)
      }
    }
  }

  for (const row of table.getRows()) {
    processRow(row, 0)
  }

  table.restoreRedraw()
}

const getExpandedFlatRows = () => {
  const result: RowComponent[] = []
  const root = table?.getRows('active') ?? []

  const walk = (row: RowComponent) => {
    result.push(row)

    if (!row.isTreeExpanded?.()) return

    const children = row.getTreeChildren?.() || []
    children.forEach((item) => walk(item))
  }

  root.forEach((row) => walk(row))

  return result
}

const getColumnDefinitions = () => {
  return table?.getColumnDefinitions()
}

defineExpose({
  table: {
    unsort,
    toggleTreeDepth,
    getExpandedFlatRows,
    getColumnDefinitions
  }
})
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
