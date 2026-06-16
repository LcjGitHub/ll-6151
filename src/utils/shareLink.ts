import type { WritingMode } from '../types'
import { MAX_SENTENCE_LENGTH } from './mapSentence'

const SENTENCE_PARAM = 's'
const MODE_PARAM = 'm'
const MODE_HORIZONTAL = 'h'
const MODE_VERTICAL = 'v'

export interface ShareParams {
  sentence: string
  writingMode: WritingMode
}

/**
 * 将短句和排版方向编码为 URL 查询参数
 */
export function encodeShareParams(params: ShareParams): string {
  const searchParams = new URLSearchParams()
  searchParams.set(SENTENCE_PARAM, params.sentence)
  const mode = params.writingMode === 'vertical' ? MODE_VERTICAL : MODE_HORIZONTAL
  searchParams.set(MODE_PARAM, mode)
  return searchParams.toString()
}

/**
 * 生成完整的分享链接
 */
export function generateShareLink(params: ShareParams): string {
  const baseUrl = `${window.location.origin}${window.location.pathname}`
  const queryString = encodeShareParams(params)
  return `${baseUrl}?${queryString}`
}

/**
 * 从 URL 查询参数中解析分享数据
 * 解析失败或参数非法时返回 null
 */
export function decodeShareParams(search: string): ShareParams | null {
  try {
    const searchParams = new URLSearchParams(search)
    const sentence = searchParams.get(SENTENCE_PARAM)
    const mode = searchParams.get(MODE_PARAM)

    if (sentence === null || mode === null) {
      return null
    }

    if (sentence.length === 0 || sentence.length > MAX_SENTENCE_LENGTH) {
      return null
    }

    if (mode !== MODE_HORIZONTAL && mode !== MODE_VERTICAL) {
      return null
    }

    const writingMode: WritingMode = mode === MODE_VERTICAL ? 'vertical' : 'horizontal'

    return {
      sentence,
      writingMode,
    }
  } catch {
    return null
  }
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    } catch {
      document.body.removeChild(textarea)
      return false
    }
  }
}
