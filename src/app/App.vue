<template>
  <Toast />
  <DynamicDialog />
  <PopUpFilter />
  <ConfirmDialog />
  <QuestionDialog />
  <ProgressBar :value="percent" :showValue="false" class="!absolute w-full !h-1" v-if="!is_auth" />
  <Button
    v-if="!is_auth"
    @click="clear"
    icon="pi pi-cog"
    rounded
    outlined
    v-tooltip="'Очистить сохраненные данные'"
    size="small"
    severity="secondary"
    style="position: absolute !important; bottom: 4px !important; right: 4px !important"
  />
  <Main v-if="is_auth" />
  <Preloader v-show="is_auth" :active_queries="active_queries" />
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { Button, DynamicDialog, ProgressBar, useDialog } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import XLSX from 'xlsx/dist/xlsx.full.min.js'

import { query } from '@/app/plugins/ky'
import { useCargoStore } from '@/app/plugins/pinia/cargo'
import { useFiltersStore } from '@/app/plugins/pinia/filters'
import { useIpStore } from '@/app/plugins/pinia/ip'
import { useMapStore } from '@/app/plugins/pinia/map'
import { useOrganizationStore } from '@/app/plugins/pinia/organization'
import { useRoadStore } from '@/app/plugins/pinia/road'
import { useStationStore } from '@/app/plugins/pinia/station'
import { useUserStore } from '@/app/plugins/pinia/user'
import Preloader from '@/components/Preloader.vue'
import ConfirmDialog from '@/core/singleton/confirm/ConfirmDialog.vue'
import PopUpFilter from '@/core/singleton/PopUpFilter.vue'
import QuestionDialog from '@/core/singleton/question/QuestionDialog.vue'
import Toast from '@/core/singleton/toast/Toast.vue'
import { getSessionId } from '@/shared/sessionId'

import Main from './Main.vue'
import localforage from './plugins/localforage'
import { emitter } from './plugins/mitt'
import { useOperatorStore } from './plugins/pinia/operators'

const is_auth = ref(true)
const count = ref(0)
const percent = computed(() => Math.round((count.value / 7) * 100))
const dialog = useDialog()
const active_queries = ref(0)

onMounted(async () => {
  // Какие то глобальные переменные, которые сами не подтянулись
  window['XLSX'] = XLSX
  window['DateTime'] = DateTime
  window['dialog'] = dialog

  emitter.on('query-start', () => {
    active_queries.value += 1
  })
  emitter.on('query-end', () => {
    active_queries.value -= 1
  })

  localStorage.pfm_session_id = getSessionId()

  const ip = useIpStore()
  const data = await query(`${window.location.origin}/WebUtil/getUserIP/`, {}, { parse: 'text' })
  ip.set(data)
  const user = useUserStore()
  user.set([{ access_descr: 99, access_type: 'ROAD', role_type: 'ROAD_EDIT', name_f: 'test1', name_i: 'test2', name_o: 'test3' }]);

  initStorage()
})

const onLogin = (rights) => {
  is_auth.value = true
  const user = useUserStore()
  user.set(rights)
}

const initStorage = async () => {
  const stations = useStationStore().init()
  const roads = useRoadStore().init()
  const organizations = useOrganizationStore().init()
  const operators = useOperatorStore().init()
  const filters = useFiltersStore().init()
  const cargo = useCargoStore().init()
  const map = useMapStore().init()

  stations.then(() => update())
  roads.then(() => update())
  organizations.then(() => update())
  operators.then(() => update())
  filters.then(() => update())
  cargo.then(() => update())
  map.then(() => update())

  const update = () => {
    count.value += 1
  }
}

const clear = async () => {
  await localforage.clear()

  window.location.reload()
}
</script>

<style scoped>
.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 0.5s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
