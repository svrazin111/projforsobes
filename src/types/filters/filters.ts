export type FiltersInQuery = {
  USER_ID: number
  MARSH_ID: string
  COMPLETE_DATE_1: string
  COMPLETE_DATE_2: string
  VIEW_DATE: string
  FILTER_CONDITION: string
  DATE_CONDITION: string
  FOLLOW_ST_LIST: any[]
  FOLLOW_ST_COUNT: number
  FORWARD_BACK: number
}

export type Filters = {
  ROAD: Road[]
  ROAD_NZ: RoadNz[]
  ST_OT: StOt[]
  ST_NZ: StNz[]
  MARSH_STATUS: MarshStatus[]
  AGREEMENT_STATUS: AgreementStatus[]
  TYPE_SOOB: TypeSoob[]
  TYPE_FORM: TypeForm[]
  MOVED: Moved[]
  CORE: Core[]
  GR_STATE: GrState[]
  TYPE_OT: TypeOt[]
  TYPE_NZ: TypeNz[]
  FROM_ETRAN: FromEtran[]
  INNO_VAG: InnoVag[]
  ROD_VAG: RodVag[]
  ROD_GR: RodGr[]
  RPS_OWNER: RpsOwner[]
  OTPR: Otpr[]
}

export type Road = {
  rd_ot_code: string
  rd_ot_name: string
  adm_ot_code: string
}

export type RoadNz = {
  rd_nz_code: string
  rd_nz_name: string
  adm_nz_code: string
}

export type StOt = {
  st_ot_id: string
  st_ot_name: string
}

export type StNz = {
  st_nz_id: string
  st_nz_name: string
}

export type MarshStatus = {
  status: string
  status_name: string
}

export type AgreementStatus = {
  agreement_status: string
  agreement_status_name: string
  condition: string
}

export type TypeSoob = {
  type_soob: string
  type_soob_name: string
}

export type TypeForm = {
  ways_private: string
  ways_private_name: string
  code: string
}

export type Moved = {
  moved: string
}

export type Core = {
  core_flag: string
  code: string
}

export type GrState = {
  code?: string
  gr_state: string
  gr_state_mnemo: string
}

export type TypeOt = {
  type_ot: string
  type_ot_name: string
}

export type TypeNz = {
  type_nz: string
  type_nz_name: string
}

export type FromEtran = {
  from_etran: string
  from_etran_name: string
}

export type InnoVag = {
  inno_vag: string
  inno_vag_name: string
}

export type RodVag = {
  rod_vag: string
  rod_vag_name: string
  rod_vag_fname: string
}

export type RodGr = {
  rod_gr: string
  rod_gr_name: string
}

export type RpsOwner = {
  rps_owner_okpo: string
  rps_owner_name: string
}

export type Otpr = {
  otpr_okpo: string
  otpr_name: string
  otpr_sort: string
}
