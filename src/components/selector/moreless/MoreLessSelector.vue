<template>
  <select v-model="option" class="border border-gray-400 rounded-sm text-align">
    <option value="<" selected>Меньше</option>
    <option value="<=">Меньше или равно</option>
    <option value="=">Равно</option>
    <option value=">=">Больше или равно</option>
    <option value=">">Больше</option>
  </select>
</template>

<script setup lang="ts">
import { MoreLess } from '@/types/filters/moreless'

const option = defineModel<MoreLess>()
</script>
