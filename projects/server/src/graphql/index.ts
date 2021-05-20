import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'
export { dataSources } from './dataSources'

const typeDefs = loadFilesSync(path.join(__dirname, './schemas/*.graphql'))
const resolvers = loadFilesSync(path.join(__dirname, './resolvers/*.ts'))

const schema = makeExecutableSchema({
  typeDefs: mergeTypeDefs(typeDefs),
  resolvers: mergeResolvers(resolvers),
})

export default schema
