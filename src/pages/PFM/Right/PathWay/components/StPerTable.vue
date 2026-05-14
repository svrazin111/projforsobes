<template>
  <div class="h-full pb-4">
    <div class="text-[#0000BB] whitespace-nowrap font-semibold text-[11px]">
      Станция переработки/стыки
    </div>
    <GridAdvanced :rows="props.rows" :cols="columns" style="width: 600px" />
  </div>
</template>

<script setup lang="ts">
import { ColumnDefinition } from 'tabulator-tables'

import { cellBlue, cellBold } from '@/composables/gridCells'
import GridAdvanced from '@/core/tabulator/GridAdvanced.vue'

import { PfSt } from '../../../const/types'

const props = defineProps<{
  rows: PfSt[]
}>()

const columns: ColumnDefinition[] = [
  {
    title: '№',
    field: 'num',
    width: 25,
    minWidth: 25,
    headerSort: false
  },
  {
    title: 'Дор',
    field: 'road_name',
    width: 45,
    formatter: cellBlue,
    headerSort: false
  },
  { title: 'ЕСР', field: 'st_esr', width: 45, formatter: cellBlue, headerSort: false },
  {
    title: 'Ст. перераб.',
    field: 'st_name',
    width: 150,
    formatter: cellBold,
    headerSort: false
  },
  {
    title: 'Ст. ПФ',
    field: 'flag_pf_name',
    width: 50,
    headerSort: false
  },
  {
    title: 'Стык',
    field: 'stk_type_name',
    width: 80,
    headerSort: false
  },
  {
    title: 'Признак перераб.',
    field: 'type_name',
    width: 160,
    headerSort: false,
    tooltip: (e, cell) => {
      const el = document.createElement('div')
      el.innerText = cell.getData().type_name
      return el
    }
  }
]
</script>
