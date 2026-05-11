import bcrypt from 'bcrypt'

/**
 * Gera um hash seguro para senhas utilizando o algoritmo bcrypt.
 * * @param password - Senha em texto plano fornecida pelo usuário.
 * @returns Promessa contendo o hash gerado com 12 salt rounds.
 */
export const hashPassword = async (password: string): Promise<string> => {
	return await bcrypt.hash(password, 12)
}

/**
 * Compara uma senha em texto plano com um hash armazenado.
 * * @param password - Senha enviada na tentativa de login.
 * @param hash - Hash recuperado do banco de dados.
 */
export const comparePassword = async (
	password: string,
	hash: string,
): Promise<boolean> => {
	return await bcrypt.compare(password, hash)
}
