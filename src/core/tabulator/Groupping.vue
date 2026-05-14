<template>
  <div>
    <Button2
      @click="apply"
      label="Применить"
      img="refresh"
      :need_update="JSON.stringify(temp_model) != JSON.stringify(model)"
      class="mb-1"
    />

    <div v-if="props.form" class="flex gap-0.5 w-[238px] mb-1">
      <select v-model="current_sample" class="w-full border border-gray-400 rounded-sm">
        <option value="" disabled selected>Вариант настройки отчета</option>
        <option v-for="item in saved_samples" :key="item" :value="item">{{ item.name }}</option>
      </select>
      <img
        v-tooltip="'Сохранить фильтры в шаблон'"
        :src="images.disk_blue"
        @click="dialog = true"
        class="img-btn"
      />
      <img
        v-tooltip="'Удалить текущий шаблон'"
        :src="images.delete_16"
        @click="removeSample"
        class="img-btn"
      />
    </div>
    <div class="flex gap-0.5 w-[240px]">
      <DataTable
        :value="selected_options"
        class="w-full border border-gray-400 rounded-sm blue-rows-primevue"
        style="min-height: 80px; max-height: 500px"
        showGridlines
        selectionMode="multiple"
        v-model:selection="selected_items"
        @rowReorder="onRowReorder"
        size="small"
      >
        <Column rowReorder />
        <Column field="label" />
      </DataTable>

      <div class="flex flex-col gap-0.5 w-[24px]">
        <img
          v-tooltip.bottom="'Добавить группировки'"
          :src="images.table_selection_row"
          @click="openSelectMenu"
          :class="['img-btn', { 'img-btn-disabled': props.options.length === temp_model.length }]"
        />
        <img
          v-tooltip.bottom="'Убрать выбранные'"
          :src="images.delete_16"
          @click="deleteRows"
          :class="['img-btn', { 'img-btn-disabled': !selected_items.length }]"
        />
        <img v-tooltip.bottom="'Очистить'" :src="images.clean" @click="clear" class="img-btn" />
      </div>
    </div>
    <Dialog
      v-model:visible="dialog"
      modal
      header="Сохранить вариант настройки отчета"
      style="width: 500px"
    >
      <InputText v-model="new_sample_name" class="w-full" size="small" />
      <template #footer>
        <Button2 @click="saveSample" label="Сохранить" img="check2" :disabled="!new_sample_name" />
        <Button2 @click="dialog = false" label="Отмена" img="delete2" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Column, DataTable, Dialog, InputText } from 'primevue'
import { nextTick, onMounted, ref, watch } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import images from '@/shared/images/imported_images'
import { createUserAction } from '@/shared/promises'
import Button2 from '@/shared/ui/button/Button2.vue'

import { form_settings } from './saved_groupping_settings'

interface Option {
  id: number
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    input?: string[]
    options: Option[]
    form?: 'TrainBugsList' | 'PriemSdachaList' | 'TrainFulfilList' | 'TrainVagList' | null
  }>(),
  {
    input: () => [],
    form: null
  }
)

export type Params = {
  TrainBugsList: {
    name: string
    groups: string[]
  }[]
  PriemSdachaList: {
    name: string
    groups: string[]
  }[]
  TrainFulfilList: {
    name: string
    groups: string[]
  }[]
  TrainVagList: {
    name: string
    groups: string[]
  }[]
}

interface Sample {
  name: string
  groups: string[]
}

const dialog = ref(false)
const saved_samples = ref<Sample[]>([])
const current_sample = ref<Sample>()
const new_sample_name = ref('')

watch(
  current_sample,
  () => {
    selected_options.value = current_sample.value?.groups
      .map((val) => props.options.find((item) => item.value === val))
      .filter(Boolean) as Option[]
  },
  { deep: true }
)

const saveSample = () => {}
const removeSample = () => {}

const model = defineModel<string[]>({ default: [] })

const selected_options = ref<Option[]>([])
const selected_items = ref<Option[]>([])
const temp_model = ref<string[]>([])

onMounted(() => {
  if (!props.input?.length) return

  selected_options.value = props.input
    .map((val) => props.options.find((item) => item.value === val))
    .filter(Boolean) as Option[]

  nextTick(() => apply())

  if (props.form == 'PriemSdachaList') saved_samples.value = form_settings.PriemSdachaList
  else if (props.form == 'TrainBugsList') saved_samples.value = form_settings.TrainBugsList
  else if (props.form == 'TrainFulfilList') saved_samples.value = form_settings.TrainFulfilList
  else if (props.form == 'TrainVagList') saved_samples.value = form_settings.TrainVagList

  // getAppParams()
})

// const getAppParams = async () => {
//   const params = {
//     PARAM_NAME: '',
//     APP_NAME: 'PFM2',
//     USER_ID: 0,
//     USER_IP: 0
//   }
//   const data = await xmlQuery('APP_PARAMS_Defs', 'Get_APP_PARAMS', params, {
//     parse: 'xml',
//     silent: true
//   })
//   console.log(
//     data.VFPDataSet.PARAMS.map((item) => {
//       return {
//         name: item.name,
//         value: item.value
//       }
//     })
//   )
// }

watch(
  () => selected_options.value,
  () => {
    temp_model.value = selected_options.value.map((item) => item.value)
  },
  { deep: true }
)

const onRowReorder = (event: any) => (selected_options.value = event.value)

const openSelectMenu = () => {
  if (props.options.length === temp_model.value.length) return

  const userAction = createUserAction()

  emitter.emit('new-filter', {
    title: 'Доступные группировки',
    rows: props.options.filter((item) => !temp_model.value.includes(item.value)),
    columns: [{ field: 'label' }],
    promise: userAction,
    single: false
  })

  userAction.wait().then((newItems: Option[]) => {
    selected_options.value.push(...newItems)
  })
}

const deleteRows = () => {
  const deleteRow = (item: Option) => {
    const index = selected_options.value.findIndex((i) => i.id === item.id)
    if (index >= 0) selected_options.value.splice(index, 1)
  }

  selected_items.value.forEach(deleteRow)
  selected_items.value = []
}

const clear = () => {
  selected_options.value = []
  selected_items.value = []
}

const apply = () => {
  model.value = [...temp_model.value]
}

defineExpose({ apply })
</script>
