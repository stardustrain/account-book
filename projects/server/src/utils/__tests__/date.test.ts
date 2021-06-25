import { getStartOfMonth, getEndOfMonth } from '../date'

describe('date.ts', () => {
  describe('startOfMonth(date: Date)', () => {
    test('should return date instance that set already start of month.', () => {
      const jan = new Date()
      jan.setMonth(0)
      const startOfJan = getStartOfMonth(jan)
      expect(startOfJan.getUTCMonth()).toBe(0)
      expect(startOfJan.getUTCDate()).toBe(1)
      expect(startOfJan.getUTCHours()).toBe(0)
      expect(startOfJan.getMinutes()).toBe(0)
      expect(startOfJan.getSeconds()).toBe(0)

      const july = new Date()
      july.setMonth(6)
      const startOfJul = getStartOfMonth(july)
      expect(startOfJul.getUTCMonth()).toBe(6)
      expect(startOfJul.getUTCDate()).toBe(1)
      expect(startOfJul.getUTCHours()).toBe(0)
      expect(startOfJul.getMinutes()).toBe(0)
      expect(startOfJul.getSeconds()).toBe(0)
    })
  })

  describe('getEndOfMonth(date: Date)', () => {
    test('should return date instance that set already end of month.', () => {
      const jan = new Date()
      jan.setMonth(0)
      const startOfJan = getEndOfMonth(jan)
      expect(startOfJan.getUTCMonth()).toBe(0)
      expect(startOfJan.getUTCDate()).toBe(31)
      expect(startOfJan.getUTCHours()).toBe(23)
      expect(startOfJan.getMinutes()).toBe(59)
      expect(startOfJan.getSeconds()).toBe(59)

      const apr = new Date()
      apr.setMonth(3)
      const startOfApr = getEndOfMonth(apr)
      expect(startOfApr.getUTCMonth()).toBe(3)
      expect(startOfApr.getUTCDate()).toBe(30)
      expect(startOfApr.getUTCHours()).toBe(23)
      expect(startOfApr.getMinutes()).toBe(59)
      expect(startOfApr.getSeconds()).toBe(59)
    })
  })
})
