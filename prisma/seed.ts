import prisma from '../apps/web/lib/prisma'
import type { Question, Answer } from '../apps/web/lib/db';

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.comment.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.questionTag.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  const alice = await prisma.user.create({
    data: {
      name: 'Alice Example',
      email: 'alice@example.com',
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: 'Bob',
      email: 'bob@example.com',
    },
  })

  const [nextjs, api, postgres, tailwind] = await Promise.all([
    prisma.tag.create({ data: { name: 'nextjs' } }),
    prisma.tag.create({ data: { name: 'api' } }),
    prisma.tag.create({ data: { name: 'postgres' } }),
    prisma.tag.create({ data: { name: 'tailwind' } }),
  ])

  let questions: Question[] = [];
  let answers: Answer[] = [];

  for (let i = 1; i <= 3; i++) {
    const question = await prisma.question.create({
      data: {
        title: `How do I solve problem #${i}?`,
        content: `I’m struggling with problem #${i}. Any advice?`,
        authorId: alice.id,
        tags: {
          create: [
            { tagId: nextjs.id },
            { tagId: api.id },
          ],
        },
      },
    });

    questions[i] = question;

    for (let j = 1; j <= 2; j++) {
      const answer = await prisma.answer.create({
        data: {
          content: `This is answer #${j} for question #${i}.`,
          authorId: bob.id,
          questionId: question.id,
        },
      });
      answers[i+j] = answer;
    }
  }

  await prisma.comment.createMany({
    data: [
      {
        content: 'Did you restart the dev server?',
        authorId: bob.id,
        questionId: questions[1].id,
      },
      {
        content: 'Thanks, that worked!',
        authorId: bob.id,
        answerId: answers[2].id,
      },
    ],
  })

  await prisma.vote.createMany({
    data: [
      {
        value: 1,
        userId: bob.id,
        questionId: questions[1].id,
      },
      {
        value: -1,
        userId: alice.id,
        answerId: answers[2].id,
      },
    ],
  })

  console.log('🌱 Seed data successfully created.')
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
