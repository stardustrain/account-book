import type { Context } from '../index'
import type { LedgerItem } from '../../generated/client'
import type { Maybe, LedgerItemConnection, Category, CategoryLedgerItemConnectionArgs } from '../../generated/resolvers'
export type { Maybe } from '../../generated/resolvers'

type PossiblePromise<T> = T | Promise<T>
interface DeepPartialArray<T> extends Array<PossiblePromise<DeepPartial<PossiblePromise<T>>>> {}
type DeepPartialObject<T> = {
  [P in keyof T]?: PossiblePromise<DeepPartial<PossiblePromise<T[P]>>>
}

type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? DeepPartialArray<U>
  : T extends object
  ? DeepPartialObject<T>
  : T | undefined

type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj
    params: TParams
  }>,
  context: TContext & {
    reply: import('fastify').FastifyReply
  },
) => Promise<Array<DeepPartial<TReturn>>>

type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>
      opts?: {
        cache?: boolean
      }
    }

type LoaderQuery<TObject extends Record<string, any>, TParams extends Record<string, any>> = {
  obj: TObject
  params: TParams
}

interface Loaders<TContext = import('mercurius').MercuriusContext & { reply: import('fastify').FastifyReply }> {
  Category?: {
    ledgerItemConnection?: LoaderResolver<
      Maybe<LedgerItemConnection>,
      Category,
      CategoryLedgerItemConnectionArgs,
      TContext
    >
  }
}

declare module 'mercurius' {
  interface MercuriusContext extends Context {}
  interface MercuriusLoaders extends Loaders {}
}

export const isPrismaLedgerItem = (ledgerItem: any): ledgerItem is LedgerItem =>
  'categoryId' in ledgerItem && typeof ledgerItem.categoryId === 'number'
export type NonNullObject<T extends object> = {
  [K in keyof T]-?: NonNullable<T[K]>
}
