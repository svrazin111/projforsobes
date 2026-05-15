<template>
  <div class="h-full" style="padding-bottom: 52px">
    <div class="font-semibold whitespace-nowrap text-[11px] text-[#0000BB]">
      Путь следования в бригадных участках
    </div>
    <GridAdvanced
      :rows="rows"
      :cols="columns"
      @column-resized="onColumnResized"
      @scroll-left-changed="onScrollLeftChanged"
      @scroll-viewport-changed="onScrollViewportChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ColumnDefinition } from 'tabulator-tables'
import { computed } from 'vue'

import { cellBlue, cellBoldBlue } from '@/composables/gridCells'
import GridAdvanced from '@/core/tabulator/GridAdvanced.vue'
import { WayFull, WayPfFull } from '@/pages/PFM/const/types'
import images from '@/shared/images/imported_images'

const props = withDefaults(
  defineProps<{
    rows?: WayFull[] | WayPfFull[]
    stk_only?: boolean
    isFull?: boolean
  }>(),
  {
    rows: () => [],
    stk_only: false,
    isFull: false
  }
)

const real_widths = defineModel<number[]>( 'real_widths', { default: [], required: true })
const scroll_left = defineModel<number>('scrollLeft', { default: 0, required: false })
const viewport_width = defineModel<number>('viewportWidth', { default: 0, required: false })

const onColumnResized = (widths: number[]) => {
  real_widths.value = widths
}

const onScrollLeftChanged = (scrollLeft: number) => {
  scroll_left.value = scrollLeft
}

const onScrollViewportChanged = (viewportWidth: number) => {
  viewport_width.value = viewportWidth
}

const rows = computed(() => {
  if (props.stk_only) {
    return props.rows.filter((item) => item['stk_type_1'] != 0)
  } else return props.rows
})

const columns = computed(() => {
  const added_col = { title: 'Затраты по ст. руб.', field: 'est', width: 60, headerSort: false }

  if (props.isFull) return [...way_cols.slice(0, 10), added_col, ...way_cols.slice(10)]
  return way_cols
})

const way_cols: ColumnDefinition[] = [
  {
    title: '№',
    field: 'num',
    width: 25,
    minWidth: 25,
    headerSort: false
  },
  { title: 'Дор', field: 'rd_name_1', width: 40, headerSort: false, formatter: cellBlue },
  {
    title: 'Тип',
    field: 'pr_per',
    width: 30,
    minWidth: 30,
    headerSort: false,
    tooltip: (e, cell) => {
      const item = cell.getData()

      if (item.stk_type_1 == 2) return 'Стык'
      if (item.stk_type_1 == 3) return 'Стык'
      if (item.pr_per == 1) return 'Ст. переработки'
      if (item.pr_per == 0) return ''

      return ''
    },
    formatter: (cell) => {
      const item = cell.getData()
      if (item.stk_type_1 == 2) {
        return `<img src="${images.public_img}" height="16" width="16">`
      }
      if (item.stk_type_1 == 3) {
        return `<img src="${images.stik}" height="16" width="16">`
      }
      if (item.pr_per == 1) {
        return `<img src="${images.star_red}" height="16" width="16">`
      }
      if (item.pr_per == 0) {
        return `<img src="${images.element}" height="16" width="16">`
      }
      return ''
    }
  },
  {
    title: 'ЕСР нач. уч.',
    field: 'st_esr_1',
    width: 60,
    headerSort: false,
    formatter: cellBoldBlue
  },
  {
    title: 'Ст. начала уч.',
    field: 'st_name_1',
    width: 100,
    headerSort: false,
    formatter: cellBoldBlue
  },
  {
    title: 'Ст. конца уч.',
    field: 'st_name_2',
    width: 100,
    headerSort: false
  },
  {
    title: 'Длина участка, км.',
    field: 'len',
    width: 60,
    headerSort: false
  },
  {
    title: 'Время след. по уч. ч.',
    field: 'tuch',
    width: 60,
    headerSort: false
  },
  {
    title: 'Время на ст. ч.',
    field: 'tst',
    width: 60,
    headerSort: false
  },
  {
    title: 'Затраты на уч. руб.',
    field: 'euch',
    width: 60,
    headerSort: false
  },
  {
    title: 'Вес. норма макс, т.',
    field: 'ves_max',
    width: 60,
    headerSort: false,
    formatter: (cell) => {
      const item = cell.getData()
      if (Number(item.ves_max < item.ves)) {
        return `<div style="color: red; font-size: 9px !important; font-weight: 400">${item.ves_max}</div>`
      } else return `<div style="font-size: 9px !important; font-weight: 400">${item.ves_max}</div>`
    }
  }
]
</script>
