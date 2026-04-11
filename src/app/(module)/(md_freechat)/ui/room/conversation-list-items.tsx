"use client";

import Link from "next/link";
import { FREECHAT_ROOM_URL } from "../../lib/url";
import { cn } from "@/app/lib/utils";
import AddConversationButton from "./add-conversation-button";
import { Conversation } from "../../lib/types";
import { useState } from "react";

const ConversationListItems = ({ conversations = [], activeId = "" }: { conversations: Conversation[]; activeId: string }) => {
  const [items, setItems] = useState(conversations);

  return (
    <>
      <div className="flex flex-col gap-2">
        {items && items.map(conv => (
          <Link key={conv.id} href={FREECHAT_ROOM_URL.replace('{{id}}', conv.id)}
            className={cn([
              "flex items-center p-2 border border-(--fc-border)",
              conv.id === activeId && "bg-(--fc-border) text-white pointer-events-none"
            ])}
          >{conv.name}</Link>
        ))}
        <AddConversationButton setItems={setItems} />
      </div>
    </>
  )
}

export default ConversationListItems;
