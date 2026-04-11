import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
config({ path: '.env' });

export default defineConfig({
  schema: './src/modules/freechat/db/schema.ts',
  out: './src/modules/freechat/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.FREECHAT_DATABASE_URL!,
  },
});
