<template>
  <div>
    <PathWayLayout>
      <template v-slot:map-button>
        <div></div>
        <Button2 @click="openMap" label="Показать на карте" img="environment" />
      </template>
      <template v-slot:variants-table>
        <Table
          :rows="props.way_vars"
          :cols="[{ title: 'Наименование', field: 'var_name' }]"
          v-model="current_variant"
          style="height: 80px; width: 200px"
        />
      </template>
      <template v-slot:administation-table>
        <AdministrationLength :rows="adms" />
      </template>
      <template v-slot:administation-pf-table>
        <AdministrationLength :rows="adms_pf" />
      </template>
      <template v-slot:opor-table>
        <OporStations :is_edit="false" v-model="pfm_st" style="width: 740px" />
      </template>
      <template v-slot:st-per-table>
        <StPerTable :rows="props.pf_st" style="width: 740px" />
      </template>
      <template v-slot:stk-only-checkbox>
        <Checkbox binary v-model="stk_only" size="small" />
      </template>
      <template v-slot:path-table>
        <UrlbPath
          v-model:real_widths="path_table_real_widths"
          :isFull="true"
          :rows="ways_full"
          :stk_only="stk_only"
          style="width: 740px"
        />
      </template>
      <template v-slot:path-sums-table>
        <PathSums :real_widths="path_table_real_widths" :isFull="true" :rows="ways_full" />
      </template>
      <template v-slot:path-pf-table>
        <UrlbPath
          v-model:real_widths="path_pf_table_real_widths"
          :rows="props.ways_pf_full"
          :stk_only="stk_only"
          style="width: 740px"
        />
      </template>
      <template v-slot:path-pf-sums-table>
        <PathSums :real_widths="path_pf_table_real_widths" :rows="props.ways_pf_full" />
      </template>
    </PathWayLayout>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Checkbox, Dialog } from 'primevue'
import { computed, ref } from 'vue'

import Table from '@/core/primetable/Table.vue'
import Button2 from '@/shared/ui/button/Button2.vue'

import { PfmRow, PfmSt, PfSt, WayFull, WayPfFull, WayVars } from '../../const/types'
import AdministrationLength from './components/AdministrationLength.vue'
import OporStations from './components/OporStations.vue'
import PathSums from './components/PathSums.vue'
import StPerTable from './components/StPerTable.vue'
import UrlbPath from './components/UrlbPath.vue'
import PathWayLayout from './componentsLayouts/PathWayLayout.vue'
import { calcAdms } from './functions'

const dialog = ref(false)

const props = defineProps<{
  row?: PfmRow
  way_vars: WayVars[]
  pfm_st: PfmSt[]
  pf_st: PfSt[]
  ways_full: WayFull[]
  ways_pf_full: WayPfFull[]
}>()

const st_ot_id = ref('0')
const st_nz_id = ref('0')
const opor_ids = ref<(string | number)[]>([])

const path_table_real_widths = ref<number[]>([])
const path_pf_table_real_widths = ref<number[]>([])

const openMap = () => {
  if (!props.row?.st_ot_id || !props.row?.st_nz_id) return

  st_ot_id.value = props.row?.st_ot_id
  st_nz_id.value = props.row?.st_nz_id
  opor_ids.value = props.pfm_st.map((item) => item.st_id)

  dialog.value = true
}

const stk_only = ref(false)

const current_variant = defineModel('var_num', { default: { var_num: 1, var_name: 'Основной' } })

const parsePfmSt = (pfm_st: PfmSt) => {
  const getPricepOtcep = (n) => {
    if (Number(n) == 2) return 'Отцепка'
    if (Number(n) == 1) return 'Прицепка'
    return '---'
  }

  const getUslPhis = (n) => {
    if (String(n) == '0') return 'физ.'
    if (String(n) == '1') return 'усл.'
    return '---'
  }

  pfm_st.pricep_otcep = getPricepOtcep(pfm_st.pricep_otcep)
  pfm_st.flag_usl = getUslPhis(pfm_st.flag_usl)

  return pfm_st
}

const pfm_st = computed(() => {
  if (!current_variant.value || !current_variant.value['var_num']) return []
  return props.pfm_st
    .filter((item) => item['var_num'] == current_variant.value['var_num'])
    .map((item) => parsePfmSt(cloneDeep(item)))
})

const ways_full = computed(() => {
  if (!current_variant.value || !current_variant.value['var_num']) return []
  return props.ways_full.filter((item) => item['var_num'] == current_variant.value['var_num'])
})

const adms = computed(() => {
  if (!ways_full.value) return [{ adm: '', len: 0 }]
  return calcAdms(ways_full.value)
})

const adms_pf = computed(() => {
  return calcAdms(props.ways_pf_full)
})
</script>
