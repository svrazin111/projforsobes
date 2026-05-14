<template>
  <div class="flex flex-col gap-2 pr-2">
    <div class="box">
      <div class="font-semibold" style="width: 200px">Станция формирования</div>
      <div class="text-[#0000BB]">{{ props.row.st_ot_esr }}</div>
      <div class="text-[#0000BB]">{{ props.row.st_ot_name }}</div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Станция назначения</div>
      <div class="text-[#0000BB]">{{ props.row.st_nz_esr }}</div>
      <div class="text-[#0000BB]">{{ props.row.st_nz_name }}</div>
    </div>
    <div class="box">
      <div style="color: blue; font-weight: 600">Кол-во станций, освобожденных от переработки</div>
      <div class="border ml-3 text-center w-10">{{ props.st_perer_count }}</div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Тип по отправлению</div>
      <div class="text-[#0000BB]">{{ props.row.type_ot_name }}</div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Тип по прибытию</div>
      <div class="text-[#0000BB]">{{ props.row.type_nz_name }}</div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Вид маршрута</div>
      <div class="text-[#0000BB]">{{ props.row.gr_state_mnemo }}</div>
    </div>
    <StationsMultiSelector
      v-if="props.row.type_ot == '2' || props.row.type_ot == '9'"
      label="Станции погрузки"
      v-model="st_pogr_copy"
      locked
    />
    <StationsMultiSelector
      v-if="props.row.type_nz == '12'"
      label="Станции назначения вагонов маршрута в расформировании"
      v-model="st_rasf_copy"
      :diapasones="st_rasf_diapasones_copy"
      locked
    />

    <div class="box flex items-center">
      <Checkbox v-model="on_time_tab_value" binary size="small" />
      <div class="font-semibold">По расписанию</div>
    </div>
    <div class="box flex items-center">
      <Checkbox v-model="inno_vag_value" binary size="small" />
      <div class="font-semibold">Из инновационных вагонов</div>
    </div>
    <StationsMultiSelector label="Станции заадресовки" v-model="st_zaadres_copy" locked />
    <CargoSelector v-model="cargo_copy" locked />

    <div class="box" :class="{ empty: props.rps.length == 0 || !props.rps[0]['rod_vag'] }">
      <div class="font-semibold" style="width: 200px">Род подвижного состава</div>
      <div>
        <div v-for="rps in props.rps" :key="rps.rod_vag" class="text-[#0000BB] mb-1">
          {{ rps.rod_vag }} {{ rps.rod_vag_fname }}
        </div>
      </div>
    </div>
    <div class="box" :class="{ empty: !props.row.prop_type_name }">
      <div
        v-tooltip.bottom="'Тип собственности подвижного состава'"
        class="font-semibold"
        style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        Тип собственности подвижного состава
      </div>
      <div class="text-[#0000BB]">{{ props.row.prop_type_name }}</div>
    </div>
    <div
      class="box"
      :class="{ empty: props.owners.length == 0 || !props.owners[0]['rps_owner_okpo'] }"
    >
      <div
        v-tooltip.bottom="'Владелец/оператов подвижного состава'"
        class="font-semibold"
        style="width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
      >
        Владелец/оператов подвижного состава
      </div>
      <div>
        <div v-for="owner in props.owners" :key="owner.rps_owner_okpo" class="text-[#0000BB] mb-1">
          {{ owner.rps_owner_okpo }} {{ owner.rps_owner_name }}
        </div>
      </div>
    </div>
    <div class="box" :class="{ empty: props.otpr.length == 0 || !props.otpr[0]['otpr_okpo'] }">
      <div class="font-semibold" style="width: 200px">Отправитель</div>
      <div>
        <div v-for="otpr in props.otpr" :key="otpr.otpr_okpo" class="text-[#0000BB] mb-1">
          {{ otpr.otpr_okpo }} {{ otpr.otpr_name }}
        </div>
      </div>
    </div>
    <div class="box" :class="{ empty: !props.row.pol_okpo }">
      <div class="font-semibold" style="width: 200px">Получатель</div>
      <div class="text-[#0000BB]">{{ props.row.pol_okpo }} {{ props.row.pol_name }}</div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Период действия</div>
      <div class="flex text-[#0000BB]">
        <div>{{ dateFormatter(props.row.date_begin) }}</div>
        <img :src="images.chevron_double_right" class="h-3 w-3 ml-2 mr-2" />
        <div>{{ dateFormatter(props.row.date_end) }}</div>
      </div>
    </div>
    <div class="box">
      <div class="font-semibold" style="width: 200px">Накопление маршрута</div>
      <div class="text-[#0000BB]">{{ props.row.ways_private_mnemo }}</div>
    </div>
    <div class="box" :class="{ empty: !props.row.pogr_owner_okpo }">
      <div class="font-semibold" style="width: 200px">Владелец пути по погрузке</div>
      <div class="text-[#0000BB]">
        {{ props.row.pogr_owner_okpo }} {{ props.row.pogr_owner_name }}
      </div>
    </div>
    <div class="box" :class="{ empty: !props.row.vigr_owner_okpo }">
      <div class="font-semibold" style="width: 200px">Владелец пути по выгрузке</div>
      <div class="text-[#0000BB]">
        {{ props.row.vigr_owner_okpo }} {{ props.row.vigr_owner_name }}
      </div>
    </div>
    <WeightLength
      :marsh_id="props.row.marsh_id"
      :weight_base="props.row.weight_base"
      :weight_1="props.row.weight_1"
      :weight_2="props.row.weight_2"
      :weight_calc="props.row.weight_calc"
      :len="props.row.len"
      :len_1="props.row.len_1"
      :len_2="props.row.len_2"
      :usl_len_base="props.row.usl_len_base"
      :usl_len_1="props.row.usl_len_1"
      :usl_len_2="props.row.usl_len_2"
      :len_calc="props.row.len_calc"
      :weights="props.weights"
      :lengths="props.lengths"
      :wl_limit="wl_limit_copy"
      locked
    />
    <div class="box" :class="{ empty: !props.row.norm_doc }">
      <div class="font-semibold" style="width: 200px">Нормативные документы</div>
      <div class="text-[#0000BB]">
        {{ props.row.norm_doc }} от {{ dateFormatter(props.row.doc_date) }}
      </div>
    </div>
    <div class="box" :class="{ empty: !props.row.comments }">
      <div class="font-semibold" style="width: 200px">Примечание</div>
      <div class="text-[#0000BB]">{{ props.row.comments }}</div>
    </div>
    <div class="box" :class="{ empty: props.nnit.length == 0 || !props.nnit[0].nnit }">
      <div class="font-semibold" style="width: 200px">Номера ниток</div>
      <div>
        <div v-for="nnit in props.nnit" :key="nnit.nnit" class="mb-1 text-[#0000BB]">
          {{ nnit.nnit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { Checkbox } from 'primevue'
import { computed } from 'vue'

import CargoSelector from '@/components/selector/CargoSelector.vue'
import StationsMultiSelector from '@/components/selector/station/StationsMultiSelector.vue'
import { forever, parseDateDDMMYYYY } from '@/shared/date'
import images from '@/shared/images/imported_images'
import { Station } from '@/types/station'

import { Cargo, Lengths, Nnit, Otpr, Owners, PfmRow, PfSt, Rps, Weights } from '../../const/types'
import WeightLength from './components/WeightLength.vue'

const props = withDefaults(
  defineProps<{
    row: PfmRow
    pf_st: PfSt[]
    st_pogr: Station[]
    st_rasf: Station[]
    st_rasf_diapasones: string[]
    st_zaadres: Station[]
    rps: Rps[]
    owners: Owners[]
    otpr: Otpr[]
    cargo: Cargo[]
    nnit: Nnit[]
    weights: Weights[]
    lengths: Lengths[]
    st_perer_count: number
  }>(),
  {
    pf_st: () => [],
    st_pogr: () => [],
    st_rasf: () => [],
    st_rasf_diapasones: () => [],
    st_zaadres: () => [],
    rps: () => [],
    owners: () => [],
    otpr: () => [],
    cargo: () => [],
    nnit: () => [],
    weights: () => [],
    lengths: () => [],
    st_perer_count: 0
  }
)

const wl_limit_copy = computed(() => {
  if (props.row.wl_limit == '0') {
    return 'or'
  }
  return 'and'
})

const st_pogr_copy = computed(() => {
  return cloneDeep(props.st_pogr)
})
const st_rasf_copy = computed(() => {
  return cloneDeep(props.st_rasf)
})
const st_rasf_diapasones_copy = computed(() => {
  return cloneDeep(props.st_rasf_diapasones)
})
const st_zaadres_copy = computed(() => {
  return cloneDeep(props.st_zaadres)
})
const cargo_copy = computed(() => {
  return cloneDeep(props.cargo)
})
const inno_vag_value = computed(() => {
  return props.row.inno_vag == '1'
})
const on_time_tab_value = computed(() => {
  return props.row.on_time_tab == '1'
})

const dateFormatter = (date_string: string) => {
  const date = new Date(date_string)
  if (String(date) == 'Invalid Date') return ''
  if (date >= forever()) {
    return 'До отмены'
  }
  return parseDateDDMMYYYY(date)
}
</script>

<style scoped>
.box {
  display: flex;
  border: solid lightgray 1px;
  background-color: white;
  border-radius: 4px;
  padding: 2px;
  gap: 8px;
  font-size: 10px;
}
.empty {
  opacity: 0.5;
}
</style>
