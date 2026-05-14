<template>
  <div class="flex text-[10px] whitespace-nowrap">
    <div class="w-[120px]">
      <div class="text-center">Статус согласования</div>
      <div class="flex justify-center gap-1">
        <div v-tooltip.bottom="'На согласовании'" class="box">
          <img :src="images.certificate_y" style="height: 14px; width: 14px" />
          <div>{{ status?.agree_count }}</div>
        </div>
        <div v-tooltip.bottom="'На доработке'" class="box">
          <img :src="images.certificate_y_return" style="height: 14px; width: 14px" />
          <div>{{ status?.return_count }}</div>
        </div>
      </div>
    </div>
    <div class="w-[120px]">
      <div class="text-center">Срок действия договора</div>
      <div class="flex justify-center gap-1">
        <div v-tooltip.bottom="'< 10 дней'" class="box">
          <img :src="images.warning" style="height: 14px; width: 14px" />
          <div>{{ status?.warning_count }}</div>
        </div>
        <div v-tooltip.bottom="'Истек'" class="box">
          <img :src="images.stop" style="height: 14px; width: 14px" />
          <div>{{ status?.stop_count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep, isEqual } from 'lodash'
import { onMounted, ref, watch } from 'vue'

import { xmlQuery } from '@/app/plugins/ky'
import images from '@/shared/images/imported_images'

const props = withDefaults(
  defineProps<{
    roads_ot?: number[]
  }>(),
  {
    roads_ot: () => []
  }
)

type StatusCount = {
  agree_count: number
  return_count: number
  warning_count: number
  stop_count: number
}

const last_roads_ot = ref<number[]>([])
const status = ref<StatusCount>({
  agree_count: 0,
  return_count: 0,
  warning_count: 0,
  stop_count: 0
})

onMounted(() => {
  setTimeout(() => {
    getStatus()
    setInterval(getStatus, 60000)
  }, 1000)
})

watch(
  props,
  () => {
    if (!isEqual(last_roads_ot.value, props.roads_ot)) {
      getStatus()
      last_roads_ot.value = cloneDeep(props.roads_ot)
    }
  },
  { deep: true }
)

const getStatus = async () => {
  if (!props.roads_ot || !props.roads_ot.length) {
    status.value = {
      agree_count: 0,
      return_count: 0,
      warning_count: 0,
      stop_count: 0
    }
    return
  }

  const data = await xmlQuery(
    'PFM2_Defs',
    'Get_STATUS_COUNT',
    { ROADS: props.roads_ot },
    {
      silent: true,
      parse: 'xml'
    }
  )
  status.value = data?.VFPDataSet?.STATUS_COUNT
}
</script>

<style scoped>
.box {
  border: solid gray 1px;
  display: flex;
  flex-wrap: nowrap;
  gap: 2px;
  height: 18px;
  border-radius: 2px;
  padding: 2px;
}
</style>
