import { z } from 'zod'

// ── Sender embutido na resposta da mensagem

export const senderSchema = z.object({
	id: z.uuid(),
	username: z.string(),
	name: z.string(),
	avatarUrl: z.string().nullable(),
	isVerified: z.boolean(),
	race: z.enum([
		'saiyan',
		'namekian',
		'human',
		'frieza_race',
		'majin',
		'android',
	]),
})

// ── Resposta de uma única mensagem

export const messageResponseSchema = z.object({
	id: z.uuid(),
	conversationId: z.uuid(),
	senderId: z.uuid(),
	content: z.string(),
	type: z.enum(['text', 'system']),
	createdAt: z.date(),
	editedAt: z.date().nullable(),
	sender: senderSchema,
})

// ── Histórico (array)

export const messagesHistoryResponseSchema = z.array(messageResponseSchema)

// ── Body do POST

export const createMessageBodySchema = z.object({
	content: z.string().min(1).max(1000).trim(),
})

export type MessageResponse = z.infer<typeof messageResponseSchema>
export type CreateMessageBody = z.infer<typeof createMessageBodySchema>
