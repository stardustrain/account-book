import Category from './Category'
import Node from './Node'
import User from './User'

import Prisma from '../../utils/Prisma'
const prisma = Prisma.getInstance()

export const dataSources = {
  category: new Category(prisma),
  node: new Node(prisma),
  user: new User(prisma),
}
