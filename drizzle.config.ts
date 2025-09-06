import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  // driver: 'pg',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
