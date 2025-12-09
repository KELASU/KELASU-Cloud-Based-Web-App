// We import from the custom generated path you saw in the terminal
import { PrismaClient } from '@/generated/prisma/client';

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: Logs SQL queries to console
  } as any); // Cast to 'any' to bypass the strict 'accelerateUrl' type check

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;