<template>
  <div class="panel">
    <img @click="moveLeft" :src="images.chevron_double_left" class="shevron" />
    <div class="grow" />
    <img @click="moveRight" :src="images.chevron_double_right" class="shevron" />

    <div ref="scrollable" class="scrollable">
      <div v-for="window in props.window_list" :key="window.id" class="flex">
        <button
          @click="open(window)"
          :class="{ 'active-btn': window.id == top_window_id }"
          class="btn"
          v-tooltip.top="window.title"
        >
          <p class="btn-text">{{ window.title }}</p>
        </button>
        <img class="close-btn" :src="images.close" @click="close(window.id)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue'

import { Window } from '@/app/windows'
import images from '@/shared/images/imported_images'

const emit = defineEmits(['close'])

const props = defineProps<{
  window_list: Window[]
}>()

onMounted(() => {
  setInterval(() => {
    let max_z_index = 0
    props.window_list.forEach((item: Window) => {
      const window_element = item.jqx_window?.['$el']
      if (!window_element) return

      if (window_element.style['z-index'] > max_z_index) {
        max_z_index = window_element.style['z-index']
        top_window_id.value = item.id
      }
    })
  }, 1000)
})

const scrollable = useTemplateRef('scrollable')
const left = ref(40)
const top_window_id = ref('0')

const open = (window: Window) => {
  window.jqx_window?.open()
  window.jqx_window?.bringToFront()
}
const close = (window: Window) => {
  emit('close', window)
}
const moveLeft = () => {
  if (left.value >= 40) return

  left.value += 150
  scrollable.value.style.left = `${left.value}px`
}
const moveRight = () => {
  left.value -= 150
  scrollable.value.style.left = `${left.value}px`
}
</script>

<!-- ! Потом стили бы как то упростить -->

<style scoped>
.scrollable {
  position: absolute;
  display: flex;
  width: 10000px;
  left: 40px;
  transition: all ease-in-out 0.5s;
  overflow: hidden;
}
.panel {
  display: flex;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 28px;
  background-color: #cbd5e1;
  z-index: 100000 !important;
}
.shevron {
  height: 28px;
  width: 28px;
  padding: 4px;
  cursor: pointer;
  z-index: 2;
  background-color: #cbd5e1;
  transition: background-color ease-in-out 0.2s;
}
.shevron:hover {
  background-color: #f8fafc;
}
.btn {
  height: 20px;
  max-width: 200px;
  margin: 4px;
  margin-right: 0px;
  padding-left: 8px;
  padding-right: 8px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  border-right: solid 1px gray;
  cursor: pointer;
  background-color: #f8fafc;
  transition: all ease-in-out 0.3s;
}
.active-btn {
  background-color: #34d399;
  color: white;
}
.btn:hover {
  background-color: #34d399;
  color: white;
}
.btn-text {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.close-btn {
  height: 20px;
  width: 16px;
  padding: 3px;
  padding-left: 1px;
  padding-right: 1px;
  margin: 4px;
  margin-left: 0px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  cursor: pointer;
  background-color: #f1f5f9;
  transition: background-color ease-in-out 0.2s;
}
.close-btn:hover {
  background-color: #fee2e2;
}
</style>
