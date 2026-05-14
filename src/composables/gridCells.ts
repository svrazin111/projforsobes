import { CellComponent } from 'tabulator-tables'

export const cellBold = (cell: CellComponent) =>
  `<div class="font-bold overflow-hidden text-ellipsis">${getCellValue(cell)}</div>`
;(cellBold as any).__excelStyle = 'bold'

export const cellBoldBlue = (cell: CellComponent) =>
  `<div class="font-bold text-[#0000BB] overflow-hidden text-ellipsis">${getCellValue(cell)}</div>`
;(cellBoldBlue as any).__excelStyle = 'bold-blue'

export const cellBlue = (cell: CellComponent) =>
  `<div class="text-[#0000BB] overflow-hidden text-ellipsis">${getCellValue(cell)}</div>`
;(cellBlue as any).__excelStyle = 'blue'

export const getCellValue = (cell: CellComponent) => {
  if (cell == undefined) return ''
  return cell.getValue() ?? ''
}
