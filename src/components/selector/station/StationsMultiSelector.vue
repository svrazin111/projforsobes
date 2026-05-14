<template>
  <div>
    <div class="flex gap-0.5">
      <div
        @dblclick="showStations"
        v-if="props.diapasones && props.diapasones.length"
        class="p-[2px] mt-[15px] border border-gray-400"
        style="
          min-height: 80px !important;
          max-height: 200px !important;
          min-width: 110px !important;
          max-width: 110px !important;
          width: 110px !important;
          overflow-y: scroll;
        "
      >
        <div v-for="item in props.diapasones" :key="item" class="flex">
          <div>{{ item }}</div>
        </div>
      </div>
      <MultiSelector
        :label="props.label"
        :rows="stations"
        :columns="columns"
        select
        :reorder="!props.locked"
        :locked="props.locked"
        :rows_to_highlight="props.rows_to_highlight"
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
import { Dialog } from 'primevue'
import { ref } from 'vue'

import { query } from '@/app/plugins/ky'
import { emitter } from '@/app/plugins/mitt'
import { useStationStore } from '@/app/plugins/pinia/station'
import EsrInput from '@/core/filter/EsrInput.vue'
import { isDiapasonesValid } from '@/shared/esr'
import images from '@/shared/images/imported_images'
import { Station } from '@/types/station'

import MultiSelector from '../basic/MultiSelector.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    locked?: boolean
    rows_to_highlight?: object[]
    diapasones?: string[]
  }>(),
  {
    label: '',
    locked: false,
    rows_to_highlight: () => [],
    diapasones: () => []
  }
)

const dispasones_dialog = ref(false)
const st_from_diapasones = ref<Station[]>([])
const showStations = async () => {
  if (!props.diapasones || !isDiapasonesValid(props.diapasones.join('\n'))) {
    emitter.emit('toast', { detail: 'Неверно заполнены диапазоны' })
    return
  }

  const params = {
    selection: {
      type: 'diapasonSelection',
      diapasons: props.diapasones.map((item) => {
        return {
          first: item.split('-')[0],
          second: item.split('-')[1]
        }
      })
    }
  }

  const data = await query(
    `${window.location.origin}/PFP/json-adapter/moving-wizard/fillDiapasonSelection/`,
    params,
    {
      parse: 'json'
    }
  )

  const temp = data.smallItemsList.map((item) => {
    return useStationStore().getBy('stan_id', item.id)[0]
  })

  st_from_diapasones.value = temp
  dispasones_dialog.value = true
}

const dialog = ref(false)

const stations = useStationStore().get()

const fillStations = (stations: Station[]) => {
  if (model.value && model.value.length) {
    model.value = model.value.concat(stations)
  } else {
    model.value = stations
  }

  dialog.value = false
}

const model = defineModel<Station[]>()

const columns = [
  { title: 'ЕСР', field: 'esr' },
  { title: 'Наименование', field: 'vname' },
  { title: 'Дорога', field: 'road_name' }
]
</script>
