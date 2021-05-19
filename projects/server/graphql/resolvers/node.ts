import { includes, cond, equals } from 'rambda'
import { atob, btoa } from '../../src/utils/base64'
import type { PrismaClient } from '../../generated/client'
import type { QueryResolvers, NodeResolvers } from '../../generated/resolvers'

const nodeImplementsTypes = ['Category', 'LedgerItem', 'User'] as const
const isNodeImplementsTypes = (type?: string): type is typeof nodeImplementsTypes[number] =>
  includes(type, nodeImplementsTypes)

const responseHelper = async (
  typeName: typeof nodeImplementsTypes[number],
  databaseId: string,
  prisma: PrismaClient,
) => {
  const fn = cond([
    [
      equals('Category'),
      () =>
        prisma.category.findUnique({
          where: {
            id: parseInt(databaseId, 10),
          },
        }),
    ],
    [
      equals('LedgerItem'),
      () =>
        prisma.ledgerItem.findUnique({
          where: {
            id: parseInt(databaseId, 10),
          },
        }),
    ],
    [
      equals('User'),
      () =>
        prisma.user.findUnique({
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

type NodeResolver = {
  Query: QueryResolvers
  Node: NodeResolvers
}

const resolvers: NodeResolver = {
  Query: {
    node: async (_, { id }, { prisma }) => {
      const [typeName, databaseId] = atob(id).split(':')

      if (!isNodeImplementsTypes(typeName)) {
        throw Error('NOT_FOUND')
      }

      return await responseHelper(typeName, databaseId, prisma)
    },
  },

  Node: {
    __resolveType: ({ __typename }) => {
      if (isNodeImplementsTypes(__typename)) {
        return __typename
      }
      return null
    },
  },
}

export default resolvers
