'use client';

import { io, Socket } from "socket.io-client";
import { SOCKET_URL } from "@/modules/freechat/shared/constants/socket";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
    });
  }
  return socket;
};