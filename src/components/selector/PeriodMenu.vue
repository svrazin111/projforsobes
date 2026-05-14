<template>
  <div class="flex flex-col h-[80px] ml-1">
    <button @click="toggle" class="w-[140px] !border !border-gray-400 rounded-[4px]">
      <div class="flex p-1 gap-1">
        <img :src="images.calendar" height="18" width="18" />
        <div>Выбор периода</div>
      </div>
    </button>
    <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />

    <div class="w-[160px] flex flex-col gap-1 mt-1">
      <div class="flex gap-1">
        <DatePicker v-model="period[0]" showIcon update-model-type="date" size="small" />
        <Button2 @click="clear('period_start')" v-tooltip.bottom="'Очистить'" img="clean" icon />
      </div>
      <div class="flex gap-1">
        <DatePicker v-model="period[1]" showIcon update-model-type="date" size="small" />
        <Button2 @click="clear('period_end')" v-tooltip.bottom="'Очистить'" img="clean" icon />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DatePicker, TieredMenu } from 'primevue'
import { MenuItem } from 'primevue/menuitem'
import { onMounted, ref } from 'vue'

import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'

onMounted(() => {
  const currentYear = new Date().getFullYear()

  const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
  ]

  const makeRange = (year: number, startMonth: number, endMonth: number) => [
    new Date(year, startMonth, 1, 3),
    new Date(year, endMonth + 1, 0, 3)
  ]

  const createMonth = (year: any, month: number) => ({
    label: MONTHS[month],
    command: () => {
      period.value = makeRange(year, month, month)
    }
  })

  const createQuarter = (year: any, label: string, startMonth: number) => ({
    label,
    command: () => {
      period.value = makeRange(year, startMonth, startMonth + 2)
    },
    items: [
      createMonth(year, startMonth),
      createMonth(year, startMonth + 1),
      createMonth(year, startMonth + 2)
    ]
  })

  const createYearItem = (year: any) => ({
    label: String(year),
    command: () => {
      period.value = makeRange(year, 0, 11)
    },
    items: [
      createQuarter(year, '1-й квартал', 0),
      createQuarter(year, '2-й квартал', 3),
      createQuarter(year, '3-й квартал', 6),
      createQuarter(year, '4-й квартал', 9)
    ]
  })

  const lastTenYears = Array.from({ length: 10 }, (_, i) => currentYear - i).reverse()

  items.value = lastTenYears.map(createYearItem)
})

const menu = ref()

const toggle = (event: any) => {
  menu.value.toggle(event)
}

const items = ref<MenuItem[]>([])

const period = defineModel<Date[]>({ required: true })

const clear = (variant: 'period_start' | 'period_end') => {
  switch (variant) {
    case 'period_start':
      period.value[0] = undefined
      break
    case 'period_end':
      period.value[1] = undefined
      break
    default:
      break
  }
}
</script>

<style>
.p-datepicker-day-cell {
  padding: 2px !important;
}

.p-datepicker-input {
  padding: 2px !important;
  width: 100px !important;
}
</style>
