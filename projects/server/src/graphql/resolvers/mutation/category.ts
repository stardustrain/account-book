import type { MutationResolvers } from '../../../../generated/resolvers'

type CategoryResolver = {
  Mutation: MutationResolvers
}

const resolvers: CategoryResolver = {
  Mutation: {
    createCategory: async (_, { input }, { dataSources }) => {
      const category = await dataSources.category.createCategory(input)
      return {
        category,
      }
    },

    updateCategory: async (_, { input }, { dataSources }) => {
      const category = await dataSources.category.updateCategory(input)
      return {
        category,
      }
    },

    deleteCategory: async (_, { input }, { dataSources }) => {
      const category = await dataSources.category.deleteCategory(input)
      return {
        category,
      }
    },
  },
}

export default resolvers
