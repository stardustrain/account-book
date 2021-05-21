import { atob, btoa } from '../base64'

describe('base64.ts', () => {
  describe('atob(str: string): string', () => {
    test('should return decoded string from base64.', () => {
      expect(atob('VXNlcjo1ZTgyNGM4YTUwZjcwMzdhMjhmZDdmZWU=')).toBe('User:5e824c8a50f7037a28fd7fee')
      expect(atob('Q2F0ZWdvcnk6MTc=')).toBe('Category:17')
      expect(atob('')).toBe('')
    })
  })

  describe('btoa(str: string): string', () => {
    test('should return base64 encoded string from utf-8 string.', () => {
      expect(btoa('User:5e824c8a50f7037a28fd7fee')).toBe('VXNlcjo1ZTgyNGM4YTUwZjcwMzdhMjhmZDdmZWU=')
      expect(btoa('Category:17')).toBe('Q2F0ZWdvcnk6MTc=')
      expect(btoa('')).toBe('')
    })
  })
})
