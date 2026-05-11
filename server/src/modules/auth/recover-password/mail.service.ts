import { env } from '#/config/env.js'
import { resend } from '#/shared/lib/resend.js'

/**
 * Envia o e-mail de recuperação de senha.
 */
export const mailService = {
	async sendForgotPasswordEmail(
		email: string,
		username: string,
		token: string,
	) {
		const resetLink = `${env.FRONTEND_URL}/reset-password?token=${token}`

		await resend.send({
			from: env.MAIL_FROM,
			to: email,
			subject: 'Recuperação de Senha',
			html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #111;">
          <h2>Olá, ${username}!</h2>
          <p>Recebemos uma solicitação para redefinir a sua senha.</p>
          <p>Para prosseguir, clique no botão abaixo:</p>
          <a href="${resetLink}"
             style="background: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Redefinir Senha
          </a>
          <p>Este link é válido por apenas 1 hora.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.8rem; color: #666;">Se não foi você quem solicitou, pode ignorar este e-mail.</p>
        </div>
      `,
		})
	},
}
