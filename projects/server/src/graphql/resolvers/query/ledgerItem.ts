import type { QueryResolvers, LedgerItemResolvers } from '../../../../generated/resolvers'
import { isPrismaLedgerItem } from '../../../utils/types'

type LedgerItemResolver = {
  Query: QueryResolvers
  LedgerItem: LedgerItemResolvers
}

const resolvers: LedgerItemResolver = {
  Query: {
    ledgerItemList: async (_, { limit }, { dataSources }) => {
      return await dataSources.ledgerItem.getLedgerItemList(limit)
    },
    ledgerItemConnection: async (_, args, { dataSources }) => {
      return await dataSources.ledgerItem.getLedgerItemConnection(args)
    },
  },
  LedgerItem: {
    category: async (parent, _, { dataSources }) => {
      if (isPrismaLedgerItem(parent)) {
        return await dataSources.category.getCategory(parent.categoryId)
      }
      return null
    },
  },
}

export default resolvers
