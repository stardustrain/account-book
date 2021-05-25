import type { QueryResolvers, CategoryResolvers } from '../../../../generated/resolvers'

type CategoryResolver = {
  Query: QueryResolvers
  Category: CategoryResolvers
}

const resolvers: CategoryResolver = {
  Query: {
    categoryList: async (_, { limit }, { dataSources }) => {
      return await dataSources.category.getCategoryList(limit)
    },

    categoryConnection: async (_, args, { dataSources }) => {
      return await dataSources.category.getCategoryConnection(args)
    },
  },

  Category: {
    ledgerItemConnection: async (parent, args, { dataSources }) => {
      return await dataSources.ledgerItem.getLedgerItemConnection(args, {
        where: {
          categoryId: dataSources.ledgerItem.getDatabaseId(parent.id),
        },
      })
    },
  },
}

export default resolvers
