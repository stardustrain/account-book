import { PrismaClient } from '../../generated/client'
import type { Prisma as PrismaType } from '../../generated/client'

const options: PrismaType.PrismaClientOptions = {
  log: ['query'],
  rejectOnNotFound: () => {
    throw Error('NOT_FOUND')
  },
}

export default class Prisma {
  private static client: PrismaClient

  static getInstance() {
    if (!this.client) {
      this.client = new PrismaClient(options)
      this.client.$use(async (params, next) => {
        const before = Date.now()
        const result = await next(params)
        const after = Date.now()

        console.log(`Query ${params.model}.${params.action} => ${after - before}ms`)

        return result
      })
    }

    return this.client
  }
}
