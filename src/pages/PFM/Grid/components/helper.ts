import Aura from '@primevue/themes/aura'
import PrimeVue from 'primevue/config'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'
import { createApp, h, reactive } from 'vue'

import { ru } from '@/app/locale'

export const mountVueInCell = (component: any, props: Record<string, any>, el: HTMLElement) => {
  const reactiveProps = reactive(props)

  const app = createApp({
    render: () => h(component, reactiveProps)
  })

  app.use(PrimeVue, {
    unstyled: false,
    ripple: true,
    theme: { preset: Aura },
    locale: ru
  })

  app.directive('tooltip', Tooltip)
  app.directive('ripple', Ripple)

  app.mount(el)

  return app
}
