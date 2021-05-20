import { btoa } from '../../utils/base64'
import Pagination from './Pagination'
import type { PaginationConstructorParams } from './Pagination'
import type { PrismaClient, Category as CategoryType } from '../../../generated/client'
import type { Maybe } from '../../../../shared/models'

export default class Category extends Pagination<CategoryType[]> {
  prisma: PrismaClient

  constructor(params: PaginationConstructorParams, prisma: PrismaClient) {
    super(params)
    this.prisma = prisma
  }

  getCategoryList = async (limit?: Maybe<number>) => {
    const categoryList = await this.prisma.category.findMany({ take: limit ?? 20 })
    return categoryList.map((category) => ({
      ...category,
      id: btoa(`Category:${category.id}`),
    }))
  }

  getCategoryConnection = async (params: PaginationConstructorParams) => {
    this.setParams(params)
    const [totalCount, categoryList] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.findMany(this.findManyOptions),
    ])
    this.nodes = categoryList
    const response = this.generatePaginationResponse('Category')
    return {
      totalCount,
      ...response,
    }
  }
}
