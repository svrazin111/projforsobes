<template>
  <JqxWindow ref="window">
    <component :is="props.component" v-bind="props.params"></component>
  </JqxWindow>
</template>

<script setup lang="ts">
import JqxWindow from 'jqwidgets-scripts/jqwidgets-vue/vue_jqxwindow.vue'
import { nextTick } from 'process'
import { onMounted, ref, useTemplateRef } from 'vue'

import images from '@/shared/images/imported_images'

const props = defineProps<{
  component?: object
  params?: object
  title?: string
  minified: boolean
}>()

const emit = defineEmits(['close'])

const window_ref = useTemplateRef('window')
const is_fullscrean = ref(true)
const jqx_window = defineModel({ type: Object })

onMounted(() => {
  window.addEventListener('resize', keepMaxSize)

  jqx_window.value = window_ref.value

  const setHeaderButtons = () => {
    const header = window_ref.value.$el.querySelector('.jqx-window-header')

    const close_btn = document.createElement('img')
    const max_btn = document.createElement('img')
    const min_btn = document.createElement('img')

    close_btn.src = images.close
    close_btn.className = 'window-controls window-controls-danger'
    close_btn.style = 'right: 1px;'
    close_btn.onclick = () => close()

    max_btn.src = images.max
    max_btn.className = 'window-controls'
    max_btn.style = 'right: 29px;'
    max_btn.onclick = () => toggle()

    min_btn.src = images.min
    min_btn.className = 'window-controls'
    min_btn.style = 'right: 57px;'
    min_btn.onclick = () => hide()

    header.append(close_btn)
    header.append(max_btn)
    header.append(min_btn)
  }

  setHeaderButtons()

  window_ref.value.setTitle(`<div class="font-bold">${props.title}</div>`)
  nextTick(() => {
    window_ref.value.setOptions({
      minWidth: 600,
      minHeight: 300,
      maxWidth: 6000,
      maxHeight: 3000,
      dragArea: {
        left: 0,
        top: 32,
        width: window.innerWidth,
        height: window.innerHeight - 32 - 28
      }
    })

    keepMaxSize()
  })

  setTimeout(() => {
    if (props.minified) toggle()
  }, 1000)
})

const setSize = (width: number, height: number) => {
  window_ref.value.setOptions({
    width: Math.round(width),
    height: Math.round(height)
  })
}
const keepMaxSize = () => {
  if (!window_ref.value) return
  if (!is_fullscrean.value) return

  setSize(window.innerWidth - 2, window.innerHeight - 30 - 30)
  window_ref.value.move(0, 30)
}
const hide = () => {
  window_ref.value.hide()
}
const toggle = () => {
  if (is_fullscrean.value) {
    setSize(window.innerWidth / 1.5 + 150, window.innerHeight / 2 + 100)
    window_ref.value.move(30, 90)
    is_fullscrean.value = false
  } else {
    is_fullscrean.value = true
    keepMaxSize()
  }
}
const close = () => {
  emit('close')
}
</script>
