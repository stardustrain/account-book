import { ObjectType, Field, Int, GraphQLTimestamp, registerEnumType } from '@nestjs/graphql'
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column } from 'typeorm'

enum CategoryType {
  INCOME = 'INCOME',
  OUTCOME = 'OUTCOME',
}

registerEnumType(CategoryType, {
  name: 'CategoryType',
})

@ObjectType()
@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  @Field(() => CategoryType)
  categoryType: CategoryType

  @CreateDateColumn()
  @Field(() => GraphQLTimestamp)
  createdAt: number

  @UpdateDateColumn()
  @Field(() => GraphQLTimestamp)
  updatedAt: number
}
