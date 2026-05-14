import { reactive } from 'vue'

export const state = reactive({
  visible: false,
  title: '',
  message: '',
  html: false,
  yesLabel: '',
  noLabel: '',
  onYes: () => {},
  onNo: () => {}
})

/**
 * Open a yes/no confirmation dialog.
 *
 * @param options.title string title
 * @param options.message string message (text or html)
 * @param options.actionYes callback when user clicks Yes
 * @param options.actionNo callback when user clicks No (optional)
 * @param options.yesLabel label for yes button (optional)
 * @param options.noLabel label for no button (optional)
 * @param options.html boolean whether message is HTML (defaults false)
 */
export function openConfirm({
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
  actionYes: () => void
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
  state.onYes = () => {
    try {
      actionYes()
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
