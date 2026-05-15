<template>
  <div class="params-layout">
    <div class="box field-row station-row">
      <div class="field-label">Станция формирования</div>
      <div class="field-code">{{ props.row.st_ot_esr }}</div>
      <div class="field-value">{{ props.row.st_ot_name }}</div>
    </div>
    <div class="box field-row station-row">
      <div class="field-label">Станция назначения</div>
      <div class="field-code">{{ props.row.st_nz_esr }}</div>
      <div class="field-value">{{ props.row.st_nz_name }}</div>
    </div>
    <div class="box field-row count-row">
      <div class="field-label field-label-blue">Количество станций освобождаемых от переработки</div>
      <div class="field-code field-count">{{ props.st_perer_count }}</div>
    </div>
    <div class="box field-row select-row">
      <div class="field-label">Тип по отправлению/прибытию</div>
      <div class="field-wide">{{ props.row.type_ot_name }}</div>
    </div>
    <div class="box field-row select-row field-row-offset">
      <div class="field-wide">{{ props.row.type_nz_name }}</div>
    </div>
    <div class="checkbox-block">
      <div class="checkbox-row">
        <Checkbox v-model="on_time_tab_value" binary size="small" />
        <span>по расписанию</span>
      </div>
      <div class="checkbox-row">
        <Checkbox v-model="inno_vag_value" binary size="small" />
        <span>из инновационных вагонов</span>
      </div>
    </div>
    <StationsMultiSelector
      v-if="props.row.type_ot == '2' || props.row.type_ot == '9'"
      class="params-table-field"
      label="Станции погрузки"
      v-model="st_pogr_copy"
      locked
    />
    <StationsMultiSelector
      v-if="props.row.type_nz == '12'"
      class="params-table-field"
      label="Станции назначения вагонов маршрута в расформировании"
      v-model="st_rasf_copy"
      :diapasones="st_rasf_diapasones_copy"
      locked
    />

    <div class="readonly-table-row">
      <div class="field-label">Станции заадресовки</div>
      <div class="readonly-table stations-table">
        <div class="readonly-body">
          <div v-for="station in st_zaadres_copy" :key="station.stan_id" class="readonly-grid-3">
            <div>{{ station.esr }}</div>
            <div>{{ station.vname }}</div>
            <div>{{ station.road_name }}</div>
          </div>
          <div v-for="index in emptyZaadresRows" :key="`empty-${index}`" class="readonly-grid-3">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    </div>

    <div class="box field-row select-row route-type-row">
      <div class="field-label">Вид маршрута</div>
      <div class="field-wide route-type-value">{{ props.row.gr_state_mnemo }}</div>
    </div>

    <div class="cargo-section">
      <div class="section-label">Род/Группа/Код груза</div>
      <div class="cargo-grid">
        <div class="cargo-head">
          <div>Нефть и нефтепродукты</div>
          <div>Нефтепродукты темные</div>
          <div></div>
          <div></div>
        </div>
        <div class="cargo-body">
          <div v-for="cargo in cargo_copy" :key="cargo.num" class="cargo-row">
            <div>{{ cargo.rod_gr_name }}</div>
            <div>{{ cargo.group_gr_name }}</div>
            <div>{{ cargo.cod_gr }}</div>
            <div>{{ cargo.gr_vname }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="box rps-row" :class="{ empty: props.rps.length == 0 || !props.rps[0]['rod_vag'] }">
      <div class="field-label">Род подвижного состава</div>
      <div class="field-value field-value-large">
        <div v-for="rps in props.rps" :key="rps.rod_vag" class="text-[#0000BB] mb-1">
          {{ rps.rod_vag }} {{ rps.rod_vag_fname }}
        </div>
      </div>
      <div class="side-actions">
        <span class="side-action add"></span>
        <span class="side-action remove"></span>
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
      class="params-weight-length"
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
const emptyZaadresRows = computed(() => {
  return Math.max(3 - st_zaadres_copy.value.length, 0)
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
  min-height: 22px;
  align-items: center;
  border: none;
  background-color: transparent;
  border-radius: 0;
  padding: 1px 14px 1px 22px;
  gap: 4px;
  font-size: 10px;
}

.params-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
  align-items: start;
  gap: 7px 10px;
  padding: 14px 10px 8px 10px;
  background: #f8f9f3;
  color: #3b3b3b;
  font-size: 9px;
  font-weight: 600;
}

.params-layout > * {
  min-width: 0;
}

.field-row {
  display: grid;
  grid-template-columns: 168px 50px minmax(0, 1fr);
  column-gap: 4px;
  align-items: center;
}

.field-label {
  color: #454545;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.1;
  white-space: nowrap;
}

.field-label-blue {
  color: #0000bb;
}

.field-code,
.field-value,
.field-wide {
  min-height: 18px;
  border: 1px solid #c1c8bb;
  background: #fff;
  color: #0000bb;
  font-size: 9px;
  font-weight: 400;
  line-height: 16px;
  padding: 1px 5px;
}

.field-code {
  text-align: center;
}

.field-wide {
  grid-column: 2 / 4;
}

.field-row-offset {
  grid-template-columns: 168px minmax(0, 1fr);
  padding-top: 0;
}

.field-row-offset .field-wide {
  grid-column: 2;
}

.field-count {
  border-color: #0000bb;
  font-weight: 700;
}

.count-row {
  grid-template-columns: auto 50px 1fr;
  padding-top: 2px;
  padding-bottom: 2px;
}

.checkbox-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-left: 196px;
  padding-top: 1px;
  padding-bottom: 4px;
  color: #8d8d8d;
  font-size: 9px;
  font-weight: 400;
}

.checkbox-row {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 17px;
}

.checkbox-row :deep(.p-checkbox) {
  width: 11px;
  height: 11px;
}

.checkbox-row :deep(.p-checkbox-box) {
  width: 11px;
  height: 11px;
  border-radius: 1px;
}

.readonly-table-row {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  column-gap: 4px;
  align-items: start;
  padding: 10px 14px 10px 22px;
}

.readonly-table {
  min-height: 64px;
  border: 1px solid #b8bfb0;
  background: #fff;
}

.readonly-body > div {
  display: grid;
}

.readonly-grid-3 {
  grid-template-columns: 60px 1fr 70px;
}

.readonly-body > div > div {
  min-height: 19px;
  border-right: 1px solid #d8ded1;
  border-bottom: 1px solid #d8ded1;
  padding: 2px 4px;
}

.route-type-row {
  margin-top: 6px;
}

.route-type-value {
  max-width: 146px;
}

.cargo-section {
  padding: 2px 12px 10px 0;
}

.section-label {
  margin-bottom: 6px;
  padding-left: 2px;
  color: #454545;
  font-weight: 700;
}

.cargo-grid {
  min-height: 124px;
  border: 1px solid #7f9b3f;
  background: #fff;
}

.cargo-head,
.cargo-row {
  display: grid;
  grid-template-columns: minmax(88px, 1fr) minmax(96px, 1fr) 54px minmax(132px, 1.4fr);
}

.cargo-head {
  min-height: 29px;
  background: #75a31a;
  color: #183f00;
  font-size: 9px;
  font-weight: 700;
}

.cargo-head > div,
.cargo-row > div {
  min-height: 29px;
  border-right: 1px solid #b9c993;
  border-bottom: 1px solid #d8ded1;
  padding: 2px 5px;
}

.cargo-body {
  min-height: 94px;
}

.rps-row {
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr) 18px;
  align-items: start;
}

.field-value-large {
  min-height: 42px;
}

.side-actions {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-left: auto;
}

.side-action {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #a8cfa3;
  background: #e8f7e1;
}

.side-action.add::before {
  content: '+';
  display: block;
  color: #3aa52b;
  font-weight: 700;
  line-height: 13px;
  text-align: center;
}

.side-action.remove {
  border-color: #e2ada4;
  background: #fff1ed;
}

.side-action.remove::before {
  content: '×';
  display: block;
  color: #cf4a2e;
  font-weight: 700;
  line-height: 12px;
  text-align: center;
}

.params-layout :deep(.p-datatable) {
  max-width: 100%;
}

.params-layout :deep(.p-datatable-table-container) {
  overflow-x: auto;
}

.params-table-field,
.params-cargo-field,
.params-weight-length {
  padding: 5px 16px 3px 18px;
}

.params-table-field :deep(.font-semibold),
.params-cargo-field :deep(.font-semibold),
.params-weight-length :deep(.font-semibold) {
  color: #4d4d4d !important;
  font-size: 10px !important;
}

.params-table-field :deep(.p-datatable),
.params-cargo-field :deep(.p-datatable) {
  border-color: #b8bfb0 !important;
  border-radius: 0 !important;
}

.params-table-field :deep(.p-datatable-header-cell),
.params-table-field :deep(.p-datatable-thead > tr > th) {
  background: #f5f5f2 !important;
  color: #555 !important;
}

.params-cargo-field :deep(.p-datatable-header-cell),
.params-cargo-field :deep(.p-datatable-thead > tr > th) {
  background: #75a31a !important;
  color: #173a00 !important;
  font-weight: 700;
}

.params-table-field :deep(.p-datatable-tbody > tr > td),
.params-cargo-field :deep(.p-datatable-tbody > tr > td) {
  border-color: #d8ded1 !important;
  background: white !important;
}

.params-cargo-field :deep(.p-datatable) {
  min-height: 124px;
}

.params-weight-length {
  opacity: 0.9;
}

.empty {
  opacity: 0.5;
}
</style>
