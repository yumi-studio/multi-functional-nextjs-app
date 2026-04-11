import { SelectConversation, SelectMessage, SelectParticipant, SelectUser } from "@/modules/freechat/db/schema";

export type User = Omit<SelectUser, 'passwordHash'>

export type Conversation = SelectConversation;

export type Participant = SelectParticipant;

export type Message = SelectMessage;
