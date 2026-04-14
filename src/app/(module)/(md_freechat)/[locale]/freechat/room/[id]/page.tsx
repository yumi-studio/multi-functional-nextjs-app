import { Suspense } from "react";
import { Grid } from "@mui/material";
import ProtectedRoute from "../../../../ui/protected-route";
import ConversationList from "../../../../ui/room/conversation-list";
import Loading from "../../loading";
import Conversation from "@/app/(module)/(md_freechat)/ui/room/conversation";
import MemberList from "@/app/(module)/(md_freechat)/ui/room/member-list";

const RoomPage = async ({ params, searchParams }: PageProps<'/[locale]/freechat/room/[id]'>) => {
  const { locale, id } = await params;
  return (
    <ProtectedRoute>
      <Grid container columns={12} sx={{ height: '100%' }}>
        <Grid size={'grow'} height={'100%'}>
          <aside className="relative z-0 h-full overflow-auto">
            <h4 className="mb-2 p-2 text-center uppercase sticky top-0 left-0 bg-(--fc-background) border-b border-b-(--fc-border)">Chat List</h4>
            <div className="px-2 pb-2"><ConversationList activeId={id} /></div>
          </aside>
        </Grid>
        <Grid size={8} height={'100%'}>
          <Conversation id={id} />
        </Grid>
        <Grid size={'grow'} height={'100%'}>
          <aside className="relative z-0 h-full overflow-auto">
            <h4 className="mb-2 p-2 text-center uppercase sticky top-0 left-0 bg-(--fc-background) border-b border-b-(--fc-border)">Members List</h4>
            <div className="px-2 pb-2"><MemberList activeId={id} /></div>
          </aside>
        </Grid>
      </Grid>
    </ProtectedRoute>
  )
}

export default RoomPage;
