<template>
  <div class="w-full flex">
    <DataTable
      v-model:selection="selected_item"
      selectionMode="single"
      class="w-full !min-h-20 border border-gray-400 rounded-sm"
      showGridlines
      :value="model"
      editMode="cell"
      scrollable
      scrollHeight="120px"
      :row-style="highlightRow"
      :pt="{
        column: {
          bodycell: ({ state }) => ({
            class: [{ '!p-[2px]': state['d_editing'] }]
          })
        }
      }"
      size="small"
    >
      <Column field="len" header="Физ. длина">
        <template #editor="{ index }">
          <InputText
            v-if="!props.disabled"
            v-model="model[index]['len']"
            class="w-full !h-5"
            size="small"
          />
          <div v-else class="w-full !h-5">{{ model[index]['len'] }}</div>
        </template>
      </Column>
      <Column field="usl_len" header="Усл. длина">
        <template #editor="{ index }">
          <InputText
            v-if="!props.disabled"
            v-model="model[index]['usl_len']"
            class="w-full !h-5"
            size="small"
          />
          <div v-else class="w-full !h-5">{{ model[index]['usl_len'] }}</div>
        </template>
      </Column>
    </DataTable>
    <div v-if="!props.disabled" class="flex flex-col gap-0.5 ml-0.5">
      <img :src="images.add" @click="addRow" class="img-btn" />
      <img :src="images.delete_16" @click="deleteRow" class="img-btn" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash'
import { Column, DataTable, InputText } from 'primevue'
import { ref } from 'vue'

import { Lengths } from '@/pages/PFM/const/types'
import images from '@/shared/images/imported_images'

const highlightRow = (data) => {
  let highlight = false
  props.rows_to_highlight.forEach((item) => {
    if (isEqual(data, item)) highlight = true
  })
  if (highlight) {
    return { 'background-color': '#F1FF7A' }
  }
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    rows_to_highlight?: object[]
  }>(),
  {
    disabled: false,
    rows_to_highlight: () => []
  }
)

const selected_item = ref<Lengths>()

const addRow = () => {
  let new_num = 0
  if (model.value.length != 0) {
    new_num = Number(model.value[model.value.length - 1].num) + 1
  }
  model.value.push({ marsh_id: '', num: String(new_num), len: '0', usl_len: '0' })
}
const deleteRow = () => {
  if (!selected_item.value) return

  model.value = model.value.filter((item) => item.num != selected_item.value.num)
}

const model = defineModel<Lengths[]>({ default: [] })
</script>
