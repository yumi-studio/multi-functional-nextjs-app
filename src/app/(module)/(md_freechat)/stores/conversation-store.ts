'use client';

import { create } from "zustand";
import { Conversation, Message, Participant } from "../lib/types";

type ConversationState = {
  conversations: Conversation[];
  members: Participant[];
  messages: Message[];
  setConversations: (conversations: Conversation[]) => void;
  setMembers: (members: Participant[]) => void;
  setMessages: (messages: Message[]) => void;
  addMessages: (messages: Message[], behavior: 'older' | 'latest') => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  members: [],
  messages: [], // This messages list is ordered by latest-to-oldest, first item is latest, last item is oldest
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
}))
