<template>
  <div class="flex flex-col gap-2 p-1 pt-0">
    <div class="flex gap-2">
      <div class="font-semibold whitespace-nowrap text-[11px] mt-[2px]">
        Срок действия документа
      </div>
      <DatePicker v-model="doc_date" size="small" showIcon update-model-type="date" />
      <Select
        v-model="type"
        :options="doc_types"
        option-label="name"
        size="small"
        fluid
        class="h-[22px]"
      >
        <template #value="{ value }">
          <div style="margin-left: 8px; margin-top: 0">{{ value.name }}</div>
        </template>
      </Select>
    </div>

    <FileUpload @select="onFileSelect">
      <template #header="{ chooseCallback, clearCallback, files }">
        <div class="w-full flex gap-2">
          <Button2
            v-if="!file"
            @click="chooseCallback()"
            v-tooltip.bottom="'Добавить'"
            img="add"
            icon
          />
          <div v-if="file" class="w-full font-semibold border rounded-md pl-2 pt-0.5">
            {{ file.name }}
          </div>
          <Button2
            v-if="file"
            @click="removeItem(clearCallback)"
            v-tooltip.bottom="'Удалить'"
            img="delete_16"
            icon
          />
        </div>
      </template>
      <template #content>
        <div></div>
      </template>
      <template #empty>
        <div class="flex items-center flex-col">
          <Button icon="pi pi-cloud-upload" rounded size="large" outlined severity="contrast" />
          <div class="mt-4 text-[14px]">Загрузить файл</div>
        </div>
      </template>
    </FileUpload>

    <div class="flex justify-end gap-2">
      <Button2 @click="commit" label="Готово" img="check2" :disabled="!file || !doc_date" />
      <Button2 @click="cancel" label="Отмена" img="delete2" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, DatePicker, FileUpload, FileUploadSelectEvent, Select } from 'primevue'
import { ref } from 'vue'

import Button2 from '@/shared/ui/button/Button2.vue'

import { doc_types } from './const'

const emit = defineEmits(['success', 'cancel'])

const file = ref()
const doc_date = ref<Date>(new Date())
const type = ref({ code: 2, name: 'Телеграмма' })

const onFileSelect = (event: FileUploadSelectEvent) => {
  if (!event.files.length) return

  file.value = event.files[event.files.length - 1]
}

const removeItem = (clearCallback: () => void) => {
  clearCallback()
  file.value = undefined
}

const commit = () => {
  emit('success', file.value, type.value, doc_date.value)
}
const cancel = () => {
  emit('cancel')
}
</script>
