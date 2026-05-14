import { forever, parseDateDDMMYYYY } from '@/shared/date'
import images from '@/shared/images/imported_images'

import { PfmRow } from '../../const/types'

export const row_style = (data: PfmRow) => {
  if (new Date(data.date_end) < new Date()) {
    return { color: '#aaaaaa' }
  }
}

export const marsh_type_formatter = (data: PfmRow) => {
  const date_end = new Date(data.date_end)
  const history = Number(data.history_count)

  if (date_end < new Date()) return images.delete_img
  if (date_end < forever()) return images.clock_yel
  if (data.from_etran == '1') return images.document_etran
  if (data.status == '1') {
    if (history == 0) return images.document_plain
    if (history > 0) return images.documents
  }

  return images.document_plain
}

export const date_end_tooltip = (data: PfmRow) => {
  const date_end = new Date(data.date_end)

  if (date_end >= forever()) return 'До отмены'
  return `До ${parseDateDDMMYYYY(date_end)}`
}
