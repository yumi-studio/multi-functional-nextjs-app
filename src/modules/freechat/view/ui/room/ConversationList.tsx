"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { cn } from "@/app/lib/utils";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import { getJoinedConversations } from "@/modules/freechat/view/actions/conversations";
import AddConversationButton from "@/modules/freechat/view/ui/room/AddConversationButton";
import { FREECHAT_ROOM_URL } from "@/modules/freechat/shared/constants/page-endpoints";

const ConversationList = () => {
  const { id: activeId }: { id: string } = useParams();
  const conversations = useConversationStore(state => state.conversations);
  const setConversations = useConversationStore(state => state.setConversations);
  const setMessages = useConversationStore(state => state.setMessages);
  const setMembers = useConversationStore(state => state.setMembers);

  const fetchConversations = async () => {
    const innitialConversations = await getJoinedConversations();
    setConversations(innitialConversations);
  };

  useEffect(() => {
    fetchConversations();

    return () => {
      setMessages([]);
      setMembers([]);
    }
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {conversations && conversations.sort((a, b) => a.name.localeCompare(b.name)).map(conv => (
        <Link key={conv.id} href={FREECHAT_ROOM_URL.replace('{{id}}', conv.id)}
          className={cn([
            "flex items-center p-2 border border-(--fc-border)",
            conv.id === activeId && "bg-(--fc-border) text-white pointer-events-none"
          ])}
        >{conv.name}</Link>
      ))}
      <AddConversationButton />
    </div>
  )
}

export default ConversationList;
