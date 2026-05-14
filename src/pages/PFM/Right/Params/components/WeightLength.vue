<template>
  <div>
    <div>
      <div class="font-semibold text-[#0000BB] text-[12px]">Вес состава, тонн</div>
      <div class="border border-gray-400 bg-gray-50 rounded-sm p-2 flex gap-2">
        <div class="flex flex-col gap-2">
          <div class="flex">
            <div class="w-24 text-[10px]">Основной</div>
            <input
              type="text"
              class="input"
              v-model="weight_base_model"
              :disabled="props.locked"
              @keyup="onRowEdited"
            />
          </div>
          <div class="flex" style="color: blue">
            <div class="w-24 text-[10px]">Расчетный</div>
            <input type="text" class="input" v-model="weight_calc_model" :disabled="props.locked" />
          </div>
          <div class="flex" style="color: blue">
            <div class="w-24 text-[10px]">Ядро</div>
            <input type="text" class="input" v-model="weight_core" :disabled="props.locked" />
          </div>
        </div>
        <div class="w-full">
          <div class="flex gap-2">
            <div class="flex">
              <div class="text-[10px]">Мин</div>
              <input type="text" class="input" v-model="weight_1_model" :disabled="props.locked" />
            </div>
            <div class="flex">
              <div class="text-[10px]">Макс</div>
              <input type="text" class="input" v-model="weight_2_model" :disabled="props.locked" />
            </div>
          </div>
          <Table
            v-if="props.locked"
            :rows="weights_model"
            :cols="weights_cols"
            class="w-full !h-20 mt-2"
          />
          <Weight v-else v-model="weights_model" :way_vars="props.way_vars" class="mt-2" />
        </div>
      </div>
    </div>
    <div>
      <div class="flex justify-between p-1">
        <div class="font-semibold text-[#0000BB] text-[10px] relative top-2">Длина состава</div>
        <select v-model="wl_limit_model" class="w-15 border border-gray-400 rounded-sm text-center">
          <option value="and" selected>И</option>
          <option value="or">ИЛИ</option>
        </select>
      </div>
      <div class="border border-gray-400 bg-gray-50 rounded-sm p-2 flex gap-2">
        <div class="flex flex-col gap-2">
          <div class="flex">
            <div class="w-40 text-[10px]">Физическая основная</div>
            <input
              type="text"
              class="input"
              v-model="len_model"
              :disabled="props.locked"
              @keyup="onRowEdited"
            />
          </div>
          <div class="flex">
            <div class="w-40 text-[10px]">Условная основная</div>
            <input
              type="text"
              class="input"
              v-model="usl_len_base_model"
              :disabled="props.locked"
              @keyup="onRowEdited"
            />
          </div>
          <div class="flex" style="color: blue">
            <div class="w-40 text-[10px]">Расчетная</div>
            <input type="text" class="input" v-model="len_calc_model" :disabled="props.locked" />
          </div>
        </div>
        <div class="w-full">
          <div class="flex gap-2 mb-2">
            <div class="flex justify-between">
              <div class="text-[10px]">Мин</div>
              <input type="text" class="input" v-model="len_1_model" :disabled="props.locked" />
            </div>
            <div class="flex justify-between">
              <div class="text-[10px]">Макс</div>
              <input type="text" class="input" v-model="len_2_model" :disabled="props.locked" />
            </div>
          </div>
          <div class="flex gap-2">
            <div class="flex justify-between">
              <div class="text-[10px]">Мин</div>
              <input type="text" class="input" v-model="usl_len_1_model" :disabled="props.locked" />
            </div>
            <div class="flex justify-between">
              <div class="text-[10px]">Макс</div>
              <input type="text" class="input" v-model="usl_len_2_model" :disabled="props.locked" />
            </div>
          </div>
          <Table
            v-if="props.locked"
            :rows="props.lengths"
            :cols="lengths_cols"
            class="w-full !h-20 mt-2"
          />
          <Length v-else v-model="lengths_model" class="mt-2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash'
import { onMounted, ref, watch } from 'vue'

import Table from '@/core/primetable/Table.vue'
import { getRowData } from '@/pages/PFM/const/functions'
import { Lengths, PfmRow, WayVars, Weights } from '@/pages/PFM/const/types'
import { CombineOptions } from '@/pages/PFM/Filters/components/WeightLengthFilter.vue'

import { calcWeightLength } from '../../queries/weightLength'
import Length from './WeightLength/Length.vue'
import Weight from './WeightLength/Weight.vue'

const props = withDefaults(
  defineProps<{
    st_ot_id?: string
    gr_state?: string
    rod_vag?: string
    rod_gr?: string
    group_gr?: string
    cod_gr?: string

    old_row?: PfmRow
    marsh_id?: string | number
    weight_base?: string
    weight_1?: string
    weight_2?: string
    weight_calc?: string
    len?: string
    len_1?: string
    len_2?: string
    usl_len_base?: string
    usl_len_1?: string
    usl_len_2?: string
    len_calc?: string
    weights?: Weights[]
    lengths?: Lengths[]
    wl_limit?: CombineOptions
    way_vars?: WayVars[]
    locked?: boolean
  }>(),
  {
    marsh_id: 0,
    weights: () => [],
    lengths: () => [],
    locked: false
  }
)

const var_names = {
  1: 'Основной',
  2: 'Дополнительный 1',
  3: 'Дополнительный 2',
  4: 'Дополнительный 3',
  5: 'Дополнительный 4',
  6: 'Дополнительный 5',
  7: 'Дополнительный 6',
  8: 'Дополнительный 7',
  9: 'Дополнительный 8'
}

onMounted(() => {
  setTimeout(() => {
    weights_model.value = weights_model.value.map((item) => {
      item.var_name = var_names[Number(item.var_num)]
      return item
    })
  }, 1000)
})

watch(
  [
    () => props.marsh_id,
    () => props.weight_base,
    () => props.weight_1,
    () => props.weight_2,
    () => props.weight_calc,
    () => props.len,
    () => props.len_1,
    () => props.len_2,
    () => props.usl_len_base,
    () => props.usl_len_1,
    () => props.usl_len_2,
    () => props.len_calc,
    () => props.weights,
    () => props.lengths,
    () => props.wl_limit
  ],
  () => {
    calcCoreWeight()

    if (props.weight_base) weight_base_model.value = props.weight_base
    else weight_base_model.value = ''

    if (props.weight_1) weight_1_model.value = props.weight_1
    else weight_1_model.value = ''

    if (props.weight_2) weight_2_model.value = props.weight_2
    else weight_2_model.value = ''

    if (props.weight_calc) weight_calc_model.value = props.weight_calc
    else weight_calc_model.value = ''

    if (props.len) len_model.value = props.len
    else len_model.value = ''

    if (props.len_1) len_1_model.value = props.len_1
    else len_1_model.value = ''

    if (props.len_2) len_2_model.value = props.len_2
    else len_2_model.value = ''

    if (props.usl_len_base) usl_len_base_model.value = props.usl_len_base
    else usl_len_base_model.value = ''

    if (props.usl_len_1) usl_len_1_model.value = props.usl_len_1
    else usl_len_1_model.value = ''

    if (props.usl_len_2) usl_len_2_model.value = props.usl_len_2
    else usl_len_2_model.value = ''

    if (props.len_calc) len_calc_model.value = props.len_calc
    else len_calc_model.value = ''

    if (props.weights && props.weights.length) {
      weights_model.value = props.weights.map((item) => {
        item.var_name = var_names[Number(item.var_num)]
        return item
      })
    } else weights_model.value = []

    if (props.lengths && props.lengths.length) lengths_model.value = props.lengths
    else lengths_model.value = []

    if (props.wl_limit) wl_limit_model.value = props.wl_limit
    else wl_limit_model.value = 'or'
  },
  { deep: true }
)

const weight_base_model = defineModel<string>('weight_base_model', { default: '' })
const weight_1_model = defineModel<string>('weight_1_model', { default: '' })
const weight_2_model = defineModel<string>('weight_2_model', { default: '' })
const weight_calc_model = defineModel<string>('weight_calc_model', { default: '' })
const len_model = defineModel<string>('len_model', { default: '' })
const len_1_model = defineModel<string>('len_1_model', { default: '' })
const len_2_model = defineModel<string>('len_2_model', { default: '' })
const usl_len_base_model = defineModel<string>('usl_len_base_model', { default: '' })
const usl_len_1_model = defineModel<string>('usl_len_1_model', { default: '' })
const usl_len_2_model = defineModel<string>('usl_len_2_model', { default: '' })
const len_calc_model = defineModel<string>('len_calc_model', { default: '' })
const weights_model = defineModel<Weights[]>('weights_model', { default: [] })
const lengths_model = defineModel<Lengths[]>('lengths_model', { default: [] })
const wl_limit_model = defineModel<CombineOptions>('wl_limit_model', { default: 'or' })

watch(
  [
    () => props.gr_state,
    () => props.rod_vag,
    () => props.rod_gr,
    () => props.group_gr,
    () => props.cod_gr
  ],
  () => {
    handleInput()
  },
  { deep: true }
)

const onRowEdited = () => {
  handleInput()
}

const handleInput = debounce(async () => {
  const calc = await calcWeightLength(
    {
      st_ot_id: props.st_ot_id,
      gr_state: props.gr_state,
      rod_vag: props.rod_vag,
      rod_gr: props.rod_gr,
      group_gr: props.group_gr,
      cod_gr: props.cod_gr
    },
    weight_base_model.value,
    len_model.value,
    usl_len_base_model.value,
    '---'
  )

  len_calc_model.value = calc.len
  weight_calc_model.value = calc.weight
}, 1000)

const calcCoreWeight = async () => {
  if (props.marsh_id) {
    const data = await getRowData(props.marsh_id)

    let min_weight = 99999
    data.pfm_st.forEach((item) => {
      if (item.new_weight && Number(item.new_weight) < min_weight)
        min_weight = Number(item.new_weight)
    })

    if (min_weight != 99999) {
      weight_core.value = String(min_weight)
    } else {
      weight_core.value = ''
    }
  }
}

const weight_core = ref('')

const weights_cols = [
  { title: 'Вес', field: 'weight' },
  { title: 'Вариант пути следования', field: 'var_name' }
]
const lengths_cols = [
  { title: 'Физ. длина', field: 'len' },
  { title: 'Усл. длина', field: 'usl_len' }
]
</script>

<style scoped>
.input {
  border: solid 1px gray;
  text-align: center;
  width: 60px;
  height: 16px;
  margin-left: 8px;
  background-color: white;
}
</style>
