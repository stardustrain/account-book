import { isNil } from 'rambda'
import BaseDataSource from './Base'
import type { Maybe } from '../../utils/types'

const enum PaginationDirection {
  FORWARD,
  BACKWARD,
}

type PrismaFindmanyParams = {
  cursor?: { id?: number }
  take?: number
  skip?: number
}
type PaginationModel<T, U = 'id'> = U extends keyof T ? T & { id: number } : never
export type PaginationParams = {
  after?: Maybe<string>
  first?: Maybe<number>
  before?: Maybe<string>
  last?: Maybe<number>
}

/**
 * Class for paging to data.
 * It is unnecessary for all of each data sources to inherit, if pagination is required, you can extends and use it.
 * Follow this order:
 * 
 * `this.setParams(args)` -> prisma query with `this.findManyOptions` -> `this.node = [query results]` -> `this.generatePaginationResponse([TYPE_NAME])`
 *
 * @export
 * @abstract
 * @class Pagination
 * @template T Response data type for item of edges
 * 
 * @example
 * ```typescript
 * class CategoryDataSrouce extends Pagination<Category> {
    constructor(prisma: PrismaClient) {
      super()
      this.prisma = prisma
    }

    getCategoryConnection = async (params: PaginationParams) => {
      this.setParams(params)
      const [totalCount, categoryList] = await Promise.all([
        this.prisma.category.count(),
        this.prisma.category.findMany(this.findManyOptions),
      ])
      this.nodes = categoryList
      const response = this.generatePaginationResponse('Category')
      return {
        totalCount,
        ...response,
      }
    }
  }
 * ```
 */
export default abstract class Pagination<T = any> extends BaseDataSource<T> {
  /**
   * Array of data that selected from database.
   *
   * @private
   * @type {PaginationModel<T>[]}
   * @memberof Pagination
   */
  private _nodes?: PaginationModel<T>[]
  /**
   * Array of data actually return. There are generate from `this.generatePaginationResponse()` using `this._nodes`.
   *
   * @private
   * @type {({ cursor: string; node: Omit<T, 'id'> & { id: string } }[])}
   * @memberof Pagination
   */
  private _edges?: { cursor: string; node: Omit<T, 'id'> & { id: string } }[]
  private after?: Maybe<string>
  private first?: Maybe<number>
  private before?: Maybe<string>
  private last?: Maybe<number>
  DEFAULT_PAGE_SIZE = 20 as const
  /**
   * Represent pagination direction to `FORWARD`, `BACKWARD`and `null`. It was dreived from `this.after` and `this.before`.
   * If direction is `null`, make pagination same as `FORWARD` in `this.generatePaginationResponse()`.
   *
   * after -> FORWARD;
   * before -> BACKWARD
   *
   * @private
   * @type {Maybe<PaginationDirection>}
   * @memberof Pagination
   */
  private paginationDirection: Maybe<PaginationDirection>
  /**
   * Number of rows to be selected. It was dreived from `this.first` and `this.last`.
   * If `this.first` and `this.last` are `nil`, `this.size` is assign to `DEFAULT_PAGE_SIZE`.
   *
   * @private
   * @type {number}
   * @memberof Pagination
   */
  private size: number
  /**
   * Default prisma query option for pagination that was generated from `this.generateFindmanyOptions()` using `PrismaFindmanyParams`.
   * If you required to other options, merge new options and this object in **datasource** not this class.
   *
   * @type {PrismaFindmanyParams}
   * @memberof Pagination
   *
   * @example
   * ```typescript
   * const options = {
   *   ...this.findManyOptions,
   *   where: {
   *     title: 'test category'
   *   }
   * }
   * const category = await this.prisma.category.findMany(options)
   * ```
   *
   */
  findManyOptions?: PrismaFindmanyParams

  constructor(typeName: string) {
    super(typeName)
    this.paginationDirection = null
    this.size = this.DEFAULT_PAGE_SIZE
  }

  private resetParams = () => {
    this.after = null
    this.first = null
    this.before = null
    this.last = null
    this.paginationDirection = null
  }

  protected setParams = ({ after, first, before, last }: PaginationParams) => {
    this.resetParams()
    this.after = after
    this.first = first
    this.before = before
    this.last = last
    this.initialize()
  }

  private initialize = () => {
    this.validatePaginationArgs()
    if (isNil(this.after) && isNil(this.before)) {
      this.size = this.DEFAULT_PAGE_SIZE
    }

    if (typeof this.after === 'string' && isNil(this.before)) {
      this.paginationDirection = PaginationDirection.FORWARD
      this.size = this.first ?? this.DEFAULT_PAGE_SIZE
    }

    if (isNil(this.after) && typeof this.before === 'string') {
      this.paginationDirection = PaginationDirection.BACKWARD
      this.size = this.last ?? this.DEFAULT_PAGE_SIZE
    }

    this.findManyOptions = this.generateFindmanyOptions()
  }

  private validatePaginationArgs = () => {
    if (!isNil(this.after) && !isNil(this.before)) {
      throw Error('Use only one of "after" and "before".')
    }

    if (typeof this.after === 'string' && typeof this.last === 'number') {
      throw Error('If you are going to use "after", do not pass "last".')
    }

    if (typeof this.before === 'string' && typeof this.first === 'number') {
      throw Error('If you are going to use "before", do not pass "first".')
    }

    if (typeof this.first === 'number' && (this.first < 0 || this.first >= 100)) {
      throw Error('"first" must be integer between 0 and 100.')
    }

    if (typeof this.last === 'number' && (this.last < 0 || this.last >= 100)) {
      throw Error('"last" must be integer between 0 and 100')
    }

    if (typeof this.first === 'number' && isNil(this.after)) {
      throw Error('"first" must using with "after"')
    }

    if (typeof this.last === 'number' && isNil(this.before)) {
      throw Error('"last" must using with "before"')
    }
  }

  private decodeCursor = (cursorExpected?: Maybe<string>) => {
    if (typeof cursorExpected === 'string') {
      return this.getDatabaseId(cursorExpected)
    }
  }

  private generateFindmanyOptions = () => {
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

  private getPaginationStatus = () => {
    if (isNil(this._nodes)) {
      throw Error('Does not exist nodes. Please check to assign this.nodes in your resolver.')
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

    return {
      hasPreviousPage: false,
      hasNextPage: this._nodes.length > this.size,
    }
  }

  private getCursorInfo = () => {
    if (isNil(this._nodes)) {
      throw Error('Does not exist nodes. Please check to assign this.nodes in your resolver.')
    }

    return {
      startCursor: this._nodes.length === 0 ? null : this.generateResponseId('Cursor', this._nodes[0].id),
      endCursor:
        this._nodes.length === 0 ? null : this.generateResponseId('Cursor', this._nodes[this._nodes.length - 1].id),
    }
  }

  private generateEdges = () => {
    if (isNil(this._nodes)) {
      throw Error('Does not exist nodes. Please check to assign this.nodes in your resolver.')
    }

    this._edges = this._nodes.map((node) => ({
      cursor: this.generateResponseId('Cursor', node.id),
      node: this.generateResponseNode(node),
    }))
  }

  set nodes(newNodes: PaginationModel<T>[]) {
    this._nodes = newNodes
  }

  protected generatePaginationResponse = () => {
    if (isNil(this._nodes)) {
      throw Error('Does not exist nodes. Please check to assign this.nodes in your resolver.')
    }
    const paginationStatus = this.getPaginationStatus()

    if (
      (this.paginationDirection === PaginationDirection.FORWARD || isNil(this.paginationDirection)) &&
      paginationStatus.hasNextPage
    ) {
      // Forward pagination이고 다음 페이지가 존재하면 first + 1개를 select했기 때문에 맨 뒤의 node하나를 지운다.
      this.nodes = this._nodes.slice(0, this.size)
    }

    if (this.paginationDirection === PaginationDirection.BACKWARD && paginationStatus.hasPreviousPage) {
      // Backward pagination이고 이전 페이지가 존재하면 last + 1개를 select했기 때문에 맨 앞의 node하나를 지운다.
      this.nodes = this._nodes.slice(1)
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
