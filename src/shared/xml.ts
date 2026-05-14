import { MoreLess } from '@/types/filters/moreless'

export const objectToXml = (object) => {
  const xml = <string[]>[]
  Object.keys(object).forEach((key) => {
    xml.push(`<TextParam ID="${key}">${object[key]}</TextParam>`)
  })
  return xml.join('')
}

export const replaceCompareSymbol = (s: MoreLess) => {
  if (s == '>') return '&gt;'
  if (s == '<') return '&lt;'
  if (s == '>=') return '&gt;='
  if (s == '<=') return '&lt;='
  if (s == '=') return '='
}
