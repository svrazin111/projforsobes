<template>
  <div class="tabulator-main border border-gray-400" ref="grid" id="grid" style="width: 100%"></div>
</template>

<!-- 
  На больших таблицах может быть проблема со скроллом, фиксится так:
  В файле ResponsiveLayout.js

  	layoutRow(row){
      var rowEl = row.getElement();

      if(row.modules.responsiveLayout){
        rowEl.appendChild(row.modules.responsiveLayout.element);
        this.generateCollapsedRowContent(row);
        ? row.calcHeight(true) добавить эту строку
      }
    }

-->

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import {
  ColumnComponent,
  ColumnDefinition,
  RowComponent,
  Sorter,
  TabulatorFull as Tabulator
} from 'tabulator-tables'
import { nextTick, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

import { columns_for_groupping } from './columns_for_groupping'
import { filterColumns, getHierarchyTitleForExpanderColumn, groupToTree } from './groupToTree'

const props = withDefaults(
  defineProps<{
    columns: ColumnDefinition[]
    rows?: any[]
    groupBy?: string[]
    avalible_groups?: { id: number; label: string; value: string }[]
    groupSortFields?: string[]
    selectableRows: number
    height: number | null
    rowFormatter: (row: RowComponent) => any
    rowHeight?: number | null
    initialSort?: Sorter[]
  }>(),
  {
    rows: () => [],
    groupBy: () => [],
    avalible_groups: () => [],
    groupSortFields: () => [],
    rowHeight: 22,
    initialSort: () => []
  }
)

const emit = defineEmits([
  'rowDblClick',
  'rowSelectionChanged',
  'dataSorted',
  'columnResized',
  'scrollLeftChanged',
  'scrollViewportChanged'
])

const grid = useTemplateRef('grid')

let table: Tabulator = undefined
let resizeFrame = 0
let scrollFrame = 0
let tableScrollHolder: Element | null = null
let tableScrollResizeObserver: ResizeObserver | null = null

const emitColumnWidths = () => {
  if (!table) return

  emit(
    'columnResized',
    table.getColumns().map((item) => item.getWidth())
  )
}

const scheduleColumnWidthsEmit = () => {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(emitColumnWidths)
}

const emitScrollLeft = () => {
  emit('scrollLeftChanged', tableScrollHolder?.scrollLeft ?? 0)
  emit('scrollViewportChanged', tableScrollHolder?.clientWidth ?? 0)
}

const scheduleScrollLeftEmit = () => {
  cancelAnimationFrame(scrollFrame)
  scrollFrame = requestAnimationFrame(emitScrollLeft)
}

const bindScrollHolder = () => {
  tableScrollHolder?.removeEventListener('scroll', scheduleScrollLeftEmit)
  tableScrollResizeObserver?.disconnect()

  tableScrollHolder = grid.value?.querySelector('.tabulator-tableholder') ?? null
  tableScrollHolder?.addEventListener('scroll', scheduleScrollLeftEmit)

  if (tableScrollHolder) {
    tableScrollResizeObserver = new ResizeObserver(scheduleScrollLeftEmit)
    tableScrollResizeObserver.observe(tableScrollHolder)
  }

  emitScrollLeft()
}

const stopLiveColumnResize = () => {
  document.body.removeEventListener('mousemove', scheduleColumnWidthsEmit)
  document.body.removeEventListener('mouseup', stopLiveColumnResize)
  document.body.removeEventListener('touchmove', scheduleColumnWidthsEmit)
  document.body.removeEventListener('touchend', stopLiveColumnResize)
  scheduleColumnWidthsEmit()
}

const startLiveColumnResize = (event: MouseEvent | TouchEvent) => {
  if (!(event.target instanceof Element)) return
  if (!event.target.closest('.tabulator-col-resize-handle')) return

  document.body.addEventListener('mousemove', scheduleColumnWidthsEmit)
  document.body.addEventListener('mouseup', stopLiveColumnResize)
  document.body.addEventListener('touchmove', scheduleColumnWidthsEmit)
  document.body.addEventListener('touchend', stopLiveColumnResize)
}

onMounted(() => {
  table = new Tabulator(grid.value, {
    index: 'marsh_id',
    maxHeight: '100%',
    rowHeight: props.rowHeight,
    dataTree: true,
    dataTreeStartExpanded: false,
    dataTreeChildIndent: 18,
    selectableRows: props.selectableRows,
    columns: props.columns,
    sortOrderReverse: true,
    layout: 'fitColumns',
    columnDefaults: {
      widthShrink: 0,
      headerWordWrap: true,
      headerSortTristate: true
    },
    renderVerticalBuffer: 300,
    reactiveData: true,
    resizableColumnFit: false,
    dataTreeBranchElement: false,
    rowFormatter: props.rowFormatter
  })

  grid.value?.addEventListener('mousedown', startLiveColumnResize, true)
  grid.value?.addEventListener('touchstart', startLiveColumnResize, true)

  table.on('rowDblClick', (e, row) => {
    emit('rowDblClick', row, e)
  })
  table.on('rowSelectionChanged', (e, row) => {
    emit('rowSelectionChanged', row, e)
  })

  table.on('dataSorted', (sorters, rows) => {
    if (!table) return

    table.getColumns().forEach((col) => {
      const colEl = col.getElement()
      const sortOrderBadge = colEl.querySelector('.sort-order-badge')
      if (sortOrderBadge) sortOrderBadge.remove()
    })

    sorters.forEach((sort, i) => {
      if (!table) return

      const col = table.getColumn(sort.field)
      if (col) {
        const colEl = col.getElement()
        const header = colEl.querySelector('.tabulator-col-title')
        if (header) {
          const badge = document.createElement('span')
          badge.className = 'sort-order-badge'
          badge.textContent = String(i + 1)
          header.appendChild(badge)
        }
      }
    })

    emit('dataSorted', sorters)
  })

  table.on('columnResized', (column: ColumnComponent) => {
    emitColumnWidths()
  })

  nextTick(() => {
    if (!grid.value) return

    if (props.height == null) {
      grid.value.style.height = `calc(100% - 0px)`
    } else {
      grid.value.style.height = `${props.height}px`
    }
  })

  setTimeout(() => {
    table.setData([])

    nextTick(() => table.setSort(props.initialSort))
  }, 250)

  setTimeout(() => {
    emitColumnWidths()
    bindScrollHolder()
  }, 1000)
})

onUnmounted(() => {
  cancelAnimationFrame(resizeFrame)
  cancelAnimationFrame(scrollFrame)
  grid.value?.removeEventListener('mousedown', startLiveColumnResize, true)
  grid.value?.removeEventListener('touchstart', startLiveColumnResize, true)
  tableScrollHolder?.removeEventListener('scroll', scheduleScrollLeftEmit)
  tableScrollResizeObserver?.disconnect()
  stopLiveColumnResize()
})

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
            props.groupBy,
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
  () => props.columns,
  () => {
    setTimeout(() => {
      if (!table) return

      table.blockRedraw()

      table.setColumns(props.columns)

      table.restoreRedraw()
    }, 500)
  },
  { deep: true }
)

watch(
  () => props.groupBy,
  () => {
    setTimeout(() => {
      if (!table || !props.groupBy) return

      table.blockRedraw()

      let columns_to_hide = props.groupBy.filter(
        (item) => item && item != '' && item != props.columns[0].field
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

      // Группировка Поезд
      // Или группировки Дорога приема/сдачи или Прием/сдача/транзит
      if (
        columns_to_hide.includes('train_full_name') ||
        columns_to_hide.includes('rd_name') ||
        columns_to_hide.includes('type')
      ) {
        columns_to_hide.push('st_ot_esr')
        columns_to_hide.push('st_ot_name')
        columns_to_hide.push('rd_ot_name')
        columns_to_hide.push('st_nz_esr')
        columns_to_hide.push('st_nz_name')
        columns_to_hide.push('rd_nz_name')
      }

      const new_columns = filterColumns(props.columns, columns_to_hide) as ColumnDefinition[]
      if (props.avalible_groups.length) {
        new_columns.forEach((item) => {
          if (item.formatterType && item.formatterType == 'treeExpander') {
            item.title = getHierarchyTitleForExpanderColumn(props.groupBy, props.avalible_groups)
            item.headerHozAlign = 'left'
          }
        })
      }

      table.setColumns(new_columns)

      table.replaceData(
        groupToTree(
          cloneDeep(props.rows),
          props.groupBy,
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
  table.setSort([])
}

const toggleTreeDepth = (depth: number) => {
  table.blockRedraw()

  const processRow = (row: RowComponent, currentLevel: number) => {
    if (currentLevel < depth) {
      row.treeExpand()
    } else {
      row.treeCollapse()
    }

    const children = row.getTreeChildren()
    if (children && children.length) {
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
  const root = table.getRows('active')

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
  return table.getColumnDefinitions()
}

defineExpose({
  unsort,
  toggleTreeDepth,
  getExpandedFlatRows,
  getColumnDefinitions
})
</script>
