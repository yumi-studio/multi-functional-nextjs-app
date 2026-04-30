"use client";

import { getSocket } from "@/modules/freechat/view/stores/socket";
import { create } from "zustand";

type SocketState = {
  socket: ReturnType<typeof getSocket> | null;
  connect: (auth: { id: string; token: string }) => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  connect: (auth: { id: string; token: string }) => {
    const socket = getSocket();
    socket.auth = auth;
    socket.connect();
    set({ socket });
  },
  disconnect: () => {
    const socket = getSocket();
    socket.disconnect();
    set({ socket: null });
  },
}));
