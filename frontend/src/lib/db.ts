import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (dbUrl.startsWith('postgresql://') || dbUrl.startsWith('postgres://')) {
    const pool = new Pool({ connectionString: dbUrl });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } else if (dbUrl.startsWith('prisma+postgres://')) {
    // @ts-ignore
    return new PrismaClient({ accelerateUrl: dbUrl });
  } else {
    return new PrismaClient();
  }
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
