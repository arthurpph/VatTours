import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const isLocalhost =
   process.env.DATABASE_URL?.includes('localhost') ||
   process.env.DATABASE_URL?.includes('127.0.0.1');

const client = postgres(process.env.DATABASE_URL || '', {
   ssl: isLocalhost ? undefined : 'require',
});

export const db = drizzle(client, { schema });
