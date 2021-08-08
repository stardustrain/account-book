import { join } from 'path'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      sortSchema: true,
      buildSchemaOptions: {
        dateScalarMode: 'timestamp',
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        post: configService.get('TYPEORM_PORT'),
        database: configService.get('TYPEORM_DATABASE'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        autoLoadEntities: true,
      }),
    }),
    CategoriesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
