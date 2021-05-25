import { PrismaClient } from '../generated/client'
import { users, categories, ledgerItems, getRandom } from './fixture'

const prisma = new PrismaClient()

const main = async () => {
  try {
    console.info('Start to inserting data.')
    // FIXME: Use bulkInsert when changing database to MySQL
    const createCategories = await prisma.$transaction(
      categories.map((category) =>
        prisma.category.create({
          data: category,
        }),
      ),
    )

    console.info(`Create category success: ${createCategories.length} rows.`)

    await prisma.$transaction([
      ...users.map((user) => prisma.user.create({ data: user })),
      ...ledgerItems.map((item) =>
        prisma.ledgerItem.create({
          data: {
            ...item,
            category: {
              connect: {
                id: getRandom(createCategories[0].id, createCategories[createCategories.length - 1].id + 1),
              },
            },
          },
        }),
      ),
    ])

    console.info(`Create user success: ${users.length} rows.\nCreate ledger item success: ${ledgerItems.length} rows.`)
    console.info('Done.')
  } catch (e) {
    console.error(e)
  } finally {
    prisma.$disconnect()
  }
}

main()
