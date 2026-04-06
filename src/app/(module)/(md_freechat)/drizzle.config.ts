import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });

export default defineConfig({
  schema: './src/app/(module)/(md_freechat)/lib/db/schema.ts',
  out: './src/app/(module)/(md_freechat)/lib/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.FREECHAT_DATABASE_URL!,
  },
});
