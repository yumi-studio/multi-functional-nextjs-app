"use client";

import { createContext, use, useContext, useEffect } from "react";
import { useAuth } from "@/modules/freechat/view/context/auth.context";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import { useSocketStore } from "@/modules/freechat/view/stores/socket.store";
import { CHAT_EVENTS } from "@/modules/freechat/shared/constants/socket";
import { WSChatTypingPayload, WSMessageCreatePayload } from "@/modules/freechat/shared/types";
import { useRoomParams } from "@/modules/freechat/view/hooks/usePagesParams";

type WebsocketContextType = {};
const WebsocketContext = createContext<WebsocketContextType | null>(null);

const debug = (message: string, ...args: any[]) => {
  console.log("[DEBUG-WS]", message, args);
}

// const createSocketInstance = (authOptions = {}) => {
//   const socket = io(SOCKET_URL, {
//     auth: authOptions,
//     retries: 5,
//     autoConnect: false,
//   });

//   socket.on("connect", () => {
//     debug(`[connect] Client ID = ${socket.id}`);
//   });

//   socket.on("message", (msg) => {
//     debug(`[message]`, msg);
//   });

//   socket.on("disconnect", () => {
//     debug(`[disconnect] Client ID = ${socket.id}`);
//   });

//   return socket;
// }

export const WebsocketProvider = ({ children }: { children: React.ReactNode; }) => {
  const { user } = useAuth();
  const { id } = useRoomParams();
  const addMessages = useConversationStore(s => s.addMessages);
  const conversations = useConversationStore(s => s.conversations);
  const setTypingParticipants = useConversationStore(s => s.setTypingParticipants);
  const socket = useSocketStore(s => s.socket);
  const connect = useSocketStore(s => s.connect);
  const disconnect = useSocketStore(s => s.disconnect);

  useEffect(function socketConnect() {
    if (user) {
      connect({ id: user.id, token: 'fake-token' });
    }
    return () => {
      disconnect();
    }
  }, [user]);

  useEffect(function socketConnect() {
    if (!socket) return;

    socket.onAny((event, ...args) => {
      debug(`[server-emit] ${event}`, args);
    });
    socket.onAnyOutgoing((event, ...args) => {
      debug(`[client-emit] ${event}`, args);
    });
    socket.on("connect", () => {
      debug(`[connect] Client ID = ${socket.id}`);
      socket.emit('chat:active', { id });
    });
    socket.on("disconnect", () => {
      debug(`[disconnect] Client ID = ${socket.id}`);
    });
    socket.on(CHAT_EVENTS.MESSAGE_CREATE, async (payload: WSMessageCreatePayload) => {
      addMessages([payload], 'latest');
    });
    socket.on(CHAT_EVENTS.CHAT_TYPING, async (payload: WSChatTypingPayload) => {
      if (payload.conversationId !== id) return;
      setTypingParticipants(payload.participants);
    });
    socket.connect();

    return () => {
      socket.offAny();
      socket.offAnyOutgoing();
      socket.off(CHAT_EVENTS.MESSAGE_CREATE);
      socket.off(CHAT_EVENTS.CHAT_TYPING);
      socket.off("connect");
      socket.off("disconnect");
    };

  }, [socket]);

  return (
    <WebsocketContext.Provider value={{}}>
      {children}
    </WebsocketContext.Provider>
  );
}

export const useWebsocket = () => {
  const context = useContext(WebsocketContext);
  if (!context) throw new Error("useWebsocket must be used within WebsocketProvider");
  return context;
}
