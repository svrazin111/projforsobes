import 'primeicons/primeicons.css'
import 'splitpanes/dist/splitpanes.css'
import '../assets/styles/base.css'
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import 'vue-files-preview/lib/style.css'

import Aura from '@primevue/themes/aura'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import Ripple from 'primevue/ripple'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import { createApp } from 'vue'
import VueFilesPreview from 'vue-files-preview'

import App from './App.vue'
import { ru } from './locale'

const app = createApp(App)
const pinia = createPinia()

app.use(PrimeVue, {
  unstyled: false,
  ripple: true,
  theme: { preset: Aura },
  locale: ru
})
app.directive('ripple', Ripple)
app.use(ToastService)
app.use(DialogService)
app.use(pinia)
app.use(VueFilesPreview)
app.directive('tooltip', Tooltip)
app.mount('#app')
