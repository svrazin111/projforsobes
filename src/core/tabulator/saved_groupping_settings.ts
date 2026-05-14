export type Params = {
  TrainBugsList: {
    name: string
    groups: string[]
  }[]
  PriemSdachaList: {
    name: string
    groups: string[]
  }[]
  TrainFulfilList: {
    name: string
    groups: string[]
  }[]
  TrainVagList: {
    name: string
    groups: string[]
  }[]
}

export const form_settings: Params = {
  TrainBugsList: [
    {
      name: 'По типу маршрута 1',
      groups: ['rd_oper_name', 'bug_type_name', 'gr_state_mnemo', 'st_oper_name']
    },
    {
      name: 'По дор/виду нарушения',
      groups: ['', 'rd_oper_name', 'bug_type_name', 'st_oper_name']
    },
    {
      name: 'ЦУП',
      groups: ['rd_oper_name', 'bug_type_name', 'type_ot_name']
    },
    {
      name: 'По типу маршрута 2',
      groups: ['rd_oper_name', 'rd_ot_name', 'rd_nz_name', 'bug_type_name', 'st_oper_name']
    },
    {
      name: 'По типу сообщения',
      groups: ['', 'rd_oper_name', 'bug_type_name', 'type_soob_name', 'st_oper_name']
    },
    {
      name: 'По дороге форм. и типу отпр.',
      groups: [
        '',
        'rd_oper_name',
        'rd_ot_name',
        'rd_nz_name',
        'bug_type_name',
        'type_soob_name',
        'type_ot_name',
        'ways_private_mnemo',
        'st_oper_name',
        'st_nz_name',
        'train_full_name'
      ]
    },
    {
      name: 'По дор/стан нарушения',
      groups: [
        'rd_oper_name',
        'rd_ot_name',
        'rd_nz_name',
        'bug_type_name',
        'gr_state_mnemo',
        'st_oper_name',
        'st_ot_name',
        'st_nz_name',
        'train_full_name'
      ]
    },
    {
      name: 'ЦЗС',
      groups: ['', 'rd_oper_name', 'bug_type_name', 'st_oper_name']
    },
    {
      name: 'Вид/дор/ст нарушения',
      groups: ['', 'rd_oper_name', 'rd_ot_name', 'bug_type_name', 'type_nz_name', 'st_oper_name']
    },
    {
      name: 'Нарушения Дема',
      groups: ['', 'rd_oper_name', 'bug_type_name', 'st_oper_name']
    },
    {
      name: 'Ежесут.маршруты',
      groups: ['rd_oper_name', 'bug_type_name', 'gr_state_mnemo', 'type_ot_name', 'st_oper_name']
    },
    {
      name: 'ИЭРТ',
      groups: ['rd_ot_name', 'bug_type_name', 'st_ot_name', 'st_nz_name']
    },
    {
      name: 'Ежесуточно прицепки',
      groups: ['', 'rd_oper_name', 'st_oper_name']
    },
    {
      name: 'Прицепки из общей справки',
      groups: ['', 'rd_oper_name', 'gr_state_mnemo', 'type_ot_name', 'type_nz_name', 'st_oper_name']
    },
    {
      name: 'Справка "нарушения"',
      groups: ['', 'rd_oper_name', 'bug_type_name', 'st_oper_name']
    },
    {
      name: 'ЦДД',
      groups: ['', 'rd_oper_name', 'st_oper_name']
    },
    {
      name: 'Вышест_ЦДДЗ',
      groups: ['', 'rd_oper_name', 'st_oper_name']
    }
  ],
  PriemSdachaList: [
    {
      name: 'Общая',
      groups: [
        '',
        'rd_name',
        'rd_ot_name',
        'rd_nz_name',
        'st_ot_name',
        'st_nz_name',
        'type',
        'type_ot_name',
        'type_nz_name',
        'stik_in_name',
        'stik_out_name'
      ]
    },
    { name: 'Для ДЦУП', groups: ['', 'type'] },
    { name: 'С ядром', groups: ['', 'rd_name', 'core_flag'] },
    { name: 'Прием по стыку колчедан', groups: ['', 'stik_in_name', 'stik_out_name'] }
  ],
  TrainFulfilList: [
    {
      name: 'Кол-во назн Лиля',
      groups: ['', 'rd_ot_name', 'gr_state_mnemo', 'type_ot_name', 'ways_private_mnemo']
    },
    {
      name: 'ИЭРТ_СтатГод',
      groups: ['', 'gr_state_mnemo', 'move_flag', 'type_ot_name', 'st_ot_name']
    },
    {
      name: 'Вышест_ЦДДЗ',
      groups: ['', 'move_flag']
    },
    {
      name: 'Отчет ежемесячный ОЖД',
      groups: ['rod_gr_name', 'gr_state_mnemo', 'move_flag', 'type_ot_name', 'st_ot_name']
    },
    {
      name: 'Отчет ежемесячный ЮУЖД',
      groups: ['gr_state_mnemo', 'move_flag']
    },
    {
      name: 'Отчет для Северстали',
      groups: ['', 'type_ot_name', 'ways_private_mnemo', 'st_ot_name', 'st_nz_name']
    },
    {
      name: 'Отчет ОЖД',
      groups: ['', 'gr_state_mnemo', 'move_flag', 'type_ot_name', 'st_ot_name']
    },
    {
      name: 'Отчет по нарушениям',
      groups: ['', 'rd_ot_name', 'gr_state_mnemo', 'move_flag']
    },
    {
      name: 'отчет порож ОЖД',
      groups: ['', 'gr_state_mnemo', 'move_flag', 'st_ot_name', 'st_nz_name']
    }
  ],
  TrainVagList: [
    { name: 'Дорога', groups: ['', 'rd_nazn_name'] },
    { name: 'Род', groups: ['', 'rod_vag_name'] },
    { name: 'Груз_стан', groups: ['', 'st_nazn_name', 'gr_name'] }
  ]
}
