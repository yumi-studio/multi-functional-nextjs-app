import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config({ path: '.env.development' });

export default defineConfig({
  schema: './src/modules/freechat/db/schema.ts',
  out: './src/modules/freechat/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.FREECHAT_DATABASE_URL!,
  },
});
