'use client';

import { create } from "zustand";
import { Conversation, Message, Participant, TypingParticipant, User, UserPresenceMap } from "@/modules/freechat/shared/types";

type ConversationState = {
  conversations: Conversation[];
  members: Participant[];
  messages: Message[];
  typingParticipants: TypingParticipant[];
  presences: UserPresenceMap;
  setConversations: (conversations: Conversation[]) => void;
  setMembers: (members: Participant[]) => void;
  setMessages: (messages: Message[]) => void;
  setTypingParticipants: (typingParticipants: TypingParticipant[]) => void;
  setPresences: (presences: UserPresenceMap) => void;
  addMessages: (messages: Message[], behavior: 'older' | 'latest') => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  members: [],
  messages: [], // This messages list is ordered by latest-to-oldest, first item is latest, last item is oldest
  typingParticipants: [],
  presences: {},
  setConversations: (conversations) => set({ conversations }),
  setMembers: (members) => set({ members }),
  setMessages: (messages) => set({ messages }),
  addMessages: (messages, behavior = 'older') => {
    if (behavior === 'older') {
      set(state => ({ ...state, messages: [...state.messages, ...messages] }))
    } else if (behavior === 'latest') {
      set(state => ({ ...state, messages: [...messages, ...state.messages] }))
    } else {
      console.error('Load behavior invalid');
    }
  },
  setTypingParticipants: (typingParticipants) => set({ typingParticipants }),
  setPresences: (presences) => set({ presences }),
  reset: () => set({ members: [], messages: [], typingParticipants: [], presences: {} }),
}))
