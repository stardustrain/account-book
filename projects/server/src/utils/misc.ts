import { pickBy, isNil } from 'ramda'
import { NonNullObject } from './types'

export const removeNullableValuesFromObject = <T extends object>(obj: T) =>
  pickBy<T, NonNullObject<T>>((value) => !isNil(value), obj)
