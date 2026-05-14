import { saveAs } from 'file-saver'
import Pako from 'pako'
import { decode } from 'uint8-to-base64'

import { replaceAllSafe } from './string'

export const downloadBase64 = (file_name: string, doc_data: string) => {
  // При получении с сервера в doc_data '+' заменяются на пробелы, заменим их обратно
  const encoded = replaceAllSafe(doc_data, ' ', '+')

  const decoded_compressed = decode(encoded)
  const decoded = Pako.inflate(decoded_compressed)

  saveAs(new Blob([decoded]), file_name)
}
