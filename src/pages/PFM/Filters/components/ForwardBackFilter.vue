<template>
  <div class="flex justify-between border border-gray-400 rounded-md" style="width: 90px">
    <ToggleButton v-model="forward" v-tooltip.bottom="'Туда'">
      <img :src="images.left" />
    </ToggleButton>
    <ToggleButton v-model="back" v-tooltip.bottom="'Обратно'">
      <img :src="images.right" />
    </ToggleButton>
    <ToggleButton v-model="forward_back" v-tooltip.bottom="'Туда и обратно'">
      <img :src="images.left_right" />
    </ToggleButton>
  </div>
</template>

<script setup lang="ts">
import ToggleButton from 'primevue/togglebutton'
import { ref, watch } from 'vue'

import images from '@/shared/images/imported_images'

const forward = ref(false)
const back = ref(false)
const forward_back = ref(true)

watch(forward, () => {
  if (forward.value) {
    back.value = false
    forward_back.value = false
    model.value = 1
  }
  if (!(forward.value || back.value || forward_back.value)) {
    setTimeout(() => {
      forward.value = true
    }, 0)
  }
})

watch(back, () => {
  if (back.value) {
    forward.value = false
    forward_back.value = false
    model.value = 2
  }
  if (!(forward.value || back.value || forward_back.value)) {
    setTimeout(() => {
      back.value = true
    }, 0)
  }
})

watch(forward_back, () => {
  if (forward_back.value) {
    forward.value = false
    back.value = false
    model.value = 0
  }
  if (!(forward.value || back.value || forward_back.value)) {
    setTimeout(() => {
      forward_back.value = true
    }, 0)
  }
})

const model = defineModel<0 | 1 | 2>({ default: 0 })
</script>
