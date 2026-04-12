import { config } from 'dotenv';
config({ path: '.env' });
import seedConversations from "./conversations";
import seedUsers from "./users";


async function main() {
  console.log(process.env.FREECHAT_DATABASE_URL ?? "UNKNOWN DB CONNECTION");
  await seedUsers();
  await seedConversations();
}

main();