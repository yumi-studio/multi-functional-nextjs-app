"use client";

import { debounce } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { getConversationMembers, getConversationPresences } from "@/modules/freechat/view/actions/conversations";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import { getParticipantName } from "@/modules/freechat/shared/utils";
import { useAuth } from "@/modules/freechat/view/context/auth.context";
import { useParams } from "next/navigation";
import { cn } from "@/app/lib/utils";

const MemberList = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const members = useConversationStore(state => state.members);
  const presences = useConversationStore(state => state.presences);
  const setMembers = useConversationStore(state => state.setMembers);
  const setPresences = useConversationStore(state => state.setPresences);

  const sortedMembers = useMemo(() => {
    return members.sort((a, b) => {
      const aName = getParticipantName(a);
      const bName = getParticipantName(b);
      return aName.localeCompare(bName);
    })
  }, [members]);

  const fetchMembers = useCallback(async (id: string) => {
    const members = await getConversationMembers(id);
    setMembers(members);
  }, [setMembers]);

  const fetchPresences = useCallback(async (id: string) => {
    const presences = await getConversationPresences(id);
    setPresences(presences);
  }, [setPresences]);

  useEffect(() => {
    fetchMembers(id);
    fetchPresences(id);

    const interval = setInterval(() => {
      fetchPresences(id);
    }, 10000);

    return () => clearInterval(interval);
  }, [id, fetchMembers, fetchPresences]);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const presences = await getConversationPresences(id);
  //     setMembers(members.map(m => {
  //       const presence = presences[m.userId];
  //       return {
  //         ...m,
  //         isOnline: presence ? presence.status : false
  //       }
  //     }));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [id, setMembers]);

  return (
    <div className="flex flex-col gap-2 overflow-auto">
      {sortedMembers.map(sm => (
        <div key={sm.id} className={cn([
          "flex items-center p-2 border",
          (presences[sm.userId]?.isOnline ?? false) ? "border-2 border-green-600" : "border-(--fc-border)"
        ])}>
          <div className="w-full flex items-center justify-between">
            <div className="flex-auto overflow-hidden line-clamp-1">
              <span>{getParticipantName(sm)}</span>
            </div>
            {user && user.id === sm.userId && (<div className="flex-1 shrink-0 grow-0 inline-flex items-center justify-center ml-1 px-2 py-0.5 bg-green-600 text-xs rounded-full">You</div>)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MemberList;
