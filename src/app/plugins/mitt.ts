import mitt from 'mitt'

import { FilterEventType } from '@/core/singleton/PopUpFilter.vue'
import { ToastEventType } from '@/core/singleton/toast/Toast.vue'

type Events = {
  toast: ToastEventType
  'query-start': undefined
  'query-end': undefined
  'new-filter': FilterEventType
}

export const emitter = mitt<Events>()
