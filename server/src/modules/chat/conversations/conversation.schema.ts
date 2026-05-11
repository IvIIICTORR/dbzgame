import { z } from 'zod'

export const conversationResponseSchema = z.object({
	id: z.uuid(),
	slug: z.string().nullable(),
	name: z.string().nullable(),
	type: z.enum(['global', 'private', 'group']),
	createdAt: z.date(),
	updatedAt: z.date(),
})

export type ConversationResponse = z.infer<typeof conversationResponseSchema>
