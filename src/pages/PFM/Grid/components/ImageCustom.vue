<template>
  <img
    :src="current_src"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onClick"
    style="height: 16px; width: 16px; margin: 2px"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useUserStore } from '@/app/plugins/pinia/user'
import images from '@/shared/images/imported_images'

import { PfmRow } from '../../const/types'

const emit = defineEmits(['return-to-draft'])

const props = defineProps<{
  row: PfmRow
}>()

const edit_level = computed(() => {
  return useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
})

const is_hovered = ref(false)
const alt_pressed = ref(false)
const shift_pressed = ref(false)

const base_src = images.certificate
const return_src = images.certificate_y_return

const current_src = computed(() => {
  if (edit_level.value != 'CD_EDIT') return base_src
  return is_hovered.value && alt_pressed.value && shift_pressed.value ? return_src : base_src
})

const onClick = () => {
  if (edit_level.value == 'CD_EDIT' && alt_pressed.value && shift_pressed.value) {
    emit('return-to-draft')
  }
}

const onMouseEnter = () => {
  is_hovered.value = true
}

const onMouseLeave = () => {
  is_hovered.value = false
}

const onKeyDown = (e) => {
  if (e.altKey) alt_pressed.value = true
  if (e.shiftKey) shift_pressed.value = true
}

const onKeyUp = (e) => {
  alt_pressed.value = e.altKey
  shift_pressed.value = e.shiftKey
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
})
</script>
