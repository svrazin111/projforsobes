<template>
  <Button
    size="small"
    outlined
    severity="contrast"
    class="h-[22px] !bg-gray-100 hover:!bg-white"
    :class="{ 'pulse-btn': props.need_update, '!p-[2px]': props.icon }"
    :disabled="props.disabled"
  >
    <img v-if="src" :src="src" class="!h-[16px] !w-[16px]" />
    <div v-if="props.label" class="text-[10px] whitespace-nowrap">{{ props.label }}</div>
  </Button>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import { computed } from 'vue'

import images, { ImageKey } from '@/shared/images/imported_images'

const props = withDefaults(
  defineProps<{
    label?: string
    img?: ImageKey
    icon?: boolean
    small?: boolean
    disabled?: boolean
    need_update?: boolean
  }>(),
  {
    icon: false,
    small: false,
    disabled: false,
    need_update: false
  }
)

const src = computed(() => {
  if (props.img) return images[props.img]
  else return undefined
})
</script>
