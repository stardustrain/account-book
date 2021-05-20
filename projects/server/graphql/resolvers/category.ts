import { take, drop, isNil } from 'rambda'
import { btoa } from '../../src/utils/base64'
import {
  validatePaginationArgs,
  generateFindmanyOptions,
  getPaginationStatus,
  getCursorInfo,
  getTakeSize,
  isForwardPagination,
} from '../../src/utils/pagination'

import type { QueryResolvers, CategoryResolvers } from '../../generated/resolvers'

type CategoryResolver = {
  Query: QueryResolvers
  Category: CategoryResolvers
}

const resolvers: CategoryResolver = {
  Query: {
    categoryList: async (_, { limit }, { prisma }) => {
      const categoryList = await prisma.category.findMany({ take: limit ?? 20 })
      return categoryList.map((category) => ({
        ...category,
        id: btoa(`Category:${category.id}`),
      }))
    },

    categoryConnection: async (_, args, { prisma }) => {
      validatePaginationArgs(args)
      const findManyOptions = generateFindmanyOptions(args)

      const [totalCount, categoryList] = await Promise.all([
        prisma.category.count(),
        prisma.category.findMany(findManyOptions),
      ])

      const paginationStatus = getPaginationStatus({ ...args, nodes: categoryList })
      const nodes = isForwardPagination({ after: args.after, before: args.before })
        ? paginationStatus.hasNextPage
          ? take(getTakeSize(args.first), categoryList)
          : categoryList
        : paginationStatus.hasPreviousPage
        ? drop(1, categoryList)
        : categoryList
      const cursors = getCursorInfo(nodes)
      const pageInfo = { ...paginationStatus, ...cursors }

      if (isNil(findManyOptions)) {
        return {
          pageInfo,
          totalCount,
          edges: categoryList.map((category) => ({
            cursor: btoa(`Cursor:${category.id}`),
            node: {
              ...category,
              id: btoa(`Category:${category.id}`),
            },
          })),
        }
      }

      return {
        pageInfo,
        totalCount,
        edges: nodes.map((category) => ({
          cursor: btoa(`Cursor:${category.id}`),
          node: {
            ...category,
            id: btoa(`Category:${category.id}`),
          },
        })),
      }
    },
  },
  Category: {},
}

export default resolvers
