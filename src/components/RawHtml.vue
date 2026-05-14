<template>
  <div v-html="html" class="!text-[12px] leading-[14px]"></div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'

const dialogRef = inject('dialogRef')

const html = ref('')
onMounted(() => {
  html.value = dialogRef.value.data.html
})
</script>
