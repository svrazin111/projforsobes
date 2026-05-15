<template>
  <FiltersPanel
    v-if="props.row"
    ref="accordion"
    class="marsh-view-panel"
    single
    hide_count
    show_dots
    open_first
    title_color="#197c17"
    :filters="filters"
  >
    <template v-slot:params>
      <ScrollPanel class="w-full" style="height: calc(100vh - 290px)">
        <Params
          v-if="props.row"
          :row="props.row"
          :pf_st="pf_st"
          :st_rasf="st_rasf"
          :st_rasf_diapasones="st_rasf_diapasones"
          :st_pogr="st_pogr"
          :st_zaadres="st_zaadres"
          :rps="rps"
          :owners="owners"
          :otpr="otpr"
          :cargo="cargo"
          :nnit="nnit"
          :weights="weights"
          :lengths="lengths"
          :st_perer_count="st_perer_count"
        />
      </ScrollPanel>
    </template>
    <template v-slot:path-way>
      <PathWay
        v-if="pfm_st"
        :row="props.row"
        :pfm_st="pfm_st"
        :pf_st="pf_st"
        :ways_full="ways_full"
        :ways_pf_full="ways_pf_full"
        :way_vars="way_vars"
        v-model:var_num="var_num"
      />
    </template>
    <template v-slot:economy>
      <Economy
        v-if="props.row && var_num"
        :ways_full="ways_full"
        :ways_pf_full="ways_pf_full"
        :var_num="var_num?.var_num"
      />
    </template>
    <template v-slot:documents>
      <Documents v-model="docs" :marsh_id="props.row.marsh_id" :is_edit="false" />
    </template>
  </FiltersPanel>
</template>

<script setup lang="ts">
import { ScrollPanel } from 'primevue'
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue'

import { useStationStore } from '@/app/plugins/pinia/station'
import FiltersPanel from '@/components/layout/FiltersPanel.vue'
import { Station } from '@/types/station'

import { getRowData, stPererCount } from '../const/functions'
import {
  Cargo,
  Docs,
  Lengths,
  Nnit,
  Otpr,
  Owners,
  PfmRow,
  PfmSt,
  PfSt,
  Rps,
  WayFull,
  WayPfFull,
  WayVars,
  Weights
} from '../const/types'
import Documents from './Documents/Documents.vue'
import Economy from './Economy.vue'
import Params from './Params/Params.vue'
import PathWay from './PathWay/PathWay.vue'

const props = withDefaults(
  defineProps<{
    row?: PfmRow
  }>(),
  {
    row: undefined
  }
)

const accordion = useTemplateRef('accordion')

const filters = computed(() => [
  {
    title: `Основные характеристики ${props.row?.st_ot_name ?? ''} -> ${props.row?.st_nz_name ?? ''} ${props.row?.rod_gr_name ?? ''}`,
    slot: 'params',
    value: []
  },
  { title: 'Путь следования', slot: 'path-way', value: [] },
  { title: 'Экономика', slot: 'economy', value: [] },
  { title: 'Прикрепленные документы', slot: 'documents', value: [] }
])

const st_perer_count = computed(() => stPererCount(pf_st.value))
const pfm_st = ref<PfmSt[]>([])
const pf_st = ref<PfSt[]>([])
const ways_full = ref<WayFull[]>([])
const ways_pf_full = ref<WayPfFull[]>([])
const way_vars = ref<WayVars[]>([])
const var_num = ref<WayVars>({ var_num: 1, var_name: 'Основной' })
const st_rasf = ref<Station[]>([])
const st_rasf_diapasones = ref<string[]>([])
const st_pogr = ref<Station[]>([])
const st_zaadres = ref<Station[]>([])
const rps = ref<Rps[]>([])
const owners = ref<Owners[]>([])
const otpr = ref<Otpr[]>([])
const cargo = ref<Cargo[]>([])
const nnit = ref<Nnit[]>([])
const weights = ref<Weights[]>([])
const lengths = ref<Lengths[]>([])
const docs = ref<Docs[]>([])

watch(
  () => props,
  async () => {
    if (!props.row) return

    const data = await getRowData(props.row.marsh_id)

    pfm_st.value = data.pfm_st
    pf_st.value = data.pf_st
    ways_full.value = data.ways_full
    ways_pf_full.value = data.ways_pf_full
    way_vars.value = data.way_vars
    st_rasf.value = data.rasform.map((item) => {
      return useStationStore().getBy('stan_id', item.stan_id)[0]
    })
    st_rasf_diapasones.value = data.rasf_diapasones
    st_pogr.value = data.pogr.map((item) => {
      return useStationStore().getBy('stan_id', item.stan_id)[0]
    })
    st_zaadres.value = data.st_zaadres
    rps.value = data.rps
    owners.value = data.owners
    otpr.value = data.otpr
    cargo.value = data.cargo
    nnit.value = data.nnit
    weights.value = data.weights
    lengths.value = data.lengths
    docs.value = data.docs

    nextTick(() => {
      accordion.value?.openFirstIfNoneIsOpen()
    })
  },
  { deep: true }
)
</script>

<style scoped>
.marsh-view-panel {
  border: 1px solid #a9b19f;
  background: #f8f9f3;
}

.marsh-view-panel :deep(.p-accordionpanel) {
  border-color: #b8c0ad;
}

.marsh-view-panel :deep(.p-accordionheader) {
  min-height: 22px;
  padding: 2px 6px;
  border-radius: 0;
  color: #197c17;
  font-weight: 700;
}

.marsh-view-panel :deep(.p-accordioncontent-content) {
  padding: 0;
  background: #f8f9f3;
}

.marsh-view-panel :deep(.p-scrollpanel-content) {
  background: #f8f9f3;
}
</style>
