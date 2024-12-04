import { Hono } from "hono";
import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '@prisma/client';

const app = new Hono<{Bindings: {DB: D1Database}}>();

app.get("/", (c) => c.text("Hello 🔥"));

app.post("/create", async (c) => {
	console.log(c)
	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({adapter});
	const user = await prisma.user.create({
		data: {
			name: "Alice",
			email: "sample@sample.com"
		}
	})
	return c.json(user);
})

export default app;
