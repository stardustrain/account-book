import { isNil, take, drop } from 'rambda'
import { atob, btoa } from '../../utils/base64'
import type { Maybe } from '../../../../shared/models'

const enum PaginationDirection {
  FORWARD,
  BACKWARD,
}

type PrismaFindmanyParams = {
  cursor?: { id?: number }
  take?: number
  skip?: number
}
type PaginationModel<T extends any[], U = 'id'> = U extends keyof T[number] ? T : never
export type PaginationConstructorParams<T extends any[] = any[]> = {
  nodes?: PaginationModel<T>
  after?: Maybe<string>
  first?: Maybe<number>
  before?: Maybe<string>
  last?: Maybe<number>
}

export default abstract class Pagination<T extends any[] = any[]> {
  _nodes?: PaginationModel<T>
  _edges?: { cursor: string; node: Omit<T[number], 'id'> & { id: string } }[]
  after?: Maybe<string>
  first?: Maybe<number>
  before?: Maybe<string>
  last?: Maybe<number>
  DEFAULT_PAGE_SIZE = 20
  paginationDirection: Maybe<PaginationDirection>
  size: number
  findManyOptions?: PrismaFindmanyParams
  typeName: Maybe<string> = null

  constructor({ nodes, after, first, before, last }: PaginationConstructorParams<T>) {
    this._nodes = nodes
    this.after = after
    this.first = first
    this.before = before
    this.last = last
    this.paginationDirection = null
    this.size = 0
  }

  protected setParams = ({ after, first, before, last }: PaginationConstructorParams) => {
    this.after = after
    this.first = first
    this.before = before
    this.last = last
    this.initialize()
  }

  protected initialize = () => {
    this.validatePaginationArgs()
    if (typeof this.after === 'string' && typeof this.first === 'number' && isNil(this.before)) {
      this.paginationDirection = PaginationDirection.FORWARD
      this.size = this.first
    }

    if (isNil(this.after) && typeof this.before === 'string' && typeof this.last === 'number') {
      this.paginationDirection = PaginationDirection.BACKWARD
      this.size = this.last
    }

    this.size = this.first ?? this.DEFAULT_PAGE_SIZE
    this.findManyOptions = this.generateFindmanyOptions()
  }

  protected validatePaginationArgs = () => {
    if (!isNil(this.after) && !isNil(this.before)) {
      throw Error('after, before 둘 중 하나만')
    }

    if (typeof this.after === 'string' && typeof this.last === 'number') {
      throw Error('after 쓸거면 first를 넣으셈')
    }

    if (typeof this.before === 'string' && typeof this.first === 'number') {
      throw Error('before 쓸거면 last를 넣으셈')
    }

    if (typeof this.first === 'number' && this.first >= 100) {
      throw Error('0 - 100의 숫자만')
    }

    if (typeof this.last === 'number' && this.last >= 100) {
      throw Error('-100 - 0의 숫자만')
    }
  }

  protected decodeCursor = (cursorExpected?: Maybe<string>) => {
    if (typeof cursorExpected === 'string') {
      const [, cursor] = atob(cursorExpected).split(':')
      return parseInt(cursor, 10)
    }
  }

  protected encodeCursor = (typeName: string, id: number) => btoa(`${typeName}:${id}`)

  protected generateFindmanyOptions = () => {
    if (this.paginationDirection === PaginationDirection.FORWARD) {
      const cursor = this.decodeCursor(this.after)
      return {
        skip: cursor ? 1 : undefined,
        cursor: {
          id: cursor,
        },
        take: this.size + 1,
      }
    }

    if (this.paginationDirection === PaginationDirection.BACKWARD) {
      const cursor = this.decodeCursor(this.before)
      return {
        skip: cursor ? 1 : undefined,
        cursor: {
          id: cursor,
        },
        take: -1 * (this.size + 1),
      }
    }

    return {
      take: (this.size ?? this.DEFAULT_PAGE_SIZE) + 1,
    }
  }

  protected getPaginationStatus = () => {
    if (isNil(this._nodes)) {
      throw Error('nodes가 없음')
    }

    if (this.paginationDirection === PaginationDirection.FORWARD) {
      return {
        hasPreviousPage: !!this.after,
        hasNextPage: this._nodes.length > this.size,
      }
    }

    if (this.paginationDirection === PaginationDirection.BACKWARD) {
      return {
        hasPreviousPage: this._nodes.length > this.size,
        hasNextPage: !!this.before,
      }
    }

    console.log(this._nodes.length, this.size)

    return {
      hasPreviousPage: false,
      hasNextPage: this._nodes.length > this.size,
    }
  }

  protected getCursorInfo = () => {
    if (isNil(this._nodes)) {
      throw Error('')
    }
    return {
      startCursor: this._nodes.length === 0 ? null : this.encodeCursor('Cursor', this._nodes[0].id),
      endCursor: this._nodes.length === 0 ? null : this.encodeCursor('Cursor', this._nodes[this._nodes.length - 1].id),
    }
  }

  protected generateEdges = () => {
    if (isNil(this._nodes)) {
      throw Error('nodes가 없음')
    }

    this._edges = this._nodes.map((node) => ({
      cursor: btoa(`Cursor:${node.id}`),
      node: {
        ...node,
        id: btoa(`${this.typeName}:${node.id}`),
      },
    }))
  }

  set nodes(newNodes: PaginationModel<T>) {
    this._nodes = newNodes
  }

  protected generatePaginationResponse = (typeName: string) => {
    if (isNil(this._nodes)) {
      throw Error('')
    }
    this.typeName = typeName
    const paginationStatus = this.getPaginationStatus()

    if (
      (this.paginationDirection === PaginationDirection.FORWARD || isNil(this.paginationDirection)) &&
      paginationStatus.hasNextPage
    ) {
      console.log('after or no')
      this.nodes = take(this.size, this._nodes) as PaginationModel<T>
    }

    // if (isNil(this.paginationDirection) && paginationStatus.hasNextPage) {
    //   this.nodes = take(this.size, this._nodes) as PaginationModel<T>
    // }

    if (this.paginationDirection === PaginationDirection.BACKWARD && paginationStatus.hasPreviousPage) {
      this.nodes = drop(1, this._nodes) as PaginationModel<T>
    }

    const cursors = this.getCursorInfo()
    const pageInfo = { ...paginationStatus, ...cursors }
    this.generateEdges()
    return {
      pageInfo,
      edges: this._edges,
    }
  }
}
