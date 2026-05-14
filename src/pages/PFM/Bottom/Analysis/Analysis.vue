<template>
  <div class="flex gap-1 ml-1">
    <Button2 label="Маршруты в движении" img="arrow_right_blue" />
    <SplitButton
      :model="analysis_items"
      size="small"
      outlined
      severity="contrast"
      class="h-[22px] !bg-gray-100 hover:!bg-white"
    >
      <img :src="images.check" />
      <div class="text-[10px] whitespace-nowrap">Анализ выполнения</div>
      <template #dropdownicon>
        <img :src="images.menu_down_custom" class="drowdown-img-custom" />
      </template>
    </SplitButton>
    <Button2 label="Анализ нарушений" img="attention" />
    <Button2 label="Прием, сдача, транзит" img="processes" />
  </div>
</template>

<script setup lang="ts">
import { SplitButton } from 'primevue'

import { newWindow } from '@/app/windows'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'
import { FiltersInQuery } from '@/types/filters/filters'

const props = defineProps<{
  filters?: FiltersInQuery
}>()

const analysis_items = [
  {
    label: 'За период',
  },
  {
    label: 'В сравнении с предыдущим',
  }
]
</script>
