<template>
  <div class="w-full flex">
    <DataTable
      v-model:selection="selected"
      selectionMode="single"
      class="w-full !min-h-20 border border-gray-400 rounded-sm"
      style="width: 280px !important"
      showGridlines
      :value="model"
      editMode="cell"
      scrollable
      scrollHeight="120px"
      :pt="{
        column: {
          bodycell: ({ state }) => ({
            class: [{ '!p-0': state['d_editing'] }]
          })
        }
      }"
      size="small"
    >
      <Column field="weight" style="padding: 0px !important">
        <template #header>
          <b style="width: 80px" class="p-0.5">Вес</b>
        </template>
        <template #body="{ data }">
          <div
            style="
              width: 80px !important;
              height: 20px !important;
              padding-left: 4px;
              padding-top: 4px;
            "
          >
            {{ data.weight }}
          </div>
        </template>
        <template #editor="{ index }">
          <input
            style="width: 80px !important; height: 20px !important; padding-left: 4px"
            type="text"
            v-model="model[index].weight"
          />
        </template>
      </Column>
      <Column field="var_name" style="padding: 0px !important">
        <template #header>
          <b style="width: 180px" class="p-0.5">Вариант пути следования</b>
        </template>
        <template #body="{ index }">
          <div
            style="
              width: 180px !important;
              height: 20px !important;
              padding-left: 4px;
              padding-top: 4px;
            "
          >
            {{ model[index].var_name }}
          </div>
        </template>
        <template #editor="{ index }">
          <select
            style="width: 180px !important; height: 20px !important"
            v-model="model[index]['var_name']"
          >
            <option
              v-for="item in props.way_vars?.map((item) => item['var_name'])"
              :key="item"
              :value="item"
            >
              {{ item }}
            </option>
          </select>
        </template>
      </Column>
    </DataTable>
    <div class="flex flex-col gap-0.5 ml-0.5">
      <img :src="images.add" @click="addRow" class="img-btn" />
      <img :src="images.delete_16" @click="deleteRow" class="img-btn" />
      <img :src="images.clean" @click="clearRows" class="img-btn" />
    </div>
  </div>
</template>

<!-- ! Чет ужасно получилось, потом переделать бы -->

<script setup lang="ts">
import { Column, DataTable } from 'primevue'
import { nextTick, ref, watch } from 'vue'

import { WayVars } from '@/pages/PFM/const/types'
import images from '@/shared/images/imported_images'

const props = defineProps<{
  way_vars: WayVars[]
}>()

const selected = ref<{ num: number; weight: number; var_name: string }>()
const last_selected = ref<{ num: number; weight: number; var_name: string }>()

const addRow = () => {
  if (!model.value) {
    model.value = [
      {
        num: 0,
        weight: 0,
        var_name: ''
      }
    ]
  }
  if (!model.value.length) {
    model.value.push({
      num: 0,
      weight: 0,
      var_name: ''
    })
  } else {
    let num = 0
    model.value.forEach((item) => {
      if (Number(item.num) > num) num = Number(item.num)
    })
    model.value.push({
      num: num + 1,
      weight: 0,
      var_name: ''
    })
  }
  selected.value = model.value[model.value.length - 1]
  last_selected.value = selected.value
}

const deleteRow = () => {
  if (!selected.value) return

  let index = -1
  model.value.forEach((item, id) => {
    if (item.num == selected.value.num) index = id
  })
  if (index <= -1) return

  model.value.splice(index, 1)
  nextTick(() => {
    selected.value = model.value[model.value.length - 1]
    last_selected.value = selected.value
  })
}

const clearRows = () => {
  model.value = []
}

const model = defineModel<any[]>({ default: [] })

watch(
  model,
  () => {
    model.value.forEach((item) => {
      if (!item.var_num || item.var_num == '') {
        item.var_num = 1
        item.var_name = 'Основной'
      } else {
        const temp = props.way_vars.filter((item2) => item2.var_name == item.var_name)[0]
        if (!temp) return
        item.var_num = temp.var_num
      }
    })
  },
  { deep: true }
)
</script>
