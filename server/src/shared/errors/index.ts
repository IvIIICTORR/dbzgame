/**
 * Classe base para erros conhecidos da aplicação.
 * Permite lançar exceções com status HTTP específicos que podem ser
 * capturados por um global error handler no Fastify.
 * * @example
 * throw new AppError('Usuário não encontrado', 404);
 */
export class AppError extends Error {
	/** Status HTTP do erro (ex: 400, 401, 404, 500) */
	public readonly statusCode: number

	/**
	 * @param message - Mensagem descritiva do erro.
	 * @param statusCode - Código de status HTTP (padrão é 400).
	 */
	constructor(message: string, statusCode = 400) {
		super(message)
		this.statusCode = statusCode

		// Mantém o nome da classe no log do erro
		this.name = 'AppError'

		// Captura o stack trace para facilitar o rastreio do erro no console
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}

/**
 * Atalhos semânticos para erros comuns.
 * Facilitam a leitura do código nos Services e garantem consistência nos status codes.
 */

/** * Erro de Requisição Inválida (400).
 * @param msg - Mensagem customizada sobre o erro de validação ou lógica.
 */
export const BadRequest = (msg: string) => new AppError(msg, 400)

/** * Erro de Não Autorizado (401).
 * @param msg - Mensagem de erro (ex: "Token expirado" ou "Login necessário").
 */
export const Unauthorized = (msg: string) => new AppError(msg, 401)

/** * Erro de Acesso Proibido (403).
 * Utilizado quando o usuário está autenticado, mas não possui permissão.
 */
export const Forbidden = (msg: string) => new AppError(msg, 403)

/** * Erro de Recurso Não Encontrado (404).
 * @param msg - Nome do recurso ou mensagem de não localizado.
 */
export const NotFound = (msg: string) => new AppError(msg, 404)

/** * Erro de Conflito (409).
 * Útil para violações de chave única, como e-mail já cadastrado.
 */
export const Conflict = (msg: string) => new AppError(msg, 409)

/** * Erro Interno do Servidor (500).
 * **IMPORTANTE:** Use este erro para falhas de infraestrutura ou situações
 * onde um recurso deveria existir/ser criado mas algo falhou no servidor.
 */
export const InternalError = (msg: string) => new AppError(msg, 500)
