import type { QueryResolvers, NodeResolvers } from '../../../../generated/resolvers'

type NodeResolver = {
  Query: QueryResolvers
  Node: NodeResolvers
}

const resolvers: NodeResolver = {
  Query: {
    node: async (_, { id }, { dataSources }) => {
      return await dataSources.node.getNode(id)
    },
  },

  Node: {
    __resolveType: ({ __typename }, { dataSources }) => {
      if (dataSources.node.isNodeImplementsTypes(__typename)) {
        return __typename
      }
      return null
    },
  },
}

export default resolvers
