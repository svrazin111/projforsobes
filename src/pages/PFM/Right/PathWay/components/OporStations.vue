<template>
  <div class="h-full pb-5">
    <div class="font-semibold text-[#0000BB] text-[11px]">Опорные станции</div>
    <div class="h-full flex">
      <DataTable
        @click="onTableClick"
        :value="model"
        class="border border-gray-400"
        style="width: 580px !important; height: 100%"
        scrollable
        scrollHeight="flex"
        showGridlines
        selectionMode="single"
        dataKey="num"
        @row-click="onRowClick"
        @update:selection="onUpdateSelection"
        v-model:selection="selected"
        :editMode="props.is_edit ? 'cell' : undefined"
        @rowReorder="onRowReorder"
        size="small"
        :pt="{
          column: {
            bodycell: ({ state }) => ({
              class: [{ '!p-0': state['d_editing'] }]
            })
          }
        }"
      >
        <Column rowReorder :header-style="{ width: '30px' }" />

        <Column header="№" field="num" style="padding: 0px !important">
          <template #body="{ data }">
            <div style="width: 20px !important; padding-left: 4px">{{ data.num }}</div>
          </template>
        </Column>

        <Column header="Дор" field="road_name">
          <template #body="{ data }">
            <div
              class="text-[8px]"
              style="width: 30px !important; white-space: nowrap; overflow: hidden"
            >
              {{ data.road_name }}
            </div>
          </template>
        </Column>

        <Column header="ЕСР" field="st_esr">
          <template #body="{ data }">
            <div class="text-[8px]" style="width: 25px !important">{{ data.st_esr }}</div>
          </template>
        </Column>

        <Column header="Станция" field="st_name">
          <template #body="{ data }">
            <div
              v-tooltip.bottom="`(${data.st_esr}) ${data.st_name}`"
              style="
                width: 75px !important;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              "
            >
              {{ data.st_name }}
            </div>
          </template>
        </Column>

        <Column v-if="props.is_edit" field="set_station" style="padding: 0px !important">
          <template #body="{ data }">
            <button
              v-if="data?.num == selected?.num"
              class="text-[8px]"
              style="width: 20px !important; height: 20px !important"
            >
              <img :src="images.table_selection_row" @click="setStation" class="img-btn" />
            </button>
            <div
              v-else
              class="text-[8px]"
              style="width: 20px !important; height: 20px !important"
            ></div>
          </template>
        </Column>

        <Column
          header="Признак прицепки/ отцепки"
          field="pricep_otcep"
          style="padding: 0px !important"
        >
          <template #editor="{ index }">
            <select
              v-model="model[index].pricep_otcep"
              style="width: 70px; height: 20px"
              class="stop-click"
              @change="onRowEdited"
              @mousedown.stop
              @click.stop
            >
              <option value="---">---</option>
              <option value="Прицепка">Прицепка</option>
              <option value="Отцепка">Отцепка</option>
            </select>
          </template>
          <template #body="{ data }">
            <div style="width: 70px !important; padding-left: 4px">{{ data.pricep_otcep }}</div>
          </template>
        </Column>

        <Column
          header="Длина после прицепки/отцепки"
          field="new_len"
          style="padding: 0px !important"
        >
          <template #editor="{ index }">
            <input
              type="text"
              v-model="model[index].new_len"
              style="width: 65px !important; height: 20px; padding-left: 4px"
              class="stop-click"
              @change="onRowEdited"
              @mousedown.stop
              @click.stop
            />
          </template>
          <template #body="{ data }">
            <div style="width: 65px !important; padding-left: 4px">{{ data.new_len }}</div>
          </template>
        </Column>

        <Column header="Усл/ физ ваг" field="flag_usl" style="padding: 0px !important">
          <template #editor="{ index }">
            <select
              v-model="model[index].flag_usl"
              style="width: 50px; height: 20px"
              class="stop-click"
              @change="onRowEdited"
              @mousedown.stop
              @click.stop
            >
              <option value="---">---</option>
              <option value="физ.">физ.</option>
              <option value="усл.">усл.</option>
            </select>
          </template>
          <template #body="{ data }">
            <div style="width: 50px !important; padding-left: 4px">{{ data.flag_usl }}</div>
          </template>
        </Column>

        <Column
          header="Вес после прицепки/отцепки"
          field="new_weight"
          style="padding: 0px !important"
        >
          <template #editor="{ index }">
            <input
              type="text"
              v-model="model[index].new_weight"
              style="width: 60px !important; height: 20px; padding-left: 4px"
              class="stop-click"
              @change="onRowEdited"
              @mousedown.stop
              @click.stop
            />
          </template>
          <template #body="{ data }">
            <div style="width: 60px !important; padding-left: 4px">{{ data.new_weight }}</div>
          </template>
        </Column>

        <Column header="Длина расчет." field="new_len_calc">
          <template #body="{ data }">
            <div style="width: 40px !important">
              {{ data.new_len_calc }}
            </div>
          </template>
        </Column>

        <Column header="Вес расчет." field="new_weight_calc">
          <template #body="{ data }">
            <div style="width: 40px !important">
              {{ data.new_weight_calc }}
            </div>
          </template>
        </Column>
      </DataTable>
      <div v-if="props.is_edit" class="flex flex-col gap-0.5 ml-0.5" style="max-height: 200px">
        <img :src="images.add" @click="addRow" class="img-btn" style="height: 18px; width: 18px" />
        <img
          :src="images.delete_16"
          @click="deleteRow"
          class="img-btn"
          style="height: 18px; width: 18px"
        />
        <img
          :src="images.clean"
          @click="clearRows"
          class="img-btn"
          style="height: 18px; width: 18px"
        />
      </div>
    </div>

    <Dialog v-model:visible="is_dialog" modal header="Выбор опорной станции" style="width: 750px">
      <DataTable
        v-model:filters="filters"
        :value="useStationStore().get()"
        class="w-full !h-100 border border-gray-400 rounded-sm"
        showGridlines
        selectionMode="single"
        :metaKeySelection="false"
        v-model:selection="dialog_item"
        scrollable
        scrollHeight="400px"
        :virtualScrollerOptions="{ itemSize: 20 }"
        @row-dblclick="selectAndCommit"
        @row-unselect="onRowUnselect"
        size="small"
      >
        <template #header>
          <InputText autofocus v-model="filters['global'].value" size="small" class="w-full h-6" />
        </template>
        <Column
          v-for="col of [
            { title: 'ЕСР', field: 'esr' },
            { title: 'Наименование', field: 'vname' },
            { title: 'Кр. наименование', field: 'name' },
            { title: 'Дорога', field: 'road_name' },
            { title: 'Ст. ПФ', field: 'flag_pf_name' },
            { title: 'Стык', field: 'stk_type_name' }
          ]"
          :key="col.field"
          :field="col.field"
          :header="col.title"
        />
      </DataTable>
      <template #footer>
        <Button2 @click="commit()" label="Готово" img="check2" :disabled="!dialog_item" />
        <Button2 @click="close()" label="Отмена" img="delete2" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { debounce, keys } from 'lodash'
import { Column, DataTable, Dialog, InputText } from 'primevue'
import { nextTick, ref } from 'vue'

import { useStationStore } from '@/app/plugins/pinia/station'
import { PfmSt } from '@/pages/PFM/const/types'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'
import { Station } from '@/types/station'

import { calcWeightLength } from '../../queries/weightLength'

const props = defineProps<{
  st_ot_id?: string
  gr_state?: string
  rod_vag?: string
  rod_gr?: string
  group_gr?: string
  cod_gr?: string

  is_edit: boolean
}>()

const onRowUnselect = (event) => {
  dialog_item.value = event.data
}

const onRowClick = (event) => {
  if (event.originalEvent.target.closest('.stop-click')) {
    return // ignore clicks inside editor cells
  }
  selected.value = event.data
}

const onTableClick = (e) => {
  const isInsideTable = e.target.closest('.p-datatable')
  const isInsideRow = e.target.closest('.p-datatable-tbody > tr')

  if (!isInsideTable || isInsideRow) return

  if (model.value.length === 0 || !isRowEmpty(model.value[model.value.length - 1])) {
    addRow()
  } else {
    deleteEmpty()
  }
}

const isRowEmpty = (row: PfmSt) => {
  let empty = true
  keys(row).forEach((key) => {
    if (key == 'num') return
    if (row[key] && row[key] != '') empty = false
  })
  return empty
}

const deleteEmpty = () => {
  const temp = [] as PfmSt[]

  model.value.forEach((row) => {
    if (!isRowEmpty(row)) temp.push(row)
  })

  model.value = temp

  recalcOrder()
}

const selected = ref<PfmSt>()
const last_selected = ref<PfmSt>()

const onUpdateSelection = (new_selected) => {
  if (!new_selected) {
    nextTick(() => {
      selected.value = last_selected.value
    })
  } else {
    nextTick(() => {
      last_selected.value = new_selected
      selected.value = new_selected
    })
  }
}
const model = defineModel<PfmSt[]>({ default: [] })

// #region // ! Диалог выбора опорных станций

const is_dialog = ref(false)
const dialog_item = ref<Station>({})

const setStation = () => {
  is_dialog.value = true
}
const commit = () => {
  const id = model.value.findIndex((item) => item.num == selected.value.num)

  model.value[id].road_name = dialog_item.value.road_name
  model.value[id].st_id = dialog_item.value.stan_id
  model.value[id].st_esr = dialog_item.value.esr
  model.value[id].st_name = dialog_item.value.name

  close()
}
const close = () => {
  is_dialog.value = false
  dialog_item.value = {}

  filters.value.global.value = null
}
const selectAndCommit = ({ data }) => {
  dialog_item.value = data
  commit()
}
const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

// #endregion

// #region // ! Добавить, удалить, очистить и переставить строки

const addRow = () => {
  if (!model.value) {
    model.value = [
      {
        marsh_id: '',
        num: 0,
        st_id: '',
        pricep_otcep: '',
        new_len: '',
        new_weight: '',
        var_num: '',
        new_len_calc: '',
        new_weight_calc: '',
        flag_usl: '',
        road_name: '',
        st_esr: '',
        st_name: '',
        stk_type_name: '',
        flag_pf_name: ''
      }
    ]
  }
  if (!model.value.length) {
    model.value.push({
      marsh_id: '',
      num: 0,
      st_id: '',
      pricep_otcep: '',
      new_len: '',
      new_weight: '',
      var_num: '',
      new_len_calc: '',
      new_weight_calc: '',
      flag_usl: '',
      road_name: '',
      st_esr: '',
      st_name: '',
      stk_type_name: '',
      flag_pf_name: ''
    })
  } else {
    let num = 0
    model.value.forEach((item) => {
      if (Number(item.num) > num) num = Number(item.num)
    })
    model.value.push({
      marsh_id: '',
      num: num + 1,
      st_id: '',
      pricep_otcep: '',
      new_len: '',
      new_weight: '',
      var_num: '',
      new_len_calc: '',
      new_weight_calc: '',
      flag_usl: '',
      road_name: '',
      st_esr: '',
      st_name: '',
      stk_type_name: '',
      flag_pf_name: ''
    })
  }
  selected.value = model.value[model.value.length - 1]
  last_selected.value = selected.value

  setTimeout(() => recalcOrder(), 500)
}
const deleteRow = () => {
  if (!selected.value) return

  let index = -1
  model.value.forEach((item, id) => {
    if (item.num == selected.value.num) index = id
  })
  if (index <= -1) return

  model.value.splice(index, 1)
  nextTick(() => {
    selected.value = model.value[model.value.length - 1]
    last_selected.value = selected.value
  })

  setTimeout(() => recalcOrder(), 500)
}
const clearRows = () => {
  model.value = []
}
const onRowReorder = ({ value }) => {
  model.value = value

  setTimeout(() => recalcOrder(), 500)
}
const recalcOrder = () => {
  model.value.forEach((item, index) => {
    item.num = index + 1
  })
}

// #endregion

const onRowEdited = () => {
  handleInput(selected.value)
}

const handleInput = debounce(async (opor_st: PfmSt) => {
  const calc = await calcWeightLength(
    {
      st_ot_id: props.st_ot_id,
      gr_state: props.gr_state,
      rod_vag: props.rod_vag,
      rod_gr: props.rod_gr,
      group_gr: props.group_gr,
      cod_gr: props.cod_gr
    },
    opor_st.new_weight,
    opor_st.new_len,
    0,
    opor_st.flag_usl
  )

  opor_st.new_len_calc = calc.len
  opor_st.new_weight_calc = calc.weight
}, 1000)
</script>
