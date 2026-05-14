<template>
  <div>
    <div class="font-semibold text-[#0000BB] text-[11px] whitespace-nowrap" style="overflow: hidden">
      Станции назначения вагонов маршрута в расформировании
    </div>
    <div class="flex">
      <div class="flex gap-1" style="width: 160px">
        <RadioButton size="small" v-model="variant" value="Диапазоны" />
        <label style="font-size: 14px; position: relative; top: -2px">Диапазоны</label>
      </div>
      <div class="flex gap-1">
        <RadioButton size="small" v-model="variant" value="Станции" />
        <label style="font-size: 14px; position: relative; top: -2px">Станции</label>
      </div>
    </div>

    <div class="flex gap-2">
      <div>
        <div class="flex gap-1">
          <Textarea
            v-model="diapasones"
            :invalid="!is_valid"
            :disabled="variant == 'Станции'"
            :class="{ 'border !border-red-600': !is_valid }"
            placeholder="ЕСР1 - ЕСР2"
            class="!h-[200px] !w-[140px] border !border-gray-400 !rounded-[4px] !p-1 !text-[14px]"
          />
          <div class="flex flex-col gap-1" v-if="variant == 'Диапазоны'">
            <img
              v-tooltip.bottom="'Показать в виде списка станций'"
              :src="images.view"
              @click="showStations"
              class="img-btn"
            />
            <img
              v-tooltip.bottom="'Добавить из списка станций'"
              :src="images.table_selection_row"
              @click="openSelectMenu"
              class="img-btn"
            />
          </div>
        </div>
      </div>
      <MultiSelector
        :locked="variant == 'Диапазоны'"
        :rows="stations"
        :columns="columns"
        select
        reorder
        v-model="model"
      >
        <template v-slot:addition_btn>
          <img
            v-tooltip="'Ввод диапазонов ЕСР'"
            :src="images.text"
            @click="dialog = true"
            class="img-btn"
          />
        </template>
      </MultiSelector>
    </div>

    <EsrInput v-if="dialog" @success="fillStations" @cancel="dialog = false" />
    <Dialog
      v-model:visible="dispasones_dialog"
      modal
      header="Станции выбранных диапазонов"
      style="width: 600px"
    >
      <StationsMultiSelector label="" v-model="st_from_diapasones" locked />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Dialog, RadioButton, Textarea } from 'primevue'
import { computed, ref } from 'vue'

import { query } from '@/app/plugins/ky'
import { emitter } from '@/app/plugins/mitt'
import { useStationStore } from '@/app/plugins/pinia/station'
import MultiSelector from '@/components/selector/basic/MultiSelector.vue'
import StationsMultiSelector from '@/components/selector/station/StationsMultiSelector.vue'
import EsrInput from '@/core/filter/EsrInput.vue'
import { isDiapasonesValid } from '@/shared/esr'
import images from '@/shared/images/imported_images'
import { createUserAction } from '@/shared/promises'
import { Station } from '@/types/station'

const variant = defineModel<'Диапазоны' | 'Станции'>('variant', { default: 'Станции' })

const dialog = ref(false)

const stations = useStationStore().get()

const openSelectMenu = () => {
  if (!is_valid.value && diapasones.value != '') {
    emitter.emit('toast', { detail: 'Неверно заполнены диапазоны' })
    return
  }

  const userAction = createUserAction()
  emitter.emit('new-filter', {
    title: 'Станции',
    rows: stations,
    columns: columns,
    promise: userAction,
    single: false
  })

  userAction.wait().then((data: Station[]) => {
    if (!diapasones.value) diapasones.value = ''

    const temp = diapasones.value.split('\n')

    data.forEach((item) => {
      temp.push(`${item.esr} - ${item.esr}`)
    })

    diapasones.value = temp.join('\n')
  })
}

const fillStations = (stations: Station[]) => {
  if (!model.value) model.value = []

  model.value = model.value.concat(stations)
  dialog.value = false
}

const dispasones_dialog = ref(false)
const st_from_diapasones = ref<Station[]>([])
const showStations = async () => {
  if (!diapasones.value || !is_valid.value) {
    emitter.emit('toast', { detail: 'Неверно заполнены диапазоны' })
    return
  }

  const params = {
    selection: {
      type: 'diapasonSelection',
      diapasons: diapasones.value.split('\n').map((item) => {
        return {
          first: item.split('-')[0],
          second: item.split('-')[1]
        }
      })
    }
  }

  const data = await query(`${window.location.origin}/PFP/json-adapter/moving-wizard/fillDiapasonSelection/`, params, {
    parse: 'json'
  })

  const temp = data.smallItemsList.map((item) => {
    return useStationStore().getBy('stan_id', item.id)[0]
  })

  st_from_diapasones.value = temp
  dispasones_dialog.value = true
}

const model = defineModel<Station[]>()
const diapasones = defineModel<string>('diapasones')

const columns = [
  { title: 'ЕСР', field: 'esr' },
  { title: 'Наименование', field: 'vname' },
  { title: 'Дорога', field: 'road_name' }
]

const is_valid = computed(() => {
  if (!diapasones.value) return false

  return isDiapasonesValid(diapasones.value)
})

defineExpose({ is_valid })
</script>
