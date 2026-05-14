<template>
  <Table :rows="props.rows" :cols="adm_cols" style="height: 80px; width: 200px;" />
</template>

<script setup lang="ts">
import Table from '@/core/primetable/Table.vue'

type Adm = { adm: string; len: number | string }

const props = defineProps<{
  rows: Adm[]
}>()

const adm_cols = [
  { title: 'Администрация', field: 'adm' },
  { title: 'Расст.', field: 'len' }
]
</script>
