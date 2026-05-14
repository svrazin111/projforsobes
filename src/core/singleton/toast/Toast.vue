<template>
  <Toast>
    <template #message="{ message }">
      <div class="w-full">
        <div class="mb-2">{{ message.detail }}</div>
        <Button2 @click="openError(message.error)" v-if="message.error" label="Подробнее" />
      </div>
    </template>
  </Toast>
  <Dialog v-model:visible="is_dialog" modal header="Подробнее" style="width: 800px">
    <textarea class="w-full h-full min-h-[400px]" v-model="error_text" readonly></textarea>
    <template #footer>
      <Button2 @click="is_dialog = false" label="Готово" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Dialog, Toast, useToast } from 'primevue'
import { onMounted, ref } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import Button2 from '@/shared/ui/button/Button2.vue'

const toast = useToast()
const is_dialog = ref(false)
const error_text = ref('')

export type ToastEventType = {
  severity?: 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'
  detail: string
  life?: number
  error?: string
}

onMounted(() => {
  emitter.on(
    'toast',
    ({ severity = 'error', detail, life = 10000, error = '' }: ToastEventType) => {
      const params = {
        severity: severity,
        detail: detail,
        life: life,
        error: error
      }
      toast.add(params)
    }
  )
})

const openError = (error: string) => {
  is_dialog.value = true
  error_text.value = error
}
</script>
