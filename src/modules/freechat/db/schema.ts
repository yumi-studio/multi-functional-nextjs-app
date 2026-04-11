import { pgTable, text, timestamp, unique, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable('fc_users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
})

export const conversationsTable = pgTable('fc_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('display_name', { length: 100 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
})

export const participantsTable = pgTable('fc_participants', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull(),
  userId: uuid('user_id').notNull(),
  nickname: varchar('nickname', { length: 100 }),
  role: varchar('role', { length: 10 }).notNull(),  // admin, member
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  lastReadMessageId: uuid('last_read_message_id'),
}, (table) => [
  uniqueIndex("conversation_user_idx").on(table.conversationId, table.userId),
]);

export const messagesTable = pgTable('fc_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id').notNull(),
  userId: uuid('user_id').notNull(),
  content: text('content'),
  type: varchar('type', { length: 10 }).notNull(), // text, or more, dont know
  replyMessageId: uuid('reply_message_id'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp('deleted_at'),
})

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertConversation = typeof conversationsTable.$inferInsert;
export type SelectConversation = typeof conversationsTable.$inferSelect;

export type InsertParticipant = typeof participantsTable.$inferInsert;
export type SelectParticipant = typeof participantsTable.$inferSelect;

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;
