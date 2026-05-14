import { XMLParser } from 'fast-xml-parser'
import ky, { KyResponse } from 'ky'

import { emitter } from '@/app/plugins/mitt'
import { objectToXml } from '@/shared/xml'

// ! Если используем query(), обязательно добавить его url в proxy в vite.config.ts

const base_url = ''

interface Option {
  method?: 'get' | 'post'
  parse?: 'json' | 'xml' | 'blob' | 'text'
  silent?: boolean
  db?: 'jaxrpc-DBQuest' | 'excel-proc'
}

const default_db = 'jaxrpc-DBQuest'

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: ''
})

/**
 * @param url - Endpoint path (without prefix)
 * @param params - JSON body
 * @param options - method, db, parse, silent
 * @returns XML/JSON/text/blob or null on error
 */
export const query = async (
  url: string,
  params: object = {},
  options: Option = { parse: 'json' }
) => {
  if (!options.silent) emitter.emit('query-start')

  try {
    const response = await ky.post(url, {
      headers: {
        'content-type': 'application/json'
      },
      prefixUrl: base_url,
      json: params
    })

    return handleResponse(response, options)
  } catch (error) {
    emitter.emit('toast', {
      detail: 'Ошибка выполнения запроса',
      error: String(error)
    })
    return null
  } finally {
    if (!options.silent) emitter.emit('query-end')
  }
}

/**
 * @param def_name - Definition name
 * @param query_set - QuerySet name
 * @param params - Parameters object (converted to XML)
 * @param options - method, db, parse, silent
 * @param ref_id_name - RefID for cData
 * @param ref_id_params - cData
 * @returns XML/JSON/text/blob or null on error
 */
export const xmlQuery = async (
  def_name: string,
  query_set: string,
  params: object = {},
  options: Option = {
    method: 'post',
    parse: 'xml',
    silent: false,
    db: default_db
  },
  ref_id_name: string = '',
  ref_id_params: string = ''
) => {
  if (!options.silent) emitter.emit('query-start')

  const refIdXml = ref_id_name ? `<RefID ID="${ref_id_name}">${ref_id_params}</RefID>` : ''

  const url = `${base_url}/${options.db ?? default_db}/HTTPQuery?DefName=${def_name}&codePage=UTF-8`

  const body = `<QuerySet refid="${query_set}">${refIdXml}${objectToXml(params)}</QuerySet>`

  try {
    let response: KyResponse<unknown>

    if (options.method === 'get') {
      response = await ky.get(`${url}&xmlQuery=${body}`, { timeout: false })
    } else {
      response = await ky.post(url, { body, timeout: false })
    }

    return handleResponse(response, options, `${url}&xmlQuery=${body}`)
  } catch (error) {
    emitter.emit('toast', { detail: 'Ошибка выполнения запроса', error: String(error) })
    return null
  } finally {
    if (!options.silent) emitter.emit('query-end')
  }
}

const handleResponse = async (response: KyResponse<unknown>, options: Option, body?: string) => {
  if (!response) return null

  switch (options.parse) {
    case 'json':
      return await response.json()

    case 'xml': {
      const text = await response.text()
      const xml = xmlParser.parse(text)

      if (!text) {
        emitter.emit('toast', { detail: 'Ошибка выполнения запроса', error: `${body}` })
        return null
      }

      if (!xml || text.includes('<ERROR>')) {
        emitter.emit('toast', { detail: 'Ошибка выполнения запроса', error: `${text}` })
        return null
      }
      return xml
    }

    case 'blob':
      return await response.blob()

    case 'text': {
      const text = await response.text()
      if (text.includes('<ERROR>')) {
        emitter.emit('toast', { detail: 'Ошибка выполнения запроса', error: `${text}` })
        return null
      }
      return text
    }
  }

  return null
}
