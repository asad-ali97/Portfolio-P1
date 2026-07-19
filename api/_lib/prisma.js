import { PrismaClient } from '@prisma/client'

// Serverless functions can be invoked many times concurrently; without
// this singleton pattern, each invocation would spin up a fresh
// PrismaClient (and DB connection). Reusing a global instance across
// warm invocations is the standard Prisma + serverless pattern.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.__prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma
}
