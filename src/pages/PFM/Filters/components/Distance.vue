<template>
  <div class="flex">
    <MoreLessSelector v-model="option" />
    <input
      class="w-full border border-gray-400 rounded-sm ml-1 mr-1"
      type="text"
      v-model="distance"
    />
    <img :src="images.clean" @click="clear" class="img-btn" />
  </div>
</template>

<script setup lang="ts">
import MoreLessSelector from '@/components/selector/moreless/MoreLessSelector.vue'
import images from '@/shared/images/imported_images'
import { MoreLess } from '@/types/filters/moreless'

const option = defineModel<MoreLess>('option')
const distance = defineModel<string>()

const clear = () => {
  distance.value = ''
}
</script>
