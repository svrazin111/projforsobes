import { keys } from 'lodash'
import { CellComponent } from 'tabulator-tables'

import images from '@/shared/images/imported_images'

import { columns_for_groupping } from './columns_for_groupping'

export const cellClickable = (cell: CellComponent) => {
  if (!cell || !cell.getValue()) return `<div></div>`

  if (!cell.getRow().getTreeChildren().length) {
    cell.getElement().classList.add('clickable-cell')
    cell.getElement().style['textAlign'] = 'center'
  }

  if (columns_for_groupping.includes(cell.getField())) {
    cell.getElement().style['textAlign'] = 'end'
  }

  return `<div>${cell.getValue()}</div>`
}
;(cellClickable as any).__excelStyle = 'clickable'

export const treeExpander = (
  cell: CellComponent,
  field_to_display: string,
  additional_style: Partial<Record<keyof CSSStyleDeclaration, string>> = {},
  replace_doc_img_with_status: boolean = false
) => {
  const cell_data = cell.getData()
  const isOpen = cell._cell.row.modules.dataTree.open

  const step = cell_data.step * 18 + 18

  if (cell_data.label != undefined) {
    return `<div class="flex" style="position: absolute; top: 4px; left: ${step}px">
              <img class="mr-1 mt-[-2px] w-4" src="${
                isOpen ? images.folder : images.folder_closed
              }">
              ${cell_data.label}
            </div>`
  }

  cell.getElement().classList.add('clickable-cell')

  keys(additional_style).forEach((key) => {
    const css_key = key as keyof CSSStyleDeclaration
    cell.getElement().style[css_key] = additional_style[css_key]
  })

  if (replace_doc_img_with_status) {
    const status = cell_data.completed

    let status_img = ''

    switch (status) {
      case '0':
        status_img = images.arrow_right_blue
        break

      case '1':
      case '2':
        status_img = images.check
        break

      case '3':
      case '6':
        status_img = images.attention
        break
    }

    return `<div class="flex" style="position: absolute; top: 4px; left: ${step}px">
              <img class="mr-1 mt-[-2px] w-4" src="${status_img}">
              ${cell_data[field_to_display]}
            </div>`
  }

  return `<div class="flex" style="position: absolute; top: 4px; left: ${step}px">
            <img class="mr-1 mt-[-2px] w-4" src="${images.document_plain}">
            ${cell_data[field_to_display]}
          </div>`
}
;(treeExpander as any).__excelStyle = 'expander'

export const same_field_tooltip = (e: MouseEvent, cell: CellComponent) => {
  const el = document.createElement('div')
  el.innerText = `${cell.getValue()}`
  return el
}
