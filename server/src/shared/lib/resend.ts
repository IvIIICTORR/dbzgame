import { Resend } from 'resend'
import { env } from '#/config/env.js'
import { BadRequest } from '../errors/index.js'

const resendClient = new Resend(env.RESEND_API_KEY)

/**
 * Utilitário para envio de e-mails via Resend.
 * Encapsula a lógica de erro para garantir que falhas na API lancem exceções capturáveis.
 */
export const resend = {
	/**
	 * Envia um e-mail utilizando o payload do Resend.
	 * * @param payload - Objeto contendo remetente, destinatário, assunto e conteúdo.
	 * @throws {Error} Lança um erro caso o serviço do Resend falhe.
	 * @returns Promessa com os dados de rastreio do envio.
	 */
	async send(payload: Parameters<typeof resendClient.emails.send>[0]) {
		const { data, error } = await resendClient.emails.send(payload)

		if (error) {
			console.error(`[Resend Error] ${error.name}: ${error.message}`)
			throw BadRequest(`Falha no serviço de e-mail: ${error.message}`)
		}

		return data
	},
}
