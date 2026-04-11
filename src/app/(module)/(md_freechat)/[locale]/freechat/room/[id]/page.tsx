import { Suspense } from "react";
import { Grid } from "@mui/material";
import ProtectedRoute from "../../../../ui/protected-route";
import ConversationList from "../../../../ui/room/conversation-list";
import Loading from "../../loading";
import Conversation from "@/app/(module)/(md_freechat)/ui/room/conversation";

const RoomPage = async ({ params, searchParams }: PageProps<'/[locale]/freechat/room/[id]'>) => {
  const { locale, id } = await params;
  return (
    <ProtectedRoute>
      <Grid container spacing={2} columns={12} sx={{ height: '100%' }}>
        <Grid size={2}>
          <aside className="p-2">
            <h4 className="mb-2">Chat List</h4>
            <Suspense fallback={<Loading />}>
              <ConversationList activeId={id} />
            </Suspense>
          </aside>
        </Grid>
        <Grid size={8}>
          <Conversation id={id} />
        </Grid>
        <Grid size={2}>
          <aside className="p-2">
            <h4 className="mb-2">Members List</h4>
          </aside>
        </Grid>
      </Grid>
    </ProtectedRoute>
  )
}

export default RoomPage;
