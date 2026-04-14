"use client";

import { cn, formatDateTime } from "@/app/lib/utils";
import Image from "next/image";
import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Message } from "../lib/types";
import { VirtualItem } from "@tanstack/react-virtual";
import { useAuth } from "../context/auth.context";
import { useConversationStore } from "../stores/conversation-store";
import { getParticipantName } from "../lib/utils";

type MesageItemProps = {
  data: Message,
  virtualRow: VirtualItem;
  measure: (el: HTMLElement | null) => void;
}

const MessageItem = memo(({ data, virtualRow, measure }: MesageItemProps) => {
  const { user } = useAuth();
  const members = useConversationStore(state => state.members);
  const isOwner = data.userId === user?.id;
  const member = members.find(m => m.userId === data.userId);
  const isAdmin = (member?.role ?? 'member') === 'admin';

  return (
    // <div
    //   style={{
    //     position: "absolute",
    //     top: 0,
    //     left: 0,
    //     width: "100%",
    //     transform: `translateY(${virtualRow.start}px)`,
    //   }}
    //   data-index={virtualRow.index}
    //   data-id={data.id}
    //   ref={measure}
    // >
    <>
      {/* Real Messaga Item */}
      <div
        className={cn([
          "flex items-start justify-start gap-3 w-full px-2 py-1 mt-2",
          isOwner && "flex-row-reverse"
        ])}
      >
        {/* Avatar */}
        <div className="flex-auto grow-0 shrink-0 w-12 h-12 rounded-full overflow-hidden">
          <Image src={isOwner ? "/sample/avatar/1.png" : "/sample/avatar/2.png"} alt="Avatar" width={120} height={120} objectFit="cover" />
        </div>

        {/* Name + Message content */}
        <div className={`flex-auto overflow-hidden`}>
          <div className={cn([
            "text-sm mb-1 flex items-center justify-start gap-2",
            isOwner && "flex-row-reverse"
          ])}>
            <span className="text-(--fc-text-secondary)">{getParticipantName(member)}</span>
            <span className={cn([
              "text-xs inline-block px-2 py-0.5 rounded-full bg-(--fc-message-user-bg) text-(--fc-message-user-text)",
              isAdmin ? "bg-(--fc-message-user-bg)" : "bg-(--fc-message-user-bg)/50"
            ])}>
              {isAdmin ? "Admin" : "Member"}
            </span>
            <span className="text-xs">{formatDateTime(data.createdAt)}</span>
            {/* <span>{`${data.id} | ${virtualRow.index} | ${virtualRow.start}->${virtualRow.end} |`}</span> */}
          </div>
          <div className={cn([
            "flex w-full",
            isOwner && "flex-row-reverse"
          ])}>
            <div className="p-2 bg-(--fc-message-bot-bg) text-(--fc-text-primary) rounded-md max-w-3xl">{data.content}</div>
          </div>
        </div>
      </div>
    </>
  )
});
MessageItem.displayName = 'Freechat_MessageItem';

export default MessageItem;
