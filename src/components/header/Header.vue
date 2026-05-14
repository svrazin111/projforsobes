<template>
  <div>
    <Menubar :model="menu" class="!shadow-md !p-0" style="z-index: 100000 !important">
      <template #itemicon="{ item }">
        <img v-if="item.icon" :src="item.icon" width="20" height="20" />
      </template>
      <template #end>
        <div class="flex">
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar'
import { MenuItem } from 'primevue/menuitem'
import { onMounted, ref } from 'vue'

import { useUserStore } from '@/app/plugins/pinia/user'
import { newWindow } from '@/app/windows'
import PFM from '@/pages/PFM/PFM.vue'
import images from '@/shared/images/imported_images'

const menu = ref<MenuItem[]>([])

onMounted(() => {
  menu.value = [
    {
      label: 'Функции',
      items: [
        {
          icon: images.edit,
          label: 'План формирования маршрутов',
          command: () => {
            newWindow('План формирования маршрутов', PFM, {})
          }
        },
      ]
    },
  ]

  if (!useUserStore().isCD) {
    menu.value.splice(3, 1)
  }

  setTimeout(() => {
    newWindow('План формирования маршрутов', PFM, {})
  }, 0);
})
</script>
