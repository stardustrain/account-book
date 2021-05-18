const schema = `
  type Query {
    user(email: String!): User
  }

  type User {
    id: Int
    email: String!
    name: String
  }
`

const resolvers = {
  Query: {
    user: async (_: any, args: any, context: any) => {
      const user = await context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
      })

      return user
    },
  },
}

export { schema, resolvers }
