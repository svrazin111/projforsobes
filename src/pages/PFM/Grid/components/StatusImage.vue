<template>
  <div>
    <div
      v-if="props.row.status == '0'"
      v-tooltip.bottom="`Черновик \n id: ${props.row.marsh_id}`"
      style="height: 16px; width: 16px; margin: 2px"
    ></div>
    <img
      v-if="props.row.status == '1' && new Date(props.row.date_end) < new Date()"
      :src="images.certificate_gray"
      v-tooltip.bottom="`Утверждено \n id: ${props.row.marsh_id}`"
      style="height: 16px; width: 16px; margin: 2px"
    />
    <ImageCustom
      @return-to-draft="emit('return-to-draft')"
      :row="props.row"
      v-if="props.row.status == '1' && new Date(props.row.date_end) >= new Date()"
      v-tooltip.bottom="`Утверждено \n id: ${props.row.marsh_id}`"
    />
    <!-- <img
      v-if="props.row.status == '1' && new Date(props.row.date_end) >= new Date()"
      :src="images.certificate"
      v-tooltip.bottom="`Утверждено \n id: ${props.row.marsh_id}`"
      style="height: 16px; width: 16px; margin: 2px"
    /> -->
    <img
      v-if="props.row.status == '2'"
      :src="images.certificate_y"
      v-tooltip.bottom="`На согласовании \n id: ${props.row.marsh_id}`"
      style="height: 16px; width: 16px; margin: 2px"
    />
    <img
      v-if="props.row.status == '3'"
      :src="images.certificate_y_return"
      v-tooltip.bottom="
        `Возвращено на доработку \n ${props.row.status_comment} \n id: ${props.row.marsh_id}`
      "
      style="height: 16px; width: 16px; margin: 2px"
    />
    <img
      v-if="
        props.row.agreement_indicator != '' &&
        Number(props.row.agreement_indicator) > 0 &&
        Number(props.row.agreement_indicator) < 10
      "
      :src="images.warning"
      v-tooltip.bottom="
        `До истечения срока действия договора осталось ${props.row.agreement_indicator} дней`
      "
      style="height: 16px; width: 16px; margin: 2px"
    />
    <img
      v-if="props.row.agreement_indicator != '' && Number(props.row.agreement_indicator) <= 0"
      :src="images.stop"
      v-tooltip.bottom="`Срок действия договора истек`"
      style="height: 16px; width: 16px; margin: 2px"
    />
  </div>
</template>

<script setup lang="ts">
import images from '@/shared/images/imported_images'

import { PfmRow } from '../../const/types'
import ImageCustom from './ImageCustom.vue'

const props = defineProps<{
  row: PfmRow
}>()

const emit = defineEmits(['return-to-draft'])
</script>
