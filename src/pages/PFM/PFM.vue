<template>
  <div>
    <Layout :action="downloadData" ref="layout">
      <template v-slot:filter>
        <Filters
          ref="filters_component"
          v-model="filters"
          v-model:local="local_filters"
          v-model:roads_ot="roads_ot"
        />
      </template>
      <template v-slot:grid>
        <PFMGrid
          ref="grid"
          :rows="display_rows"
          :is_loading="is_main_loading"
          :roads_ot="roads_ot"
          v-model="selected_rows"
          is_main_grid
        />
      </template>
      <template v-slot:history>
        <PFMGrid
          :rows="history_rows"
          :is_loading="is_history_loading"
          v-model="selected_history_row"
        />
      </template>
      <template v-slot:bottom>
        <Bottom
          :row="selected_row"
          :rows="selected_rows"
          :total_rows="rows.length"
          :filters="filters"
          :is_multi="isMulti"
          @update="downloadData"
        />
      </template>
      <template v-slot:row-title>
        {{ row_title }}
      </template>
      <template v-slot:right>
        <MarshView :row="selected_row" />
      </template>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import { toArray } from '@/shared/array'
import { FiltersInQuery } from '@/types/filters/filters'
import { MoreLess } from '@/types/filters/moreless'

import Bottom from './Bottom/Bottom.vue'
import { getFullName } from './const/functions'
import { PfmRow, PfmRow2, PfmRowData2 } from './const/types'
import Filters from './Filters/Filters.vue'
import PFMGrid from './Grid/PFMGrid.vue'
import Layout from './Layout.vue'
import MarshView from './Right/MarshView.vue'

// Прелоадер
const is_main_loading = ref(false)
const is_history_loading = ref(false)

// Фильтры
const filters = ref<FiltersInQuery>()
const local_filters = ref()
const roads_ot = ref<number[]>([])

// Строки
const grid = useTemplateRef('grid')
const history_rows = ref<PfmRow[]>([])
const rows = ref<PfmRow[]>([])
const display_rows = computed(() => {
  if (!local_filters.value) {
    return rows.value
  }
  if (!rows.value) {
    return []
  }

  const filtered = ref(rows.value)

  if (local_filters.value['type_soob'].length) {
    const selected = local_filters.value['type_soob'].map((item: { [x: string]: any }) => item['type_soob'])
    filtered.value = filtered.value.filter((item) => selected.includes(item['type_soob']))
  }

  if (local_filters.value['in_use'].length) {
    const selected = local_filters.value['in_use'].map((item: { [x: string]: any }) => item['moved'])
    filtered.value = filtered.value.filter((item) => selected.includes(item['moved']))
  }

  if (local_filters.value['distance'] && local_filters.value['distance_option']) {
    const option: MoreLess = local_filters.value['distance_option']
    const distance = Number(local_filters.value['distance'])

    if (option == '<') {
      filtered.value = filtered.value.filter((item) => Number(item.marsh_way_len) < distance)
    } else if (option == '<=') {
      filtered.value = filtered.value.filter((item) => Number(item.marsh_way_len) <= distance)
    } else if (option == '=') {
      filtered.value = filtered.value.filter((item) => Number(item.marsh_way_len) == distance)
    } else if (option == '>=') {
      filtered.value = filtered.value.filter((item) => Number(item.marsh_way_len) >= distance)
    } else if (option == '>') {
      filtered.value = filtered.value.filter((item) => Number(item.marsh_way_len) > distance)
    }
  }

  return filtered.value
})

// Выбранные строки
const selected_rows = ref<PfmRow[]>([])
const selected_history_row = ref<PfmRow[]>([])
const selected_row = computed(() => {
  if (selected_rows.value.length == 1) {
    if (
      selected_history_row.value.length == 1 &&
      selected_history_row.value[0].parent_id == selected_rows.value[0].marsh_id
    ) {
      return selected_history_row.value[0]
    }

    return selected_rows.value[0]
  }
  return undefined
})
watch(
  selected_rows,
  () => {
    history_rows.value = []
    selected_history_row.value = []

    if (
      selected_rows.value.length == 1 &&
      saved_history_rows.value[selected_rows.value[0].marsh_id] != undefined
    ) {
      history_rows.value = saved_history_rows.value[selected_rows.value[0].marsh_id]
    }
  },
  { deep: true }
)
const selected_row_data = ref<PfmRowData2>()
const row_title = computed(() => {
  if (!selected_row.value) return 'Не выбран маршрут'
  else return getFullName(selected_row.value)
})

// Режим множенственного выбора
const isMulti = computed(() => selected_rows.value.length > 1)
const multi_marsh_id_list = ref<(string | number)[]>([])
const multi_form_type = ref<'edit' | 'copy'>('edit')

const layout = useTemplateRef('layout')
const saved_history_rows = ref({})

const filters_component = useTemplateRef('filters_component')

const downloadData = async () => {
  is_main_loading.value = true

  let last_selected_id = <string | number>0
  if (selected_rows.value.length > 0) {
    last_selected_id = selected_rows.value[0].marsh_id
  }

  if (!filters_component.value) return

  selected_rows.value = []
  history_rows.value = []
  if (grid.value) {
    grid.value.clear()
  }

  const data = {
    "?xml": {
      "version": "1.0",
      "encoding": "Windows-1251",
      "standalone": "yes"
    },
    "VFPDataSet": {
      "ROWDATA": [
        {
          "PFM": [
            {
              "marsh_id": "2022041412181568",
              "st_ot_id": "4072",
              "st_nz_id": "494",
              "type_ot": "1",
              "type_nz": "11",
              "gr_state": "1",
              "rod_gr": "3",
              "cod_gr": "",
              "rod_vag": "",
              "len": "72",
              "date_begin": "2022-04-14 00:00:00",
              "date_end": "2100-01-01 00:00:00",
              "usl_len_1": "",
              "usl_len_2": "",
              "usl_len_base": "",
              "weight_1": "",
              "weight_2": "",
              "weight_base": "6500",
              "wl_limit": "0",
              "norm_doc": "тел. №9054/ЦД",
              "status": "1",
              "group_gr": "22000",
              "parent_id": "",
              "doc_date": "2022-04-14",
              "prop_type": "",
              "otpr_okpo": "98770511",
              "pol_okpo": "",
              "ways_private": "1",
              "pogr_owner_okpo": "",
              "vigr_owner_okpo": "",
              "len_calc": "82",
              "weight_calc": "5738",
              "rps_owner_okpo": "",
              "comments": "",
              "status_comment": "",
              "len_1": "",
              "len_2": "",
              "rod_vag_name": "",
              "rod_vag_fname": "",
              "rps_owner_name": "",
              "on_time_tab": "",
              "from_etran": "0",
              "inno_vag": "0",
              "type_ot_name": "Отправительский",
              "type_nz_name": "Прямой",
              "rd_ot_code": "17",
              "rd_ot_name": "МОСК",
              "st_ot_esr": "19450",
              "st_ot_name": "ЯНИЧКИНО",
              "adm_ot_code": "20",
              "vg_ch": "15.760",
              "lk_chm": "4191.36",
              "rd_nz_code": "1",
              "rd_nz_name": "ОКТ",
              "st_nz_esr": "03560",
              "st_nz_name": "АВТОВО-Э",
              "adm_nz_code": "20",
              "gr_state_mnemo": "груж",
              "group_gr_name": "Нефтепродукты темные",
              "rod_gr_name": "Нефть и нефтепродукты",
              "prop_type_name": "",
              "otpr_name": "ООО \"Газпромнефть-Логистика\"",
              "pol_name": "",
              "pogr_owner_name": "",
              "vigr_owner_name": "",
              "gr_vname": "",
              "ways_private_mnemo": "ПНП",
              "f_completed_count": "0",
              "moved": "Не используемые",
              "agreement_indicator": "",
              "marsh_way_len": "1189",
              "core_flag": "без ядра",
              "type_soob": "2",
              "ring_flag": "0",
              "moving_count": "",
              "completed_count": "",
              "leaved_count": "",
              "history_count": "0"
            },
            {
              "marsh_id": "2023121914491350",
              "st_ot_id": "4072",
              "st_nz_id": "494",
              "type_ot": "1",
              "type_nz": "11",
              "gr_state": "1",
              "rod_gr": "3",
              "cod_gr": "",
              "rod_vag": "",
              "len": "",
              "date_begin": "2023-12-18 00:00:00",
              "date_end": "2100-01-01 00:00:00",
              "usl_len_1": "",
              "usl_len_2": "",
              "usl_len_base": "",
              "weight_1": "",
              "weight_2": "",
              "weight_base": "5500",
              "wl_limit": "0",
              "norm_doc": "тел. №29377/ЦД",
              "status": "1",
              "group_gr": "",
              "parent_id": "",
              "doc_date": "2023-12-18",
              "prop_type": "",
              "otpr_okpo": "98770511",
              "pol_okpo": "",
              "ways_private": "1",
              "pogr_owner_okpo": "",
              "vigr_owner_okpo": "",
              "len_calc": "67",
              "weight_calc": "",
              "rps_owner_okpo": "",
              "comments": "",
              "status_comment": "",
              "len_1": "",
              "len_2": "",
              "rod_vag_name": "",
              "rod_vag_fname": "",
              "rps_owner_name": "",
              "on_time_tab": "",
              "from_etran": "0",
              "inno_vag": "0",
              "type_ot_name": "Отправительский",
              "type_nz_name": "Прямой",
              "rd_ot_code": "17",
              "rd_ot_name": "МОСК",
              "st_ot_esr": "19450",
              "st_ot_name": "ЯНИЧКИНО",
              "adm_ot_code": "20",
              "vg_ch": "15.760",
              "lk_chm": "4191.36",
              "rd_nz_code": "1",
              "rd_nz_name": "ОКТ",
              "st_nz_esr": "03560",
              "st_nz_name": "АВТОВО-Э",
              "adm_nz_code": "20",
              "gr_state_mnemo": "груж",
              "group_gr_name": "",
              "rod_gr_name": "Нефть и нефтепродукты",
              "prop_type_name": "",
              "otpr_name": "ООО \"Газпромнефть-Логистика\"",
              "pol_name": "",
              "pogr_owner_name": "",
              "vigr_owner_name": "",
              "gr_vname": "",
              "ways_private_mnemo": "ПНП",
              "f_completed_count": "0",
              "moved": "Не используемые",
              "agreement_indicator": "",
              "marsh_way_len": "1043",
              "core_flag": "с ядром",
              "type_soob": "2",
              "ring_flag": "0",
              "moving_count": "",
              "completed_count": "",
              "leaved_count": "",
              "history_count": "4"
            }
          ]
        },
        {
          "ROD_GR": {
            "rod_gr": "3",
            "rod_gr_name": "Нефть и нефтепродукты"
          }
        },
        {
          "ROD_VAG": {
            "rod_vag": "",
            "rod_vag_name": "",
            "rod_vag_fname": ""
          }
        },
        {
          "RPS_OWNER": {
            "rps_owner_okpo": "",
            "rps_owner_name": ""
          }
        },
        {
          "OTPR": {
            "otpr_okpo_list": "98770511",
            "otpr_name": "ООО \"Газпромнефть-Логистика\""
          }
        }
      ],
      "ID_AND_TIME": {
        "id": 2026051215373684,
        "date": "2026-05-12",
        "time": "2026-05-12 15:37:36.845978+03",
        "future": "2100-01-01 00:00:00"
      }
    }
  }

  rows.value = toArray(data?.VFPDataSet?.ROWDATA?.[0]?.PFM ?? [])
    .map((item: PfmRow2) => {
      delete item.tarif
      delete item.tar_rast
      delete item.tarif_group
      delete item.gr_state_name
      delete item.not_wl_limit
      delete item.pay_claim_id
      delete item.claim_date
      delete item.pay_date
      delete item.st_ot_fname
      delete item.st_nz_fname
      delete item.rd_ot_fname
      delete item.rd_nz_fname
      delete item.type_soob_name
      delete item.type_ot_old
      delete item.type_ot_mnemo
      delete item.type_ot_num
      delete item.type_nz_mnemo
      delete item.type_nz_num
      delete item.ways_private_name
      delete item.otpr_okpo_list
      delete item.gr_code
      delete item.gr_name

      return item
    })
    .filter((item) => item.marsh_id)

  setTimeout(() => {
    if (!rows.value || !rows.value.length) {
      emitter.emit('toast', { detail: 'По заданным фильтрам маршрутов не найдено' })
      return
    }

    if (last_selected_id != 0) {
      selected_rows.value = rows.value.filter((item) => item.marsh_id == last_selected_id)

      setTimeout(() => {
        selected_rows.value = rows.value.filter((item) => item.marsh_id == last_selected_id)
      }, 500)
    }
  }, 500)

  is_main_loading.value = false
}

</script>
