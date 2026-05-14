export const replaceAllSafe = (str: string, search: string, replacement: string) => {
  if (!str || !str.replace) return ''

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return str.replace(new RegExp(escaped, 'g'), replacement)
}
