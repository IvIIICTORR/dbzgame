import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import autoload from '@fastify/autoload'
import fastify from 'fastify'
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'

const __dirname = dirname(fileURLToPath(import.meta.url))

const app = fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
				colorize: true,
				singleLine: true,
				messageFormat: '{msg}',
			},
		},
	},
}).withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(autoload, {
	dir: join(__dirname, 'plugins'),
})

app.register(autoload, {
	dir: join(__dirname, 'modules'),
	matchFilter: /\.route\.(ts|js)$/,
})

export { app }
