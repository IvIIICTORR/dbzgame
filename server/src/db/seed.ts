import crypto from 'node:crypto'
import { eq } from 'drizzle-orm'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { conversations, dailyMissionProgress, dailyMissions, messages, referrals, sagaProgress, sagaStages, sagas, users } from '#/db/schema.js'
import { hashPassword } from '#/shared/utils/password.js'
import { db } from './index.js'

async function seed() {
	console.log('--- Iniciando Seed ---')

	// CONFIG
	const TOTAL_USERS = 50

	// 1. Limpeza (Ordem importa por causa das chaves estrangeiras)
	await db.delete(sagaProgress)
	await db.delete(sagaStages)
	await db.delete(sagas)
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
			userId: testUserId,
			missionId: p.missionId,
			progress: p.progress,
			date: today,
		})
	}
	console.log('\u2705 Missões diárias criadas com progresso do usuário de teste')

	// ======================================================
	// 7. SAGAS (Campanha)
	// ======================================================
	const sagasData = [
		{
			title: 'A Chegada dos Saiyajins',
			episode: 'Capítulo 01',
			description: 'Raditz chegou à Terra. Una-se a Piccolo para resgatar Gohan e enfrentar a primeira grande ameaça espacial.',
			difficulty: 'Normal' as const,
			reward: 'Esfera de 4 Estrelas',
			rewardZeni: 1000,
			rewardExp: 500,
			imageUrl: '/templates/batalhas/sagas/saiyajin.png',
			sortOrder: 1,
			requiresSagaId: null,
			stages: [
				{ stageName: 'Raditz - O Irmão de Goku', enemyName: 'Raditz', enemyLevel: 15, enemyHp: 80, enemyAvatarUrl: '/templates/equipamentos/raditz.avif', enemyImageUrl: '/templates/raditz.png', enemyForm: 'Base', sortOrder: 1 },
				{ stageName: 'Nappa - O General Saiyajin', enemyName: 'Nappa', enemyLevel: 25, enemyHp: 100, enemyAvatarUrl: '/templates/equipamentos/nappa.avif', enemyImageUrl: '/templates/nappa.png', enemyForm: 'Base', sortOrder: 2 },
				{ stageName: 'Vegeta - O Príncipe dos Saiyajins', enemyName: 'Vegeta', enemyLevel: 35, enemyHp: 120, enemyAvatarUrl: '/templates/equipamentos/vegeta.avif', enemyImageUrl: '/templates/vegeta.png', enemyForm: 'Oozaru', sortOrder: 3 },
			],
		},
		{
			title: 'O Imperador do Universo',
			episode: 'Capítulo 02',
			description: 'Viagem a Namekusei. Enfrente as Forças Ginyu e prepare-se para o duelo mortal contra Freeza.',
			difficulty: 'Normal' as const,
			reward: 'Z-Sword Fragment',
			rewardZeni: 2000,
			rewardExp: 1000,
			imageUrl: '/templates/batalhas/sagas/freeza.png',
			sortOrder: 2,
			requiresSagaId: null as string | null, // preenchido depois
			stages: [
				{ stageName: 'Capitão Ginyu - Mudança de Corpo', enemyName: 'Ginyu', enemyLevel: 40, enemyHp: 90, enemyAvatarUrl: '/templates/equipamentos/ginyu.avif', enemyImageUrl: '/templates/ginyu.png', enemyForm: 'Base', sortOrder: 1 },
				{ stageName: 'Freeza - Primeira Forma', enemyName: 'Freeza', enemyLevel: 50, enemyHp: 100, enemyAvatarUrl: '/templates/equipamentos/freeza.avif', enemyImageUrl: '/templates/freeza.png', enemyForm: '1ª Forma', sortOrder: 2 },
				{ stageName: 'Freeza - Forma Final', enemyName: 'Freeza', enemyLevel: 65, enemyHp: 150, enemyAvatarUrl: '/templates/equipamentos/freeza.avif', enemyImageUrl: '/templates/freeza.png', enemyForm: 'Forma Final', sortOrder: 3 },
			],
		},
		{
			title: 'Os Androids e o Terror de Cell',
			episode: 'Capítulo 03',
			description: 'O futuro está em perigo. Treine na Sala do Tempo para alcançar o Super Saiyajin 2 e deter a forma perfeita de Cell.',
			difficulty: 'Difícil' as const,
			reward: 'Cápsula de Treino',
			rewardZeni: 3000,
			rewardExp: 1500,
			imageUrl: '/templates/batalhas/sagas/cell.png',
			sortOrder: 3,
			requiresSagaId: null as string | null,
			stages: [
				{ stageName: 'Android 19 e Dr. Gero', enemyName: 'Android 19', enemyLevel: 55, enemyHp: 90, enemyAvatarUrl: '/templates/equipamentos/android19.avif', enemyImageUrl: '/templates/android19.png', enemyForm: 'Base', sortOrder: 1 },
				{ stageName: 'Cell - Forma Semi-Perfeita', enemyName: 'Cell', enemyLevel: 70, enemyHp: 120, enemyAvatarUrl: '/templates/equipamentos/cell.avif', enemyImageUrl: '/templates/cell.png', enemyForm: 'Semi-Perfeito', sortOrder: 2 },
				{ stageName: 'Cell - Forma Perfeita', enemyName: 'Cell', enemyLevel: 80, enemyHp: 180, enemyAvatarUrl: '/templates/equipamentos/cell.avif', enemyImageUrl: '/templates/cell.png', enemyForm: 'Perfeito', sortOrder: 3 },
			],
		},
		{
			title: 'O Despertar de Majin Boo',
			episode: 'Capítulo 04',
			description: 'A magia de Babidi libertou a criatura mais perigosa do universo. Domine a Genki Dama final.',
			difficulty: 'Elite' as const,
			reward: 'Brincos Potara',
			rewardZeni: 5000,
			rewardExp: 2500,
			imageUrl: '/templates/batalhas/sagas/majinboo.png',
			sortOrder: 4,
			requiresSagaId: null as string | null,
			stages: [
				{ stageName: 'Dabura - O Rei dos Demônios', enemyName: 'Dabura', enemyLevel: 75, enemyHp: 100, enemyAvatarUrl: '/templates/equipamentos/dabura.avif', enemyImageUrl: '/templates/dabura.png', enemyForm: 'Base', sortOrder: 1 },
				{ stageName: 'Majin Boo - Forma Gorda', enemyName: 'Majin Boo', enemyLevel: 85, enemyHp: 150, enemyAvatarUrl: '/templates/equipamentos/majinboo.avif', enemyImageUrl: '/templates/majinboo.png', enemyForm: 'Gordo', sortOrder: 2 },
				{ stageName: 'Kid Boo - A Forma Original', enemyName: 'Kid Boo', enemyLevel: 99, enemyHp: 200, enemyAvatarUrl: '/templates/equipamentos/kidboo.avif', enemyImageUrl: '/templates/kidboo.png', enemyForm: 'Kid', sortOrder: 3 },
			],
		},
	]

	const sagaIds: string[] = []
	for (const s of sagasData) {
		const sagaId = crypto.randomUUID()
		sagaIds.push(sagaId)

		await db.insert(sagas).values({
			id: sagaId,
			title: s.title,
			episode: s.episode,
			description: s.description,
			difficulty: s.difficulty,
			reward: s.reward,
			rewardZeni: s.rewardZeni,
			rewardExp: s.rewardExp,
			imageUrl: s.imageUrl,
			sortOrder: s.sortOrder,
			requiresSagaId: s.requiresSagaId,
		})

		for (const stage of s.stages) {
			await db.insert(sagaStages).values({
				sagaId,
				...stage,
			})
		}
	}

	// Encadear requisitos: saga 2 requer saga 1, saga 3 requer saga 2, etc
	for (let i = 1; i < sagaIds.length; i++) {
		await db.update(sagas).set({ requiresSagaId: sagaIds[i - 1] }).where(
			// @ts-expect-error - Drizzle strict typing
			eq(sagas.id, sagaIds[i]),
		)
	}

	// Progresso do test user: saga 1 concluída, saga 2 em progresso
	// @ts-expect-error - Drizzle strict typing with $defaultFn
	await db.insert(sagaProgress).values({
		userId: testUserId,
		sagaId: sagaIds[0],
		status: 'completed',
		rank: 'S',
		victories: 3,
		defeats: 1,
		bestTime: 85,
		completedAt: new Date(),
	})
	// @ts-expect-error - Drizzle strict typing with $defaultFn
	await db.insert(sagaProgress).values({
		userId: testUserId,
		sagaId: sagaIds[1],
		status: 'in_progress',
		victories: 1,
		defeats: 2,
	})

	console.log('\u2705 Sagas criadas com stages e progresso do usuário de teste')

	console.log('--- Seed Finalizada ---')
	process.exit(0)
}

seed().catch((err) => {
	console.error('❌ Erro na Seed:', err)
	process.exit(1)
})
