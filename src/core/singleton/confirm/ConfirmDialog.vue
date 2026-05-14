<template>
  <Dialog
    v-model:visible="state.visible"
    :header="state.title"
    modal
    :closable="false"
    :style="{ width: '600px' }"
    @hide="handleNo"
  >
    <div class="p-2">
      <div v-if="state.html" v-html="state.message"></div>
      <div v-else>{{ state.message }}</div>
    </div>

    <template #footer>
      <Button2 @click="handleYes" :label="state.yesLabel" img="check2" />
      <Button2 @click="handleNo" :label="state.noLabel" img="delete2" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { nextTick } from 'vue'

import Button2 from '@/shared/ui/button/Button2.vue'

import { state } from './confirm'

const handleYes = () => {
  state.visible = false
  nextTick(() => state.onYes())
}

const handleNo = () => {
  state.visible = false
  nextTick(() => state.onNo())
}
</script>
