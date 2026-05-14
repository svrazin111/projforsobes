<template>
  <div class="w-full h-full relative">
    <div class="flex justify-between h-[30px] items-center" v-if="props.is_main_grid">
      <div class="flex gap-2 h-[20px] text-[11px]">
        <div class="flex">
          <div class="font-semibold whitespace-nowrap mr-1 mt-[3px]">По ст. отпр.</div>
          <input
            type="text"
            v-model="filters_st_ot_esr"
            placeholder="ЕСР"
            class="border border-gray-400 rounded-[2px] pl-1 w-[50px]"
          />
          <input
            type="text"
            v-model="filters_st_ot_name"
            placeholder="Станция"
            class="border border-gray-400 rounded-[2px] pl-1 w-[120px]"
          />
        </div>
        <div class="flex">
          <div class="font-semibold whitespace-nowrap mr-1 mt-[3px]">По ст. назн.</div>
          <input
            type="text"
            v-model="filters_st_nz_esr"
            placeholder="ЕСР"
            class="border border-gray-400 rounded-[2px] pl-1 w-[50px]"
          />
          <input
            type="text"
            v-model="filters_st_nz_name"
            placeholder="Станция"
            class="border border-gray-400 rounded-[2px] pl-1 w-[120px]"
          />
        </div>
      </div>
      <Status :roads_ot="props.roads_ot" />
    </div>
    <Tabulator
      ref="tabulator"
      v-model="selected_rows"
      :rows="rows"
      :cols="columns"
      :rowHeight="24"
      :initialSort="initial_sort"
      :headerVisible="props.is_main_grid"
      :manualFilters="manualFilters"
      :rowFormatter="rowFormatter"
      alwaysSelect
      @rowClick="onRowClick"
      :custom_sort_btn_class="'relative top-[-25px] left-[480px] '"
      style="height: calc(100% - 32px)"
    />
    <Preloader :active_queries="Number(props.is_loading)" />
  </div>
</template>

<script setup lang="ts">
import { ColumnDefinition, Filter, RowComponent, Sorter } from 'tabulator-tables'
import { computed, ref, useTemplateRef } from 'vue'

import Preloader from '@/components/Preloader.vue'
import Tabulator from '@/core/tabulator/Tabulator.vue'
import { parseDateDDMMYYYY } from '@/shared/date'
import images from '@/shared/images/imported_images'

import Status from '../Bottom/Status.vue'
import { PfmRow } from '../const/types'
import { mountVueInCell } from './components/helper'
import StatusCellWrapper from './components/StatusCellWrapper.vue'
import { date_end_tooltip, marsh_type_formatter } from './const/formatters'

const emit = defineEmits([
  'history-click',
  'approve_click',
  'unapprove_click',
  'main-grid-click',
  'return-to-draft'
])

const props = withDefaults(
  defineProps<{
    rows?: PfmRow[]
    roads_ot?: number[]
    is_main_grid?: boolean
    is_loading: boolean
  }>(),
  {
    rows: () => [],
    roads_ot: () => [],
    is_main_grid: false
  }
)

const grid = useTemplateRef('tabulator')

const selected_rows = defineModel<PfmRow[]>({ default: [] })

const lenFunc = (item: PfmRow) => {
  return `${item.len.length == 0 ? '-' : item.len}/${
    item.usl_len_base.length == 0 ? '-' : item.usl_len_base
  }`
}

const initial_sort = computed(() => {
  if (!props.is_main_grid) {
    return [{ column: 'date_begin', dir: 'desc' }] as Sorter[]
  }

  return [
    { column: 'rd_ot_code', dir: 'asc' },
    { column: 'st_ot_name', dir: 'asc' },
    { column: 'rd_nz_code', dir: 'asc' },
    { column: 'st_nz_name', dir: 'asc' },
    { column: 'date_begin', dir: 'asc' }
  ] as Sorter[]
})

const onRowClick = () => {
  if (props.is_main_grid) {
    emit('main-grid-click')
  }
}

const rowFormatter = (row: RowComponent) => {
  const data = row.getData()

  if (new Date(data.date_end) < new Date()) {
    row.getElement().style.color = '#aaaaaa'
  }
}

const filters_st_ot_esr = ref<string>()
const filters_st_ot_name = ref<string>()
const filters_st_nz_esr = ref<string>()
const filters_st_nz_name = ref<string>()

const manualFilters = computed(() => {
  const filters = [] as Filter[]

  if (filters_st_ot_esr.value) {
    filters.push({ field: 'st_ot_esr', type: 'like', value: filters_st_ot_esr.value })
  }

  if (filters_st_ot_name.value) {
    filters.push({ field: 'st_ot_name', type: 'like', value: filters_st_ot_name.value })
  }

  if (filters_st_nz_esr.value) {
    filters.push({ field: 'st_nz_esr', type: 'like', value: filters_st_nz_esr.value })
  }

  if (filters_st_nz_name.value) {
    filters.push({ field: 'st_nz_name', type: 'like', value: filters_st_nz_name.value })
  }

  return filters
})

const cellTooltip = (row: PfmRow): string => {
  const lines: string[] = []

  lines.push(`${row.st_ot_name} -> ${row.st_nz_name}`)

  let temp = row.type_ot_name
  if (Number(row.type_ot) < 6 && row.type_nz_name) {
    temp += ` ${row.type_nz_name.toLowerCase()}`
  }
  lines.push(temp)

  lines.push(`${row.gr_state_mnemo} ${row.ways_private_mnemo}`)

  if (row.gr_state === '1') {
    if (row.rod_gr_name) lines.push(row.rod_gr_name)
    if (row.group_gr_name) lines.push(row.group_gr_name)
    if (row.gr_vname) lines.push(row.gr_vname)
  } else {
    lines.push(row.rod_vag_fname)
  }

  if (row.rps_owner_name) lines.push(`Влад. подв. сост: ${row.rps_owner_name}`)

  if (row.otpr_name) lines.push(`Отправитель: ${row.otpr_name}`)

  return lines.join('<br/>')
}

const countHeader = (imgSrc: string) => {
  const img = document.createElement('img')
  img.src = imgSrc
  return img
}

const columns: ColumnDefinition[] = [
  {
    title: '',
    field: 'marsh_type',
    width: 22,
    minWidth: 0,
    tooltip: (e, cell) => {
      const data = cell.getData() as PfmRow
      return date_end_tooltip(data)
    },
    formatter: (cell) => {
      const data = cell.getData() as PfmRow
      const img = document.createElement('img')
      img.src = marsh_type_formatter(data)
      return img
    }
  },
  {
    title: 'Дата нач.',
    field: 'date_begin',
    width: 70,
    sorter: 'date',
    tooltip: (e, cell) => {
      const data = cell.getData() as PfmRow
      return date_end_tooltip(data)
    },
    formatter: (cell) => parseDateDDMMYYYY(cell.getValue())
  },
  {
    title: '',
    field: 'history_count',
    width: 26,
    minWidth: 0,
    formatter: (cell) => {
      if (!props.is_main_grid) return ''

      const data = cell.getRow().getData() as PfmRow
      if (Number(data.history_count) < 1) return ''

      const btn = document.createElement('button')
      btn.className = 'img-btn'
      btn.title = 'История изменений'
      btn.onclick = () => emit('history-click', data)

      const img = document.createElement('img')
      img.src = images.history
      btn.appendChild(img)

      return btn
    }
  },
  {
    title: '',
    field: 'moving_count',
    width: 40,
    hozAlign: 'center',
    headerTooltip: 'Маршруты в движении',
    titleFormatter: () => countHeader(images.arrow_right_blue),
    formatter: (cell) => {
      const v = cell.getValue()
      if (!v) return ''

      const btn = document.createElement('button')
      btn.textContent = v
      btn.className = 'bg-[#b2cbff] border border-gray-400 w-full h-full'

      return btn
    },
    cssClass: 'no-padding-cell'
  },
  {
    title: '',
    field: 'completed_count',
    width: 40,
    hozAlign: 'center',
    headerTooltip: 'Выполненные',
    titleFormatter: () => countHeader(images.check),
    formatter: (cell) => {
      const v = cell.getValue()
      if (!v) return ''

      const btn = document.createElement('button')
      btn.textContent = v
      btn.className = 'bg-[#97ffad] border border-gray-400 w-full h-full'
      return btn
    },
    cssClass: 'no-padding-cell'
  },
  {
    title: '',
    field: 'leaved_count',
    width: 40,
    hozAlign: 'center',
    headerTooltip: 'Отставленные от движения',
    titleFormatter: () => countHeader(images.attention),
    formatter: (cell) => {
      const v = cell.getValue()
      if (!v) return ''

      const btn = document.createElement('button')
      btn.textContent = v
      btn.className = 'bg-[#ff9797] border border-gray-400 w-full h-full'

      return btn
    },
    cssClass: 'no-padding-cell'
  },
  {
    title: 'Форм.',
    columns: [
      { title: 'Дор', field: 'rd_ot_name', width: 45 },
      { title: 'ЕСР', field: 'st_ot_esr', width: 50 },
      {
        title: 'Станция',
        field: 'st_ot_name',
        width: 130,
        tooltip: (e, cell) => cellTooltip(cell.getRow().getData() as PfmRow)
      }
    ]
  },
  {
    title: 'Назн.',
    columns: [
      { title: 'Дор', field: 'rd_nz_name', width: 45 },
      { title: 'ЕСР', field: 'st_nz_esr', width: 50 },
      {
        title: 'Станция',
        field: 'st_nz_name',
        width: 130
      }
    ]
  },
  {
    title: '',
    field: 'status',
    width: 60,
    formatter: (cell) => {
      const el = document.createElement('div')
      const row = cell.getRow().getData() as PfmRow

      const app = mountVueInCell(
        StatusCellWrapper,
        {
          row,
          selected_ids: computed(() => selected_rows.value.map((r) => r.marsh_id))
        },
        el
      )

      cell
        .getRow()
        .getElement()
        ?.addEventListener('rowDeleted', () => {
          app.unmount()
        })

      return el
    }
  },
  {
    title: 'Тип по отправлению',
    field: 'type_ot_name',
    width: 110,
    tooltip: true
  },
  {
    title: 'Тип по прибытию',
    field: 'type_nz_name',
    width: 110,
    tooltip: true
  },
  {
    title: 'Гр/Пор',
    field: 'gr_state_mnemo',
    width: 50
  },
  {
    title: 'РПС',
    field: 'rod_vag_name',
    width: 80,
    tooltip: true
  },
  {
    title: 'Род груза',
    field: 'rod_gr_name',
    width: 130,
    tooltip: true
  },
  {
    title: 'Накоп ление',
    field: 'ways_private_mnemo',
    width: 50
  },
  {
    title: 'Дальн.',
    field: 'marsh_way_len',
    width: 60
  },
  {
    title: 'Вес',
    field: 'weight_base',
    width: 60
  },
  {
    title: 'Длина',
    field: 'len_calc',
    width: 60,
    formatter: (cell) => lenFunc(cell.getRow().getData() as PfmRow)
  },
  {
    title: 'Примечание',
    field: 'comments',
    width: 200,
    formatter: (cell) => {
      const div = document.createElement('div')
      div.textContent = cell.getValue()
      div.style.color = 'blue'
      return div
    }
  },
  // Костыль - надо чтобы по этим полям тоже была сортировка
  { title: '', field: 'rd_ot_code', width: 8, minWidth: 0, formatter: () => '' },
  { title: '', field: 'rd_nz_code', width: 8, minWidth: 0, formatter: () => '' }
]

const clear = () => {
  selected_rows.value = []
}

defineExpose({
  clear,
  grid
})
</script>
