<template>
  <Dialog v-model:visible="is_dialog" modal style="width: 800px">
    <template #header>
      <div class="flex w-full gap-1">
        <div class="font-semibold text-xl">{{ title }}</div>
        <div class="grow"></div>
        <Button2 @click="selectAll" label="Все" :disabled="is_single" />
        <Button2 @click="clear" img="clean" icon />
      </div>
    </template>

    <DataTable
      :value="rows"
      class="border border-gray-300"
      showGridlines
      :selectionMode="is_single ? 'single' : 'multiple'"
      scrollable
      scrollHeight="400px"
      :virtualScrollerOptions="{ itemSize: 26 }"
      dataKey="id"
      v-model:filters="filters"
      v-model:selection="selected"
      size="small"
      @row-dblclick="selectAndCommit"
      @row-unselect="onRowUnselect"
    >
      <template #header>
        <InputText autofocus v-model="filters['global'].value" size="small" class="w-full h-6" />
      </template>
      <Column
        v-for="col of columns"
        :key="col['field']"
        :field="col['field']"
        :header="col['title']"
      />
    </DataTable>
    <template #footer>
      <Button2 @click="commit" label="Готово" img="check2" />
      <Button2 @click="cancel" label="Отмена" img="delete2" />
    </template>
  </Dialog>
</template>

<!--  Пример использования
const userAction = createUserAction()
emitter.emit('new-filter', {
  title: '', rows: [], columns: [], promise: userAction,
})

userAction.wait().then((data) => {
  Используем данные 'data'
})
-->

<script setup lang="ts">
import { Column, DataTable, Dialog, InputText } from 'primevue'
import { onMounted, ref } from 'vue'

import { emitter } from '@/app/plugins/mitt'
import Button2 from '@/shared/ui/button/Button2.vue'

const filters = ref({
  global: { value: null, matchMode: 'contains' }
})

const is_dialog = ref(false)
const rows = ref<Array<object>>()
const columns = ref<Array<object>>()
const title = ref<string>()
const current_promise = ref()
const selected = ref([])

const is_single = ref(false)

export type FilterEventType = {
  title: string
  rows: Array<object>
  columns: Array<object>
  promise: any
  single: boolean
}

onMounted(() => {
  emitter.on('new-filter', (filterData) => {
    filters.value.global.value = null
    title.value = filterData.title
    rows.value = filterData.rows.slice(0)
    if (!rows.value[0]['id']) {
      rows.value.forEach((item, index) => {
        item['id'] = index
      })
    }
    is_single.value = filterData.single
    columns.value = filterData.columns
    current_promise.value = filterData.promise

    is_dialog.value = true
  })
})

const onRowUnselect = (event) => {
  selected.value = event.data
}

const selectAndCommit = ({ data }) => {
  selected.value = [data]
  setTimeout(() => {
    commit()
  }, 100)
}

const selectAll = () => (selected.value = rows.value.slice(0))

const clear = () => (selected.value = [])

const commit = () => {
  if (is_single.value) {
    if (!selected.value) {
      emitter.emit('toast', { detail: 'Не выбрано ни одного элемента' })
      return
    }

    current_promise.value.done([selected.value])
  } else {
    if (!selected.value.length) {
      emitter.emit('toast', { detail: 'Не выбрано ни одного элемента' })
      return
    }

    current_promise.value.done(selected.value)
  }
  cancel()
}

const cancel = () => {
  is_dialog.value = false
  selected.value = []
  filters.value.global.value = null
  title.value = ''
  rows.value = []
  columns.value = []
  current_promise.value = undefined
}
</script>
