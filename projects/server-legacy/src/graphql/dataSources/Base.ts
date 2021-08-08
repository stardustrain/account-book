import { atob, btoa } from '../../utils/base64'

export type Model<T, U = 'id'> = U extends keyof T ? T & { id: number } : never
export default class BaseDataSource<T = any> {
  /**
   * Schema name of pagination data.
   *
   * @private
   * @type {string}
   * @memberof Pagination
   */
  typeName: string

  constructor(typeName: string) {
    this.typeName = typeName
  }

  getDatabaseId = (encodedId: string) => {
    const [, id] = atob(encodedId).split(':')
    return parseInt(id, 10)
  }

  generateResponseId = (typeName: string, id: number) => btoa(`${typeName}:${id}`)

  generateResponseNode = (node: Model<T>) => ({
    ...node,
    id: this.generateResponseId(this.typeName, node.id),
  })
}
