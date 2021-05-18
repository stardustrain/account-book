import type { QueryResolvers } from '../../generated/resolvers'

type UserResolver = {
  Query: QueryResolvers
}

const resolvers: UserResolver = {
  Query: {
    user: async (_, { email }, { prisma }) => {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
      })
    },
  },
}

export default resolvers
