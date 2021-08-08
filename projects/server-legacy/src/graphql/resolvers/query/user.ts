import type { QueryResolvers } from '../../../../generated/resolvers'

type UserResolver = {
  Query: QueryResolvers
}

const resolvers: UserResolver = {
  Query: {
    user: async (_, { email }, { dataSources }) => {
      return await dataSources.user.getUserByEmail(email)
    },
  },
}

export default resolvers
