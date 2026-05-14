<template>
  <Dialog
    v-model:visible="dialog"
    @hide="emit('cancel')"
    modal
    header="Диапазоны ЕСР"
    style="width: 600px"
  >
    <Textarea
      v-model="diapasones"
      placeholder="ЕСР1 - ЕСР2"
      :invalid="!is_valid"
      class="w-full h-[400px] !text-[14px]"
      :class="{ 'border !border-red-600': !is_valid }"
    />
    <div class="flex gap-1 text-[12px]">
      <input type="checkbox" id="esr_input" v-model="is_strong_check" />
      <label for="esr_input"
        >Использовать только существующие ЕСР в качестве границ диапазонов</label
      >
    </div>
    <template #footer>
      <Button2 @click="commit" label="Заполнить" img="check2" :disabled="!is_valid" />
      <Button2 @click="emit('cancel')" label="Отмена" img="delete2" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, Textarea } from 'primevue'
import { computed, ref } from 'vue'

import { query } from '@/app/plugins/ky'
import { useStationStore } from '@/app/plugins/pinia/station'
import { isDiapasonesValid } from '@/shared/esr'
import Button2 from '@/shared/ui/button/Button2.vue'
import { Region } from '@/types/region'
import { Road } from '@/types/road'

const emit = defineEmits(['success', 'cancel'])

const dialog = ref(true)

const diapasones = ref<string>('')

const is_strong_check = ref(false)
const is_valid = computed(() => isDiapasonesValid(diapasones.value, is_strong_check.value))

const commit = async () => {
  const params = {
    selection: {
      type: 'diapasonSelection',
      diapasons: diapasones.value.split('\n').map((diapason) => {
        return {
          first: diapason.split('-')[0],
          second: diapason.split('-')[1]
        }
      })
    }
  }

  const data = (await query(`${window.location.origin}/PFP/json-adapter/moving-wizard/fillDiapasonSelection/`, params, {
    parse: 'json'
  })) as Response

  emit(
    'success',
    data.smallItemsList.map((item) => {
      return useStationStore().getBy('stan_id', item.id)[0]
    })
  )
}

type Response = {
  itemsList: ItemsList[]
  smallItemsList: SmallItemsList[]
  exclusion: any[]
}

type ItemsList = {
  first: number
  second: number
}

type SmallItemsList = {
  id: number
  code: number
  charCode: string
  name: string
  shortName: string
  sortSystemsCount: number
  tracksCount: number
  road: Road
  region: Region
}
</script>
