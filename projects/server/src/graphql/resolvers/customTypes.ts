import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql'

const customTypeResolvers = {
  Date: new GraphQLScalarType({
    name: 'Date',
    description: '',
    parseValue(value) {
      // value from the client
      return new Date(value)
    },
    serialize(value) {
      // value sent to the client
      return value.getTime()
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value)
      }
      return null
    },
  }),
}

export default customTypeResolvers
