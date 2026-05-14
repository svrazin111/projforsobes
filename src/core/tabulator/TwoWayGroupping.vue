<template>
  <DataTable
    :value="rows"
    class="w-wull mr-1 !min-h-20 !max-h-50 border border-gray-400 rounded-sm"
    scrollable
    scrollHeight="flex"
    showGridlines
    @rowReorder="reorder"
    size="small"
  >
    <Column rowReorder />
    <Column field="checkbox" style="padding: 0px; width: 26px">
      <template #body="{ data }: { data: GroupBy2 }">
        <Checkbox binary v-model="data.checkbox" />
      </template>
    </Column>
    <Column field="title" header="Группировка" />
    <Column field="direction" style="padding: 0px; width: 26px">
      <template #body="{ data }: { data: GroupBy2 }">
        <img
          v-if="data.checkbox && data.direction == 'left'"
          @click="changeDirection(data)"
          :src="images.arrow_right_green"
          class="img-btn"
        />
        <img
          v-if="data.checkbox && data.direction == 'top'"
          @click="changeDirection(data)"
          :src="images.arrow_down_blue"
          class="img-btn"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Checkbox } from 'primevue'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { onMounted, ref, watch } from 'vue'

import { GroupBy2 } from '@/pages/AnalysisControl/ExecutionAnalysis/const/types'
import images from '@/shared/images/imported_images'

const props = defineProps<{
  options: GroupBy2[]
}>()

const changeDirection = (row: GroupBy2) => {
  let keep_changing_left_to_top = true
  rows.value.forEach((item) => {
    if (item.field == row.field) {
      keep_changing_left_to_top = false
    }
    if (keep_changing_left_to_top) {
      item.direction = 'top'
    } else {
      item.direction = 'left'
    }
  })
}

const rows = ref<GroupBy2[]>([])

watch(
  () => rows,
  () => {
    model.value = rows.value.filter((item) => item.checkbox)
  },
  { deep: true }
)

onMounted(() => (rows.value = cloneDeep(props.options)))

const reorder = (reordered: { dragIndex: number; dropIndex: number; value: GroupBy2[] }) => {
  rows.value = reordered.value
  changeDirection(rows.value[Math.min(reordered.dragIndex, reordered.dropIndex)])
}

const model = defineModel<GroupBy2[]>({ default: [] })
</script>
