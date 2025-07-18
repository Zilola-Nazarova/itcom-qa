import prisma from '../apps/web/lib/prisma'

async function main() {
  await prisma.answer.deleteMany()
  await prisma.question.deleteMany()
  await prisma.user.deleteMany()

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

  // Create tags
  const [nextjs, api, postgres, tailwind] = await Promise.all([
    prisma.tag.create({ data: { name: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'api' } }),
    prisma.tag.create({ data: { name: 'postgres' } }),
    prisma.tag.create({ data: { name: 'tailwind' } }),
  ])

  const question = await prisma.question.create({
    data: {
      title: 'Why is my Next.js API route not working?',
      content: 'I created an API route under /pages/api/hello.js but it doesn’t seem to work.',
      authorId: alice.id,
      tags: {
        create: [
          { tagId: nextjs.id },
          { tagId: api.id },
        ],
      },
    },
  })

  const answer = await prisma.answer.create({
    data: {
      content: 'Make sure your file is named correctly and placed under /pages/api.',
      authorId: bob.id,
      questionId: question.id,
    },
  })

  await prisma.comment.createMany({
    data: [
      {
        content: 'Did you restart the dev server?',
        authorId: bob.id,
        questionId: question.id,
      },
      {
        content: 'Thanks, that worked!',
        authorId: alice.id,
        answerId: answer.id,
      },
    ],
  })

  await prisma.vote.createMany({
    data: [
      {
        value: 1,
        userId: bob.id,
        questionId: question.id,
      },
      {
        value: 1,
        userId: alice.id,
        answerId: answer.id,
      },
    ],
  })

  console.log('🌱 Seed data successfully created.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
