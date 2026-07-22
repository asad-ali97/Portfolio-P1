import { PrismaClient } from '@prisma/client'

// Serverless functions can be invoked many times concurrently; without
// this singleton pattern, each cold start spins up a fresh PrismaClient
// (and DB connection). Reuse a global instance across warm invocations
// in every environment — especially production on Vercel.
const globalForPrisma = globalThis

export const prisma = globalForPrisma.__prisma ?? new PrismaClient()

globalForPrisma.__prisma = prisma
