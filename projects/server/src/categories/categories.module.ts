import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from './models/category.model'
import { CategoriesResolver } from './categories.resolver'
import { CategoriesService } from './categories.service'

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesResolver, CategoriesService],
})
export class CategoriesModule {}
