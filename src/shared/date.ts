/**
 * @return 2024-01-01
 */
export const parseDate = (date: Date | undefined) => {
  if (!date) return ''
  date = new Date(date)

  const year = String(date.getFullYear())
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())
  if (month.length == 1) month = `0${month}`
  if (day.length == 1) day = `0${day}`
  return `${year}-${month}-${day}`
}

/**
 * @return 01.01.2024
 */
export const parseDateDDMMYYYY = (date: Date | undefined) => {
  if (!date) return ''
  date = new Date(date)

  const year = String(date.getFullYear())
  let month = String(date.getMonth() + 1)
  let day = String(date.getDate())
  if (month.length == 1) month = `0${month}`
  if (day.length == 1) day = `0${day}`
  return `${day}.${month}.${year}`
}

/**
 * @return 01.01.2024 00:00
 */
export const parseDateTimeDDMMYYYY = (date: Date | undefined) => {
  if (!date) return ''

  date = new Date(date)

  const h = date.getHours()
  const m = date.getMinutes()

  const time = `${addZero(h)}:${addZero(m)}`
  return `${parseDateDDMMYYYY(date)} ${time}`
}

/**
 * @return 2024-01-01 00:00:00.000000
 */
export const parseDateTime = (date: Date | undefined, real_time = true) => {
  if (!date) return ''

  date = new Date(date)

  const h = date.getHours()
  const m = date.getMinutes()
  const s = date.getSeconds()

  const time = `${addZero(h)}:${addZero(m)}:${addZero(s)}.000000`
  const fake_time = `00:00:00.000000`

  if (real_time) return `${parseDate(date)} ${time}`
  else return `${parseDate(date)} ${fake_time}`
}

/**
 * @return new Date('01.01.2100')
 */
export const forever = () => {
  return new Date('01.01.2100')
}

export const yesterday = () => {
  const date = new Date()
  date.setDate(date.getDate() - 1)
  return date
}

export const monthAgo = () => {
  const date = new Date()
  date.setDate(date.getDate() - 30)
  return date
}

export const isMoreThanThreeDays = (date1: string | Date, date2: string | Date) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)

  const diffMs = Math.abs(d2 - d1)
  const oneWeekMs = 3 * 24 * 60 * 60 * 1000

  return diffMs > oneWeekMs
}

export const daysBetween = (start: Date | string, end: Date | string) => {
  const diff = new Date(end).getTime() - new Date(start).getTime()

  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export const dayTitle = (num: number) => {
  if (num > 10 && [11, 12, 13, 14].includes(num % 100)) return 'дней'
  const last_num = num % 10
  if (last_num == 1) return 'день'
  if ([2, 3, 4].includes(last_num)) return 'дня'
  if ([5, 6, 7, 8, 9, 0].includes(last_num)) return 'дней'
  return ''
}

const addZero = (num: number) => {
  return num < 10 ? `0${num}` : `${num}`
}
