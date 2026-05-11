import { z } from 'zod'

export const loginBodySchema = z.object({
	email: z.email(),
	password: z.string().min(1).max(32),
})

export const loginResponseSchema = z.object({
	message: z.string(),
	user: z.object({
		id: z.uuid(),
		username: z.string(),
		email: z.email(),
		avatarUrl: z.string().nullable(),
	}),
})

export type LoginBody = z.infer<typeof loginBodySchema>
