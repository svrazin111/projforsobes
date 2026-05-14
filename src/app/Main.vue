<template>
  <Header />
  <Title class="absolute w-full top-10" />
  <WindowControl
    v-for="item in window_list"
    v-model="item.jqx_window"
    :key="item.id"
    :title="item.title"
    :component="item.component"
    :params="item.params"
    :minified="item.minified"
    @close="close(item.id)"
  />
  <WindowHistory :window_list="window_list" @close="close" />
</template>

<script setup lang="ts">
import Header from '@/components/header/Header.vue'
import Title from '@/components/Title.vue'
import WindowControl from '@/core/window/WindowControl.vue'
import WindowHistory from '@/core/window/WindowHistory.vue'

import { window_list } from './windows'

const close = (window_id) => {
  window_list.value = window_list.value.filter((item) => item.id != window_id)
}
</script>
