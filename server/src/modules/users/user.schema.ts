import { z } from 'zod'

const userSchema = z.object({
	username: z.string().min(3).max(32),
	name: z.string().min(2).max(32),
	email: z.email(),
	race: z.enum([
		'saiyan',
		'namekian',
		'human',
		'frieza_race',
		'majin',
		'android',
	]),
	avatarUrl: z.url().optional(),
})

export const userResponseSchema = userSchema.extend({
	id: z.uuid(),
	level: z.number(),
	exp: z.number(),
	zeni: z.number(),
	powerLevel: z.number(),
	hp: z.number(),
	maxHp: z.number(),
	ki: z.number(),
	maxKi: z.number(),
	stamina: z.number(),
	maxStamina: z.number(),
	location: z.string(),
	isVerified: z.boolean(),
	isVip: z.boolean(),
	vipExpiresAt: z.date().nullable(),
	acceptedTermsAt: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export const userListResponseSchema = z.array(userResponseSchema)

export const createUserSchema = userSchema.extend({
	password: z.string().min(6),
	acceptedTerms: z.literal(true),
})

export const updateUserSchema = createUserSchema
	.omit({ email: true, race: true, password: true, acceptedTerms: true })
	.partial()

export const userIdParamSchema = z.object({
	id: z.uuid(),
})

export const registerQuerySchema = z.object({
	ref: z.string().optional(),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type RegisterQueryInput = z.infer<typeof registerQuerySchema>
export type UserIdParam = z.infer<typeof userIdParamSchema>
