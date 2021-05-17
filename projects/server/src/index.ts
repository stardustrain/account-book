import fastify from 'fastify'

const server = fastify({
  logger: true,
})

server.get('/', (req, res) => {
  res.send({
    hello: 'world',
  })
})

server.listen(4000, (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info('server listening on 4000')
})
