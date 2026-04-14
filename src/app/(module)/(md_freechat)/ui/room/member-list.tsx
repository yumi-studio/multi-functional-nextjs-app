"use client";

import { debounce } from "lodash/fp";
import { map } from "lodash";
import { useEffect, useMemo, useState } from "react";
import Loading from "../../[locale]/freechat/loading";
import { getConversationMember } from "../../actions/conversations";
import { useConversationStore } from "../../stores/conversation-store";
import { getParticipantName } from "../../lib/utils";
import { useUserStore } from "../../stores/user-store";
import { useAuth } from "../../context/auth.context";

const MemberList = ({ activeId }: { activeId: string }) => {
  const [loaded, setLoaded] = useState(false);
  const { user } = useAuth();
  const members = useConversationStore(state => state.members);
  const setMembers = useConversationStore(state => state.setMembers);

  const sortedMembers = useMemo(() => {
    return members.sort((a, b) => {
      const aName = getParticipantName(a);
      const bName = getParticipantName(b);
      return aName.localeCompare(bName);
    })
  }, [members]);

  const init = debounce(100)(async () => {
    console.info('[DEBUG] Start initialize MemberList');
    const initMembers = await getConversationMember(activeId);
    setMembers(initMembers);
    setLoaded(true);
    console.info('[DEBUG] End initialize MemberList');
  });

  useEffect(() => {
    init();
  }, [])

  return !loaded ? <Loading /> : (
    <div className="flex flex-col gap-2 overflow-auto">
      {sortedMembers.map(sm => (
        <div key={sm.id} className="flex items-center p-2 border border-(--fc-border)">
          <div className="w-full flex items-center justify-between">
            <div className="flex-auto overflow-hidden line-clamp-1">{getParticipantName(sm)}</div>
            {user && user.id === sm.userId && (<div className="flex-1 shrink-0 grow-0 inline-flex items-center justify-center ml-1 px-2 py-0.5 bg-green-600 text-xs rounded-full">You</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
