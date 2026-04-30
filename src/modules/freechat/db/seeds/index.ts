import { config } from 'dotenv';
config({ path: '.env.development' });

import seedConversations from "@/modules/freechat/db/seeds/conversations";
import seedUsers from "@/modules/freechat/db/seeds/users";
import { drizzle } from 'drizzle-orm/postgres-js';
import { exit } from 'process';

const safeSeed = async (name: string, fn: () => Promise<void>) => {
  try {
    console.info(`[INFO] Seeding ${name}...`);
    await fn();
    console.info(`[SUCCESS] ${name} done`);
  } catch (e) {
    if (e instanceof Error) {
      console.error(`[ERROR] ${name}:`, e.message);
    } else {
      console.error(`[ERROR] ${name}: unknown error`, e);
    }
  }
};

async function main() {
  const start = Date.now();
  console.info('[INFO] Seeding started', start);

  const db = drizzle(process.env.FREECHAT_DATABASE_URL!);

  await safeSeed("users", () => seedUsers(db));
  await safeSeed("conversations", () => seedConversations(db));

  const end = Date.now();
  console.info('[INFO] Seeding finished', end, `(${end - start} ms)`);
}

main()
  .catch((e) => {
    console.error('[FATAL]', e);
  })
  .finally(() => exit(0));
