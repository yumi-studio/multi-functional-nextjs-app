import {
  SelectConversation,
  SelectMessage,
  SelectParticipant,
  SelectUser,
} from "@/modules/freechat/db/schema";

// User related types
export type User = Omit<SelectUser, 'passwordHash'>;
export type JwtPayload = {
  userId: string,
  expiresAt: Date,
}

// Chat related types
export type Conversation = SelectConversation;
export type Participant = Omit<SelectParticipant, ''> & {
  user?: User | null;
}
export type UserPresence = {
  userId: string;
  isOnline: boolean;
  lastOnline: Date | null;
}
export type UserPresenceMap = Record<string, UserPresence>;
export type TypingParticipant = { id: string; name: string; }
export type Message = SelectMessage;



// Socket Payload types
export type WSMessageCreatePayload = Message;
export type WSChatTypingPayload = { conversationId: string; participants: TypingParticipant[]; };