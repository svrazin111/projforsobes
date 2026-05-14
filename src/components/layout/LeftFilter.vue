<template>
  <splitpanes class="default-theme h-full z-1">
    <pane :size="width" class="h-full">
      <div class="flex gap-1 h-6 mb-1">
        <Button
          @click="toggle"
          label="Скрыть"
          icon="pi pi-angle-double-left"
          severity="info"
          size="small"
          style="width: 100px"
        />
        <Button
          @click="props.action"
          label="Применить"
          icon="pi pi-sync"
          severity="contrast"
          size="small"
          style="width: calc(100% - 100px)"
        />
      </div>
      <ScrollPanel class="w-full" style="height: calc(100% - 30px)">
        <slot name="filter" />
      </ScrollPanel>
    </pane>
    <pane :size="100 - width">
      <slot name="body" />
    </pane>
  </splitpanes>
  <Button
    @click="toggle()"
    v-if="!filters"
    label="Фильтры"
    icon="pi pi-angle-right"
    iconPos="right"
    severity="info"
    style="z-index: 2 !important"
    class="!h-8 !absolute !top-[26px] !left-[-88px] hover:!left-[-6px] !transition-[left] opacity-75 hover:opacity-100"
  />
</template>

<script setup lang="ts">
import { Button, ScrollPanel } from 'primevue'
import { Pane, Splitpanes } from 'splitpanes'
import { defineProps, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    action: () => void
    startWidth?: number
  }>(),
  {
    action: () => {},
    startWidth: 20
  }
)

const filters = ref(true)
const width = ref(props.startWidth)

const toggle = () => {
  if (filters.value) width.value = 0
  else width.value = props.startWidth
  filters.value = !filters.value
}

defineExpose({ toggle })
</script>
