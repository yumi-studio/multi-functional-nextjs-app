"use client"

import { useEffect } from "react";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import MessageList from "@/modules/freechat/view/ui/MessageList";
import MessageEditor from "@/modules/freechat/view/ui/room/MessageEditor";

const Conversation = () => {
  const reset = useConversationStore(state => state.reset);
  useEffect(() => {
    return () => {
      console.log('Conversation unmounted, reset conversation store');
      reset();
    }
  }, []);

  return (
    <div className="w-full h-full max-w-7xl mx-auto bg-inherit border-x-2 border-(--fc-border) relative flex flex-col">
      {/* Message stream */}
      <MessageList />
      <MessageEditor />
    </div>
  )
}

export default Conversation;
