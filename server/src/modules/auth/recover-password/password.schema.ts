import { z } from 'zod'

export const forgotPasswordBodySchema = z.object({
	email: z.email(),
})

export const verifyTokenQuerySchema = z.object({
	token: z.string().min(1),
})

export const resetPasswordBodySchema = z.object({
	token: z.string().min(1),
	password: z.string().min(6).max(32),
})

export const verifyTokenResponseSchema = z.object({
	valid: z.boolean(),
	message: z.string(),
})

export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>
export type VerifyTokenQuery = z.infer<typeof verifyTokenQuerySchema>
