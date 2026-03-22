import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

const { JWT_SECRET, COOKIE_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set");
}

if (!COOKIE_SECRET) {
  throw new Error("COOKIE_SECRET is not set");
}

export default defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true" || process.env.DISABLE_MEDUSA_ADMIN === "1",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    workerMode: (process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server") || "shared",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: JWT_SECRET,
      cookieSecret: COOKIE_SECRET,
    }
  },
  modules: [
    {
      resolve: "./src/modules/tenant",
    },
  ],
})
