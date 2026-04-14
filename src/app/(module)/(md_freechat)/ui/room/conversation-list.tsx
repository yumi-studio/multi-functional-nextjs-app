"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/app/lib/utils";
// import ConversationListItems from "./conversation-list-items";
import { useConversationStore } from "../../stores/conversation-store";
import debounce from "lodash/fp/debounce";
import AddConversationButton from "./add-conversation-button";
import { FREECHAT_ROOM_URL } from "../../lib/url";
import Loading from "../../[locale]/freechat/loading";
import { getJoinedConversations } from "../../actions/conversations";

const ConversationList = ({ activeId }: { activeId: string }) => {
  const conversations = useConversationStore(state => state.conversations);
  const setConversations = useConversationStore(state => state.setConversations);
  const [loaded, setLoaded] = useState(conversations.length === 0 ? false : true);  // Use stored conversations as warmup data

  const init = debounce(100)(async () => {
    console.info('[DEBUG] Start initialize ConversationList');
    const innitialConversations = await getJoinedConversations();
    setLoaded(true);
    setConversations(innitialConversations);
    console.info('[DEBUG] End initialize ConversationList');
  });

  useEffect(() => {
    init();
  }, []);

  return !loaded ? <Loading /> : (
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
