import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  if (dbUrl.startsWith('mysql://') || dbUrl.startsWith('mysqls://')) {
    try {
      const url = new URL(dbUrl);
      const host = url.hostname;
      const port = url.port ? parseInt(url.port, 10) : 3306;
      const user = decodeURIComponent(url.username);
      const password = decodeURIComponent(url.password);
      const database = decodeURIComponent(url.pathname.substring(1));
      
      const adapter = new PrismaMariaDb({
        host,
        port,
        user,
        password,
        database,
        connectionLimit: 10,
      });
      
      return new PrismaClient({ adapter });
    } catch (e) {
      console.error('Failed to parse MySQL DATABASE_URL, falling back to default Client', e);
      return new PrismaClient();
    }
  }
  
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;


