import Category from './Category'
import Node from './Node'
import User from './User'
import LedgerItem from './LedgerItem'

import Prisma from '../../utils/Prisma'
const prisma = Prisma.getInstance()

export const dataSources = {
  category: new Category(prisma),
  node: new Node(prisma),
  user: new User(prisma),
  ledgerItem: new LedgerItem(prisma),
}
