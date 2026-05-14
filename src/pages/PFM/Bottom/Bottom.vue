<template>
  <div class="flex flex-col gap-1 mt-0.5">
    <div class="flex justify-between">
      <Analysis :filters="props.filters" />
      <div class="whitespace-nowrap text-[12px] pr-1 pt-1">
        Маршрутов, выбранных по фильтру <b class="text-green-600">{{ props.total_rows }}</b>
      </div>
    </div>
    <Export :row="props.row" :filters="props.filters" />
    <div class="flex justify-between p-1 bg-gray-300">
      <Control
        :row="props.row"
        :rows="props.rows"
        :is_multi="props.is_multi"
        @delete="emit('delete')"
        @create="emit('create')"
        @edit="emit('edit')"
        @correct="emit('correct')"
        @copy="emit('copy')"
        @copy_with_docs="emit('copy_with_docs')"
        @multi_edit="emit('multi_edit')"
        @multi_copy="emit('multi_copy')"
        @multi_approve="emit('multi_approve')"
      />
      <Button2 @click="emit('update')" label="Обновить" img="refresh" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button2 from '@/shared/ui/button/Button2.vue'
import { FiltersInQuery } from '@/types/filters/filters'

import { PfmRow } from '../const/types'
import Analysis from './Analysis/Analysis.vue'
import Control from './Control/Control.vue'
import Export from './Export/Export.vue'

const emit = defineEmits([
  'update',
  'delete',
  'create',
  'edit',
  'correct',
  'copy',
  'copy_with_docs',
  'multi_copy',
  'multi_edit',
  'multi_approve'
])

const props = defineProps<{
  row?: PfmRow
  rows?: PfmRow[]
  total_rows?: number
  filters?: FiltersInQuery
  is_multi: boolean
}>()
</script>
