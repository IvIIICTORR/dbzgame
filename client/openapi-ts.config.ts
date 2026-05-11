import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: 'http://localhost:3000/docs/json',
  output: 'src/api',
  plugins: [
    '@hey-api/typescript',
    '@pinia/colada',
    '@hey-api/sdk',
    'zod',
    {
      name: '@hey-api/client-axios',
      runtimeConfigPath: '../client.ts',
    }
  ],
})
