const resolvers = {
  Query: {
    user: async (_: any, args: any, context: any) => {
      return await context.prisma.user.findUnique({
        where: {
          email: args.email,
        },
      })
    },
  },
}

export default resolvers
