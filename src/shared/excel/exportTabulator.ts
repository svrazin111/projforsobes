import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { range } from 'lodash'
import { ColumnDefinition, RowComponent } from 'tabulator-tables'

import { replaceAllSafe } from '../string'

export const flattenColumns = (columns: ColumnDefinition[]) => {
  const result: ColumnDefinition[] = []
  const step = (cols: ColumnDefinition[]) => {
    for (const col of cols) {
      if (col.columns && col.columns.length > 0) {
        step(col.columns)
      } else {
        result.push(col)
      }
    }
  }
  step(columns)
  return result
}
const getMaxDepth = (cols: ColumnDefinition[]) => {
  let max = 0
  for (const c of cols) {
    if (c.columns && c.columns.length) {
      max = Math.max(max, 1 + getMaxDepth(c.columns))
    } else {
      max = Math.max(max, 1)
    }
  }
  return max
}

const applyTabulatorFormatter = (value: string, rowData: any, colDef: ColumnDefinition): string => {
  const formatter = colDef.formatter
  if (!colDef.field || typeof formatter !== 'function') {
    return value ?? ''
  }

  try {
    const fakeCell = {
      getValue: () => value,
      getData: () => rowData,
      getField: () => colDef.field,

      getElement: () => document.createElement('div')
    }

    const result = formatter(fakeCell)

    if (result instanceof HTMLElement) {
      return result.innerText
    }

    if (typeof result === 'string') {
      const div = document.createElement('div')
      div.innerHTML = result
      return div.innerText
    }

    return String(result) ?? ''
  } catch (e) {
    return value ?? ''
  }
}

/**
 * Export Tabulator tree table to Excel
 *
 * @param rows - Tabulator RowComponent array
 * @param columns - Tabulator column definition array
 * @param filename - File name .xlsx
 */
export const exportTabulatorTree = async ({
  rows,
  columns,
  filename = 'export.xlsx'
}: {
  rows: RowComponent[]
  columns: ColumnDefinition[]
  filename: string
}) => {
  // Только нижний уровень колонок для хэдера
  const flatten = flattenColumns(columns)
  const headerDepth = getMaxDepth(columns)
  const headerRows: string[][] = Array.from({ length: headerDepth }, () => [])
  const merges: any[] = []

  const columnDefMap = new Map<string, ColumnDefinition>()
  flatten.forEach((item) => {
    if (item.field) columnDefMap.set(item.field, item)
  })

  // В массив с хэдерами добавлять пустые ячейки, если надо
  const ensureHeaderCell = (headerRows: string[][], level: number, idx: number) => {
    while (headerRows[level].length <= idx) headerRows[level].push('')
  }

  const buildHeaders = (nodes: any[], level = 0) => {
    nodes.forEach((node) => {
      ensureHeaderCell(headerRows, level, colIndex)

      headerRows[level][colIndex] = node.title ?? node.field ?? ''

      if (node.columns?.length) {
        const start = colIndex

        buildHeaders(node.columns, level + 1)

        // Мержить горизонтально
        const end = colIndex - 1
        if (end > start)
          merges.push({ start: { row: level, column: start }, end: { row: level, column: end } })
      } else {
        // Мержить вертикально
        if (level < headerDepth - 1) {
          merges.push({
            start: { row: level, column: colIndex },
            end: { row: headerDepth - 1, column: colIndex }
          })
        }
        colIndex++
      }
    })
  }

  // Заполнить headerRows
  let colIndex = 0
  buildHeaders(columns)

  const htmlToText = (html: string) => {
    const temp = document.createElement('div')
    temp.innerHTML = html

    const rows = temp.querySelectorAll(':scope > div > div')
    const lines: string[] = []

    rows.forEach((row, index) => {
      const textEl = row.children[1] as HTMLElement | undefined
      const text = (textEl?.textContent ?? '').trim()

      lines.push(`${'   '.repeat(index * 2)}${text}`)
    })

    return lines.join('\r\n')
  }

  // Текст первой колонки спарсить из html в просто текст
  const firstCol = flatten[0]
  if (firstCol) {
    const originalCol = columns.find((c) => c.field === firstCol.field)
    if (
      originalCol?.title &&
      typeof originalCol.title === 'string' &&
      originalCol.title.includes('<div')
    ) {
      headerRows[0][0] = htmlToText(originalCol.title)
    }
  }

  // Горизонтальное выравнивание в колонках
  const columnAlignMap = new Map<string, ExcelJS.Alignment['horizontal']>()
  flatten.forEach((col) => {
    if (!col.field) return
    let align: ExcelJS.Alignment['horizontal'] = 'left'
    if (col.hozAlign) align = col.hozAlign
    columnAlignMap.set(col.field, align)
  })

  // Добавить строки хэдера
  const sheetData: any[][] = []
  headerRows.forEach((row) =>
    sheetData.push([...row].map((item) => replaceAllSafe(item, '<br>', '\n')))
  )

  // Добавить просто строки
  rows.forEach((row) => {
    const rowData = row.getData()

    let level = 0
    let parent = row.getTreeParent?.()
    while (parent) {
      level++
      parent = parent.getTreeParent?.()
    }

    const data = flatten.map((item, index) => {
      let value = rowData[item.field ?? 'undefined'] ?? ''

      // Применить форматтеры (стили здесь все равно не применятся)
      if (item.field && item.formatter && typeof item.formatter == 'function') {
        const colDef = columnDefMap.get(item.field)

        if (colDef) {
          value = applyTabulatorFormatter(rowData[item.field], rowData, colDef)
        }
      }

      // Для строк в первой колонке нужный текст лежит в label
      if (index === 0 && !value) value = rowData['label'] ?? ''
      if (index === 0) value = `${'        '.repeat(level)}${value}`
      return value
    })

    sheetData.push(data)
  })

  // ExcelJS
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Export')

  sheetData.forEach((row) => worksheet.addRow(row))

  // Merges
  merges.forEach((item) => {
    worksheet.mergeCells(
      item.start.row + 1,
      item.start.column + 1,
      item.end.row + 1,
      item.end.column + 1
    )
  })

  // Стиль для хэдера
  range(headerDepth + 1).forEach((item) => {
    const row = worksheet.getRow(item)
    // Высота в зависимости от количества переносов

    const maxLines = Math.max(
      ...row.values.map((v: any) => (typeof v === 'string' ? v.split('\r\n').length : 1))
    )

    row.height = maxLines * 18

    row.eachCell((cell) => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F2F2F2' } }
      cell.font = { bold: true, size: 10 }
      cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    })
  })

  // Стиль для строк
  worksheet.eachRow((row, rowNum) => {
    if (rowNum <= headerDepth) return

    const dataIndex = rowNum - headerDepth - 1
    const tabRow = rows[dataIndex]
    const isStriped = dataIndex % 2 === 1
    const hasChildren = tabRow?.getTreeChildren?.()?.length > 0

    row.eachCell((cell, colNumber) => {
      const leafCol = flatten[colNumber - 1]
      const align = leafCol?.field ? columnAlignMap.get(leafCol.field) ?? 'left' : 'left'

      cell.alignment = { horizontal: align, vertical: 'middle' }
      cell.border = {
        top: { style: 'thin', color: { argb: '808080' } },
        left: { style: 'thin', color: { argb: '808080' } },
        bottom: { style: 'thin', color: { argb: '808080' } },
        right: { style: 'thin', color: { argb: '808080' } }
      }
      cell.font = { bold: false, size: 10 }

      // Для строк иерарии темно-серый
      if (hasChildren) {
        if (isStriped) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DEDEDE' } }
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E5E5E5' } }
        }
      }
      // Строки в полоску
      else if (isStriped) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F7F7F7' } }
      } else {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFF' } }
      }

      // Перенос некоторых стилей, как в форматтерах cellBlue, cellBold, cellBlueBold, cellClickable, treeExpander
      const formatter = leafCol?.formatter

      const styleTag = (formatter as any)?.__excelStyle

      if (styleTag == 'blue') {
        cell.font = { ...cell.font, color: { argb: '0000ff' } }
      }

      if (styleTag == 'bold') {
        cell.font = { ...cell.font, bold: true }
      }

      if (styleTag == 'bold-blue') {
        cell.font = { ...cell.font, bold: true, color: { argb: '0000ff' } }
      }

      if ((styleTag == 'clickable' || styleTag == 'expander') && cell.text.length > 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ffffe0' } }
      }
    })
  })

  // Ширина колонок
  worksheet.columns.forEach((item, index) => {
    item.width = flatten[index]?.width
      ? Math.max(6, Math.min(60, Math.round(Number(flatten[index].width) / 6.5)))
      : 24
    if (index === 0) item.alignment = { horizontal: 'left', vertical: 'middle' }
  })

  // Сохранение
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), filename)
}
