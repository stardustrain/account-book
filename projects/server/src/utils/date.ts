const toDate = (date: Date) => new Date(date.getTime())

export const getStartOfMonth = (date: Date) => {
  const currentDate = toDate(date)
  currentDate.setUTCDate(1)
  currentDate.setUTCHours(0, 0, 0, 0)
  return currentDate
}

export const getEndOfMonth = (date: Date) => {
  const currentDate = toDate(date)
  currentDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
  currentDate.setUTCHours(23, 59, 59, 999)
  return currentDate
}
