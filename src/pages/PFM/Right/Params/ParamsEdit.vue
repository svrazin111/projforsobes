<template>
  <div class="flex justify-between w-full pr-3 mb-4 mt-1">
    <div class="flex flex-col gap-3" style="width: 500px !important">
      <StationSelector
        label="Станция формирования"
        v-model="st_ot"
        required
        small
        :disabled="is_approved"
      />
      <StationSelector
        label="Станция назначения"
        v-model="st_nz"
        required
        small
        :disabled="is_approved"
      />

      <div class="flex text-[12px] font-semibold">
        <div class="text-[#0000BB] ml-3">Кол-во станций, освобожденных от переработки</div>
        <div class="border ml-3 text-center pl-2 pr-2 h-5">{{ props.st_perer_count }}</div>
      </div>

      <TypeByOtprSelector v-model="type_ot" small :disabled="is_approved" />
      <TypeByPribSelector v-model="type_nz" small :disabled="is_approved" />

      <GrStateSelector v-model="gr_state" required small :disabled="is_approved" />

      <StationsMultiSelector
        v-if="type_ot && (type_ot.type_ot == '2' || type_ot.type_ot == '9')"
        label="Станции погрузки"
        v-model="st_pogr"
      />

      <RasformEdit
        ref="rasform"
        v-if="type_nz && type_nz.type_nz == '12'"
        v-model="st_rasf"
        v-model:diapasones="st_rasf_diapasones"
        v-model:variant="st_rast_variant"
      />

      <div class="flex gap-4">
        <div>
          <Checkbox v-model="on_time_tab" binary size="small" class="mb-1" />
          <span class="ml-2">По расписанию</span>
        </div>
        <div>
          <Checkbox v-model="inno_vag" binary size="small" class="mb-1" />
          <span class="ml-2">Из инновационных вагонов</span>
        </div>
      </div>

      <StationsMultiSelector label="Станции заадресовки" v-model="st_zaadres" />

      <CargoSelector v-model="cargo" small />
      <RPSSelector v-model="rps" small />
      <RPSOwnerTypeSelector v-model="rps_owner_type" small />
      <RPSOwnerSelector v-model="rps_owner" small />

      <OrganizationMultiSelector v-model="sender" label="Отправитель" />
      <OrganizationSelector v-model="reciever" label="Получатель" small />
    </div>

    <div class="flex flex-col gap-3" style="width: 500px !important">
      <WaysPrivateSelector v-model="ways_private" required small />
      <OrganizationSelector v-model="pogr_owner" label="Владелец пути по погрузке" small />
      <OrganizationSelector v-model="vigr_owner" label="Владелец пути по выгрузке" small />
      <WeightLength
        :st_ot_id="st_ot.stan_id"
        :gr_state="gr_state?.gr_state"
        :rod_vag="rps[0]?.rod_vag"
        :rod_gr="cargo[0]?.rod_gr"
        :group_gr="cargo[0]?.group_gr"
        :cod_gr="cargo[0]?.cod_gr"
        :old_row="props.old_row"
        :marsh_id="props.old_row ? props.old_row?.marsh_id : props.marsh_id"
        v-model:weight_base_model="weight_base"
        v-model:weight_1_model="weight_1"
        v-model:weight_2_model="weight_2"
        v-model:weight_calc_model="weight_calc"
        v-model:len_model="len"
        v-model:len_1_model="len_1"
        v-model:len_2_model="len_2"
        v-model:usl_len_base_model="usl_len_base"
        v-model:usl_len_1_model="usl_len_1"
        v-model:usl_len_2_model="usl_len_2"
        v-model:len_calc_model="len_calc"
        v-model:weights_model="weights"
        v-model:lengths_model="lengths"
        v-model:wl_limit_model="wl_limit"
        :way_vars="props.way_vars"
      />
      <div class="w-full">
        <div class="font-semibold text-[#0000BB] text-[12px]">Нормативные документы</div>
        <div class="flex gap-0.5">
          <InputText v-model="docs" class="w-full h-[22px] !rounded-[2px]" size="small" />
          <DatePicker v-model="doc_date" showIcon size="small" update-model-type="date" />
        </div>
      </div>
      <div class="w-full">
        <div class="font-semibold text-[#0000BB] text-[12px]">Примечание</div>
        <Textarea class="w-full h-24" v-model="comments" />
      </div>
      <MultiSelector
        label="Номера ниток"
        :columns="[{ title: 'Номер нитки', field: 'nnit' }]"
        input
        class="w-full !h-24"
        v-model="nnit"
      />
      <div>
        <div class="text-[#0000BB]">Период действия</div>
        <div>
          <PeriodInput v-model:date_start="date_start" v-model:date_end="date_end" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- !!! Очень вероятно, что поле для веса ядра не работает !!! -->

<script setup lang="ts">
import { XMLBuilder } from 'fast-xml-parser'
import { cloneDeep } from 'lodash'
import { Checkbox, DatePicker, InputText, Textarea } from 'primevue'
import { onMounted, ref, useTemplateRef, watch } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import { useOrganizationStore } from '@/app/plugins/pinia/organization'
import { useStationStore } from '@/app/plugins/pinia/station'
import MultiSelector from '@/components/selector/basic/MultiSelector.vue'
import CargoSelector from '@/components/selector/CargoSelector.vue'
import OrganizationMultiSelector from '@/components/selector/other/OrganizationMultiSelector.vue'
import OrganizationSelector from '@/components/selector/other/OrganizationSelector.vue'
import RPSSelector from '@/components/selector/other/RPSSelector.vue'
import StationSelector from '@/components/selector/station/StationSelector.vue'
import StationsMultiSelector from '@/components/selector/station/StationsMultiSelector.vue'
import { parseDate, parseDateTime } from '@/shared/date'
import { GrState, RpsOwner, TypeForm, TypeNz, TypeOt } from '@/types/filters/filters'
import { Organization } from '@/types/organization'
import { Station } from '@/types/station'

import { Cargo, Lengths, Nnit, PfmRow, PfmRowData2, Rps, WayVars, Weights } from '../../const/types'
import { CombineOptions } from '../../Filters/components/WeightLengthFilter.vue'
import GrStateSelector from './components/GrStateSelector.vue'
import PeriodInput from './components/PeriodInput.vue'
import RasformEdit from './components/RasformEdit.vue'
import RPSOwnerSelector from './components/RPSOwnerSelector.vue'
import RPSOwnerTypeSelector from './components/RPSOwnerTypeSelector.vue'
import TypeByOtprSelector from './components/TypeByOtprSelector.vue'
import TypeByPribSelector from './components/TypeByPribSelector.vue'
import WaysPrivateSelector from './components/WaysPrivateSelector.vue'
import WeightLength from './components/WeightLength.vue'

const props = defineProps<{
  marsh_id: string
  way_vars: WayVars[]
  old_row?: PfmRow
  old_data?: PfmRowData2
  form_type: 'create' | 'edit' | 'achive' | 'copy' | 'copy_with_docs'
  st_perer_count: number
}>()

type RpsOwnerType = {
  code: number
  name: string
}

const rasf_com = useTemplateRef('rasform')

const st_ot = defineModel<Station>('st_ot', { default: {} })
const st_nz = defineModel<Station>('st_nz', { default: {} })
const type_ot = ref<TypeOt>()
const type_nz = ref<TypeNz>()
const st_rasf = ref<Station[]>([])
const st_rasf_diapasones = ref<string>('')
const st_rast_variant = ref<'Диапазоны' | 'Станции'>('Станции')
const st_pogr = ref<Station[]>([])
const on_time_tab = ref(false)
const inno_vag = ref(false)
const st_zaadres = ref<Station[]>()
const gr_state = ref<GrState>()
const cargo = ref<Cargo[]>([])
const rps = ref<Rps[]>([])
const rps_owner_type = ref<RpsOwnerType>()
const rps_owner = ref<RpsOwner[]>([])
const sender = ref<Organization[]>([])
const reciever = ref<Organization>()
const ways_private = ref<TypeForm>()
const pogr_owner = ref<Organization>()
const vigr_owner = ref<Organization>()
const date_start = ref<Date>()
const date_end = ref<Date>()
const weight_base = defineModel<string>('weight_base', { default: '' })
const weight_1 = ref<string>()
const weight_2 = ref<string>()
const weight_calc = defineModel<string>('weight_calc', { default: '' })
const len = defineModel<string>('len', { default: '' })
const len_1 = ref<string>()
const len_2 = ref<string>()
const usl_len_base = ref<string>()
const usl_len_1 = ref<string>()
const usl_len_2 = ref<string>()
const len_calc = defineModel<string>('len_calc', { default: '' })
const weights = ref<Weights[]>([])
const lengths = ref<Lengths[]>([])
const wl_limit = ref<CombineOptions>()
const docs = ref<string>()
const doc_date = ref<Date>()
const comments = ref<string>()
const nnit = ref<Nnit[]>([])

const st_ot_id = defineModel<string>('st_ot_id', { default: '' })
const gr_state_str = defineModel<string>('gr_state', { default: '' })
const rod_vag = defineModel<string>('rod_vag', { default: '' })
const rod_gr = defineModel<string>('rod_gr', { default: '' })
const group_gr = defineModel<string>('group_gr', { default: '' })
const cod_gr = defineModel<string>('cod_gr', { default: '' })

watch(
  () => [st_ot, gr_state, cargo],
  () => {
    st_ot_id.value = st_ot.value?.stan_id ?? ''
    gr_state_str.value = gr_state.value?.gr_state ?? ''
    rod_vag.value = rps.value[0]?.rod_vag ?? ''
    rod_gr.value = cargo.value[0]?.rod_gr ?? ''
    group_gr.value = cargo.value[0]?.rod_gr ?? ''
    cod_gr.value = cargo.value[0]?.cod_gr ?? ''
  },
  { deep: true }
)

const is_valid = defineModel<boolean>('is_valid', { default: false })
const isValid = () => {
  if (!st_ot.value) return false
  if (!st_nz.value) return false
  if (!type_ot.value) return false
  if (!type_nz.value) return false
  if (
    type_nz.value.type_nz == '12' &&
    st_rast_variant.value == 'Диапазоны' &&
    rasf_com.value &&
    !rasf_com.value.is_valid
  )
    return false
  if (!gr_state.value) return false
  if (!ways_private.value) return false
  if (!date_start.value) return false
  if (!date_end.value) return false

  return true
}

const required_params_changed = defineModel<boolean>('required_params_changed', { default: true })

watch(
  [
    st_ot,
    st_nz,
    weight_base,
    weight_1,
    weight_2,
    weight_calc,
    len,
    len_1,
    len_2,
    usl_len_base,
    usl_len_1,
    usl_len_2,
    len_calc,
    weights,
    lengths,
    wl_limit
  ],
  () => {
    setTimeout(() => {
      required_params_changed.value = true
    }, 100)
  },
  { deep: true }
)

watch(
  [
    st_ot,
    st_nz,
    type_ot,
    type_nz,
    st_rasf_diapasones,
    st_rast_variant,
    gr_state,
    ways_private,
    date_start,
    date_end
  ],
  () => {
    setTimeout(() => {
      is_valid.value = isValid()
    }, 100)
  },
  { deep: true }
)

const is_weights_valid = defineModel<boolean>('is_weights_valid', { default: false })
const isWeightsValid = () => {
  let valid = true
  weights.value.forEach((item) => {
    if (!item.var_num || item.var_num == '') valid = false
  })

  return valid
}

watch(
  () => weights.value,
  () => {
    is_weights_valid.value = isWeightsValid()
  },
  { deep: true }
)

const is_approved = ref(false)

onMounted(() => {
  if (!props.old_row || !props.old_data) return
  if (props.form_type == 'create') return

  if (props.form_type == 'edit' && props.old_row.status == '1') is_approved.value = true

  const stations = useStationStore()
  const organizations = useOrganizationStore()
  const filters_store = useFiltersStore().get()
  if (!filters_store) return

  st_ot.value = stations.getBy('stan_id', props.old_row.st_ot_id)[0]
  st_nz.value = stations.getBy('stan_id', props.old_row.st_nz_id)[0]

  type_ot.value = filters_store.TYPE_OT.filter((item) => item.type_ot == props.old_row?.type_ot)[0]
  type_nz.value = filters_store.TYPE_NZ.filter((item) => item.type_nz == props.old_row?.type_nz)[0]

  st_rasf.value = props.old_data.rasform.map((item) => {
    return stations.getBy('stan_id', item.stan_id)[0]
  })

  st_rasf_diapasones.value = props.old_data.rasf_diapasones.join('\n')

  st_pogr.value = props.old_data.pogr.map((item) => {
    return stations.getBy('stan_id', item.stan_id)[0]
  })

  inno_vag.value = props.old_row.inno_vag == '1'
  on_time_tab.value = props.old_row.on_time_tab == '1'

  st_zaadres.value = props.old_data.st_zaadres

  gr_state.value = filters_store.GR_STATE.filter(
    (item) => item.gr_state == props.old_row?.gr_state
  )[0]

  cargo.value = props.old_data.cargo

  rps.value = props.old_data.rps

  rps_owner_type.value = useFiltersStore()
    .getRpsOwnerTypes()
    .filter((item) => item.code == Number(props.old_row?.prop_type))[0]

  rps_owner.value = props.old_data.owners.map(
    (item) =>
      filters_store.RPS_OWNER.filter((item2) => item2.rps_owner_okpo == item.rps_owner_okpo)[0]
  )

  sender.value = props.old_data.otpr.map((item) => organizations.getBy('code', item.otpr_okpo)[0])
  reciever.value = organizations.getBy('code', props.old_row.pol_okpo)[0]

  ways_private.value = filters_store.TYPE_FORM.filter(
    (item) => item.ways_private == props.old_row.ways_private
  )[0]

  pogr_owner.value = organizations.getBy('code', props.old_row.pogr_owner_okpo)[0]
  vigr_owner.value = organizations.getBy('code', props.old_row.vigr_owner_okpo)[0]

  date_start.value = new Date(props.old_row.date_begin)
  date_end.value = new Date(props.old_row.date_end)

  if (props.form_type == 'achive') {
    date_start.value = new Date()
  }

  weight_base.value = props.old_row.weight_base
  weight_1.value = props.old_row.weight_1
  weight_2.value = props.old_row.weight_2
  weight_calc.value = props.old_row.weight_calc
  len.value = props.old_row.len
  len_1.value = props.old_row.len_1
  len_2.value = props.old_row.len_2
  usl_len_base.value = props.old_row.usl_len_base
  usl_len_1.value = props.old_row.usl_len_1
  usl_len_2.value = props.old_row.usl_len_2
  len_calc.value = props.old_row.len_calc
  weights.value = props.old_data.weights
  lengths.value = props.old_data.lengths

  if (props.old_row.wl_limit == '0') {
    wl_limit.value = 'or'
  } else wl_limit.value = 'and'

  docs.value = props.old_row.norm_doc
  if (props.old_row.doc_date) {
    doc_date.value = new Date(props.old_row.doc_date)
  }

  comments.value = props.old_row.comments

  nnit.value = props.old_data.nnit
})

const getWLLimit = () => {
  if (wl_limit.value == 'and') return '1'
  if (wl_limit.value == 'or') return '0'
  return ''
}
const getTypeSoob = (adm_ot: number, adm_nz: number, rd_ot: number, rd_nz: number) => {
  if (adm_ot != adm_nz) return 1
  else if (adm_ot == 20 && adm_nz == 20 && rd_ot != rd_nz) return 2
  else if (adm_ot == 20 && adm_nz == 20 && rd_ot == rd_nz) return 3
  else return ''
}

const getMarshData = () => {
  if (!isValid()) {
    emitter.emit('toast', { detail: 'Неверно заполнены основные параметры' })
    return
  }

  // ! Как все оттестируют, можно будет убрать закомменченные строки
  const marsh = {
    marsh_id: props.marsh_id,
    parent_id: props.old_row?.parent_id ?? '',
    status: props.old_row?.status ?? '0',
    status_comment: props.old_row?.status_comment ?? '',
    moving_count: props.old_row?.moving_count ?? '',
    completed_count: props.old_row?.completed_count ?? '',
    f_completed_count: props.old_row?.f_completed_count ?? '',
    leaved_count: props.old_row?.leaved_count ?? '',
    history_count: props.old_row?.history_count ?? '0',
    from_etran: props.old_row?.from_etran ?? '0',
    ring_flag: props.old_row?.ring_flag ?? '0',

    comments: comments.value ?? '',

    date_begin: parseDateTime(date_start.value),
    date_end: parseDateTime(date_end.value),

    inno_vag: Number(inno_vag.value) ?? '0',
    on_time_tab: Number(on_time_tab.value) ?? '0',

    st_ot_id: st_ot.value.stan_id,
    st_ot_esr: st_ot.value.esr,
    st_ot_name: st_ot.value.name,
    // st_ot_fname: '',

    st_nz_id: st_nz.value.stan_id,
    st_nz_esr: st_nz.value.esr,
    st_nz_name: st_nz.value.name,
    // st_nz_fname: '',

    rd_ot_code: st_ot.value.road_code,
    rd_ot_name: st_ot.value.road_name,
    // rd_ot_fname: '',

    rd_nz_code: st_nz.value.road_code,
    rd_nz_name: st_nz.value.road_name,
    // rd_nz_fname: '',

    adm_ot_code: st_ot.value.adm_code,
    adm_nz_code: st_nz.value.adm_code,

    type_soob: getTypeSoob(
      st_ot.value.adm_code,
      st_nz.value.adm_code,
      st_ot.value.road_code,
      st_nz.value.road_code
    ),
    // type_soob_name: '',

    type_ot: type_ot.value?.type_ot,
    // type_ot_old: '',
    type_ot_name: type_ot.value?.type_ot_name,
    // type_ot_num: type_ot.value.type_ot,
    // type_ot_mnemo: '',

    type_nz: type_nz.value?.type_nz,
    type_nz_name: type_nz.value?.type_nz_name,
    // type_nz_num: type_nz.value.type_nz,
    // type_nz_mnemo: '',

    gr_state: gr_state.value?.gr_state,
    gr_state_mnemo: gr_state.value?.gr_state_mnemo,

    ways_private: ways_private.value?.ways_private ?? '',
    // ways_private_name: ways_private.value?.ways_private_name ?? '',
    // ways_private_mnemo: '',

    rod_vag: rps.value?.[0]?.rod_vag ?? '',
    // rod_vag_name: rps.value?.[0]?.rod_vag_name ?? '',
    // rod_vag_fname: rps.value?.[0]?.rod_vag_fname ?? '',

    prop_type: rps_owner_type.value?.code ?? '',
    prop_type_name: rps_owner_type.value?.name ?? '',

    rps_owner_okpo: rps_owner.value?.[0]?.rps_owner_okpo ?? '',
    rps_owner_name: rps_owner.value?.[0]?.rps_owner_name ?? '',

    otpr_okpo: sender.value?.[0]?.code ?? '',
    // otpr_okpo_list: sender.value?.map(item => item.code).join() ?? '',
    otpr_name: sender.value?.[0]?.name ?? '',

    pol_okpo: reciever.value?.code ?? '',
    pol_name: reciever.value?.name ?? '',

    pogr_owner_okpo: pogr_owner.value?.code ?? '',
    pogr_owner_name: pogr_owner.value?.name ?? '',

    vigr_owner_okpo: vigr_owner.value?.code ?? '',
    vigr_owner_name: vigr_owner.value?.name ?? '',

    rod_gr: cargo.value?.map((item) => item.rod_gr).join() ?? '',
    group_gr: cargo.value?.map((item) => item.group_gr).join() ?? '',
    cod_gr: cargo.value?.map((item) => item.cod_gr).join() ?? '',
    rod_gr_name: cargo.value?.map((item) => item.rod_gr_name).join() ?? '',
    group_gr_name: cargo.value?.map((item) => item.group_gr_name).join() ?? '',
    gr_vname: cargo.value?.map((item) => item.gr_vname).join() ?? '',
    // gr_code: '',
    // gr_name: '',

    weight_base: weight_base.value ?? '',
    weight_1: weight_1.value ?? '',
    weight_2: weight_2.value ?? '',
    weight_calc: weight_calc.value ?? '',
    len: len.value ?? '',
    len_1: len_1.value ?? '',
    len_2: len_2.value ?? '',
    usl_len_base: usl_len_base.value ?? '',
    usl_len_1: usl_len_1.value ?? '',
    usl_len_2: usl_len_2.value ?? '',
    len_calc: len_calc.value ?? '',

    wl_limit: getWLLimit(),
    // not_wl_limit: '',

    norm_doc: docs.value ?? '',
    doc_date: parseDate(doc_date.value) ?? '',

    // pay_claim_id: props.old_row?.pay_claim_id ?? '',
    // claim_date: props.old_row?.claim_date ?? '',
    // pay_date: props.old_row?.pay_date ?? '',
    // tarif: '', // Вроде нигде не используется
    // tar_rast: '', // Вроде нигде не используется
    // tarif_group: '', // Вроде нигде не используется
    vg_ch: props.old_row?.vg_ch ?? '', // Возможно нужно для расчетов во вкладке экономика, но это не точно
    lk_chm: props.old_row?.lk_chm ?? '', // Возможно нужно для расчетов во вкладке экономика, но это не точно
    // moved: '', //  Вроде нигде не используется
    agreement_indicator: props.old_row?.agreement_indicator ?? '', // Вроде само заполнится
    marsh_way_len: props.old_row?.marsh_way_len ?? '',
    core_flag: props.old_row?.core_flag ?? ''

    // way_loaded: 1,
    // otpr_prib_loaded: 1
  }

  return <PfmRow>marsh
}

const getParamsForTest = () => {
  if (!isValid()) return

  return {
    ST_OT_ID: st_ot.value.id,
    ST_NZ_ID: st_nz.value.id,
    TYPE_OT: type_ot.value?.type_ot,
    TYPE_NZ: type_nz.value?.type_nz,
    GR_STATE: gr_state.value?.gr_state,
    ROD_GR: cargo.value?.map((item) => item.rod_gr) ?? [],
    GROUP_GR: cargo.value?.map((item) => item.group_gr) ?? [],
    COD_GR: cargo.value?.map((item) => item.cod_gr) ?? [],
    ROD_VAG: rps.value?.map((item) => item.rod_vag) ?? [],
    PROP_TYPE: rps_owner_type.value?.code,
    RPS_OWNER: rps_owner.value?.map((item) => item.rps_owner_okpo) ?? [],
    OTPR_OKPO: sender.value?.map((item) => item.code) ?? [],
    POL_OKPO: reciever.value?.code,
    WAYS_PRIVATE: ways_private.value?.code,
    WEIGHT_BASE: weight_base.value ?? ''
  }
}

const getData = async () => {
  const builder = new XMLBuilder()

  const getPogr = () => {
    if (!st_pogr.value || !st_pogr.value.length) return ''
    if (type_ot.value?.type_ot != '2' && type_ot.value?.type_ot != '9') return ''

    const POGR = <string[]>[]

    st_pogr.value.forEach((item, index) => {
      const new_item = {
        marsh_id: props.marsh_id,
        num: index,
        stan_id: item.stan_id,
        st_pogr_code: item.esr,
        st_pogr_name: item.name
      }

      const xml = builder.build(new_item)

      POGR.push(`<POGR>${xml}</POGR>`)
    })

    return `${POGR.join('')}`
  }
  const getRasform = () => {
    if (!st_rasf.value || !st_rasf.value.length) return ''
    if (type_nz.value?.type_nz != '12') return ''

    const RASFORM = <string[]>[]

    st_rasf.value
      .filter((item) => item && item.stan_id)
      .forEach((item, index) => {
        const new_item = {
          marsh_id: props.marsh_id,
          num: index,
          stan_id: item.stan_id,
          st_rasform_code: item.esr,
          st_rasform_name: item.name
        }

        const xml = builder.build(new_item)

        RASFORM.push(`<RASFORM>${xml}</RASFORM>`)
      })

    return `${RASFORM.join('')}`
  }
  const getRasformDiapasones = () => {
    if (!st_rasf_diapasones.value) return ''
    if (type_nz.value?.type_nz != '12') return ''

    const RASFORM_INT = `<RASFORM_INT><st_rasform_list>${st_rasf_diapasones.value
      .split('\n')
      .join(',')}</st_rasform_list></RASFORM_INT>`

    return `${RASFORM_INT}`
  }
  const getCargo = () => {
    if (!cargo.value || !cargo.value.length) return ''

    const CARGO = <string[]>[]

    cargo.value.forEach((item) => {
      item.marsh_id = props.marsh_id
      const xml = builder.build(item)

      CARGO.push(`<CARGO>${xml}</CARGO>`)
    })

    return `${CARGO.join('')}`
  }
  const getNnit = () => {
    if (!nnit.value || !nnit.value.length) return ''

    const NNIT = <string[]>[]
    nnit.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        num: index,
        nnit: item.nnit
      }
      const xml = builder.build(temp)

      NNIT.push(`<NNIT>${xml}</NNIT>`)
    })

    return `${NNIT.join('')}`
  }
  const getRPS = () => {
    if (!rps.value || !rps.value.length) return ''

    const RPS = <string[]>[]
    cloneDeep(rps.value).forEach((item, index) => {
      item.marsh_id = props.marsh_id
      item.num = index + 1
      delete item.id
      const xml = builder.build(item)

      RPS.push(`<RPS>${xml}</RPS>`)
    })

    return `${RPS.join('')}`
  }
  const getOwners = () => {
    if (!rps_owner.value || !rps_owner.value.length) return ''

    const OWNERS = <string[]>[]
    rps_owner.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        num: index + 1,
        rps_owner_okpo: item.rps_owner_okpo,
        rps_owner_name: item.rps_owner_name
      }

      const xml = builder.build(temp)

      OWNERS.push(`<OWNERS>${xml}</OWNERS>`)
    })

    return `${OWNERS.join('')}`
  }
  const getOtpr = () => {
    if (!sender.value || !sender.value.length) return ''

    const OTPR = <string[]>[]
    sender.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        num: index + 1,
        otpr_okpo: item.code,
        otpr_name: item.name
      }

      const xml = builder.build(temp)

      OTPR.push(`<OTPR>${xml}</OTPR>`)
    })

    return `${OTPR.join('')}`
  }
  const getRasp = () => {
    if (!st_zaadres.value || !st_zaadres.value.length) return ''

    const RASP = <string[]>[]
    st_zaadres.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        num: index + 1,
        st_rasp_id: item.stan_id,
        st_rasp_code: item.esr,
        st_rasp_name: item.name
      }

      const xml = builder.build(temp)

      RASP.push(`<RASP>${xml}</RASP>`)
    })

    return `${RASP.join('')}`
  }
  const getWeights = () => {
    if (!weights.value || !weights.value.length) return ''

    const WEIGHTS = <string[]>[]
    weights.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        weight: item.weight,
        num: index + 1,
        var_num: item.var_num
      }

      const xml = builder.build(temp)
      WEIGHTS.push(`<WEIGHTS>${xml}</WEIGHTS>`)
    })

    return `${WEIGHTS.join('')}`
  }
  const getLengths = () => {
    if (!lengths.value || !lengths.value.length) return ''

    const LENGTHS = <string[]>[]
    lengths.value.forEach((item, index) => {
      const temp = {
        marsh_id: props.marsh_id,
        num: index + 1,
        len: item['len_base'],
        usl_len: item['len_usl']
      }

      const xml = builder.build(temp)
      LENGTHS.push(`<LENGTHS>${xml}</LENGTHS>`)
    })

    return `${LENGTHS.join('')}`
  }

  const marsh_data = <string[]>[]

  marsh_data.push(getPogr())
  if (st_rast_variant.value == 'Станции') {
    marsh_data.push(getRasform())
  } else if (st_rast_variant.value == 'Диапазоны') {
    marsh_data.push(getRasformDiapasones())
  }
  marsh_data.push(getCargo())
  marsh_data.push(getNnit())
  marsh_data.push(getRPS())
  marsh_data.push(getOwners())
  marsh_data.push(getOtpr())
  marsh_data.push(getRasp())
  marsh_data.push(getWeights())
  marsh_data.push(getLengths())

  return marsh_data.join('')
}

defineExpose({
  getData,
  getMarshData,
  getParamsForTest,
  is_valid,
  is_weights_valid
})
</script>
