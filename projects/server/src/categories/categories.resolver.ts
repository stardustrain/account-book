import { Resolver, Query, Args, Int } from '@nestjs/graphql'

import { Category } from './models/category.model'
import { CategoriesService } from './categories.service'

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => Category, { nullable: true })
  category(@Args('id', { type: () => Int }) id: number) {
    return this.categoriesService.getCategory(id)
  }
}
