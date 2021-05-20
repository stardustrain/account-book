import { omit } from 'rambda'
import { btoa } from '../../utils/base64'
import type { QueryResolvers } from '../../../generated/resolvers'

type UserResolver = {
  Query: QueryResolvers
}

const resolvers: UserResolver = {
  Query: {
    user: async (_, { email }, { prisma }) => {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      })

      return {
        ...omit(['id'], user),
        id: btoa(`User:${user.id}`),
      }
    },
  },
}

export default resolvers
