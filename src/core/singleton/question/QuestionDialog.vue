<template>
  <Dialog
    v-model:visible="state.visible"
    :header="state.title"
    modal
    :closable="false"
    :style="{ width: '600px' }"
    @hide="handleNo"
  >
    <div class="p-2 space-y-3">
      <div v-if="state.html" v-html="state.message"></div>
      <div v-else>{{ state.message }}</div>

      <Textarea v-model="state.input" class="w-full h-30" autofocus />
    </div>

    <template #footer>
      <Button :label="state.yesLabel" @click="handleYes" outlined class="h-7" />
      <Button :label="state.noLabel" @click="handleNo" outlined severity="danger" class="h-7" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { Textarea } from 'primevue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import { nextTick } from 'vue'

import { state } from './question'

function handleYes() {
  state.visible = false
  nextTick(() => state.onYes(state.input))
}

function handleNo() {
  state.visible = false
  nextTick(() => state.onNo())
}
</script>
