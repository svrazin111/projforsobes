<template>
  <div class="flex">
    <StatusImage
      @return-to-draft="emit('return-to-draft', props.row)"
      :row="props.row"
      style="border-right: 1px solid lightgray"
    />

    <StatusAction
      v-if="props.selected_ids.includes(props.row.marsh_id)"
      :row="props.row"
      @approve="$emit('approve', props.row)"
      @unapprove="$emit('unapprove', props.row)"
    />
  </div>
</template>

<script setup lang="ts">
import { PfmRow } from '../../const/types'
import StatusAction from './StatusAction.vue'
import StatusImage from './StatusImage.vue'

const props = defineProps<{
  row: PfmRow
  selected_ids: string[]
}>()

const emit = defineEmits(['approve', 'unapprove', 'return-to-draft'])
</script>
