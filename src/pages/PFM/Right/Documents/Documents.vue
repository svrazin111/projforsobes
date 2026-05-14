<template>
  <div style="width: 600px">
    <DataTable
      :value="docs"
      showGridlines
      stripedRows
      scrollable
      scrollHeight="flex"
      selectionMode="single"
      v-model:selection="selected_document"
      class="border border-gray-400 rounded-sm"
      style="height: 120px"
      :row-style="highlightRow"
      size="small"
    >
      <Column header="№" field="num">
        <template #body="{ data }">
          <div style="width: 20px !important">{{ data.num }}</div>
        </template>
      </Column>
      <Column header="Название файла" field="file_name">
        <template #body="{ data }">
          <div
            style="
              width: 160px !important;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
            v-tooltip="data.file_name"
          >
            {{ data.file_name }}
          </div>
        </template>
      </Column>
      <Column header="Тип документа" field="doc_type_name">
        <template #body="{ data }">
          <div style="width: 60px !important; white-space: nowrap">{{ data.doc_type_name }}</div>
        </template>
      </Column>
      <Column header="Срок действия документа" field="date_end">
        <template #body="{ data }">
          <div style="width: 80px !important; white-space: nowrap">{{ data.date_end }}</div>
        </template>
      </Column>
      <Column header="Размер, Кб" field="file_size">
        <template #body="{ data }">
          <div style="width: 50px !important; white-space: nowrap">
            {{ (Number(data.file_size) / 1024).toFixed(2) }}
          </div>
        </template>
      </Column>
      <Column header="Дата создания" field="file_date">
        <template #body="{ data }">
          <div
            style="
              width: 80px !important;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
            "
            v-tooltip="data.file_date"
          >
            {{ data.file_date }}
          </div>
        </template>
      </Column>
    </DataTable>
    <div class="flex gap-1 mt-1 w-[600px]">
      <div style="height: 100px" class="w-full">
        <Textarea
          v-if="selected_document"
          v-model="selected_document.comment"
          :disabled="!selected_document || !props.is_edit"
          class="h-full w-full"
        />
        <div v-else class="h-full w-full border rounded-md opacity-20 bg-gray-300"></div>
      </div>

      <div class="flex flex-col gap-1">
        <Button2
          @click="dialog = true"
          label="Добавить"
          img="document_add"
          :disabled="!props.is_edit"
        />
        <Button2
          @click="remove"
          label="Удалить"
          img="document_delete"
          :disabled="!selected_document || !props.is_edit"
        />
        <Button2 @click="preview" label="Предпросмотр" img="view" :disabled="!selected_document" />
        <Button2 @click="download" label="Скачать" img="disk_blue" :disabled="!selected_document" />
      </div>
    </div>
    <Dialog v-model:visible="dialog" modal header="Прикрепить документ" style="width: 800px">
      <AddDocument @success="addDocument" @cancel="dialog = false" />
    </Dialog>
    <Dialog
      modal
      v-model:visible="preview_visible"
      header="Предпросмотр"
      style="width: 80%; height: 100vh"
    >
      <VueFilesPreview :file="file_to_preview" />
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { XMLBuilder } from 'fast-xml-parser'
import { fileTypeFromBuffer } from 'file-type'
import { isEqual } from 'lodash'
import Pako from 'pako'
import { Column, DataTable, Dialog, Textarea } from 'primevue'
import { decode } from 'uint8-to-base64'
import { onMounted, ref } from 'vue'
import { VueFilesPreview } from 'vue-files-preview'

import { xmlQuery } from '@/app/plugins/ky'
import { emitter } from '@/app/plugins/mitt'
import { toArray } from '@/shared/array'
import { parseDate } from '@/shared/date'
import { downloadBase64 } from '@/shared/downloadBase64'
import { replaceAllSafe } from '@/shared/string'
import Button2 from '@/shared/ui/button/Button2.vue'

import { Docs, DocsData } from '../../const/types'
import AddDocument from './AddDocument.vue'
import { arrayBufferToBase64 } from './const'

const highlightRow = (data: Docs) => {
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
    is_etran?: boolean
    is_edit: boolean
    marsh_id: string
    rows_to_highlight?: object[]
  }>(),
  {
    is_etran: false,
    rows_to_highlight: () => []
  }
)

const valid_marsh_id = ref<string>('')

onMounted(async () => {
  if (!props.marsh_id) {
    valid_marsh_id.value = await xmlQuery('PFM2_Defs', 'Get_ID', {}, { parse: 'text' })
  } else {
    valid_marsh_id.value = props.marsh_id
  }
})

const dialog = ref(false)
const selected_document = ref<Docs>()

const addDocument = (file: File, type: { code: number; name: string }, doc_date: Date) => {
  const reader = new FileReader()
  reader.readAsArrayBuffer(file)
  reader.onload = async () => {
    if (!reader.result || typeof reader.result == 'string') {
      emitter.emit('toast', { detail: 'Ошибка при чтении файла' })
      return
    }

    const id = await xmlQuery('PFM2_Defs', 'Get_ID', {}, { parse: 'text' })

    docs.value.push({
      marsh_id: valid_marsh_id.value,
      num: 0,
      file_name: file.name,
      comment: '',
      file_size: file.size,
      file_date: parseDate(new Date()),
      data_id: id,
      doc_type: type.code,
      date_end: parseDate(doc_date),
      doc_type_name: type.name,
      saved: 0
    })

    docs_data.value.push({
      data_id: id,
      doc_data: arrayBufferToBase64(reader.result),
      marsh_id: valid_marsh_id.value
    })
  }

  dialog.value = false
}

const remove = () => {
  if (!selected_document.value) return

  const data_id = selected_document.value.data_id

  docs.value = docs.value.filter((item) => item.data_id != data_id)
  docs_data.value = docs_data.value.filter((item) => item.data_id != data_id)
}

const preview_visible = ref(false)
const file_to_preview = ref<File>()
const preview = async () => {
  // ! Сильно дублируется с downloadBase64
  if (!selected_document.value) return

  let def_name = ''
  let query_set = ''

  if (props.is_etran) {
    def_name = 'PFM2_ETRAN_Defs'
    query_set = 'GET_ETRAN_DOC'
  } else {
    def_name = 'PFM2_Defs'
    query_set = 'Get_PFM_DOC'
  }

  const data = await xmlQuery(def_name, query_set, {
    DATA_ID: selected_document.value.data_id
  })

  const temp = toArray(data?.VFPDataSet?.DOCS_DATA ?? [])

  if (temp.length == 0) {
    emitter.emit('toast', { detail: 'Ошибка при получении файла' })
    return
  }

  let encoded = ''

  if (temp.length == 1) {
    encoded = replaceAllSafe(temp[0].doc_data, ' ', '+')
  } else {
    encoded = replaceAllSafe(temp[selected_document.value.num - 1].doc_data, ' ', '+')
  }

  const decoded_compressed = decode(encoded)
  const decoded = Pako.inflate(decoded_compressed)

  const type = await fileTypeFromBuffer(decoded)

  if (!type || type.ext == 'cfb' || selected_document.value.file_name.includes('.doc')) {
    emitter.emit('toast', {
      detail: 'Не удалось загрузить предпросмотр',
      error:
        'Предпросмотр старых форматов документов не поддерживается, воспользуйтесь кнопкой <b>Скачать</b>'
    })
    return
  }

  file_to_preview.value = new File([decoded], selected_document.value.file_name)
  preview_visible.value = true
}

const download = async () => {
  if (!selected_document.value) return

  const params = {
    DATA_ID: selected_document.value.data_id
  }

  let def_name = ''
  let query_set = ''

  if (props.is_etran) {
    def_name = 'PFM2_ETRAN_Defs'
    query_set = 'GET_ETRAN_DOC'
  } else {
    def_name = 'PFM2_Defs'
    query_set = 'Get_PFM_DOC'
  }

  const data = await xmlQuery(def_name, query_set, params)

  const temp = toArray(data?.VFPDataSet?.DOCS_DATA ?? [])

  if (temp.length == 0) {
    emitter.emit('toast', { detail: 'Ошибка при скачивании файла' })
    return
  }
  if (temp.length == 1) {
    downloadBase64(selected_document.value.file_name, temp[0].doc_data)
  } else {
    downloadBase64(
      selected_document.value.file_name,
      temp[selected_document.value.num - 1].doc_data
    )
  }
}

const getAsXml = () => {
  docs.value.forEach((item, index) => {
    item.num = index
  })

  const builder = new XMLBuilder()

  const DOCS = <string[]>[]
  docs.value.forEach((item) => {
    const xml = builder.build(item)

    DOCS.push(`<DOCS>${xml}</DOCS>`)
  })

  const DOCS_DATA = <string[]>[]
  docs_data.value.forEach((item) => {
    item.marsh_id = Number(valid_marsh_id.value)
    const xml = builder.build(item)

    DOCS_DATA.push(`<DOCS_DATA>${xml}</DOCS_DATA>`)
  })

  return `${DOCS.join('')}${DOCS_DATA.join('')}`
}

const docs = defineModel<Docs[]>({ default: [] })
const docs_data = defineModel<DocsData[]>('doc_data', { default: [] })

defineExpose({
  getAsXml
})
</script>
