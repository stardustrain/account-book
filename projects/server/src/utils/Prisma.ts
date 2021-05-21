import { PrismaClient } from '../../generated/client'
import type { Prisma as PrismaType } from '../../generated/client'

const options: PrismaType.PrismaClientOptions = {
  rejectOnNotFound: () => {
    throw Error('NOT_FOUND')
  },
}

export default class Prisma {
  private static client: PrismaClient

  static getInstance() {
    if (!this.client) {
      this.client = new PrismaClient(options)
    }

    return this.client
  }
}
