<template>
  <div>
    <div class="flex">
      <div :style="{ width: `${left_offset}px` }"></div>
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
    <div class="flex">
      <div :style="{ width: `${left_offset}px` }"></div>
      <div :style="{ width: `${len_sum_width}px` }"></div>
      <div :style="{ width: `${tuch_sum_width + tst_sum_width}px` }" class="box2 brn btn">
        {{ (tuch_sum + tst_sum).toFixed(2) }}
      </div>
      <div :style="{ width: `${euch_sum_width + est_sum_width}px` }" class="box2 btn">
        {{ (euch_sum + est_sum).toFixed(2) }}
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
    isFull?: boolean
  }>(),
  {
    rows: () => [],
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
</script>

<style scoped>
.box {
  border: solid blue 1px;
  padding: 1px;
  text-align: center;
  color: blue;
  font-size: 10px;
}
.box2 {
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
