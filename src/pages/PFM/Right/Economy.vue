<template>
  <div class="flex !text-[11px]">
    <div class="w-1/2">
      <p class="text-center mb-3">Затраты при следовании маршрутом</p>
      <div class="flex">
        <div class="w-1/3 flex flex-col gap-2">
          <div class="h-4"></div>
          <p>На участках</p>
          <p>На станциях</p>
          <p>Итого по уч. и ст.</p>
        </div>
        <div class="w-1/3 flex flex-col gap-2">
          <p>руб./ваг.</p>
          <div>{{ total_e_uch.toFixed(2) }}</div>
          <div>{{ total_e_st.toFixed(2) }}</div>
          <div class="font-semibold">{{ (total_e_uch + total_e_st).toFixed(2) }}</div>
        </div>
        <div class="w-1/3 flex flex-col gap-2">
          <p>руб./сост.</p>
          <div>{{ (total_e_uch * total_t_uch).toFixed(2) }}</div>
          <div>{{ (total_e_st * total_t_uch).toFixed(2) }}</div>
          <div class="font-semibold">
            {{ (total_e_uch * total_t_uch + total_e_st * total_t_uch).toFixed(2) }}
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2">
      <p class="text-center mb-3">Затраты при следовании по плану формирования</p>
      <div class="flex">
        <div class="w-1/3 flex flex-col gap-2">
          <p>руб./ваг.</p>
          <div>{{ total_e_uch_pf.toFixed(2) }}</div>
          <div>{{ total_e_st_pf.toFixed(2) }}</div>
          <div class="font-semibold">{{ (total_e_uch_pf + total_e_st_pf).toFixed(2) }}</div>
        </div>
        <div class="w-1/3 flex flex-col gap-2">
          <p>руб./сост.</p>
          <div>{{ (total_e_uch_pf * total_t_uch).toFixed(2) }}</div>
          <div>{{ (total_e_st_pf * total_t_uch).toFixed(2) }}</div>
          <div class="font-semibold">
            {{ (total_e_uch_pf * total_t_uch + total_e_st_pf * total_t_uch).toFixed(2) }}
          </div>
        </div>
        <div class="w-1/3 flex flex-col gap-2">
          <p>разница</p>
          <div>{{ (total_e_uch_pf * total_t_uch - total_e_uch * total_t_uch).toFixed(2) }}</div>
          <div>{{ (total_e_st_pf * total_t_uch - total_e_st * total_t_uch).toFixed(2) }}</div>
          <div class="font-semibold">
            {{
              (
                total_e_uch_pf * total_t_uch -
                total_e_uch * total_t_uch +
                total_e_st_pf * total_t_uch -
                total_e_st * total_t_uch
              ).toFixed(2)
            }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import { WayFull, WayPfFull } from '../const/types'

const props = defineProps<{
  ways_full: WayFull[]
  ways_pf_full: WayPfFull[]
  var_num: number
}>()

let total_e_uch = 0
let total_e_st = 0
let total_t_uch = 0
let total_e_uch_pf = 0
let total_e_st_pf = 0

watch(
  props,
  () => {
    calcMarshExp(props.var_num)
    calcPFExp()
  },
  { deep: true }
)

const calcMarshExp = (var_num = 1) => {
  let euch = 0
  let est = 0
  let tuch = 0
  total_e_uch = 0
  total_e_st = 0
  total_t_uch = 0
  for (let i = 0; i < props.ways_full.length; i++) {
    let item = props.ways_full[i]
    if (item.var_num == var_num) {
      euch = euch + Number(item.euch)
      est = est + Number(item.est)
      tuch = tuch + Number(item.tuch)
    }
  }
  total_e_uch = euch
  total_e_st = est
  total_t_uch = Math.floor(tuch)
}

const calcPFExp = () => {
  let euch = 0
  let est = 0
  total_e_uch_pf = 0
  total_e_st_pf = 0
  for (let i = 0; i < props.ways_pf_full.length; i++) {
    let item = props.ways_pf_full[i]

    euch = euch + Number(item.euch)
    est = est + Number(item.est)
  }
  total_e_uch_pf = euch
  total_e_st_pf = est
}
</script>

<style scoped>
p {
  font-weight: 600;
  color: blue;
}
</style>
