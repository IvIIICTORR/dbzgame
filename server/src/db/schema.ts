import crypto from 'node:crypto'
import {
	relations,
	type InferSelectModel,
	type InferInsertModel,
} from 'drizzle-orm'
import {
	boolean,
	index,
	int,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	unique,
	json,
	varchar,
} from 'drizzle-orm/mysql-core'

// ======================================================
// 1. USERS
// ======================================================

export const users = mysqlTable(
	'users',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		username: varchar('username', { length: 32 }).notNull().unique(),
		name: varchar('name', { length: 32 }).notNull(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		passwordHash: varchar('password_hash', { length: 255 }).notNull(),
		avatarUrl: varchar('avatar_url', { length: 512 }),
		referralCode: varchar('referral_code', { length: 20 }).notNull().unique(),
		race: mysqlEnum('race', [
			'saiyan',
			'namekian',
			'human',
			'frieza_race',
			'majin',
			'android',
		]).notNull(),
		// role: mysqlEnum('role', ['user', 'moderator', 'admin'])
		// 	.default('user')
		// 	.notNull(),
		level: int('level').default(1).notNull(),
		exp: int('exp').default(0).notNull(),
		zeni: int('zeni').default(0).notNull(),
		powerLevel: int('power_level').default(100).notNull(),
		hp: int('hp').default(100).notNull(),
		maxHp: int('max_hp').default(100).notNull(),
		ki: int('ki').default(100).notNull(),
		maxKi: int('max_ki').default(100).notNull(),
		stamina: int('stamina').default(100).notNull(),
		maxStamina: int('max_stamina').default(100).notNull(),
		location: varchar('location', { length: 100 }).default('Planeta Terra - Capital do Oeste').notNull(),
		isVerified: boolean('is_verified').default(false).notNull(),
		isVip: boolean('is_vip').default(false).notNull(),
		vipExpiresAt: timestamp('vip_expires_at'),
		acceptedTermsAt: timestamp('accepted_terms_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
		deletedAt: timestamp('deleted_at'),
	},
	(table) => [
		index('username_idx').on(table.username),
		// index('role_idx').on(table.role),
		index('referral_code_idx').on(table.referralCode),
	],
)

// ======================================================
// 2. PROVIDERS
// ======================================================
export const providers = mysqlTable(
	'providers',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		provider: mysqlEnum('provider', ['google', 'discord']).notNull(),
		providerId: varchar('provider_id', { length: 255 }).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
	},
	(table) => [unique('provider_unique').on(table.provider, table.providerId)],
)

// ======================================================
// 3. TOKENS
// ======================================================
export const tokens = mysqlTable('tokens', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: varchar('user_id', { length: 36 })
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: varchar('token', { length: 255 }).notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ======================================================
// 4. REFERRALS
// ======================================================
export const referrals = mysqlTable('referrals', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	referrerId: varchar('referrer_id', { length: 36 }) // Quem convidou
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	referredId: varchar('referred_id', { length: 36 }) // Quem foi convidado (o novo user)
		.notNull()
		.unique() // Um usuário só pode ser convidado uma vez
		.references(() => users.id, { onDelete: 'cascade' }),
	status: mysqlEnum('status', ['pending', 'completed', 'rewarded'])
		.default('pending')
		.notNull(),
	rewardedAt: timestamp('rewarded_at'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ======================================================
// 5. CONVERSATIONS
// ======================================================

export const conversations = mysqlTable(
	'conversations',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		slug: varchar('slug', { length: 32 }).unique(), // 'global'
		name: varchar('name', { length: 64 }),

		type: mysqlEnum('type', ['global', 'private', 'group']).notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
	},
	(table) => [index('slug_idx').on(table.slug)],
)

// ======================================================
// 6. MESSAGES
// ======================================================

export const messages = mysqlTable(
	'messages',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),

		conversationId: varchar('conversation_id', { length: 36 })
			.notNull()
			.references(() => conversations.id, { onDelete: 'cascade' }),

		senderId: varchar('sender_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),

		content: text('content').notNull(),

		type: mysqlEnum('type', ['text', 'system']).default('text').notNull(),

		createdAt: timestamp('created_at').defaultNow().notNull(),

		editedAt: timestamp('edited_at'),
		deletedAt: timestamp('deleted_at'),
	},
	(table) => [
		index('conversation_created_idx').on(table.conversationId, table.createdAt),
	],
)

// ======================================================
// 7. NEWS
// ======================================================
export const news = mysqlTable('news', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: varchar('slug', { length: 128 }).notNull().unique(),
	title: varchar('title', { length: 255 }).notNull(),
	subtitle: varchar('subtitle', { length: 255 }),
	description: text('description').notNull(), // Resumo para a listagem
	category: mysqlEnum('category', [
		'Update',
		'Manutenção',
		'Lançamento',
		'Evento',
	]).notNull(),
	imageUrl: varchar('image_url', { length: 512 }),
	content: json('content')
		.$type<
			Array<{
				type: 'paragraph' | 'list'
				title?: string
				text?: string
				items?: string[]
			}>
		>()
		.notNull(),
	authorId: varchar('author_id', { length: 36 })
		.notNull()
		.references(() => users.id),
	publishedAt: timestamp('published_at').defaultNow(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
})

// ======================================================
// 8. DAILY MISSIONS (Definição das missões)
// ======================================================
export const dailyMissions = mysqlTable('daily_missions', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: varchar('title', { length: 100 }).notNull(),
	description: varchar('description', { length: 255 }).notNull(),
	total: int('total').notNull(),
	rewardZeni: int('reward_zeni').notNull().default(0),
	rewardExp: int('reward_exp').notNull().default(0),
	imageUrl: varchar('image_url', { length: 512 }),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ======================================================
// 9. DAILY MISSION PROGRESS (Progresso por jogador por dia)
// ======================================================
export const dailyMissionProgress = mysqlTable(
	'daily_mission_progress',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		missionId: varchar('mission_id', { length: 36 })
			.notNull()
			.references(() => dailyMissions.id, { onDelete: 'cascade' }),
		progress: int('progress').notNull().default(0),
		claimed: boolean('claimed').default(false).notNull(),
		date: varchar('date', { length: 10 }).notNull(), // 'YYYY-MM-DD'
		claimedAt: timestamp('claimed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
	},
	(table) => [
		index('user_date_idx').on(table.userId, table.date),
		unique('user_mission_date_unique').on(table.userId, table.missionId, table.date),
	],
)

// ======================================================
// 10. SAGAS (Definição das sagas/campanha)
// ======================================================
export const sagas = mysqlTable('sagas', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: varchar('title', { length: 150 }).notNull(),
	episode: varchar('episode', { length: 50 }).notNull(),
	description: text('description').notNull(),
	difficulty: mysqlEnum('difficulty', ['Normal', 'Difícil', 'Elite', 'Lendário']).notNull(),
	reward: varchar('reward', { length: 255 }).notNull(),
	rewardZeni: int('reward_zeni').notNull().default(0),
	rewardExp: int('reward_exp').notNull().default(0),
	imageUrl: varchar('image_url', { length: 512 }),
	sortOrder: int('sort_order').notNull().default(0),
	requiresSagaId: varchar('requires_saga_id', { length: 36 }),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ======================================================
// 11. SAGA STAGES (Boss/inimigos de cada saga)
// ======================================================
export const sagaStages = mysqlTable('saga_stages', {
	id: varchar('id', { length: 36 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	sagaId: varchar('saga_id', { length: 36 })
		.notNull()
		.references(() => sagas.id, { onDelete: 'cascade' }),
	stageName: varchar('stage_name', { length: 100 }).notNull(),
	enemyName: varchar('enemy_name', { length: 100 }).notNull(),
	enemyLevel: int('enemy_level').notNull(),
	enemyHp: int('enemy_hp').notNull().default(100),
	enemyAvatarUrl: varchar('enemy_avatar_url', { length: 512 }),
	enemyImageUrl: varchar('enemy_image_url', { length: 512 }),
	enemyForm: varchar('enemy_form', { length: 100 }),
	sortOrder: int('sort_order').notNull().default(0),
	createdAt: timestamp('created_at').defaultNow().notNull(),
})

// ======================================================
// 12. SAGA PROGRESS (Progresso do jogador nas sagas)
// ======================================================
export const sagaProgress = mysqlTable(
	'saga_progress',
	{
		id: varchar('id', { length: 36 })
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar('user_id', { length: 36 })
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		sagaId: varchar('saga_id', { length: 36 })
			.notNull()
			.references(() => sagas.id, { onDelete: 'cascade' }),
		currentStageId: varchar('current_stage_id', { length: 36 })
			.references(() => sagaStages.id),
		status: mysqlEnum('status', ['locked', 'in_progress', 'completed'])
			.default('locked')
			.notNull(),
		rank: mysqlEnum('rank', ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS']),
		bestTime: int('best_time'),
		victories: int('victories').notNull().default(0),
		defeats: int('defeats').notNull().default(0),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
	},
	(table) => [
		unique('user_saga_unique').on(table.userId, table.sagaId),
		index('user_saga_idx').on(table.userId),
	],
)

// ======================================================
// RELATIONSHIPS
// ======================================================

export const usersRelations = relations(users, ({ many }) => ({
	tokens: many(tokens),
	providers: many(providers),
	referralsMade: many(referrals, { relationName: 'referrer' }),
	referredBy: many(referrals, { relationName: 'referred' }),
	messages: many(messages),
	dailyMissionProgress: many(dailyMissionProgress),
	sagaProgress: many(sagaProgress),
}))

export const dailyMissionsRelations = relations(dailyMissions, ({ many }) => ({
	progress: many(dailyMissionProgress),
}))

export const dailyMissionProgressRelations = relations(dailyMissionProgress, ({ one }) => ({
	user: one(users, {
		fields: [dailyMissionProgress.userId],
		references: [users.id],
	}),
	mission: one(dailyMissions, {
		fields: [dailyMissionProgress.missionId],
		references: [dailyMissions.id],
	}),
}))

export const sagasRelations = relations(sagas, ({ many }) => ({
	stages: many(sagaStages),
	progress: many(sagaProgress),
}))

export const sagaStagesRelations = relations(sagaStages, ({ one }) => ({
	saga: one(sagas, {
		fields: [sagaStages.sagaId],
		references: [sagas.id],
	}),
}))

export const sagaProgressRelations = relations(sagaProgress, ({ one }) => ({
	user: one(users, {
		fields: [sagaProgress.userId],
		references: [users.id],
	}),
	saga: one(sagas, {
		fields: [sagaProgress.sagaId],
		references: [sagas.id],
	}),
	currentStage: one(sagaStages, {
		fields: [sagaProgress.currentStageId],
		references: [sagaStages.id],
	}),
}))

export const providersRelations = relations(providers, ({ one }) => ({
	user: one(users, {
		fields: [providers.userId],
		references: [users.id],
	}),
}))

export const tokensRelations = relations(tokens, ({ one }) => ({
	user: one(users, {
		fields: [tokens.userId],
		references: [users.id],
	}),
}))

export const referralsRelations = relations(referrals, ({ one }) => ({
	referrer: one(users, {
		fields: [referrals.referrerId],
		references: [users.id],
		relationName: 'referrer',
	}),
	referred: one(users, {
		fields: [referrals.referredId],
		references: [users.id],
		relationName: 'referred',
	}),
}))

export const conversationsRelations = relations(conversations, ({ many }) => ({
	messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
	conversation: one(conversations, {
		fields: [messages.conversationId],
		references: [conversations.id],
	}),
	sender: one(users, {
		fields: [messages.senderId],
		references: [users.id],
	}),
}))

// ======================================================
// TYPE INFERENCE
// ======================================================

// Users
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

// Providers
export type Provider = InferSelectModel<typeof providers>
export type NewProvider = InferInsertModel<typeof providers>

// Tokens
export type Token = InferSelectModel<typeof tokens>
export type NewToken = InferInsertModel<typeof tokens>

// Referrals
export type Referral = InferSelectModel<typeof referrals>
export type NewReferral = InferInsertModel<typeof referrals>

// Conversations
export type Conversation = InferSelectModel<typeof conversations>
export type NewConversation = InferInsertModel<typeof conversations>

// Messages
export type Message = InferSelectModel<typeof messages>
export type NewMessage = InferInsertModel<typeof messages>

// News
export type News = InferSelectModel<typeof news>
export type NewNews = InferInsertModel<typeof news>

// Daily Missions
export type DailyMission = InferSelectModel<typeof dailyMissions>
export type NewDailyMission = InferInsertModel<typeof dailyMissions>

// Daily Mission Progress
export type DailyMissionProgress = InferSelectModel<typeof dailyMissionProgress>
export type NewDailyMissionProgress = InferInsertModel<typeof dailyMissionProgress>

// Sagas
export type Saga = InferSelectModel<typeof sagas>
export type NewSaga = InferInsertModel<typeof sagas>

// Saga Stages
export type SagaStage = InferSelectModel<typeof sagaStages>
export type NewSagaStage = InferInsertModel<typeof sagaStages>

// Saga Progress
export type SagaProgress = InferSelectModel<typeof sagaProgress>
export type NewSagaProgress = InferInsertModel<typeof sagaProgress>
