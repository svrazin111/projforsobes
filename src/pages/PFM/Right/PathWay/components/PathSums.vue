<template>
  <div class="path-sums-viewport" :style="{ width: sums_viewport_width }">
    <div class="path-sums-content" :style="{ transform: `translateX(-${props.scrollLeft}px)` }">
      <div class="flex" :style="{ width: `${total_width}px` }">
        <div :style="{ width: `${left_offset}px` }" class="path-sums-spacer"></div>
        <div :style="{ width: `${len_sum_width}px` }" class="box brn">{{ len_sum.toFixed(0) }}</div>
        <div :style="{ width: `${tuch_sum_width}px` }" class="box brn">{{ tuch_sum.toFixed(2) }}</div>
        <div :style="{ width: `${tst_sum_width}px` }" class="box brn">{{ tst_sum.toFixed(2) }}</div>
        <div :style="{ width: `${euch_sum_width}px` }" class="box brn">{{ euch_sum.toFixed(2) }}</div>
        <div :style="{ width: `${est_sum_width}px` }" class="box">{{ est_sum.toFixed(2) }}</div>
        <div
          :style="{ width: `${ves_max_min_width}px` }"
          v-if="props.isFull"
          class="box border !border-l-0"
        >
          {{ ves_max_min.toFixed(0) }}
        </div>
      </div>
      <div class="flex" :style="{ width: `${total_width}px` }">
        <div :style="{ width: `${left_offset}px` }" class="path-sums-spacer"></div>
        <div :style="{ width: `${len_sum_width}px` }" class="path-sums-spacer"></div>
        <div :style="{ width: `${tuch_sum_width + tst_sum_width}px` }" class="box2 brn btn">
          {{ (tuch_sum + tst_sum).toFixed(2) }}
        </div>
        <div :style="{ width: `${euch_sum_width + est_sum_width}px` }" class="box2 btn">
          {{ (euch_sum + est_sum).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

import { WayFull, WayPfFull } from '@/pages/PFM/const/types'

const props = withDefaults(
  defineProps<{
    rows?: WayFull[] | WayPfFull[]
    real_widths: number[]
    scrollLeft?: number
    viewportWidth?: number
    isFull?: boolean
  }>(),
  {
    rows: () => [],
    scrollLeft: 0,
    viewportWidth: 0,
    isFull: false
  }
)

onMounted(() => {
  setTimeout(() => {
    updateWidths()
  }, 1000)
})

const len_sum = computed(() => {
  return props.rows.reduce((total, item) => total + Number(item.len), 0)
})
const tuch_sum = computed(() => {
  return props.rows.reduce((total, item) => total + Number(item.tuch), 0)
})
const tst_sum = computed(() => {
  return props.rows.reduce((total, item) => total + Number(item.tst), 0)
})
const euch_sum = computed(() => {
  return props.rows.reduce((total, item) => total + Number(item.euch), 0)
})
const est_sum = computed(() => {
  return props.rows.reduce((total, item) => total + Number(item.est), 0)
})
const ves_max_min = computed(() => {
  return Math.min(
    ...props.rows.filter((item) => Number(item.ves_max) > 0).map((item) => item.ves_max)
  )
})

const left_offset = ref(0)
const len_sum_width = ref(0)
const tuch_sum_width = ref(0)
const tst_sum_width = ref(0)
const euch_sum_width = ref(0)
const est_sum_width = ref(0)
const ves_max_min_width = ref(0)

const total_width = computed(() => {
  return (
    left_offset.value +
    len_sum_width.value +
    tuch_sum_width.value +
    tst_sum_width.value +
    euch_sum_width.value +
    est_sum_width.value +
    ves_max_min_width.value
  )
})

const sums_viewport_width = computed(() => {
  return props.viewportWidth > 0 ? `${props.viewportWidth}px` : '100%'
})

const updateWidths = () => {
  if (!props.real_widths || !props.real_widths.length) return

  left_offset.value = props.real_widths.slice(0, 6).reduce((acc, curr) => acc + curr, 0)

  len_sum_width.value = props.real_widths[6]
  tuch_sum_width.value = props.real_widths[7]
  tst_sum_width.value = props.real_widths[8]
  euch_sum_width.value = props.real_widths[9]
  est_sum_width.value = props.real_widths[10]

  ves_max_min_width.value = props.real_widths[11] ?? 0
}

watch(
  () => props.real_widths,
  () => {
    updateWidths()
  },
  { deep: true, immediate: true }
)
</script>

<style scoped>
.path-sums-viewport {
  overflow: hidden;
  width: 100%;
}

.path-sums-content {
  width: max-content;
}

.path-sums-spacer,
.box {
  box-sizing: border-box;
  flex: 0 0 auto;
}

.box {
  border: solid blue 1px;
  padding: 1px;
  text-align: center;
  color: blue;
  font-size: 10px;
}
.box2 {
  box-sizing: border-box;
  flex: 0 0 auto;
  border: solid blue 1px;
  padding: 1px;
  text-align: center;
  color: blue;
  font-size: 10px;
}
.brn {
  border-right: none;
}
.btn {
  border-top: none;
}
</style>
