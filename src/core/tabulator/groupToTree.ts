import { ColumnDefinition } from 'tabulator-tables'

export const groupToTree = (
  data: any[],
  groupFields: string[],
  aggregateFields: string[],
  sortFields: string[],
  level = 0
) => {
  if (!groupFields.length) {
    return data.map((item) => ({
      ...item,
      step: level
    }))
  }

  const field = groupFields[0]
  const sortField = sortFields[0]
  const map: Record<string, any> = {}

  for (const row of data) {
    const val = row[field]

    if (!map[val]) {
      map[val] = {
        label: val ?? 'Общий итог',
        [field]: val,
        [sortField]: row[sortField],
        _children: [],
        step: level
      }

      for (const agg of aggregateFields) {
        map[val][agg] = 0
      }
    }

    map[val]._children.push(row)

    for (const agg of aggregateFields) {
      const num = Number(row[agg])
      if (!isNaN(num)) {
        map[val][agg] += num
        map[val][agg] = Number(map[val][agg].toFixed(2))
      }
    }
  }

  let result = Object.values(map)

  if (sortField) {
    result = result.sort((a, b) => {
      const x = a[sortField]
      const y = b[sortField]
      return x < y ? -1 : x > y ? 1 : 0
    })
  }

  if (groupFields.length > 1) {
    for (const group of result) {
      group._children = groupToTree(
        group._children,
        groupFields.slice(1),
        aggregateFields,
        sortFields.slice(1),
        level + 1
      )
    }
  } else {
    for (const group of result) {
      group._children = group._children.map((child) => ({
        ...child,
        step: level + 1
      }))
    }

    if (sortField) {
      for (const group of result) {
        group._children.sort((a, b) => {
          const x = a[sortField]
          const y = b[sortField]
          return x < y ? -1 : x > y ? 1 : 0
        })
      }
    }
  }

  return result
}

export const filterColumns = (
  columns: ColumnDefinition[] = [],
  fields_to_remove: string[] = []
) => {
  return columns
    .map((col) => {
      if (col.columns) {
        const sub_columns = filterColumns(col.columns, fields_to_remove)

        if (sub_columns.length === 0) return null

        return { ...col, columns: sub_columns }
      }

      if (col.field && fields_to_remove.includes(col.field)) {
        return null
      }

      return col
    })
    .filter(Boolean)
}

/**
 * @param groupFields [ "", "rd_oper_name", ... ]
 * @param avalible_groups [ { "id": 0, "label": "Общий итог", "value": "" }, { "id": 1, "label": "Дорога нарушения", "value": "rd_oper_name" }, ... ]
 * @returns ```
  *          <div class="pt-3.5 pl-7">
                <div class="flex">
                  <div style="width: 0px"></div>
                  <div class="whitespace-nowrap">Общий итог</div>
                </div>
                <div class="flex">
                  <div style="width: 10px"></div>
                  <div class="whitespace-nowrap">Дорога нарушения</div>
                </div>
                <div class="flex">
                  <div style="width: 20px"></div>
                  <div class="whitespace-nowrap">Вид нарушения</div>
                </div>
                ...
              </div>
 *          ```
 */
export const getHierarchyTitleForExpanderColumn = (
  groupFields: string[] = [],
  avalible_groups: { id: number; label: string; value: string }[] = []
) => {
  const html_column_hierarchy_items = <string[]>[]

  const hierarchy_groups = groupFields.map(
    (item) => avalible_groups.filter((item2) => item2.value == item)[0]
  )

  hierarchy_groups.forEach((item, index) => {
    html_column_hierarchy_items.push(
      `<div class="flex">
        <div style="width: ${index * 10}px"></div>
        <div class="whitespace-nowrap">${item?.label}</div>
      </div>`
    )
  })

  return `<div class="pt-3.5 pl-7">${html_column_hierarchy_items.join('')}</div>`
}
