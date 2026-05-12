import crypto from 'node:crypto'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { conversations, dailyMissionProgress, dailyMissions, messages, referrals, users } from '#/db/schema.js'
import { hashPassword } from '#/shared/utils/password.js'
import { db } from './index.js'

async function seed() {
	console.log('--- Iniciando Seed ---')

	// CONFIG
	const TOTAL_USERS = 50

	// 1. Limpeza (Ordem importa por causa das chaves estrangeiras)
	await db.delete(dailyMissionProgress)
	await db.delete(dailyMissions)
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

	// ======================================================
	// 6. MISSÕES DIÁRIAS
	// ======================================================
	const missionsData = [
		{ title: 'Aquecimento', description: 'Derrota 5 Saibamens.', total: 5, rewardZeni: 200, rewardExp: 100, imageUrl: '/templates/capsula.png' },
		{ title: 'Controle de Ki', description: 'Treina Atributos 3 vezes.', total: 3, rewardZeni: 150, rewardExp: 80, imageUrl: '/templates/cell.png' },
		{ title: 'Desafiante', description: 'Vence 1 duelo na Arena.', total: 1, rewardZeni: 500, rewardExp: 250, imageUrl: '/templates/freeza.png' },
		{ title: 'Explorador', description: 'Encontra 1 Esfera do Dragão.', total: 1, rewardZeni: 1000, rewardExp: 500, imageUrl: '/templates/esferas.png' },
		{ title: 'Treino Pesado', description: 'Gravidade 100x.', total: 10, rewardZeni: 300, rewardExp: 200, imageUrl: '/templates/treinopesado.png' },
		{ title: 'Patrulha Galáctica', description: 'Ajude o Jaco.', total: 1, rewardZeni: 400, rewardExp: 150, imageUrl: '/templates/patrulha.png' },
		{ title: 'Mestre Kame', description: 'Entrega de leite.', total: 1, rewardZeni: 250, rewardExp: 120, imageUrl: '/templates/mestrekame.png' },
	]

	const missionIds: string[] = []
	for (const m of missionsData) {
		const id = crypto.randomUUID()
		await db.insert(dailyMissions).values({ id, ...m })
		missionIds.push(id)
	}

	// Criar progresso mock para o usuário de teste (hoje)
	const today = new Date().toISOString().split('T')[0]
	const testProgress = [
		{ missionId: missionIds[0], progress: 5 },  // Aquecimento: 5/5 (completa)
		{ missionId: missionIds[1], progress: 1 },  // Controle de Ki: 1/3
		{ missionId: missionIds[2], progress: 0 },  // Desafiante: 0/1
		{ missionId: missionIds[3], progress: 0 },  // Explorador: 0/1
		{ missionId: missionIds[4], progress: 2 },  // Treino Pesado: 2/10
		{ missionId: missionIds[5], progress: 0 },  // Patrulha: 0/1
		{ missionId: missionIds[6], progress: 1 },  // Mestre Kame: 1/1 (completa)
	]

	for (const p of testProgress) {
		await db.insert(dailyMissionProgress).values({
			id: crypto.randomUUID(),
			userId: testUserId,
			missionId: p.missionId,
			progress: p.progress,
			date: today,
		})
	}
	console.log('\u2705 Missões diárias criadas com progresso do usuário de teste')

	console.log('--- Seed Finalizada ---')
	process.exit(0)
}

seed().catch((err) => {
	console.error('❌ Erro na Seed:', err)
	process.exit(1)
})
