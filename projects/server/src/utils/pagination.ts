import { isNil, drop, take } from 'rambda'
import { atob, btoa } from './base64'
import type { Maybe } from '../../../shared/models'

type PaginationArgs = {
  after?: Maybe<string>
  first?: Maybe<number>
  before?: Maybe<string>
  last?: Maybe<number>
}

const DEFAULT_PAGE_SIZE = 20

export const isForwardPagination = ({ after, before }: PaginationArgs) => typeof after === 'string' && isNil(before)
export const isBackwardPagination = ({ after, before }: PaginationArgs) => isNil(after) && typeof before === 'string'

const decodeCursor = (cursorExpected?: Maybe<string>) => {
  if (typeof cursorExpected === 'string') {
    const [, cursor] = atob(cursorExpected).split(':')
    return parseInt(cursor, 10)
  }
}

export const encodeCursor = (typeName: string, id: number) => btoa(`${typeName}:${id}`)

export const getTakeSize = (size?: Maybe<number>) => size ?? DEFAULT_PAGE_SIZE

export const validatePaginationArgs = ({ after, first, before, last }: PaginationArgs) => {
  if (!isNil(after) && !isNil(before)) {
    throw Error('after, before 둘 중 하나만')
  }

  if (typeof after === 'string' && typeof last === 'number') {
    throw Error('after 쓸거면 first를 넣으셈')
  }

  if (typeof before === 'string' && typeof first === 'number') {
    throw Error('before 쓸거면 last를 넣으셈')
  }

  if ((typeof first === 'number' && first >= 100) || (typeof last === 'number' && last >= 100)) {
    throw Error('100 이하의 숫자만')
  }
}

export const generateFindmanyOptions = ({ after, first, before, last }: PaginationArgs) => {
  if (isForwardPagination({ after, before })) {
    const cursor = decodeCursor(after)
    return {
      skip: cursor ? 1 : undefined,
      cursor: {
        id: cursor,
      },
      take: getTakeSize(first) + 1,
    }
  }

  if (isBackwardPagination({ after, before })) {
    const cursor = decodeCursor(before)
    return {
      skip: cursor ? 1 : undefined,
      cursor: {
        id: cursor,
      },
      take: -1 * (getTakeSize(last) + 1),
    }
  }
}

type Model = { id: number }
type GeneratePageInfoArgs<T = Model> = PaginationArgs & {
  nodes: T[]
}
export const getPaginationStatus = ({ after, before, nodes, first, last }: GeneratePageInfoArgs) => {
  if (isForwardPagination({ after, before })) {
    return {
      hasPreviousPage: !!after,
      hasNextPage: nodes.length > getTakeSize(first),
    }
  }

  if (isBackwardPagination({ after, before })) {
    return {
      hasPreviousPage: nodes.length > getTakeSize(last),
      hasNextPage: !!before,
    }
  }

  return {
    hasPreviousPage: false,
    hasNextPage: false,
  }
}

type GetCursorInfoArgs<T = Model, U = 'id'> = U extends keyof T ? T : never
export const getCursorInfo = (nodes: Readonly<GetCursorInfoArgs[]>) => ({
  startCursor: nodes.length === 0 ? null : encodeCursor('Cursor', nodes[0].id),
  endCursor: nodes.length === 0 ? null : encodeCursor('Cursor', nodes[nodes.length - 1].id),
})
