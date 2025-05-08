import type { PrismaClient } from '@prisma/client'
import { aToO, random, range, truncate, values } from 'jittoku'

const NUM_TAGS = 15
const NUM_USERS = 10

export async function seed(prisma: PrismaClient) {
  console.log('Seeding database...')

  await prisma.message.deleteMany({})
  await prisma.topic.deleteMany({})
  await prisma.area.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.tag.deleteMany({})

  const tags = await Promise.all(
    range(NUM_TAGS).map((i) =>
      prisma.tag.upsert({
        where: { name: `Tag_${i}` },
        update: {},
        create: { name: `Tag_${i}` },
      }),
    ),
  )

  const users = await Promise.all(
    range(NUM_USERS).map((i) =>
      prisma.user.upsert({
        where: { userId: `user${i}` },
        update: {},
        create: {
          userId: `user${i}`,
          name: `User_${i}`,
          color: random(0, 360),
        },
      }),
    ),
  )

  const areaPositions = range(3).flatMap((x) => range(3).map((y) => [x * 100, y * 100]))
  const areas = await Promise.all(
    areaPositions.map(([x, y]) => {
      return prisma.area.upsert({
        where: { x_y: { x, y } },
        update: { name: `Area_${x}_${y}`, x, y },
        create: { name: `Area_${x}_${y}`, x, y },
      })
    }),
  )

  const topics = await Promise.all(
    areas.flatMap((area) => {
      const user = users[Math.floor(random() * users.length)]
      const topicTags = tags.sort(() => 0.5 - Math.random()).slice(0, 3)
      const topicPositions = values(
        aToO(range(50), () => {
          const x = area.x + truncate(random(0, 100), -1)
          const y = area.y + truncate(random(0, 100), -1)
          return [`${x}_${y}`, [x, y] as [x: number, y: number]]
        }),
      )
      return topicPositions.map(([x, y]) => {
        const item = {
          userId: user.id,
          areaId: area.id,
          title: `Topic_${x}_${y}_by_User_${user.id}`,
          x,
          y,
          tags: {
            connect: topicTags.map((tag) => ({ id: tag.id })),
          },
        }
        return prisma.topic.upsert({
          where: { x_y: { x, y } },
          update: item,
          create: item,
        })
      })
    }),
  )

  const messages = await Promise.all(
    topics.flatMap((topic) => {
      const user = users[Math.floor(random() * users.length)]
      // const messagePositions = values(
      //   aToO(range(20), () => {
      //     const x = topic.x + truncate(random(0, 10), 0)
      //     const y = topic.y + truncate(random(0, 10), 0)
      //     return [`${x}_${y}`, [x, y] as [x: number, y: number]]
      //   }),
      // )
      const messagePositions = range(20).map(() => {
        const x = topic.x + truncate(random(0, 10), 0)
        const y = topic.y + truncate(random(0, 10), 0)
        return [x, y]
      })

      console.log(messagePositions)
      return messagePositions.map(async ([x, y]) => {
        const item = {
          userId: user.id,
          topicId: topic.id,
          content: `Message_${x}_${y}_in_Topic_${topic.id}_by_User_${user.id}`,
          x,
          y,
        }
        await prisma.message.upsert({
          where: { x_y: { x, y } },
          update: item,
          create: item,
        })
      })
    }),
  )

  console.log('------------------ Database seeding completed! ------------------ ')
  console.log('Users:', users.length)
  console.log('Tags:', tags.length)
  console.log('Areas:', areas.length)
  console.log('Topics:', topics.length)
  console.log('Messages:', messages.length)
}
