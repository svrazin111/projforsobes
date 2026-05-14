import { uniqueId } from 'lodash'
import { markRaw, ref } from 'vue'

type PropsOf<T> = T extends new (...args: any[]) => { $props: infer P } ? P : never

export type Window = {
  id: string
  title: string
  component: object
  params: object
  jqx_window: object | undefined
  minified: boolean
}

export const window_list = ref<Window[]>([])

export const newWindow = <T extends abstract new (...args: any) => any>(
  title: string,
  component: T,
  params: PropsOf<T>,
  minified: boolean = false
) => {
  window_list.value.push({
    id: uniqueId('window_'),
    title: title,
    component: markRaw(component),
    params: params,
    jqx_window: undefined,
    minified: minified
  })
}
