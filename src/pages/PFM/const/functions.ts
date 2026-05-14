import { xmlQuery } from '@/app/plugins/ky'
import { useIpStore } from '@/app/plugins/pinia/ip'
import { useStationStore } from '@/app/plugins/pinia/station'
import { useUserStore } from '@/app/plugins/pinia/user'
import { toArray } from '@/shared/array'
import { correctEsr } from '@/shared/esr'

import { PfmRow, PfmRowData, PfmRowData2, PfmSt, PfSt, WayFull, WayPfFull } from './types'

export const getFullName = (row: PfmRow) => {
  return `${row.st_ot_name} -> ${row.st_nz_name} ${
    row.gr_state == '1' ? row.rod_gr_name : row.rod_vag_fname
  }`
}

export const getRowData = async (marsh_id: string | number) => {
  const params = { MARSH_ID: marsh_id }
  // const PFM_WAYS = await xmlQuery('PFM2_Defs', 'Get_PFM_WAYS', params, {
  //   parse: 'xml',
  //   silent: true
  // })
  // console.log(PFM_WAYS);
  const temp: PfmRowData = {
    WEIGHTS: { marsh_id: "", weight: "", num: "", var_num: "" },
    LENGTHS: { marsh_id: "", len: "", usl_len: "", num: "" },
    PAYS: { marsh_id: "", num: "", "pod_count": "", "form_time": "", "form_payment": "", "comment": "", "stay_payment": "", "train_len": "", "discount_marsh": "", "delivery_time_marsh": "", "delivery_time_group": "", "sum_payment": "", "discount_vag": "" },
    RPS: { marsh_id: "", num: "", "rod_vag": "", "rod_vag_name": "", "rod_vag_fname": "" },
    OWNERS: { marsh_id: "", num: "", "rps_owner_okpo": "", "rps_owner_name": "" },
    OTPR: { marsh_id: 2022041412181568, num: 1, otpr_okpo: 98770511, otpr_name: "ООО \"Газпромнефть-Логистика\"" },
    RASP: { marsh_id: "", num: "", st_rasp_id: "", st_rasp_code: "", st_rasp_name: "" },
    POGR: { marsh_id: "", num: "", "stan_id": "", "st_pogr_code": "", "st_pogr_name": "" },
    RASFORM: { marsh_id: "", num: "", "stan_id": "", "st_rasform_code": "", "st_rasform_name": "" },
    RASFORM_INT: { "st_rasform_list": "" },
    CARGO: { marsh_id: 2022041412181568, num: 1, rod_gr: 3, group_gr: 22000, cod_gr: "", rod_gr_name: "Нефть и нефтепродукты", group_gr_name: "Нефтепродукты темные", gr_vname: "" },
    NNIT: { marsh_id: "", num: "", nnit: "" },
    WAY_VARS: { marsh_id: 2022041412181568, var_num: 1, "var_name": "Основной" },
    PFM_ST: [
      { marsh_id: 2022041412181568, num: 1,"st_id": 5111, "pricep_otcep": 0,"new_len": "","new_weight": "",var_num: 1,"new_len_calc": "","new_weight_calc": "","flag_usl": "","road_name": "МОСК",
        "st_esr": "23700","st_name": "АЛЕКСАНДРОВ","stk_type_name": "МЕЖ. ДОР.","flag_pf_name": "ПФ"},
      { marsh_id: 2022041412181568, num: 2,"st_id": 6483, "pricep_otcep": 0,"new_len": "","new_weight": "",var_num: 1,"new_len_calc": "","new_weight_calc": "","flag_usl": "","road_name": "СЕВ",
        "st_esr": "30260","st_name": 'КОШТА',"stk_type_name": "МЕЖ. ДОР.","flag_pf_name": "ПФ" }
    ],
    PF_ST: [
      { marsh_id: 2022041412181568,num: 1, "st_id": 4934, "type": 1, "rp": 10, road_name: "МОСК", st_esr: "23000", st_name: "ОРЕХОВО-ЗУЕВО", stk_type_name: "", flag_pf_name: "ПФ", type_name: "ст. переработки по ПФ", rp_name: "Сквозной" },
      { marsh_id: 2022041412181568,num: 2, "st_id": 5008, "type": 2, "rp": 10, road_name: "МОСК", st_esr: "23360", st_name: "ВОСКРЕСЕНСК", stk_type_name: "", flag_pf_name: "ПФ", type_name: "ст. кружности по ПФ", rp_name: "Сквозной" },
      { marsh_id: 2022041412181568,num: 3, "st_id": 3698, "type": 1, "rp": 10, road_name: "МОСК", st_esr: "18000", st_name: "БЕКАСОВО-СОРТ", stk_type_name: "", flag_pf_name: "ПФ", type_name: "ст. переработки по ПФ", rp_name: "Сквозной" },
      { marsh_id: 2022041412181568,num: 4, "st_id": 4186, "type": 2, "rp": 10, road_name: "МОСК", st_esr: "19770", st_name: "ШАХОВСКАЯ", stk_type_name: "МЕЖ. ДОР.", flag_pf_name: "", type_name: "ст. кружности по ПФ", rp_name: "Сквозной" },
      { marsh_id: 2022041412181568,num: 5, "st_id": 445, "type": 1, "rp": 30, road_name: "ОКТ", st_esr: "03300", st_name: "ШУШАРЫ", stk_type_name: "", flag_pf_name: "ПФ", type_name: "ст. переработки по ПФ", rp_name: "Вывозной" },
      { marsh_id: 2022041412181568,num: 6, "st_id": 493, "type": 1, "rp": 50, road_name: "ОКТ", st_esr: "03550", st_name: "АВТОВО", stk_type_name: "", flag_pf_name: "ПФ", type_name: "ст. переработки по ПФ", rp_name: "Маневровый локомотив"  }
    ],
    WAY_FULL: [
      { marsh_id: 2022041412181568, var_num: 1, start_urlb: 0,end_urlb: 0,startv: 4072,endv: 4064,len_urlb: 4,len: 4,num: 1,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 0,euch: "",est: 0,dor: 17,tuch: "",tst: 0,
        ves_max: "",stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4072,4071,4064",rd_name_1: "МОСК",st_esr_1: "19450",st_name_1: "ЯНИЧКИНО",
        flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "19421",st_name_2: "ПАНКИ",flag_pf_name_2: "",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 4718,end_urlb: 4049,startv: 4064,endv: 4049,len_urlb: 170,len: 12,num: 2,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 0,euch: 84.65,est: 0,dor: 17,
        tuch: 0.2,tst: 0,ves_max: 7000,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4064,4063,4049",rd_name_1: "МОСК",st_esr_1: "19421",
        st_name_1: "ПАНКИ",flag_pf_name_1: "",rd_name_2: "МОСК",st_esr_2: "19380",st_name_2: "ПЕРОВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 4049,end_urlb: 4934,startv: 4049,endv: 4934,len_urlb: 101,len: 101,num: 3,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 815.78,est: 93.3,
        dor: 17,tuch: 1.77,tst: 5.92,ves_max: 6300,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4049,4063,4069,4074,4083,40108,40107,4976,4974,4934",
        rd_name_1: "МОСК",st_esr_1: "19380",st_name_1: "ПЕРОВО",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "23000",st_name_2: "ОРЕХОВО-ЗУЕВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 4934,end_urlb: 5111,startv: 4934,endv: 5111,len_urlb: 79,len: 79,num: 4,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 658.32,est: 34.67,dor: 17,tuch: 1.97,
        tst: 2.2,ves_max: 8000,stk_type_1: 0,stk_type_2: 2,stk_type_name_1: "",stk_type_name_2: "МЕЖ. ДОР.",dor_1: 17,dor_2: 17,upath: "4934,5125,5120,5117,5115,5113,5112,5111",
        rd_name_1: "МОСК",st_esr_1: "23000",st_name_1: "ОРЕХОВО-ЗУЕВО",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "23700",st_name_2: "АЛЕКСАНДРОВ",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 4934,end_urlb: 6659,startv: 5111,endv: 6659,len_urlb: 326,len: 247,num: 5,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 0,euch: 1698.12,est: 0,
        dor: 28,tuch: 4.9,tst: 0,ves_max: 8000,stk_type_1: 2,stk_type_2: 0,stk_type_name_1: "МЕЖ. ДОР.",stk_type_name_2: "",dor_1: 17,dor_2: 28,upath: "5111,6694,6698,6704,6705,6708,6709,6711,6713,6721,6727,6631,6630,6640,6641,6639,6649,6654,6659",
        rd_name_1: "МОСК",st_esr_1: "23700",st_name_1: "АЛЕКСАНДРОВ",flag_pf_name_1: "ПФ",rd_name_2: "СЕВ",st_esr_2: "31110",st_name_2: "ДАНИЛОВ",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 6659,end_urlb: 6435,startv: 6659,endv: 6435,len_urlb: 132,len: 132,num: 6,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 846.82,
        est: 60.36,dor: 28,tuch: 2.57,tst: 3.83,ves_max: 8000,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 28,dor_2: 28,upath: "6659,40173,6485,6488,6492,6495,6500,6435",
        rd_name_1: "СЕВ",st_esr_1: "31110",st_name_1: "ДАНИЛОВ",flag_pf_name_1: "ПФ",rd_name_2: "СЕВ",st_esr_2: "30000",st_name_2: "ЛОСТА",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 6435,end_urlb: 6483,startv: 6435,endv: 6483,len_urlb: 149,len: 149,num: 7,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 1055.96,est: 26.79,dor: 28,tuch: 3.57,
        tst: 1.7,ves_max: 9000,stk_type_1: 0,stk_type_2: 2,stk_type_name_1: "",stk_type_name_2: "МЕЖ. ДОР.",dor_1: 28,dor_2: 28,upath: "6435,6436,6440,6462,6464,6466,6467,6470,6475,6480,6482,6483",
        rd_name_1: "СЕВ",st_esr_1: "30000",st_name_1: "ЛОСТА",flag_pf_name_1: "ПФ",rd_name_2: "СЕВ",st_esr_2: "30260",st_name_2: 'КОШТА',flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 6483,end_urlb: 779,startv: 6483,endv: 779,len_urlb: 114,len: 114,num: 8,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 831.14,est: 60.36,
        dor: 1,tuch: 2.3,tst: 3.83,ves_max: 12600,stk_type_1: 2,stk_type_2: 0,stk_type_name_1: "МЕЖ. ДОР.",stk_type_name_2: "",dor_1: 28,dor_2: 1,upath: "6483,770,769,772,774,778,779",
        rd_name_1: "СЕВ",st_esr_1: "30260",st_name_1: 'КОШТА',flag_pf_name_1: "ПФ",rd_name_2: "ОКТ",st_esr_2: "04640",st_name_2: "БАБАЕВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 779,end_urlb: 493,startv: 779,endv: 493,len_urlb: 351,len: 351,num: 9,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 1,euch: 2070.77,est: 31.52,dor: 1,
        tuch: 6.79,tst: 2,ves_max: 12600,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 1,dor_2: 1,upath: "779,781,782,783,784,787,788,791,792,793,796,798,804,806,809,600,40161,810,812,815,391,393,401,404,406,407,385,452,486,495,492,493",
        rd_name_1: "ОКТ",st_esr_1: "04640",st_name_1: "БАБАЕВО",flag_pf_name_1: "ПФ",rd_name_2: "ОКТ",st_esr_2: "03550",st_name_2: "АВТОВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 1,start_urlb: 0,end_urlb: 0,startv: 493,endv: 494,len_urlb: 0,len: 0,num: 10,ves: 6500,dls: 72,pr_per: 0,pr_sttex: 0,euch: 0,est: 0,
        dor: 1,tuch: "",tst: 0,ves_max: "",stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 1,dor_2: 1,upath: "493,494",rd_name_1: "ОКТ",st_esr_1: "03550",st_name_1: "АВТОВО",
        flag_pf_name_1: "ПФ",rd_name_2: "ОКТ",st_esr_2: "03560",st_name_2: "АВТОВО (ЭКСП.)",flag_pf_name_2: "",adm_name_1: "Россия",adm_name_2: "Россия"
      }
    ],
    WAY_PF_FULL: [
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 0,end_urlb: 0,startv: 4072,endv: 4064,len_urlb: 4,len: 4,num: 1,ves: 0,dls: 0,pr_per: 0,pr_sttex: 0,euch: "",est: 0,dor: 17,tuch: "",tst: 0,ves_max: "",stk_type_1: 0,
        stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4072,4071,4064",rd_name_1: "МОСК",st_esr_1: "19450",st_name_1: "ЯНИЧКИНО",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",
        st_esr_2: "19421",st_name_2: "ПАНКИ",flag_pf_name_2: "",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 4718,end_urlb: 4049,startv: 4064,endv: 4049,len_urlb: 170,len: 12,num: 2,ves: 6000,dls: 71,pr_per: 0,pr_sttex: 0,euch: 82.06,est: 0,dor: 17,tuch: 0.2,tst: 0,ves_max: 7000,
        stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4064,4063,4049",rd_name_1: "МОСК",st_esr_1: "19421",st_name_1: "ПАНКИ",flag_pf_name_1: "",
        rd_name_2: "МОСК",st_esr_2: "19380",st_name_2: "ПЕРОВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 4049,end_urlb: 4934,startv: 4049,endv: 4934,len_urlb: 101,len: 101,num: 3,ves: 6000,dls: 71,pr_per: 0,pr_sttex: 1,euch: 656.42,est: 93.3,dor: 17,tuch: 1.77,
        tst: 5.92,ves_max: 6300,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4049,4063,4069,4074,4083,40108,40107,4976,4974,4934",rd_name_1: "МОСК",
        st_esr_1: "19380",st_name_1: "ПЕРОВО",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "23000",st_name_2: "ОРЕХОВО-ЗУЕВО",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 4934,end_urlb: 5008,startv: 4934,endv: 5008,len_urlb: 64,len: 64,num: 4,ves: 5500,dls: 71,pr_per: 1,pr_sttex: 1,euch: 520.84,est: 330.96,dor: 17,tuch: 1.18,tst: 10.5,ves_max: 8200,
        stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "4934,4974,4976,40107,4979,5005,5003,5004,5008",rd_name_1: "МОСК",st_esr_1: "23000",st_name_1: "ОРЕХОВО-ЗУЕВО",
        flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "23360",st_name_2: "ВОСКРЕСЕНСК",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 5008, end_urlb: 3698,startv: 5008,endv: 3698,len_urlb: 152,len: 152,num: 5,ves: 5500,dls: 71,pr_per: 0,pr_sttex: 1,euch: 1093.32,est: 93.3,dor: 17,tuch: 2.82,tst: 5.92,
        ves_max: 9000,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "5008,40092,4000,4008,4016,4014,4013,4018,3968,3726,3732,3698",rd_name_1: "МОСК",
        st_esr_1: "23360",st_name_1: "ВОСКРЕСЕНСК",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "18000",st_name_2: "БЕКАСОВО-СОРТИРОВОЧНОЕ",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,start_urlb: 3698,end_urlb: 4149,startv: 3698,endv: 4149,len_urlb: 76,len: 76,num: 6,ves: 4500,dls: 71,pr_per: 1,pr_sttex: 1,euch: 531.95,est: 330.96,dor: 17,tuch: 1.76,tst: 10.5,
        ves_max: 6000,stk_type_1: 0,stk_type_2: 0,stk_type_name_1: "",stk_type_name_2: "",dor_1: 17,dor_2: 17,upath: "3698,3700,40090,3703,3705,3706,3768,3772,4158,4150,4149",rd_name_1: "МОСК",
        st_esr_1: "18000",st_name_1: "БЕКАСОВО-СОРТИРОВОЧНОЕ",flag_pf_name_1: "ПФ",rd_name_2: "МОСК",st_esr_2: "19700",st_name_2: "МАНИХИНО I",flag_pf_name_2: "ПФ",adm_name_1: "Россия",adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 4149,
          end_urlb: 4183,
          startv: 4149,
          endv: 4183,
          len_urlb: 73,
          len: 73,
          num: 7,
          ves: 4300,
          dls: 57,
          pr_per: 0,
          pr_sttex: 1,
          euch: 663.2,
          est: 93.3,
          dor: 17,
          tuch: 1.35,
          tst: 5.92,
          ves_max: 6000,
          stk_type_1: 0,
          stk_type_2: 0,
          stk_type_name_1: "",
          stk_type_name_2: "",
          dor_1: 17,
          dor_2: 17,
          upath: "4149,4167,4171,4175,4180,4183",
          rd_name_1: "МОСК",
          st_esr_1: "19700",
          st_name_1: "МАНИХИНО I",
          flag_pf_name_1: "ПФ",
          rd_name_2: "МОСК",
          st_esr_2: "19760",
          st_name_2: "ВОЛОКОЛАМСК",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 4183,
          end_urlb: 1183,
          startv: 4183,
          endv: 4186,
          len_urlb: 113,
          len: 28,
          num: 8,
          ves: 4600,
          dls: 57,
          pr_per: 0,
          pr_sttex: 1,
          euch: 277.92,
          est: 93.3,
          dor: 17,
          tuch: 0.89,
          tst: 5.92,
          ves_max: 5500,
          stk_type_1: 0,
          stk_type_2: 2,
          stk_type_name_1: "",
          stk_type_name_2: "МЕЖ. ДОР.",
          dor_1: 17,
          dor_2: 17,
          upath: "4183,4186",
          rd_name_1: "МОСК",
          st_esr_1: "19760",
          st_name_1: "ВОЛОКОЛАМСК",
          flag_pf_name_1: "ПФ",
          rd_name_2: "МОСК",
          st_esr_2: "19770",
          st_name_2: "ШАХОВСКАЯ",
          flag_pf_name_2: "",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 4183,
          end_urlb: 1183,
          startv: 4186,
          endv: 1183,
          len_urlb: 113,
          len: 85,
          num: 9,
          ves: 4600,
          dls: 57,
          pr_per: 0,
          pr_sttex: 0,
          euch: 843.68,
          est: 0,
          dor: 1,
          tuch: 2.71,
          tst: 0,
          ves_max: 5500,
          stk_type_1: 2,
          stk_type_2: 0,
          stk_type_name_1: "МЕЖ. ДОР.",
          stk_type_name_2: "",
          dor_1: 17,
          dor_2: 1,
          upath: "4186,1190,1193,1196,1183",
          rd_name_1: "МОСК",
          st_esr_1: "19770",
          st_name_1: "ШАХОВСКАЯ",
          flag_pf_name_1: "",
          rd_name_2: "ОКТ",
          st_esr_2: "06300",
          st_name_2: "РЖЕВ-БАЛТИЙСКИЙ",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 1183,
          end_urlb: 1243,
          startv: 1183,
          endv: 1243,
          len_urlb: 242,
          len: 242,
          num: 10,
          ves: 4600,
          dls: 57,
          pr_per: 0,
          pr_sttex: 1,
          euch: 2031.15,
          est: 90.46,
          dor: 1,
          tuch: 7.47,
          tst: 5.74,
          ves_max: 5500,
          stk_type_1: 0,
          stk_type_2: 0,
          stk_type_name_1: "",
          stk_type_name_2: "",
          dor_1: 1,
          dor_2: 1,
          upath: "1183,1214,1216,1219,1221,1223,1225,1231,1234,1235,1236,1237,1239,1243",
          rd_name_1: "ОКТ",
          st_esr_1: "06300",
          st_name_1: "РЖЕВ-БАЛТИЙСКИЙ",
          flag_pf_name_1: "ПФ",
          rd_name_2: "ОКТ",
          st_esr_2: "06600",
          st_name_2: "ВЕЛИКИЕ ЛУКИ",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 1243,
          end_urlb: 1025,
          startv: 1243,
          endv: 1025,
          len_urlb: 205,
          len: 205,
          num: 11,
          ves: 3000,
          dls: 57,
          pr_per: 0,
          pr_sttex: 1,
          euch: 1682.84,
          est: 90.46,
          dor: 1,
          tuch: 6.7,
          tst: 5.74,
          ves_max: 6500,
          stk_type_1: 0,
          stk_type_2: 0,
          stk_type_name_1: "",
          stk_type_name_2: "",
          dor_1: 1,
          dor_2: 1,
          upath: "1243,1274,1267,1032,1034,1037,1045,1044,1048,1025",
          rd_name_1: "ОКТ",
          st_esr_1: "06600",
          st_name_1: "ВЕЛИКИЕ ЛУКИ",
          flag_pf_name_1: "ПФ",
          rd_name_2: "ОКТ",
          st_esr_2: "05670",
          st_name_2: "ДНО",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568,var_num: 0,
          start_urlb: 1025,
          end_urlb: 385,
          startv: 1025,
          endv: 445,
          len_urlb: 235,
          len: 231,
          num: 12,
          ves: 3000,
          dls: 57,
          pr_per: 0,
          pr_sttex: 1,
          euch: 1764,
          est: 90.46,
          dor: 1,
          tuch: 5.85,
          tst: 5.74,
          ves_max: 6000,
          stk_type_1: 0,
          stk_type_2: 0,
          stk_type_name_1: "",
          stk_type_name_2: "",
          dor_1: 1,
          dor_2: 1,
          upath: "1025,1066,1070,1072,1074,1076,1081,1082,1083,1086,1088,1090,1095,437,439,440,441,30032,443,445",
          rd_name_1: "ОКТ",
          st_esr_1: "05670",
          st_name_1: "ДНО",
          flag_pf_name_1: "ПФ",
          rd_name_2: "ОКТ",
          st_esr_2: "03300",
          st_name_2: "ШУШАРЫ",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
          start_urlb: 0,
          end_urlb: 0,
          startv: 445,
          endv: 493,
          len_urlb: 15,
          len: 15,
          num: 13,
          ves: 0,
          dls: 0,
          pr_per: 1,
          pr_sttex: 0,
          euch: "",
          est: 611.49,
          dor: 1,
          tuch: "",
          tst: 19.4,
          ves_max: "",
          stk_type_1: 0,
          stk_type_2: 0,
          stk_type_name_1: "",
          stk_type_name_2: "",
          dor_1: 1,
          dor_2: 1,
          upath: "445,482,484,483,493",
          rd_name_1: "ОКТ",
          st_esr_1: "03300",
          st_name_1: "ШУШАРЫ",
          flag_pf_name_1: "ПФ",
          rd_name_2: "ОКТ",
          st_esr_2: "03550",
          st_name_2: "АВТОВО",
          flag_pf_name_2: "ПФ",
          adm_name_1: "Россия",
          adm_name_2: "Россия"
      },
      { marsh_id: 2022041412181568, var_num: 0,
        start_urlb: 0,
        end_urlb: 0,
        startv: 493,
        endv: 494,
        len_urlb: 0,
        len: 0,
        num: 14,
        ves: 0,
        dls: 0,
        pr_per: 1,
        pr_sttex: 0,
        euch: 0,
        est: 611.49,
        dor: 1,
        tuch: "",
        tst: 19.4,
        ves_max: "",
        stk_type_1: 0,
        stk_type_2: 0,
        stk_type_name_1: "",
        stk_type_name_2: "",
        dor_1: 1,
        dor_2: 1,
        upath: "493,494",
        rd_name_1: "ОКТ",
        st_esr_1: "03550",
        st_name_1: "АВТОВО",
        flag_pf_name_1: "ПФ",
        rd_name_2: "ОКТ",
        st_esr_2: "03560",
        st_name_2: "АВТОВО (ЭКСП.)",
        flag_pf_name_2: "",
        adm_name_1: "Россия",
        adm_name_2: "Россия"
      }
    ],
    DOCS: { marsh_id: 2022041412181568, num: 1, "file_name": "2022_04_14_9054_Янгичкино-Автово_6500.pdf", "comment": "", "file_size": 627714, "file_date": "14-04-2022 12:05:22", "data_id": "20220414121815681966", "doc_type": 2, "date_end": "", "doc_type_name": "Телеграмма", "saved": 1},
    DOCS_DATA: { data_id: "", doc_data: "", marsh_id: "" }
  };

  return <PfmRowData2>{
    pfm_st: toArray(temp.PFM_ST).map((item: PfmSt) => {
      item.st_esr = correctEsr(item.st_esr)
      return item
    }),
    pf_st: toArray(temp.PF_ST).map((item: PfSt) => {
      item.st_esr = correctEsr(item.st_esr)
      return item
    }),
    ways_full: toArray(temp.WAY_FULL).map((item: WayFull) => {
      item.st_esr_1 = correctEsr(item.st_esr_1)
      item.st_esr_2 = correctEsr(item.st_esr_2)
      return item
    }),
    ways_pf_full: toArray(temp.WAY_PF_FULL).map((item: WayPfFull) => {
      item.st_esr_1 = correctEsr(item.st_esr_1)
      item.st_esr_2 = correctEsr(item.st_esr_2)
      return item
    }),
    way_vars: toArray(temp.WAY_VARS),
    st_zaadres: toArray(temp.RASP).map((item) => {
      return useStationStore().getBy('stan_id', item['st_rasp_id'])[0]
    }),
    pogr: toArray(temp.POGR),
    rasform: toArray(temp.RASFORM),
    rasf_diapasones: temp.RASFORM_INT.st_rasform_list.split(',').filter((item) => item != ''),
    rps: toArray(temp.RPS),
    owners: toArray(temp.OWNERS),
    otpr: toArray(temp.OTPR),
    cargo: toArray(temp.CARGO),
    nnit: toArray(temp.NNIT),
    weights: toArray(temp.WEIGHTS),
    lengths: toArray(temp.LENGTHS),
    docs: toArray(temp.DOCS),
    docs_data: toArray(temp.DOCS_DATA)
  }
}

export const getMarshErrors = (row: PfmRow, data: PfmRowData2) => {
  if (!row || !data) return ['Не выбрана строка']

  const list_of_errors = <string[]>[]

  if (!row.st_ot_id) {
    list_of_errors.push('Не заполнено поле "Станция формирования"')
  }
  if (!row.st_nz_id) {
    list_of_errors.push('Не заполнено поле "Станция назначения"')
  }
  if (!row.type_ot) {
    list_of_errors.push('Не заполнено поле "Тип по отравлению"')
  }
  if (!row.type_nz) {
    list_of_errors.push('Не заполнено поле "Тип по прибытию"')
  }
  if (!row.gr_state) {
    list_of_errors.push('Не заполнено поле "Груж./Пор."')
  }
  if (!row.ways_private) {
    list_of_errors.push('Не заполнено поле "Накопление маршрута"')
  }
  if (!row.date_begin) {
    list_of_errors.push('Не заполнено поле "Дата начала периода действия"')
  }
  if (!row.date_end) {
    list_of_errors.push('Не заполнено поле "Дата окончания периода действия"')
  }
  if (!data.ways_full.length || !data.ways_pf_full.length) {
    // ! Эту проверку сделать бы как то по другому
    list_of_errors.push('Не выполнен расчет "Пути следования"')
  }
  if (row.gr_state == '1' && row.type_ot != '6' && row.rod_gr.length == 0) {
    list_of_errors.push('Не заполнено поле "Род груза"')
  }
  if (
    row.gr_state == '1' &&
    row.weight_base.length == 0 &&
    row.len.length == 0 &&
    row.usl_len_base.length == 0
  ) {
    list_of_errors.push(
      'Не заполнены поля "Вес груза", "Условная длина состава", "Физическая длина состава"'
    )
  }
  if (row.gr_state == '0' && row.rod_vag.length == 0) {
    list_of_errors.push('Не заполнено поле "Род подвижного состава"')
  }
  if (new Date(row.date_end) <= new Date(row.date_begin)) {
    list_of_errors.push(
      'Дата окончания периода действия" меньше или равно "Даты начала периода действия"'
    )
  }
  return list_of_errors
}

export const setStatus = async (row: PfmRow, new_status: string, status_comment: string = '') => {
  const params = {
    MARSH_ID: row.marsh_id,
    STATUS: new_status,
    STATUS_NAME: '', // Не факт, что вообще нужно
    STATUS_COMMENT: status_comment,
    SESSION_ID: localStorage.pfm_session_id,
    USER_ID: useUserStore().id,
    USER_IP: useIpStore().value
  }
  const data = await xmlQuery('PFM2_Defs', 'Approve_PFM', params, { parse: 'text' })
  return data
  // Если успешно, то просто заново выполнить запрос на получене данных для основной формы и выбрать эту же строку по marsh_id
}

export const stPererCount = (pf_st: PfSt[]) => {
  if (!pf_st || !pf_st.length) return 0

  let counter = 0

  pf_st.forEach((item) => {
    if (item.type == 1) counter += 1
  })
  return counter
}
