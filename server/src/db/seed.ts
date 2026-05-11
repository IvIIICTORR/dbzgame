import crypto from 'node:crypto'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { conversations, messages, referrals, users } from '#/db/schema.js'
import { hashPassword } from '#/shared/utils/password.js'
import { db } from './index.js'

async function seed() {
	console.log('--- Iniciando Seed ---')

	// CONFIG
	const TOTAL_USERS = 50

	// 1. Limpeza (Ordem importa por causa das chaves estrangeiras)
	await db.delete(messages)
	await db.delete(conversations)
	await db.delete(referrals)
	await db.delete(users)

	console.log('✅ Banco limpo')

	const userIds: string[] = []
	const races = [
		'saiyan',
		'namekian',
		'human',
		'frieza_race',
		'majin',
		'android',
	] as const

	// ======================================================
	// 2. USUÁRIO DE TESTE (FIXO)
	// ======================================================
	const testUserId = crypto.randomUUID()
	const hashedTestPassword = await hashPassword('password123')

	await db.insert(users).values({
		id: testUserId,
		username: 'testuser',
		name: 'Usuário de Teste',
		email: 'test@example.com',
		passwordHash: hashedTestPassword,
		avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
		referralCode: 'TEST123',
		race: 'saiyan',
		acceptedTermsAt: new Date(),
	})
	userIds.push(testUserId)

	// ======================================================
	// 3. CRIAÇÃO DE DEMAIS USUÁRIOS
	// ======================================================
	for (let i = 0; i < TOTAL_USERS - 1; i++) {
		const id = crypto.randomUUID()
		await db.insert(users).values({
			id,
			username: faker.internet.username().toLowerCase(),
			name: faker.person.fullName(),
			email: faker.internet.email().toLowerCase(),
			passwordHash: hashedTestPassword,
			avatarUrl: faker.image.avatar(),
			referralCode: faker.string.alphanumeric(8).toUpperCase(),
			race: faker.helpers.arrayElement(races),
			acceptedTermsAt: new Date(),
		})
		userIds.push(id)
	}
	console.log(`✅ ${TOTAL_USERS} usuários criados`)

	// ======================================================
	// 4. CANAL GLOBAL (Obrigatório para o módulo de chat)
	// ======================================================
	const globalChannelId = crypto.randomUUID()

	await db.insert(conversations).values({
		id: globalChannelId,
		slug: 'global', // ✨ IMPORTANTE: O Service busca por este slug
		name: 'Chat Global',
		type: 'global',
	})

	// Criar algumas mensagens iniciais no Global para o chat não nascer vazio
	for (let i = 0; i < 20; i++) {
		await db.insert(messages).values({
			id: crypto.randomUUID(),
			conversationId: globalChannelId,
			senderId: faker.helpers.arrayElement(userIds),
			content: faker.lorem.sentence(),
			type: 'text',
			createdAt: faker.date.recent({ days: 1 }),
		})
	}
	console.log('✅ Canal Global criado com mensagens iniciais')

	// ======================================================
	// 5. CONVERSAS PRIVADAS
	// ======================================================
	for (let i = 0; i < 15; i++) {
		const convId = crypto.randomUUID()
		const user1 = faker.helpers.arrayElement(userIds)
		const user2 = faker.helpers.arrayElement(
			userIds.filter((id) => id !== user1),
		)

		await db.insert(conversations).values({
			id: convId,
			type: 'private',
		})

		for (let j = 0; j < faker.number.int({ min: 2, max: 5 }); j++) {
			await db.insert(messages).values({
				id: crypto.randomUUID(),
				conversationId: convId,
				senderId: faker.helpers.arrayElement([user1, user2]),
				content: faker.lorem.sentence(),
				type: 'text',
				createdAt: faker.date.recent(),
			})
		}
	}
	console.log('✅ Conversas privadas criadas')

	console.log('--- Seed Finalizada ---')
	process.exit(0)
}

seed().catch((err) => {
	console.error('❌ Erro na Seed:', err)
	process.exit(1)
})
