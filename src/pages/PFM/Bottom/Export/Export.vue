<template>
  <div class="flex gap-1 ml-1">
    <div class="flex">
      <Button
        size="small"
        outlined
        severity="contrast"
        class="h-[22px] !bg-gray-100 hover:!bg-white"
        style="
          border-top-right-radius: 0px !important;
          border-bottom-right-radius: 0px !important;
          border-right: none !important;
        "
      >
        <img :src="images.page_excel" />
        <div class="text-[10px] whitespace-nowrap">Ведомость маршрутов</div>
      </Button>
      <img
        @click="toggle"
        :src="images.menu_down_custom"
        class="export-marsh-btn drowdown-img-custom"
      />
    </div>
    <Button2
      v-tooltip.top="'Ведомость отправительских маршрутов формируемых на путях общего пользования'"
      label="Ведомость ОТПР с ПОП"
      img="page_excel"
      :disabled="!youCanExport"
    />
    <Button2 label="Телеграмма" img="page_word" :disabled="!props.row" />

    <Popover ref="op">
      <MarshVed :filters="props.filters" />
    </Popover>
    <Dialog v-model:visible="telegram_dialog" modal header="Телеграмма" style="width: 1000px">
      <div v-html="telegram"></div>
      <template #footer>
        <Button2 label="Скачать" img="disk_blue" />
      </template>
    </Dialog>
    <Dialog
      modal
      v-model:visible="preview_visible"
      header="Предпросмотр"
      style="width: 1200px; height: 100vh"
    >
      <VueFilesPreview :file="file_to_preview" />
      <template #footer>
        <Button2 label="Скачать" img="disk_blue" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { Button, Dialog, Popover } from 'primevue'
import { computed, ref, useTemplateRef } from 'vue'
import { VueFilesPreview } from 'vue-files-preview'

import { useUserStore } from '@/app/plugins/pinia/user'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'
import { FiltersInQuery } from '@/types/filters/filters'

import { PfmRow } from '../../const/types'

const props = defineProps<{
  filters?: FiltersInQuery
  row?: PfmRow
}>()


const op = useTemplateRef('op')
const toggle = (event) => op.value.toggle(event)

const youCanExport = computed(() => {
  if (!props.row) return false

  const edit_level = useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
  if (edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT' || edit_level == 'RD_OUT_EDIT')
    return true

  return false
})

const preview_visible = ref(false)
const file_to_preview = ref<File>()
const file_blob = ref<Blob>()

const telegram = ref('')
const telegram_dialog = ref(false)
</script>

<style>
.export-marsh-btn {
  rotate: 180deg;
  border: solid 1px #334155;
  border-radius: 4px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 0px;
}
</style>
