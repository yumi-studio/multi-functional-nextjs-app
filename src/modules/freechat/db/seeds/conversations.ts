import { conversationsTable, participantsTable, usersTable } from '../schema';
import { db } from '..';
import { sql } from "drizzle-orm";

export default async function seedConversations() {
  // Create default channel
  await db.insert(conversationsTable).values({
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Default'
  }).execute();

  // Invite users to default channel
  await db.execute(
    sql`insert into ${participantsTable} (conversation_id, user_id) 
    select '00000000-0000-0000-0000-000000000000' as conversation_id, id as user_id
    from ${usersTable}`)
}