import { reactive } from 'vue'

export const state = reactive({
  visible: false,
  title: '',
  message: '',
  html: false,
  yesLabel: '',
  noLabel: '',
  input: '',
  onYes: (value: string) => {},
  onNo: () => {}
})

export function openQuestion({
  title,
  message,
  actionYes,
  actionNo,
  yesLabel = 'Готово',
  noLabel = 'Отмена',
  html = false
}: {
  title: string
  message: string
  actionYes: (value: string) => void
  actionNo?: () => void
  yesLabel?: string
  noLabel?: string
  html?: boolean
}) {
  state.title = title
  state.message = message
  state.html = !!html
  state.yesLabel = yesLabel
  state.noLabel = noLabel
  state.onYes = (value: string) => {
    try {
      actionYes(value)
    } catch (error) {
      /* empty */
    }
  }
  state.onNo = () => {
    if (actionNo) {
      try {
        actionNo()
      } catch (error) {
        /* empty */
      }
    }
  }

  state.visible = true
}
