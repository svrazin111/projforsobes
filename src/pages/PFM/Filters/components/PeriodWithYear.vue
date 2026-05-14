<template>
  <div class="w-full">
    <div class="flex gap-0.5">
      <select class="border border-gray-300 rounded-sm text-center h-[22px]" v-model="year">
        <option :value="undefined" disabled selected>Выбор года</option>
        <option v-for="year in years" :key="year.label" :value="year">{{ year.label }}</option>
      </select>

      <Button2 @click="clearYear" v-tooltip.bottom="'Очистить все'" img="clean" icon />
      <Button2
        v-if="useUserStore().isCD"
        @click="changeLastYear"
        v-tooltip.bottom="'Изменить границы года'"
        img="cogs"
        icon
      />
    </div>
    <div class="font-semibold mt-1 text-[11px]">Дата начала</div>

    <div class="flex gap-0.5">
      <select class="border border-gray-300 text-center h-[22px] text-[10px]" v-model="param_start">
        <option value="&gt;">После</option>
        <option value="&lt;">До</option>
        <option value="=">Равно</option>
        <option value="!=">Не равно</option>
      </select>
      <DatePicker v-model="date_start" update-model-type="date" size="small" />
      <Button2
        @click="setCurrentDate('date_start')"
        v-tooltip.bottom="'Текущая дата'"
        img="calendar"
        icon
      />
      <Button2
        @click="setUntilUndo('date_start')"
        v-tooltip.bottom="'До отмены'"
        img="navigate_right2"
        icon
      />
      <Button2 @click="clear('date_start')" v-tooltip.bottom="'Очистить'" img="clean" icon />
    </div>

    <div class="font-semibold mt-1 text-[11px]">Дата окончания</div>

    <div class="flex gap-0.5">
      <select class="border border-gray-300 text-center h-[22px] text-[10px]" v-model="param_end">
        <option value="&gt;">После</option>
        <option value="&lt;">До</option>
        <option value="=">Равно</option>
        <option value="!=">Не равно</option>
      </select>
      <DatePicker v-model="date_end" update-model-type="date" size="small" />
      <Button2
        @click="setCurrentDate('date_end')"
        v-tooltip.bottom="'Текущая дата'"
        img="calendar"
        icon
      />
      <Button2
        @click="setUntilUndo('date_end')"
        v-tooltip.bottom="'До отмены'"
        img="navigate_right2"
        icon
      />
      <Button2 @click="clear('date_end')" v-tooltip.bottom="'Очистить'" img="clean" icon />
    </div>
    <Dialog
      v-model:visible="edit_last_year_dialog"
      modal
      header="Редактор границ года"
      style="width: 400px"
    >
      <div class="flex flex-col gap-1">
        <select class="border border-gray-300 rounded-sm text-center h-[26px]" v-model="last_year">
          <option :value="undefined" disabled selected>Выбор года</option>
          <option v-for="year in years" :key="year.label" :value="year">{{ year.label }}</option>
        </select>
        <div class="flex gap-4">
          <div>
            <div class="font-semibold text-[#0000BB] text-[12px]">Дата начала до</div>
            <DatePicker
              v-model="last_year_start_date"
              showIcon
              update-model-type="date"
              size="small"
            />
          </div>
          <div>
            <div class="font-semibold text-[#0000BB] text-[12px]">Дата окончания после</div>
            <DatePicker
              v-model="last_year_end_date"
              showIcon
              update-model-type="date"
              size="small"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <Button2
          @click="commitYearChange()"
          label="Готово"
          img="check2"
          :disabled="!last_year || !last_year_start_date || !last_year_end_date"
        />
        <Button2 @click="cancelYearChange()" label="Отмена" img="delete2" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { DatePicker, Dialog } from 'primevue'
import { onMounted, ref, watch } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import { useUserStore } from '@/app/plugins/pinia/user'
import { toArray } from '@/shared/array'
import { forever, parseDateTime } from '@/shared/date'
import Button2 from '@/shared/ui/button/Button2.vue'
import { MoreLess } from '@/types/filters/moreless'

const param_start = defineModel<MoreLess>('param_start')
const param_end = defineModel<MoreLess>('param_end')
const date_start = defineModel<Date | undefined>('date_start')
const date_end = defineModel<Date | undefined>('date_end')

const year = ref<Year | undefined>(undefined)
const years = ref<Year[]>([])

type Year = {
  label: string
  date_begin_before: string
  date_end_after: string
}

const emit = defineEmits(['year-selected'])

watch(
  () => year,
  () => {
    if (!year.value) return

    param_start.value = '<'
    param_end.value = '>'
    date_start.value = new Date(year.value.date_begin_before)
    date_end.value = new Date(year.value.date_end_after)

    emit('year-selected', [
      new Date(year.value.date_end_after),
      new Date(year.value.date_begin_before)
    ])
  },
  { deep: true }
)

onMounted(async () => {
  await downloadData()
})

const downloadData = async () => {
  const { VFPDataSet } = await xmlQuery('PFM2_Defs', 'Get_PLAN_YEARS')
  years.value = toArray(VFPDataSet.YEAR)
}

const setCurrentDate = (variant: 'date_start' | 'date_end') => {
  if (variant == 'date_start') {
    date_start.value = new Date()
  }
  if (variant == 'date_end') {
    date_end.value = new Date()
  }
}

const setUntilUndo = (variant: 'date_start' | 'date_end') => {
  if (variant == 'date_start') {
    date_start.value = forever()
  }
  if (variant == 'date_end') {
    date_end.value = forever()
  }
}

const clear = (variant: 'date_start' | 'date_end') => {
  if (variant == 'date_start') {
    date_start.value = undefined
  }
  if (variant == 'date_end') {
    date_end.value = undefined
  }
}

const clearYear = () => {
  year.value = undefined
  date_start.value = undefined
  date_end.value = undefined
}

const edit_last_year_dialog = ref(false)
const last_year = ref<Year>()
const last_year_start_date = ref<Date>()
const last_year_end_date = ref<Date>()
watch(
  () => last_year,
  () => {
    if (!last_year.value) return

    last_year_start_date.value = new Date(last_year.value.date_begin_before)
    last_year_end_date.value = new Date(last_year.value.date_end_after)
  },
  { deep: true }
)
const changeLastYear = () => {
  last_year.value = years.value[years.value.length - 1]
  edit_last_year_dialog.value = true
}
const commitYearChange = async () => {
  if (!last_year.value || !last_year_start_date.value || !last_year_end_date.value) return

  const cData = `
    <YEAR>
      <label>${last_year.value?.label}</label>
      <date_begin_before>${parseDateTime(last_year_start_date.value)}</date_begin_before>
      <date_end_after>${parseDateTime(last_year_end_date.value)}</date_end_after>
    </YEAR>`
  await xmlQuery('PFM2_Defs', 'UPDATE_PLAN_YEAR', {}, { parse: 'text' }, 'PFM_XML_TABLE', cData)
  await downloadData()
  cancelYearChange()
}
const cancelYearChange = () => {
  edit_last_year_dialog.value = false
  last_year.value = undefined
  last_year_start_date.value = undefined
  last_year_end_date.value = undefined
}
</script>
