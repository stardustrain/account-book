import fastify from 'fastify'
import mercurius from 'mercurius'

import schema, { dataSources } from './graphql'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient({
  rejectOnNotFound: () => {
    throw Error('NOT_FOUND')
  },
})
const server = fastify({
  // logger: true,
})

const contextBuilder = async () => {
  return {
    prisma,
    dataSources: dataSources.reduce((arr: { [key: string]: InstanceType<typeof dataSources[number]> }, dataSource) => {
      arr[dataSource.name.toLowerCase()] = new dataSource({}, prisma)
      return arr
    }, {}),
  }
}
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T
export type Context = PromiseType<ReturnType<typeof contextBuilder>>

server.register(mercurius, {
  schema,
  graphiql: true,
  context: contextBuilder,
})

server.listen(4000, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.info('server listening on 4000')
  server.log.info('server listening on 4000')
})
