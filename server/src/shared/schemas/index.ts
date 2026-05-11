import { z } from 'zod'

/**
 * Schema para IDs (UUID)
 * Útil para /users/:id
 */
export const idParamSchema = z.object({
	id: z.uuid(),
})

/**
 * Schema de Paginação e Busca
 * Adicionado ordenação padrão
 */
export const paginationSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(10),
	search: z.string().optional(),
	sortBy: z.string().default('createdAt'),
	order: z.enum(['asc', 'desc']).default('desc'),
})

/**
 * Schema de Resposta de Erro Padronizada
 * Estrutura mais comum para feedback no Front-end (Vue.js)
 */
export const errorResponseSchema = z.object({
	statusCode: z.number().int(),
	error: z.string(), // "Bad Request", "Unauthorized"
	message: z.string(),

	code: z.string().optional(), // "USER_NOT_FOUND", "VALIDATION_ERROR"

	errors: z
		.array(
			z.object({
				path: z.array(z.string()),
				message: z.string(),
			}),
		)
		.optional(),
})

/**
 * Schema genérico para respostas de sucesso com metadados
 * Útil para seu Front-end saber o total de páginas
 */
export const successPaginatedResponseSchema = z.object({
	data: z.array(z.any()),
	meta: z.object({
		total: z.number(),
		page: z.number(),
		lastPage: z.number(),
	}),
})

// Tipagens
export type IdParam = z.infer<typeof idParamSchema>
export type PaginationParams = z.infer<typeof paginationSchema>
export type ErrorResponse = z.infer<typeof errorResponseSchema>
