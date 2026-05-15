<template>
  <div class="h-full w-full">
    <splitpanes class="default-theme">
      <pane :size="100 - params_size">
        <splitpanes class="default-theme" style="height: calc(100% - 84px)">
          <!-- ? Панель фильтров -->
          <pane :size="filters_size">
            <div class="flex gap-0.5 !h-6">
              <Button
                @click="hideFiltersTab"
                label="Скрыть"
                icon="pi pi-angle-double-left"
                severity="info"
                size="small"
                style="width: 120px"
              />
              <Button
                @click="props.action()"
                label="Применить"
                icon="pi pi-sync"
                severity="contrast"
                size="small"
                style="width: calc(100% - 120px)"
              />
            </div>
            <div style="overflow: auto; height: calc(100% - 30px)">
              <slot name="filter" />
            </div>
          </pane>

          <!-- ? Таблица -->
          <pane :size="100 - filters_size">
            <splitpanes class="default-theme" style="height: 100%" horizontal>
              <pane :size="gridPaneHeight">
                <slot name="grid" />
              </pane>
              <pane :size="history_size">
                <slot name="history" />
              </pane>
            </splitpanes>
          </pane>
        </splitpanes>
        <!-- ? Кнопки -->
        <div class="w-full">
          <slot name="bottom" />
        </div>
      </pane>

      <!-- ? Правая часть -->
      <pane :size="params_size" id="params">
        <div class="pfm-right-header">
          <div class="pfm-right-title">
            <div class="pfm-right-mode">ПРОСМОТР</div>
          </div>
          <Button
            @click="hideParamsTab"
            label="Скрыть"
            icon="pi pi-angle-right"
            iconPos="right"
            severity="info"
            class="!h-6 pfm-right-hide"
            fluid
          />
        </div>
        <ScrollPanel class="w-full" style="height: calc(100% - 28px)">
          <slot name="right" />
        </ScrollPanel>
      </pane>
    </splitpanes>
    <Button
      @click="openFiltersTab"
      v-if="!filters_tab"
      label="Фильтры"
      icon="pi pi-angle-double-right"
      iconPos="right"
      severity="info"
      style="z-index: 1 !important"
      class="!h-8 !absolute !top-[26px] !left-[-88px] hover:!left-[-6px] !transition-[left] opacity-75 hover:opacity-100 w-[0px]"
    />
    <Button
      @click="openParamsTab"
      v-if="!params_tab"
      label="Параметры"
      icon="pi pi-angle-double-left"
      severity="info"
      style="z-index: 1 !important"
      class="!h-8 !absolute !top-[26px] !right-[-106px] hover:!right-[-6px] !transition-[right] opacity-75 hover:opacity-100"
    />
  </div>
</template>

<script setup lang="ts">
import { Button, ScrollPanel } from 'primevue'
import { Pane, Splitpanes } from 'splitpanes'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps<{
  action: () => void
}>()

const filters_tab = ref(false)
const filters_size = ref(30) // Стартовая ширина должна быть примерно 322px
// eslint-disable-next-line no-undef
let filters_interval = <NodeJS.Timeout>{}
const params_tab = ref(true)
const params_size = ref(0) // Стартовая ширина должна быть примерно 480px
const history_size = ref(10)

onMounted(() => {
  params_size.value = (600 / window.innerWidth) * 100
  filters_size.value = 0;
  props.action()
})

onUnmounted(() => {
  clearInterval(filters_interval)
})

const gridPaneHeight = computed(() => {
  return 100 - history_size.value
})

const openHistoryPane = () => {
  history_size.value = 15
}
const openFiltersTab = () => {
  filters_tab.value = true
}
const hideFiltersTab = () => {
  filters_tab.value = false
}
const openParamsTab = () => {
  params_size.value = (480 / window.innerWidth) * 100
  params_tab.value = true
}
const hideParamsTab = () => {
  params_size.value = 0
  params_tab.value = false
}

defineExpose({
  openHistoryPane
})
</script>
