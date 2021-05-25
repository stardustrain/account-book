import fastify from 'fastify'
import mercurius from 'mercurius'

import schema, { dataSources } from './graphql'
import Prisma from './utils/Prisma'

const server = fastify({
  // logger: true,
})

const contextBuilder = async () => {
  return {
    prisma: Prisma.getInstance(),
    dataSources,
  }
}
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T
export type Context = PromiseType<ReturnType<typeof contextBuilder>>

server.register(mercurius, {
  schema,
  graphiql: true,
  context: contextBuilder,
})

server.listen(4000, (err) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.info('\x1b[35mserver listening on 4000')
  server.log.info('server listening on 4000')
})
