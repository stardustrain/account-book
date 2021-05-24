import Pagination from './Pagination'
import type { PaginationParams } from './Pagination'
import type { PrismaClient, LedgerItem, Prisma } from '../../../generated/client'
import type { Maybe } from '../../../generated/resolvers'

export default class LedgerItemDatasource extends Pagination<LedgerItem> {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    super('LedgerItem')
    this.prisma = prisma
  }

  getLedgerItemList = async (limit?: Maybe<number>) => {
    const ledgerItems = await this.prisma.ledgerItem.findMany({
      take: limit ?? this.DEFAULT_PAGE_SIZE,
    })
    return ledgerItems.map(this.generateResponseNode)
  }

  getLedgerItemConnection = async (params: PaginationParams, options?: { where: Prisma.LedgerItemWhereInput }) => {
    this.setParams(params)
    const [totalCount, ledgerItemList] = await Promise.all([
      this.prisma.ledgerItem.count(options),
      this.prisma.ledgerItem.findMany({ ...this.findManyOptions, ...options }),
    ])
    this.nodes = ledgerItemList
    const response = this.generatePaginationResponse()

    return {
      totalCount,
      ...response,
    }
  }
}
