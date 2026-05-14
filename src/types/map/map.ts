export type MapStation = {
  stan_id: number
  esr: string
  st_kod: number
  name: string
  vname: string
  road_name: string
  road_code: number
  adm_code: number
  flag_gr: number
  flag_gr_name: string
  stk_type: any
  stk_type_name: string
  id: number
  priority: number
  flag_port: number
  x: number
  y: number
}

export type MapItem = {
  geometry: Geometry
  type: string
  properties: Properties
}

export type LineItem = {
  geometry: Geometry
  type: string
  properties: LineProperties
}

export type Geometry = {
  type: string
  coordinates: number[][][] | number[][]
}

export type Properties = {
  dor_code: any
  dor_name: string
  dor_color: string
  type?: string
}

export type LineProperties = {
  len: number
  type: string
  end_name: string
  pend_idx: number
  pend_idy: number
  end_st_kod: number
  pstart_idx: number
  pstart_idy: number
  start_name: string
  end_stan_id: number
  start_st_kod: number
  start_stan_id: number
}
