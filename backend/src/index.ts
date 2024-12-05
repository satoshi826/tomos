import { PrismaD1 } from '@prisma/adapter-d1'
import { type Message, PrismaClient } from '@prisma/client'
import { Hono } from 'hono'

const prismaClient = (db: D1Database) => {
	const adapter = new PrismaD1(db)
	return new PrismaClient({ adapter })
}

const app = new Hono<{ Bindings: { DB: D1Database } }>()

app.get('/', (c) => c.text('Hello 🔥'))

// app.post("/create", async (c) => {
// 	const adapter = new PrismaD1(c.env.DB);
// 	const prisma = new PrismaClient({adapter});
// 	const user = await prisma.user.create({
// 		data: {
// 			name: "Alice",
// 			email: "sample@sample.com"
// 		}
// 	})
// 	return c.json(user);
// })

app.post('/messages', async (c) => {
	const prisma = prismaClient(c.env.DB)
	const { userId, content, x, y } = await c.req.json<Pick<Message, 'userId' | 'content' | 'x' | 'y'>>()
	const message = await prisma.message.create({
		data: {
			content,
			userId,
			x,
			y,
		},
	})
	return c.json(message)
})

app.get('/messages', async (c) => {
	const prisma = prismaClient(c.env.DB)
})

export default app
