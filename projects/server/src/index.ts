import fastify from 'fastify'
import { PrismaClient } from './generated/client'

const server = fastify({
  logger: true,
})
const prisma = new PrismaClient()

server.get('/', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: 'test@test.com',
    },
  })
  res.send({
    hello: 'world',
    user,
  })
})

server.listen(4000, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info('server listening on 4000')
})
