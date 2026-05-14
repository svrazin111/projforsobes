<template>
  <div>
    <div
      v-if="!props.single"
      style="
        position: relative;
        left: calc(100% - 32px);
        height: 0px;
        width: 0px;
        top: 3px;
        z-index: 2;
      "
    >
      <Button
        v-if="all_opened"
        @click="closeAll"
        v-tooltip.bottom="'Скрыть все фильтры'"
        size="small"
        severity="secondary"
        style="
          width: 24px;
          height: 24px !important;
          padding: 0px !important;
          border: solid 1px lightslategray;
        "
      >
        <img :src="images.arrow_up_blue" />
      </Button>
      <Button
        v-if="!all_opened"
        @click="openAll"
        v-tooltip.bottom="'Показать все фильтры'"
        size="small"
        severity="secondary"
        style="
          width: 24px;
          height: 24px !important;
          padding: 0px !important;
          border: solid 1px lightslategray;
        "
      >
        <img :src="images.arrow_down_blue" />
      </Button>
    </div>
    <Accordion v-model:value="accordion" :multiple="!props.single">
      <AccordionPanel
        v-for="(filter, index) in props.filters"
        :value="Number(index)"
        :key="filter.title"
      >
        <AccordionHeader
          v-bind:style="{
            'background-image': `url(${images.old_accordion_bar_style})`,
            'background-size': 'contain'
          }"
        >
          <div class="flex">
            <div v-if="filter.slot == 'road'" class="flex">
              <div>
                <div
                  v-if="!props.hide_count"
                  :class="{
                    gray: calc([filter.value[0]], filter.max[0]) == 0,
                    green: calc([filter.value[0]], filter.max[0]) > 0
                  }"
                >
                  {{ calc([filter.value[0]], filter.max[0]) }}
                </div>
              </div>
              <div>
                <div
                  v-if="!props.hide_count"
                  :class="{
                    gray: calc([filter.value[1]], filter.max[1]) == 0,
                    green: calc([filter.value[1]], filter.max[1]) > 0
                  }"
                >
                  {{ calc([filter.value[1]], filter.max[1]) }}
                </div>
              </div>
            </div>
            <div v-if="filter.slot == 'station'" class="flex">
              <div>
                <div
                  v-if="!props.hide_count"
                  :class="{
                    gray: calc([filter.value[0]], filter.max[0].max) == 0,
                    green: calc([filter.value[0]], filter.max[0].max) > 0
                  }"
                >
                  {{ calc([filter.value[0]], filter.max[0].max) }}
                </div>
              </div>
              <div>
                <div
                  v-if="!props.hide_count"
                  :class="{
                    gray: calc([filter.value[1]], filter.max[1].max) == 0,
                    green: calc([filter.value[1]], filter.max[1].max) > 0
                  }"
                >
                  {{ calc([filter.value[1]], filter.max[1].max) }}
                </div>
              </div>
            </div>
            <div v-if="filter.slot != 'road' && filter.slot != 'station'">
              <div
                v-if="!props.hide_count"
                :class="{
                  gray: calc(filter.value, filter.max) == 0,
                  green: calc(filter.value, filter.max) > 0
                }"
              >
                {{ calc(filter.value, filter.max) }}
              </div>
            </div>
            <div v-if="props.show_dots" class="mr-1 w-[14px] h-[14px]">
              <img v-if="props.single && accordion == index" :src="images.ball_green" />
              <img v-else :src="images.ball_red" />
            </div>
            <div
              class="whitespace-nowrap text-[10px] flex items-center"
              :style="`color: ${props.title_color}`"
            >
              {{ filter.title }}
            </div>
          </div>
        </AccordionHeader>
        <AccordionContent>
          <slot :name="filter.slot"></slot>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { isArray } from 'lodash'
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel, Button } from 'primevue'
import { computed, nextTick, onMounted, Ref, ref } from 'vue'

import images from '@/shared/images/imported_images'

export interface Filter {
  title: string
  slot: string
  value: Ref[]
  max: number[] | undefined
}

const props = withDefaults(
  defineProps<{
    filters: Filter[]
    show_dots?: boolean
    hide_count?: boolean
    single?: boolean
    open_first?: boolean
    open_all?: boolean
    title_color?: string
  }>(),
  {
    show_dots: false,
    hide_count: false,
    single: false,
    open_first: false,
    open_all: true,
    title_color: 'black'
  }
)

const accordion = ref<number | number[] | undefined>(props.single ? undefined : [])
const all_opened = computed(() => {
  if (!accordion.value || !isArray(accordion.value)) return

  return accordion.value.length / props.filters.length > 0.5
})

onMounted(async () => {
  accordion.value = props.filters.map((item, index) => index)
  accordion.value = props.filters.map((item, index) => index)
  nextTick(() => {
    accordion.value = props.single ? undefined : []
    accordion.value = props.single ? undefined : []
  })

  nextTick(() => {
    if (props.open_first) {
      openFirst()
    }
    if (props.open_all) {
      openAll()
    }
  })
})

const calc = (array: Ref[], max: number) => {
  let count = 0
  if (!array) return count
  array.forEach((item) => {
    if (!item.value) return
    if (isArray(item.value)) count += item.value.length
    else count += 1
  })
  if (max && count == max) return 0
  return count
}

const openAll = () => {
  accordion.value = props.filters.map((item, index) => index)
  accordion.value = props.filters.map((item, index) => index)
}

const closeAll = () => {
  accordion.value = props.single ? undefined : []
  accordion.value = props.single ? undefined : []
}

const openFirst = () => {
  accordion.value = 0
  accordion.value = 0
}

const openFirstIfNoneIsOpen = () => {
  if (!accordion.value || (isArray(accordion.value) && accordion.value.length)) {
    openFirst()
  }
}

defineExpose({ openAll, closeAll, openFirstIfNoneIsOpen })
</script>

<style scoped>
.gray {
  background-color: lightgray;
  height: 16px;
  width: 16px;
  text-align: center;
  border-radius: 4px;
  margin-right: 6px;
}

.green {
  color: black;
  background-color: #92e65a;
  height: 16px;
  min-width: 16px;
  text-align: center;
  border-radius: 4px;
  margin-right: 6px;
}
</style>
