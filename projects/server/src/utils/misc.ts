import { pickBy, isNil } from 'ramda'
import { NonNullObject } from './types'

export const removeNullableValuesFromObject = <T extends Record<string, unknown>>(obj: T) =>
  pickBy<T, NonNullObject<T>>((value) => !isNil(value), obj)
