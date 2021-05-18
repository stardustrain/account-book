import fastify from 'fastify'
import mercurius from 'mercurius'

import schema from '../graphql'
import { PrismaClient } from '../generated/client'

const prisma = new PrismaClient()
const server = fastify({
  // logger: true,
})

const contextBuilder = () => {
  return {
    prisma,
  }
}
export type Context = ReturnType<typeof contextBuilder>

server.register(mercurius, {
  schema,
  graphiql: true,
  context: () => {
    return {
      prisma,
    }
  },
})

server.listen(4000, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  console.info('server listening on 4000')
  server.log.info('server listening on 4000')
})
