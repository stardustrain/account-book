import { includes, cond, equals } from 'rambda'
import { atob, btoa } from '../../utils/base64'
import type { PrismaClient } from '../../../generated/client'
import type { ResolversTypes } from '../../../generated/resolvers'

const nodeImplementsTypes = ['Category', 'LedgerItem', 'User'] as const
type NodeImplementsType = typeof nodeImplementsTypes[number]

export default class NodeDataSource {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  private resposeHelper = async (typeName: NodeImplementsType, databaseId: string): Promise<ResolversTypes['Node']> => {
    const fn = cond([
      [
        equals('Category'),
        () =>
          this.prisma.category.findUnique({
            where: {
              id: parseInt(databaseId, 10),
            },
          }),
      ],
      [
        equals('LedgerItem'),
        () =>
          this.prisma.ledgerItem.findUnique({
            where: {
              id: parseInt(databaseId, 10),
            },
          }),
      ],
      [
        equals('User'),
        () =>
          this.prisma.user.findUnique({
            where: {
              id: parseInt(databaseId, 10),
            },
          }),
      ],
    ])
    const result = await fn(typeName)
    return {
      ...result,
      __typename: typeName,
      id: btoa(`${typeName}:${result.id}`),
    }
  }

  isNodeImplementsTypes = (type?: string): type is NodeImplementsType => includes(type, nodeImplementsTypes)

  getNode = async (id: string) => {
    const [typeName, databaseId] = atob(id).split(':')
    if (!this.isNodeImplementsTypes(typeName)) {
      throw Error('NOT_FOUND')
    }

    return await this.resposeHelper(typeName, databaseId)
  }
}
