<template>
  <div>
    <div class="font-semibold mb-0.5 text-[#0000BB]">Вес состава</div>
    <div class="flex">
      <MoreLessSelector v-model="weight_option" />
      <input class="w-full border border-gray-400 rounded-sm mx-1" type="text" v-model="weight" />
      <img :src="images.clean" @click="clear('weight')" class="img-btn" />
    </div>
    <select v-model="and_or" class="mt-2 mb-1 w-15 border border-gray-400 rounded-sm text-center">
      <option value="and" selected>И</option>
      <option value="or">ИЛИ</option>
    </select>
    <div class="flex justify-between mb-[2px]">
      <div class="font-semibold text-[#0000BB]">Длина состава</div>
      <div class="flex gap-1">
        <div class="flex gap-0.5">
          <RadioButton v-model="phis_usl" value="phis" size="small" />
          <div>Физ</div>
        </div>
        <div class="flex gap-0.5">
          <RadioButton v-model="phis_usl" value="usl" size="small" />
          <div>Усл</div>
        </div>
      </div>
    </div>
    <div class="flex">
      <MoreLessSelector v-model="length_option" />
      <input class="w-full border border-gray-400 rounded-sm mx-1" type="text" v-model="length" />
      <img :src="images.clean" @click="clear('length')" class="img-btn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import RadioButton from 'primevue/radiobutton'

import MoreLessSelector from '@/components/selector/moreless/MoreLessSelector.vue'
import images from '@/shared/images/imported_images'
import { MoreLess } from '@/types/filters/moreless'

export type LengthTypes = 'phis' | 'usl'
export type CombineOptions = 'and' | 'or'

const weight = defineModel<string>('weight')
const weight_option = defineModel<MoreLess>('weight_option', { default: '<' })
const length = defineModel<string>('length')
const length_option = defineModel<MoreLess>('length_option', { default: '<' })
const phis_usl = defineModel<LengthTypes>('length_type', { default: 'phis' })
const and_or = defineModel<CombineOptions>('combine_option', { default: 'and' })

const clear = (variant: 'length' | 'weight') => {
  if (variant == 'weight') {
    weight.value = ''
  } else if (variant == 'length') {
    length.value = ''
  }
}
</script>
