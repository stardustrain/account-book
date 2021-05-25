import Pagination from './Pagination'
import type { PaginationParams } from './Pagination'
import type { PrismaClient, Category, Prisma } from '../../../generated/client'
import type { CreateCategoryInput, UpdateCategoryInput, DeleteCategoryInput } from '../../../generated/resolvers'
import type { Maybe } from '../../../../shared/models'

export default class CategoryDataSource extends Pagination<Category> {
  prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    super('Category')
    this.prisma = prisma
  }

  getCategory = async (id: string | number, options?: Prisma.CategoryFindUniqueArgs) => {
    const prismaId = typeof id === 'string' ? parseInt(id, 10) : id
    const category = await this.prisma.category.findUnique({
      where: {
        id: prismaId,
      },
      ...options,
    })
    if (category) {
      return this.generateResponseNode(category)
    }
    return null
  }

  getCategoryList = async (limit?: Maybe<number>) => {
    const categoryList = await this.prisma.category.findMany({
      take: limit ?? 20,
    })
    return categoryList.map((category) => this.generateResponseNode(category))
  }

  getCategoryConnection = async (params: PaginationParams) => {
    this.setParams(params)
    const [totalCount, categoryList] = await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.findMany(this.findManyOptions),
    ])
    this.nodes = categoryList
    const response = this.generatePaginationResponse()
    return {
      totalCount,
      ...response,
    }
  }

  createCategory = async (input: CreateCategoryInput) => {
    const createdCategory = await this.prisma.category.create({
      data: {
        ...input,
      },
    })

    return this.generateResponseNode(createdCategory)
  }

  updateCategory = async ({ id, title, categoryType }: UpdateCategoryInput) => {
    const prismaId = this.getDatabaseId(id)
    const updatedCategory = await this.prisma.category.update({
      where: {
        id: prismaId,
      },
      data: {
        title: title ?? undefined,
        categoryType: categoryType ?? undefined,
      },
    })

    return this.generateResponseNode(updatedCategory)
  }

  deleteCategory = async (input: DeleteCategoryInput) => {
    const id = this.getDatabaseId(input.id)
    const deletedCategory = await this.prisma.category.delete({
      where: {
        id,
      },
    })

    return this.generateResponseNode(deletedCategory)
  }
}
