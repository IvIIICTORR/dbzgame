import { z } from 'zod'

export const myReferralsResponseSchema = z.array(
	z.object({
		id: z.string(),
		status: z.enum(['pending', 'completed', 'rewarded']),
		createdAt: z.date(),
		referredUser: z.object({
			username: z.string(),
			avatarUrl: z.string().nullable(),
		}),
	}),
)
