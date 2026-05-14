import { DialogServiceMethods } from 'primevue'

import { xmlQuery } from '@/app/plugins/ky'
import RawHtml from '@/components/RawHtml.vue'
import { replaceAllSafe } from '@/shared/string'

// Открыть карточку маршрута
export const openInfoCard = async (cell_data: { marsh_id: any }) => {
  if (!cell_data || !cell_data.marsh_id) return

  let data = await xmlQuery(
    'PFM2_RPT_Defs',
    'Get_MARSH_DESCRIPTION',
    { MARSH_ID: cell_data.marsh_id },
    { parse: 'text' }
  )

  data = replaceAllSafe(data, '\r', '<br>')
  data = replaceAllSafe(data, '\t', '&nbsp;&nbsp;&nbsp;&nbsp;')

  const dialog: DialogServiceMethods = window['dialog']
  dialog.open(RawHtml, {
    props: {
      header: 'Карточка маршрута',
      style: {
        width: '600px',
        padding: '4px'
      },
      modal: true
    },
    data: {
      html: `<div>${data}</div>`
    }
  })
}
