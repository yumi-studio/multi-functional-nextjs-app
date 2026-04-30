import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { conversationsTable, messagesTable, participantsTable, usersTable } from '@/modules/freechat/db/schema';
import { sql } from "drizzle-orm";
import { seed } from 'drizzle-seed';

export default async function seedConversations(db: PostgresJsDatabase) {
  await db.execute(sql`TRUNCATE TABLE ${conversationsTable}`);
  await db.execute(sql`TRUNCATE TABLE ${participantsTable}`);
  await db.execute(sql`TRUNCATE TABLE ${messagesTable}`);

  // Create default channel
  await db.insert(conversationsTable).values({
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Default'
  }).execute();

  // Invite users to default channel
  await db.execute(
    sql`insert into ${participantsTable} (conversation_id, user_id, role) 
    select '00000000-0000-0000-0000-000000000000' as conversation_id, id as user_id, 'member' as role
    from ${usersTable}`);

  // Create demo messages in default channel
  const userIds = (await db.select({ id: usersTable.id }).from(usersTable).execute()).map(o => o.id);
  await seed(db, { messagesTable }, { count: 1000 }).refine((f) => ({
    messagesTable: {
      columns: {
        content: f.loremIpsum(),
        conversationId: f.default({ defaultValue: '00000000-0000-0000-0000-000000000000' }),
        userId: f.valuesFromArray({ values: userIds, isUnique: false }),
      }
    }
  }))
}
