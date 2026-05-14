<template>
  <div>
    <div class="font-semibold text-[#0000BB] text-[11px] whitespace-nowrap">
      Род/Группа/Код груза
    </div>
    <div class="w-full flex">
      <DataTable
        ref="table"
        :value="cargo"
        showGridlines
        scrollable
        scrollHeight="flex"
        selectionMode="single"
        v-model:selection="selected_item"
        class="border border-gray-400 rounded-sm"
        size="small"
        :row-style="highlightRow"
        style="width: 600px !important; min-height: 100px; max-height: 300px"
      >
        <Column field="num" header="№">
          <template #body="{ data }">
            <div style="width: 20px !important">{{ data.num }}</div>
          </template>
        </Column>
        <Column field="rod_gr">
          <template #body="{ data }">
            <div style="width: 30px !important">{{ data.rod_gr }}</div>
          </template>
        </Column>
        <Column field="rod_gr_name" header="Род">
          <template #body="{ data }">
            <div style="width: 120px !important; white-space: normal">
              {{ data.rod_gr_name }}
            </div>
          </template>
        </Column>
        <Column field="set_rod" style="padding: 0px !important">
          <template #body="{ data }">
            <button
              v-if="selected_item && data['num'] == selected_item['num'] && !props.locked"
              style="height: 20px !important; width: 20px !important"
              @click="setRod(data)"
            >
              <img :src="images.table_selection_row" class="img-btn" />
            </button>
            <div v-else style="height: 20px !important; width: 20px !important"></div>
          </template>
        </Column>
        <Column field="group_gr" style="width: 40px">
          <template #body="{ data }">
            <div style="width: 30px !important">{{ data.group_gr }}</div>
          </template>
        </Column>
        <Column field="group_gr_name" header="Группа">
          <template #body="{ data }">
            <div style="width: 120px !important; white-space: normal">
              {{ data.group_gr_name }}
            </div>
          </template>
        </Column>
        <Column field="set_group" style="padding: 0px !important">
          <template #body="{ data }">
            <button
              v-if="selected_item && data['num'] == selected_item['num'] && !props.locked"
              style="height: 20px !important; width: 20px !important"
              @click="setGroup(data)"
            >
              <img :src="images.table_selection_row" class="img-btn" />
            </button>
            <div v-else style="height: 20px !important; width: 20px !important"></div>
          </template>
        </Column>
        <Column field="cod_gr">
          <template #body="{ data }">
            <div style="width: 30px !important">{{ data.cod_gr }}</div>
          </template>
        </Column>
        <Column field="gr_vname" header="Код груза">
          <template #body="{ data }">
            <div style="width: 120px !important; white-space: normal">
              {{ data.gr_vname }}
            </div>
          </template>
        </Column>
        <Column field="set_cargo" style="padding: 0px !important">
          <template #body="{ data }">
            <button
              v-if="selected_item && data['num'] == selected_item['num'] && !props.locked"
              style="height: 20px !important; width: 20px !important"
              @click="setCargo(data)"
            >
              <img :src="images.table_selection_row" class="img-btn" />
            </button>
            <div v-else style="height: 20px !important; width: 20px !important"></div>
          </template>
        </Column>
      </DataTable>
      <div
        v-if="!props.locked"
        class="flex flex-col gap-0.5 ml-0.5"
        style="min-width: 20px !important"
      >
        <Button2 @click="addRow" img="add" icon />
        <Button2 @click="deleteRow" img="delete_16" icon />
        <Button2 @click="clearRows" img="clean" icon />
      </div>
    </div>

    <Dialog v-model:visible="is_dialog" modal :header="dialog_header" style="width: 800px">
      <DataTable
        :value="dialog_rows"
        class="w-full h-full border border-gray-400 rounded-sm"
        showGridlines
        scrollable
        scrollHeight="400px"
        :virtualScrollerOptions="{ itemSize: 26 }"
        selectionMode="single"
        v-model:selection="dialog_item"
        v-model:filters="filters"
        @row-dblclick="selectAndCommit"
        size="small"
      >
        <template #header>
          <InputText autofocus v-model="filters['global'].value" size="small" class="w-full h-6" />
        </template>
        <Column
          v-for="col of dialog_cols"
          :key="col.field"
          :field="col.field"
          :header="col.title"
        />
      </DataTable>
      <template #footer>
        <Button2 @click="clear" label="Задать пустое" />
        <div class="grow"></div>
        <Button2 @click="commit" label="Готово" img="check2" :disabled="!dialog_item" />
        <Button2 @click="close" label="Отмена" img="delete2" />
      </template>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash'
import { Column, DataTable, Dialog, InputText } from 'primevue'
import { onMounted, ref, watch } from 'vue'

import { useCargoStore } from '@/app/plugins/pinia/cargo'
import { Cargo } from '@/pages/PFM/const/types'
import images from '@/shared/images/imported_images'
import Button2 from '@/shared/ui/button/Button2.vue'

const highlightRow = (data) => {
  let highlight = false
  props.rows_to_highlight.forEach((item) => {
    if (isEqual(data, item)) highlight = true
  })
  if (highlight) {
    return { 'background-color': '#F1FF7A' }
  }
}

const props = withDefaults(
  defineProps<{
    locked?: boolean
    rows_to_highlight?: object[]
  }>(),
  {
    locked: false,
    rows_to_highlight: () => []
  }
)

const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

onMounted(() => {
  cargo.value.forEach((item, index) => {
    item.num = index
  })
})

const is_dialog = ref(false)
const dialog_header = ref<'Род груза' | 'Группа груза' | 'Груз'>('Род груза')
const dialog_item = ref({})
const dialog_rows = ref([])
const dialog_cols = [
  { title: 'Код', field: 'code' },
  { title: 'Наименование', field: 'name' }
]

const selected_item = ref<Cargo>()

const addRow = () => {
  if (!cargo.value) {
    cargo.value = [
      {
        num: 0,
        rod_gr: '',
        rod_gr_name: '',
        group_gr: '',
        group_gr_name: '',
        cod_gr: '',
        gr_vname: ''
      }
    ]
  }
  if (!cargo.value?.length) {
    cargo.value?.push({
      num: 0,
      rod_gr: '',
      rod_gr_name: '',
      group_gr: '',
      group_gr_name: '',
      cod_gr: '',
      gr_vname: ''
    })
  } else {
    cargo.value?.push({
      num: Number(cargo.value[cargo.value.length - 1].num) + 1,
      rod_gr: '',
      rod_gr_name: '',
      group_gr: '',
      group_gr_name: '',
      cod_gr: '',
      gr_vname: ''
    })
  }
  selected_item.value = cargo.value[cargo.value.length - 1]
}
const deleteRow = () => {
  const last_num = Number(selected_item.value.num)
  cargo.value = cargo.value?.filter((item) => item['num'] != last_num)
  selected_item.value = cargo.value.filter((item) => item.num == last_num - 1)?.[0] ?? {}
}
const clearRows = () => {
  cargo.value = []
  selected_item.value = {}
}

const setRod = (data: Cargo) => {
  selected_item.value = data
  dialog_rows.value = useCargoStore().getKinds()
  dialog_header.value = 'Род груза'
  is_dialog.value = true
}

const setGroup = (data: Cargo) => {
  selected_item.value = data
  if (selected_item.value.rod_gr != '' && selected_item.value.rod_gr_name != '') {
    dialog_rows.value = useCargoStore()
      .getGroups()
      .filter((item) => item.rod_code == selected_item.value.rod_gr)
      .map((item) => {
        return {
          code: item.group_code,
          name: item.group_name
        }
      })
  } else {
    dialog_rows.value = useCargoStore()
      .getGroups()
      .map((item) => {
        return {
          code: item.group_code,
          name: item.group_name
        }
      })
  }

  dialog_header.value = 'Группа груза'
  is_dialog.value = true
}

const setCargo = (data: Cargo) => {
  selected_item.value = data

  if (
    selected_item.value.rod_gr != '' &&
    selected_item.value.rod_gr_name != '' &&
    selected_item.value.group_gr != '' &&
    selected_item.value.group_gr_name != ''
  ) {
    dialog_rows.value = useCargoStore()
      .getCargo()
      .filter((item) => item['rod_code'] == selected_item.value['rod_gr'])
      .filter((item) => item['group_code'] == Number(selected_item.value['group_gr']))
  } else if (selected_item.value.rod_gr != '' && selected_item.value.rod_gr_name != '') {
    dialog_rows.value = useCargoStore()
      .getCargo()
      .filter((item) => item['rod_code'] == selected_item.value['rod_gr'])
  } else {
    dialog_rows.value = useCargoStore().getCargo()
  }

  is_dialog.value = true
  dialog_header.value = 'Груз'
}

const clear = () => {
  if (!selected_item.value) return

  const selected_cargo = cargo.value.filter(
    (item) => item.num == Number(selected_item.value.num)
  )[0]

  if (!selected_cargo) return

  if (dialog_header.value == 'Род груза') {
    selected_cargo['rod_gr'] = ''
    selected_cargo['rod_gr_name'] = ''
    selected_cargo['group_gr'] = ''
    selected_cargo['group_gr_name'] = ''
    selected_cargo['cod_gr'] = ''
    selected_cargo['gr_vname'] = ''
  } else if (dialog_header.value == 'Группа груза') {
    selected_cargo['group_gr'] = ''
    selected_cargo['group_gr_name'] = ''
    selected_cargo['cod_gr'] = ''
    selected_cargo['gr_vname'] = ''
  } else if (dialog_header.value == 'Груз') {
    selected_cargo['cod_gr'] = ''
    selected_cargo['gr_vname'] = ''
  }
  close()
}

const commit = () => {
  if (!selected_item.value) return

  const selected_cargo = cargo.value.filter(
    (item) => item.num == Number(selected_item.value.num)
  )[0]

  if (!selected_cargo) return

  if (dialog_header.value == 'Род груза') {
    selected_cargo['rod_gr'] = dialog_item.value['code']
    selected_cargo['rod_gr_name'] = dialog_item.value['name']
    selected_cargo['group_gr'] = ''
    selected_cargo['group_gr_name'] = ''
    selected_cargo['cod_gr'] = ''
    selected_cargo['gr_vname'] = ''
  } else if (dialog_header.value == 'Группа груза') {
    const temp = useCargoStore()
      .getGroups()
      .filter((item) => item.group_code == dialog_item.value['code'])
    selected_cargo['rod_gr'] = temp[0].rod_code
    selected_cargo['rod_gr_name'] = temp[0].rod_name
    selected_cargo['group_gr'] = dialog_item.value['code']
    selected_cargo['group_gr_name'] = dialog_item.value['name']
    selected_cargo['cod_gr'] = ''
    selected_cargo['gr_vname'] = ''
  } else if (dialog_header.value == 'Груз') {
    const temp = useCargoStore()
      .getCargo()
      .filter((item) => item.code == dialog_item.value['code'])
    selected_cargo['rod_gr'] = temp[0].rod_code
    selected_cargo['rod_gr_name'] = temp[0].rod_name
    selected_cargo['group_gr'] = temp[0].group_code
    selected_cargo['group_gr_name'] = temp[0].group_name
    selected_cargo['cod_gr'] = dialog_item.value['code']
    selected_cargo['gr_vname'] = dialog_item.value['name']
  }
  close()
}

const selectAndCommit = ({ data }) => {
  dialog_item.value = data
  commit()
}

const close = () => {
  is_dialog.value = false
  dialog_item.value = {}
}

const cargo = defineModel<Cargo[]>({ default: [] })
</script>
