import { isArray, keys, some } from 'lodash'

export const toArray = (value: unknown) => {
  if (Array.isArray(value)) return value

  if (
    value &&
    typeof value === 'object' &&
    Object.values(value as Record<string, unknown>).some((v) => v !== '')
  ) {
    return [value]
  }

  return []
}

export const filterDuplicates = (array) => {
  const without_duplicates = []

  const ids = new Set(array.map((item) => item['id']))

  ids.forEach((id) => {
    without_duplicates.push(array.find((item) => item['id'] == id))
  })

  return without_duplicates
}

// Нужна чисто в одном месте
export const findDeletedItem = (original, modified) => {
  const modifiedSet = new Set(modified.map((item) => JSON.stringify(item)))

  for (const item of original) {
    if (!modifiedSet.has(JSON.stringify(item))) {
      return item
    }
  }
  return undefined
}
