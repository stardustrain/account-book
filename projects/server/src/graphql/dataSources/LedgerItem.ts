import { omit, has } from 'ramda'
import Pagination from './Pagination'
import { removeNullableValuesFromObject } from '../../utils/misc'
import { getStartOfMonth, getEndOfMonth } from '../../utils/date'
import type { PaginationParams } from './Pagination'
import type { PrismaClient, LedgerItem, Prisma } from '../../../generated/client'
import type {
  CreateLedgerItemInput,
  UpdateLedgerItemInput,
  DeleteLedgerItemInput,
  QueryLedgerOfMonthArgs,
} from '../../../generated/resolvers'
import type { Maybe } from '../../utils/types'

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

  createLedgerItem = async (input: CreateLedgerItemInput) => {
    const ledgerItem = await this.prisma.ledgerItem.create({
      data: {
        ...removeNullableValuesFromObject(input),
        categoryId: this.getDatabaseId(input.categoryId),
      },
    })
    return this.generateResponseNode(ledgerItem)
  }

  updateLedgerItem = async (input: UpdateLedgerItemInput) => {
    const ledgerItem = await this.prisma.ledgerItem.update({
      data: {
        ...removeNullableValuesFromObject(omit(['id'], input)),
        categoryId: this.getDatabaseId(input.categoryId),
      },
      where: {
        id: this.getDatabaseId(input.id),
      },
    })
    return this.generateResponseNode(ledgerItem)
  }

  deleteLedgerItem = async ({ id }: DeleteLedgerItemInput) => {
    const ledgerItem = await this.prisma.ledgerItem.delete({
      where: {
        id: this.getDatabaseId(id),
      },
    })
    return this.generateResponseNode(ledgerItem)
  }

  getLegderItemOfMonth = async ({ month }: QueryLedgerOfMonthArgs) => {
    const currentDate = new Date()
    if (typeof month === 'number') {
      currentDate.setMonth(month - 1)
    }
    const startOfMonth = getStartOfMonth(currentDate)
    const endOfMonth = getEndOfMonth(currentDate)

    const aggregateConditions = [
      {
        _sum: {
          cash: true,
        },
        categoryType: 'INCOME',
      },
      {
        _sum: {
          cash: true,
          card: true,
        },
        categoryType: 'EXPENSES',
      },
    ] as const

    const [income, expenses] = await Promise.all(
      aggregateConditions.map(({ _sum, categoryType }) =>
        this.prisma.ledgerItem.aggregate({
          _sum,
          where: {
            AND: [
              {
                date: {
                  gte: startOfMonth,
                  lte: endOfMonth,
                },
              },
              {
                category: {
                  categoryType,
                },
              },
            ],
          },
        }),
      ),
    )

    return {
      income: income._sum.cash ?? 0,
      expenses: {
        cash: expenses._sum.cash ?? 0,
        card: has('card', expenses._sum) ? expenses._sum.card ?? 0 : 0,
      },
    }
  }
}
