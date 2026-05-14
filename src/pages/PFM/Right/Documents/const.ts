import pako from 'pako'
import { encode } from 'uint8-to-base64'

export const doc_types = [
  { code: 1, name: 'Договор' },
  { code: 2, name: 'Телеграмма' },
  { code: 3, name: 'Письмо (Обращение)' },
  { code: 4, name: 'Технология' },
  { code: 5, name: 'Другое' },
  { code: 6, name: 'Оперативный приказ' }
]

export const arrayBufferToBase64 = (array_buffer: ArrayBuffer) => {
  const bite_array = new Uint8Array(array_buffer)
  const compressed_data = pako.deflate(bite_array)

  const encoded_data = encode(compressed_data)
  return encoded_data.match(/.{1,76}/g)?.join('\n') ?? ''
}
