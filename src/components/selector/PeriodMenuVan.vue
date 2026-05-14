<template>
  <div class="flex h-[24px] ml-1">
    <Menubar :model="items" class="!p-0 font-normal">
      <template #itemicon="{ item }">
        <img v-if="item?.icon == 'pi pi-calendar'" :src="images.calendar" />
      </template>
    </Menubar>
    <div class="relative flex gap-2 items-center mx-2">
      с
      <DatePicker
        v-model="period[0]"
        showIcon
        update-model-type="date"
        size="small"
        class="font-normal"
      />
      по
      <DatePicker
        v-model="period[1]"
        showIcon
        update-model-type="date"
        size="small"
        class="font-normal"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { range } from 'lodash'
import { DatePicker, Menubar } from 'primevue'
import { MenuItem } from 'primevue/menuitem'
import { onMounted, ref } from 'vue'

import images from '@/shared/images/imported_images'

onMounted(() => {
  const current_year = new Date().getFullYear()
  const last_ten_years = range(10)
    .map((item) => current_year - item)
    .reverse()

  items.value = [
    {
      label: '',
      icon: 'pi pi-calendar',
      items: last_ten_years.map((year) => {
        return {
          label: String(year),
          command: () => {
            period.value = [new Date(year, 0, 1, 3), new Date(year, 11, 31, 3)]
          },
          items: [
            {
              label: '1-й квартал',
              command: () => {
                period.value = [new Date(year, 0, 1, 3), new Date(year, 2, 31, 3)]
              },
              items: [
                {
                  label: 'Январь',
                  command: () => {
                    period.value = [new Date(year, 0, 1, 3), new Date(year, 0, 31, 3)]
                  }
                },
                {
                  label: 'Февраль',
                  command: () => {
                    period.value = [new Date(year, 1, 1, 3), new Date(year, 1, 31, 3)]
                  }
                },
                {
                  label: 'Март',
                  command: () => {
                    period.value = [new Date(year, 2, 1, 3), new Date(year, 2, 31, 3)]
                  }
                }
              ]
            },
            {
              label: '2-й квартал',
              command: () => {
                period.value = [new Date(year, 3, 1, 3), new Date(year, 5, 31, 3)]
              },
              items: [
                {
                  label: 'Апрель',
                  command: () => {
                    period.value = [new Date(year, 3, 1, 3), new Date(year, 3, 31, 3)]
                  }
                },
                {
                  label: 'Май',
                  command: () => {
                    period.value = [new Date(year, 4, 1, 3), new Date(year, 4, 31, 3)]
                  }
                },
                {
                  label: 'Июнь',
                  command: () => {
                    period.value = [new Date(year, 5, 1, 3), new Date(year, 5, 31, 3)]
                  }
                }
              ]
            },
            {
              label: '3-й квартал',
              command: () => {
                period.value = [new Date(year, 6, 1, 3), new Date(year, 8, 31, 3)]
              },
              items: [
                {
                  label: 'Июль',
                  command: () => {
                    period.value = [new Date(year, 6, 1, 3), new Date(year, 6, 31, 3)]
                  }
                },
                {
                  label: 'Август',
                  command: () => {
                    period.value = [new Date(year, 7, 1, 3), new Date(year, 7, 31, 3)]
                  }
                },
                {
                  label: 'Сентябрь',
                  command: () => {
                    period.value = [new Date(year, 8, 1, 3), new Date(year, 8, 31, 3)]
                  }
                }
              ]
            },
            {
              label: '4-й квартал',
              command: () => {
                period.value = [new Date(year, 9, 1, 3), new Date(year, 11, 31, 3)]
              },
              items: [
                {
                  label: 'Октябрь',
                  command: () => {
                    period.value = [new Date(year, 9, 1, 3), new Date(year, 9, 31, 3)]
                  }
                },
                {
                  label: 'Ноябрь',
                  command: () => {
                    period.value = [new Date(year, 10, 1, 3), new Date(year, 10, 31, 3)]
                  }
                },
                {
                  label: 'Декабрь',
                  command: () => {
                    period.value = [new Date(year, 11, 1, 3), new Date(year, 11, 31, 3)]
                  }
                }
              ]
            }
          ]
        }
      })
    }
  ]
})

const items = ref<MenuItem[]>([])

const period = defineModel<Date[]>({ required: true })
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
