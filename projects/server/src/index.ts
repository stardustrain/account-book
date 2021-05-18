import fastify from 'fastify'
import mercurius from 'mercurius'

import { schema, resolvers } from '../graphql'
import { PrismaClient } from './generated/client'

const prisma = new PrismaClient()
const server = fastify({
  logger: true,
})

server.register(mercurius, {
  schema,
  resolvers,
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
  server.log.info('server listening on 4000')
})
