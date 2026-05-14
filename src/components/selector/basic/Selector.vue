<template>
  <div class="flex w-full">
    <FloatLabel class="w-full" variant="on">
      <Select
        @dblclick="openSelectMenu"
        v-model="model"
        :disabled="props.disabled"
        filter
        :options="props.rows"
        :optionLabel="props.title_field"
        :virtualScrollerOptions="{ itemSize: 38 }"
        :invalid="props.required && (!model || !model[props.title_field])"
        :placeholder="props.placeholder"
        class="w-full h-10"
        size="small"
        :class="{ '!h-6': props.small, 'w-full': true }"
        :pt="{
          label: {
            class: [{ '!p-0 !pl-2': props.small, 'mt-2.5 ml-2': !props.small }]
          }
        }"
      >
        <template #dropdownicon>
          <div v-if="props.required">
            <img v-if="!model || !model[props.title_field]" :src="images.flag_red" />
            <img v-else :src="images.flag_green" />
          </div>
          <img v-else :src="images.menu_down_custom" />
        </template>
      </Select>
      <label class="!text-[#0000BB]" style="font-size: 12px">{{ props.label }}</label>
    </FloatLabel>

    <div class="flex flex-col" v-if="!props.small && !props.disabled">
      <img :src="images.table_selection_row" @click="openSelectMenu" class="img-btn" />
      <img :src="images.clean" @click="clear()" class="img-btn" />
    </div>
    <img
      v-if="props.small && !props.disabled"
      :src="images.table_selection_row"
      @click="openSelectMenu"
      class="img-btn !h-6 !w-6"
    />
    <img
      v-if="props.small && !props.disabled"
      :src="images.clean"
      @click="clear()"
      class="img-btn !h-6 !w-6"
    />
  </div>
</template>

<script setup lang="ts">
import { FloatLabel, Select } from 'primevue'

import { emitter } from '@/app/plugins/mitt'
import images from '@/shared/images/imported_images'
import { createUserAction } from '@/shared/promises'

const props = withDefaults(
  defineProps<{
    label: string
    rows: Array<any> | undefined
    columns: Array<object>
    required?: boolean
    small?: boolean
    title_field: string
    placeholder?: string
    disabled?: boolean
  }>(),
  {
    required: false,
    small: false,
    placeholder: '',
    disabled: false
  }
)

const openSelectMenu = () => {
  const userAction = createUserAction()
  emitter.emit('new-filter', {
    title: props.label,
    rows: props.rows,
    columns: props.columns,
    promise: userAction,
    single: true
  })

  userAction.wait().then((data) => {
    model.value = data[0]
  })
}
const clear = () => {
  model.value = undefined
}

const model = defineModel()
</script>
