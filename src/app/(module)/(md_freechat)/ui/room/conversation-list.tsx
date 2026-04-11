import { getJoinedConversations } from "../../actions";
import ConversationListItems from "./conversation-list-items";

const ConversationList = async ({ activeId }: { activeId: string }) => {
  const conversations = await getJoinedConversations();
  return (
    <ConversationListItems conversations={conversations} activeId={activeId} />
  )
}

export default ConversationList;
