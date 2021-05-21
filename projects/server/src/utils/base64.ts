/**
 *
 * @param str base64 string
 * @returns decoded utf-8 string
 */
export const atob = (str: string) => {
  const buf = Buffer.from(str, 'base64')
  const base64Decoded = buf.toString('utf-8')
  return base64Decoded
}

/**
 *
 * @param str utf-8 string
 * @returns base64 encoded string
 */
export const btoa = (str: string) => {
  const buf = Buffer.from(str, 'utf-8')
  const base64Encoded = buf.toString('base64')
  return base64Encoded
}
