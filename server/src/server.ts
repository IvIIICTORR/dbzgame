import { app } from './app.js'
import { env } from './config/env.js'

const start = async () => {
	try {
		await app.listen({ port: env.PORT, host: env.HOST })
		app.log.info(`Documentation: http://${env.HOST}:${env.PORT}/docs`)
	} catch (err) {
		app.log.error(err)
		process.exit(1)
	}
}

start()
