// import underPressure from '@fastify/under-pressure'
// import fp from 'fastify-plugin'

// export default fp(async (app) => {
//   app.register(underPressure, {
//     maxEventLoopDelay: 1000,
//     maxHeapUsedBytes: 1 * 1024 * 1024 * 1024,
//     maxRssBytes: 1.5 * 1024 * 1024 * 1024,
//     exposeStatusRoute: {
//       url: '/status',
//       routeOpts: {
//         logLevel: 'debug'
//       }
//     }
//   })
// })
