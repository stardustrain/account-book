import type { QueryResolvers, CategoryResolvers } from '../../../generated/resolvers'

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
    // ledgerItemConnection: (parent, { after, first, before, last }, { prisma }) => {},
  },
}

export default resolvers
