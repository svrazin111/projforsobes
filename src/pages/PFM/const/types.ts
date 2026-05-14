import { Station } from '@/types/station'

// Используем
export type PfmRow = {
  marsh_id: string
  st_ot_id: string
  st_nz_id: string
  type_ot: string
  type_nz: string
  gr_state: string
  rod_gr: string
  cod_gr: string
  rod_vag: string
  len: string
  date_begin: string
  date_end: string
  usl_len_1: string
  usl_len_2: string
  usl_len_base: string
  weight_1: string
  weight_2: string
  weight_base: string
  wl_limit: string
  norm_doc: string
  status: string
  group_gr: string
  parent_id: string
  doc_date: string
  prop_type: string
  otpr_okpo: string
  pol_okpo: string
  ways_private: string
  pogr_owner_okpo: string
  vigr_owner_okpo: string
  len_calc: string
  weight_calc: string
  rps_owner_okpo: string
  comments: string
  status_comment: string
  len_1: string
  len_2: string
  rod_vag_fname: string
  rps_owner_name: string
  on_time_tab: string
  from_etran: string
  inno_vag: string
  type_ot_name: string
  type_nz_name: string
  rd_ot_code: string
  rd_ot_name: string
  st_ot_esr: string
  st_ot_name: string
  adm_ot_code: string
  vg_ch: string
  lk_chm: string
  rd_nz_code: string
  rd_nz_name: string
  st_nz_esr: string
  st_nz_name: string
  adm_nz_code: string
  gr_state_mnemo: string
  group_gr_name: string
  rod_gr_name: string
  prop_type_name: string
  otpr_name: string
  pol_name: string
  pogr_owner_name: string
  vigr_owner_name: string
  gr_vname: string
  ways_private_mnemo: string
  f_completed_count: string
  moved: string
  agreement_indicator: string
  marsh_way_len: string
  core_flag: string
  type_soob: string
  history_count: string
  ring_flag: string
  moving_count: string
  completed_count: string
  leaved_count: string
}

// Приходит с сервера
export type PfmRow2 = {
  marsh_id: string
  st_ot_id: string
  st_nz_id: string
  type_ot: string
  type_nz: string
  gr_state: string
  rod_gr: string
  cod_gr: string
  rod_vag: string
  len: string
  date_begin: string
  date_end: string
  usl_len_1: string
  usl_len_2: string
  usl_len_base: string
  weight_1: string
  weight_2: string
  weight_base: string
  wl_limit: string
  norm_doc: string
  status: string
  group_gr: string
  parent_id: string
  doc_date: string
  prop_type: string
  otpr_okpo: string
  pol_okpo: string
  ways_private: string
  pogr_owner_okpo: string
  vigr_owner_okpo: string
  pay_claim_id?: string
  claim_date?: string
  pay_date?: string
  len_calc: string
  weight_calc: string
  rps_owner_okpo: string
  comments: string
  status_comment: string
  len_1: string
  len_2: string
  rod_vag_name: string
  rod_vag_fname: string
  rps_owner_name: string
  on_time_tab: string
  type_ot_old?: string
  tarif?: string
  tar_rast?: string
  from_etran: string
  inno_vag: string
  tarif_group?: string
  type_ot_name: string
  type_ot_num?: string
  type_ot_mnemo?: string
  type_nz_name: string
  type_nz_num?: string
  type_nz_mnemo?: string
  rd_ot_code: string
  rd_ot_name: string
  rd_ot_fname?: string
  st_ot_esr: string
  st_ot_name: string
  st_ot_fname?: string
  adm_ot_code: string
  vg_ch: string
  lk_chm: string
  rd_nz_code: string
  rd_nz_name: string
  rd_nz_fname?: string
  st_nz_esr: string
  st_nz_name: string
  st_nz_fname?: string
  adm_nz_code: string
  gr_state_mnemo: string
  gr_state_name?: string
  group_gr_name: string
  rod_gr_name: string
  prop_type_name: string
  otpr_okpo_list?: string
  otpr_name: string
  pol_name: string
  pogr_owner_name: string
  vigr_owner_name: string
  gr_code?: string
  gr_name?: string
  gr_vname: string
  ways_private_name?: string
  ways_private_mnemo: string
  f_completed_count: string
  moved: string
  agreement_indicator: string
  marsh_way_len: string
  core_flag: string
  type_soob: string
  type_soob_name?: string
  not_wl_limit?: string
  history_count: string
  ring_flag: string
  moving_count: string
  completed_count: string
  leaved_count: string
}

// Это приходит из запроса
export type PfmRowData = {
  WEIGHTS: Weights[] | Weights
  LENGTHS: Lengths[] | Lengths
  PAYS: Pays[] | Pays
  RPS: Rps[] | Rps
  OWNERS: Owners[] | Owners
  OTPR: Otpr[] | Otpr
  RASP: Rasp[] | Rasp
  POGR: Pogr[] | Pogr
  RASFORM: Rasform[] | Rasform
  CARGO: Cargo[] | Cargo
  NNIT: Nnit[] | Nnit
  WAY_VARS: WayVars[] | WayVars
  PFM_ST: PfmSt[] | PfmSt
  PF_ST: PfSt[] | PfSt
  WAY_FULL: WayFull[] | WayFull
  WAY_PF_FULL: WayPfFull[] | WayPfFull
  DOCS: Docs[] | Docs
  DOCS_DATA: DocsData[] | DocsData
}

// Этим мы пользуемся
export type PfmRowData2 = {
  weights: Weights[]
  lengths: Lengths[]
  rps: Rps[]
  owners: Owners[]
  otpr: Otpr[]
  st_zaadres: Station[]
  pogr: Pogr[]
  rasform: Rasform[]
  cargo: Cargo[]
  nnit: Nnit[]
  way_vars: WayVars[]
  pfm_st: PfmSt[]
  pf_st: PfSt[]
  ways_full: WayFull[]
  ways_pf_full: WayPfFull[]
  docs: Docs[]
  docs_data: DocsData[]
}

export type Weights = {
  marsh_id: string | number
  weight: string
  num: string
  var_num: string
}

export type Lengths = {
  marsh_id: string | number
  len: string
  usl_len: string
  num: string
}

export type Pays = {
  marsh_id: string | number
  num: string
  pod_count: string
  form_time: string
  form_payment: string
  comment: string
  stay_payment: string
  train_len: string
  discount_marsh: string
  delivery_time_marsh: string
  delivery_time_group: string
  sum_payment: string
  discount_vag: string
}

export type Rps = {
  marsh_id: string | number
  num: string
  rod_vag: string
  rod_vag_name: string
  rod_vag_fname: string
}

export type Owners = {
  marsh_id: string | number
  num: string
  rps_owner_okpo: string
  rps_owner_name: string
}

export type Otpr = {
  marsh_id: string | number
  num: string
  otpr_okpo: string
  otpr_name: string
}

export type Rasp = {
  marsh_id: string | number
  num: string
  st_rasp_id: string
  st_rasp_code: string
  st_rasp_name: string
}

export interface Pogr {
  marsh_id: string
  num: string
  stan_id: string
  st_pogr_code: string
  st_pogr_name: string
}

export interface Rasform {
  marsh_id: string
  num: string
  stan_id: string
  st_rasform_code: string
  st_rasform_name: string
}

export type Cargo = {
  marsh_id?: number | string
  num: number | string
  rod_gr: number | string
  group_gr: string
  cod_gr: string
  rod_gr_name: string
  group_gr_name: string
  gr_vname: string
}

export type Nnit = {
  marsh_id: string | number
  num: string
  nnit: string
}

export type WayVars = {
  marsh_id?: number | string
  var_num: number
  var_name: string
}

export type PfmSt = {
  marsh_id: number | string
  num: number | string
  st_id: number | string
  pricep_otcep: number | string
  new_len: string
  new_weight: string
  var_num: number | string
  new_len_calc: string
  new_weight_calc: string
  flag_usl: string
  road_name: string
  st_esr: number | string
  st_name: string
  stk_type_name: string
  flag_pf_name: string
}

export type PfSt = {
  marsh_id: number | string
  num: number
  st_id: number
  type: number
  rp: number
  road_name: string
  st_esr: number
  st_name: string
  stk_type_name: string
  flag_pf_name: string
  type_name: string
  rp_name: string
}

export type WayFull = {
  marsh_id: number | string
  var_num: number
  start_urlb: number
  end_urlb: number
  start: number
  end: number
  len_urlb: number
  len: number
  num: number
  ves: number
  dls: number
  pr_per: number
  pr_sttex: number
  euch: any
  est: number
  dor: number
  tuch: any
  tst: number
  ves_max: any
  stk_type_1: number
  stk_type_2: number
  stk_type_name_1: string
  stk_type_name_2: string
  dor_1: number
  dor_2: number
  upath: string
  rd_name_1: string
  st_esr_1: number
  st_name_1: string
  flag_pf_name_1: string
  rd_name_2: string
  st_esr_2: number
  st_name_2: string
  flag_pf_name_2: string
  adm_name_1: string
  adm_name_2: string
}

export type WayPfFull = {
  marsh_id: number | string
  var_num: number
  start_urlb: number
  end_urlb: number
  start: number
  end: number
  len_urlb: number
  len: number
  num: number
  ves: number
  dls: number
  pr_per: number
  pr_sttex: number
  euch: any
  est: any
  dor: number
  tuch: any
  tst: number
  ves_max: any
  stk_type_1: number
  stk_type_2: number
  stk_type_name_1: string
  stk_type_name_2: string
  dor_1: number
  dor_2: number
  upath: string
  rd_name_1: string
  st_esr_1: number
  st_name_1: string
  flag_pf_name_1: string
  rd_name_2: string
  st_esr_2: number
  st_name_2: string
  flag_pf_name_2: string
  adm_name_1: string
  adm_name_2: string
}

export type Docs = {
  marsh_id: number | string
  num: number
  file_name: string
  comment: string
  file_size: number
  file_date: string
  data_id: string
  doc_type: number
  date_end: string
  doc_type_name: string
  saved: number
}

export type DocsData = {
  data_id: string
  doc_data: string
  marsh_id: string | number
}
