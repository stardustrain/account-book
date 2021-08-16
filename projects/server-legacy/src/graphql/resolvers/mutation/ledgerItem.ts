import type { MutationResolvers } from '../../../../generated/resolvers'

type LedgerItemResolver = {
  Mutation: MutationResolvers
}
const resolvers: LedgerItemResolver = {
  Mutation: {
    createLedgerItem: async (_, { input }, { dataSources }) => {
      const ledgerItem = await dataSources.ledgerItem.createLedgerItem(input)
      return {
        ledgerItem,
      }
    },
    updateLedgerItem: async (_, { input }, { dataSources }) => {
      const ledgerItem = await dataSources.ledgerItem.updateLedgerItem(input)
      return {
        ledgerItem,
      }
    },
    deleteLedgerItem: async (_, { input }, { dataSources }) => {
      const ledgerItem = await dataSources.ledgerItem.deleteLedgerItem(input)
      return {
        ledgerItem,
      }
    },
  },
}

export default resolvers
