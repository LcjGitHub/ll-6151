import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  encodeShareParams,
  decodeShareParams,
  generateShareLink,
  copyToClipboard,
  type ShareParams,
} from '../shareLink'

describe('shareLink - 分享链接编解码工具', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:5173',
        pathname: '/compose',
        href: 'http://localhost:5173/compose',
        search: '',
      },
      writable: true,
    })
  })

  describe('encodeShareParams - 编码分享参数', () => {
    it('横排短句正确编码', () => {
      const params: ShareParams = {
        sentence: '活字印刷',
        writingMode: 'horizontal',
      }
      const result = encodeShareParams(params)
      expect(result).toContain('s=%E6%B4%BB%E5%AD%97%E5%8D%B0%E5%88%B7')
      expect(result).toContain('m=h')
    })

    it('竖排短句正确编码', () => {
      const params: ShareParams = {
        sentence: '竖排测试',
        writingMode: 'vertical',
      }
      const result = encodeShareParams(params)
      expect(result).toContain('s=%E7%AB%96%E6%8E%92%E6%B5%8B%E8%AF%95')
      expect(result).toContain('m=v')
    })

    it('空字符串短句正确编码', () => {
      const params: ShareParams = {
        sentence: '',
        writingMode: 'horizontal',
      }
      const result = encodeShareParams(params)
      expect(result).toContain('s=')
      expect(result).toContain('m=h')
    })

    it('含特殊字符短句正确编码', () => {
      const params: ShareParams = {
        sentence: 'hello 世界!@#',
        writingMode: 'vertical',
      }
      const result = encodeShareParams(params)
      expect(result).toContain('s=hello+%E4%B8%96%E7%95%8C%21%40%23')
      expect(result).toContain('m=v')
    })
  })

  describe('decodeShareParams - 解码分享参数', () => {
    it('横排短句正确解码', () => {
      const search = '?s=%E6%B4%BB%E5%AD%97%E5%8D%B0%E5%88%B7&m=h'
      const result = decodeShareParams(search)
      expect(result).not.toBeNull()
      expect(result?.sentence).toBe('活字印刷')
      expect(result?.writingMode).toBe('horizontal')
    })

    it('竖排短句正确解码', () => {
      const search = '?s=%E7%AB%96%E6%8E%92%E6%B5%8B%E8%AF%95&m=v'
      const result = decodeShareParams(search)
      expect(result).not.toBeNull()
      expect(result?.sentence).toBe('竖排测试')
      expect(result?.writingMode).toBe('vertical')
    })

    it('不含问号的查询字符串也能正确解码', () => {
      const search = 's=%E6%B4%BB%E5%AD%97%E5%8D%B0%E5%88%B7&m=h'
      const result = decodeShareParams(search)
      expect(result).not.toBeNull()
      expect(result?.sentence).toBe('活字印刷')
    })

    it('缺失 s 参数时返回 null', () => {
      const search = '?m=h'
      const result = decodeShareParams(search)
      expect(result).toBeNull()
    })

    it('缺失 m 参数时返回 null', () => {
      const search = '?s=%E6%B4%BB%E5%AD%97'
      const result = decodeShareParams(search)
      expect(result).toBeNull()
    })

    it('m 参数非法时返回 null', () => {
      const search = '?s=%E6%B4%BB%E5%AD%97&m=x'
      const result = decodeShareParams(search)
      expect(result).toBeNull()
    })

    it('空字符串短句返回 null', () => {
      const search = '?s=&m=h'
      const result = decodeShareParams(search)
      expect(result).toBeNull()
    })

    it('超过最大长度的短句返回 null', () => {
      const longSentence = 'a'.repeat(21)
      const encoded = encodeURIComponent(longSentence)
      const search = `?s=${encoded}&m=h`
      const result = decodeShareParams(search)
      expect(result).toBeNull()
    })

    it('最大长度的短句正常解码', () => {
      const longSentence = 'a'.repeat(20)
      const encoded = encodeURIComponent(longSentence)
      const search = `?s=${encoded}&m=h`
      const result = decodeShareParams(search)
      expect(result).not.toBeNull()
      expect(result?.sentence).toBe(longSentence)
    })

    it('空查询字符串返回 null', () => {
      const result = decodeShareParams('')
      expect(result).toBeNull()
    })

    it('含特殊字符短句正确解码', () => {
      const search = '?s=hello%20%E4%B8%96%E7%95%8C%21%40%23&m=v'
      const result = decodeShareParams(search)
      expect(result).not.toBeNull()
      expect(result?.sentence).toBe('hello 世界!@#')
      expect(result?.writingMode).toBe('vertical')
    })
  })

  describe('generateShareLink - 生成完整分享链接', () => {
    it('正确生成包含协议、域名、路径和参数的完整链接', () => {
      const params: ShareParams = {
        sentence: '活字印刷',
        writingMode: 'horizontal',
      }
      const result = generateShareLink(params)
      expect(result).toMatch(/^http:\/\/localhost:5173\/compose\?/)
      expect(result).toContain('s=%E6%B4%BB%E5%AD%97%E5%8D%B0%E5%88%B7')
      expect(result).toContain('m=h')
    })
  })

  describe('copyToClipboard - 复制到剪贴板', () => {
    it('navigator.clipboard 可用时成功复制', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
        writable: true,
      })

      const result = await copyToClipboard('test text')
      expect(result).toBe(true)
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text')
    })

    it('navigator.clipboard 不可用时降级到 execCommand', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(true)
      const createElementSpy = vi.spyOn(document, 'createElement')
      const appendChildSpy = vi.spyOn(document.body, 'appendChild')
      const removeChildSpy = vi.spyOn(document.body, 'removeChild')

      const result = await copyToClipboard('fallback text')

      expect(result).toBe(true)
      expect(createElementSpy).toHaveBeenCalledWith('textarea')
      expect(appendChildSpy).toHaveBeenCalled()
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(removeChildSpy).toHaveBeenCalled()

      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })

    it('execCommand 失败时返回 false', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })

      document.execCommand = vi.fn().mockReturnValue(false)

      const result = await copyToClipboard('fail text')

      expect(result).toBe(false)
    })
  })
})
