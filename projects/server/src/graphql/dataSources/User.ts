import { isNil } from 'ramda'
import { btoa } from '../../utils/base64'
import type { PrismaClient } from '../../../generated/client'

export default class UserDataSource {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  getUserByEmail = async (email: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })

    if (isNil(user)) {
      return null
    }

    return {
      ...user,
      id: btoa(`User:${user.id}`),
    }
  }
}
