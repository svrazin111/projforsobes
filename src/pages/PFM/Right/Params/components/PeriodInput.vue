<template>
  <div class="flex gap-0.5 relative">
    <DatePicker
      v-model="date_start"
      showIcon
      size="small"
      update-model-type="date"
      :invalid="!date_start"
    />
    <img :src="images.minus" />
    <DatePicker
      v-model="date_end"
      showIcon
      size="small"
      update-model-type="date"
      :default-value="new Date()"
      :invalid="!date_end"
    />
    <div
      v-if="date_end && date_end >= forever()"
      class="w-[60px] h-[18px] bg-white flex-nowrap text-[11px] absolute left-[143px] top-[3px] pointer-events-none"
    >
      до отмены
    </div>
    <Button2 @click="setCurrentDate" v-tooltip.bottom="'Текущая дата'" img="calendar" icon />
    <Button2 @click="setUntilUndo" v-tooltip.bottom="'До отмены'" img="chevron_double_right" icon />
  </div>
</template>

<script setup lang="ts">
import { DatePicker } from 'primevue'

import { forever } from '@/shared/date'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'

const date_start = defineModel<Date>('date_start')
const date_end = defineModel<Date>('date_end')

const setCurrentDate = () => {
  date_end.value = new Date()
}
const setUntilUndo = () => {
  date_end.value = forever()
}
</script>
