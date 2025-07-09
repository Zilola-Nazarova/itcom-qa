import { PrismaClient } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  })

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
    },
  })

  const question = await prisma.question.create({
    data: {
      title: 'How to set up Prisma with Next.js?',
      content: 'I am trying to use Prisma in a fullstack Next.js app. Any tips?',
      authorId: alice.id,
    },
  })

  await prisma.answer.create({
    data: {
      content: 'You can initialize Prisma in lib/prisma.ts and generate the client via schema.',
      authorId: bob.id,
      questionId: question.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
