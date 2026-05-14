<template>
  <div
    v-if="
      props.row.status == '0' ||
      props.row.status == '3' ||
      (props.row.status == '2' && edit_level == 'CD_EDIT')
    "
  >
    <button
      v-if="edit_level == 'CD_EDIT' || edit_level == 'RD_IN_EDIT'"
      @click.stop="emit('approve')"
      v-tooltip.bottom="`Утвердить \n id: ${props.row.marsh_id}`"
      class="img-btn !w-5"
    >
      <img :src="images.certificate_add" />
    </button>
    <button
      v-if="edit_level == 'RD_OUT_EDIT'"
      @click.stop="emit('approve')"
      v-tooltip.bottom="`Согласовать \n id: ${props.row.marsh_id}`"
      class="img-btn !w-5"
    >
      <img :src="images.certificate_add_y" />
    </button>
    <button
      v-if="edit_level == 'CD_EDIT' && props.row.status == '2'"
      @click.stop="emit('unapprove')"
      v-tooltip.bottom="`Вернуть на доработку`"
      class="img-btn !w-5"
    >
      <img :src="images.certificate_y_return" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useUserStore } from '@/app/plugins/pinia/user'
import images from '@/shared/images/imported_images'

import { PfmRow } from '../../const/types'

const props = defineProps<{
  row: PfmRow
}>()

const emit = defineEmits(['approve', 'unapprove'])

const edit_level = computed(() => {
  return useUserStore().getEditLevel(props.row.rd_ot_code, props.row.rd_nz_code)
})
</script>
