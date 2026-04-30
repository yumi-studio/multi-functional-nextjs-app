import { Grid } from "@mui/material";
import ProtectedRoute from "@/modules/freechat/view/ui/ProtectedRoute";
import { WebsocketProvider } from "@/modules/freechat/view/context/websocket.context";
import ConversationList from "@/modules/freechat/view/ui/room/ConversationList";
import MemberList from "@/modules/freechat/view/ui/room/MemberList";
import Conversation from "@/modules/freechat/view/ui/room/Conversation";

const RoomPage = async ({ params }: PageProps<'/[locale]/freechat/room/[id]'>) => {
  return (
    <ProtectedRoute>
      <WebsocketProvider>
        <Grid container columns={12} sx={{ height: '100%' }}>
          <Grid size={'grow'} height={'100%'}>
            <aside className="relative z-0 h-full overflow-auto">
              <h4 className="mb-2 p-2 text-center uppercase sticky top-0 left-0 bg-(--fc-background) border-b border-b-(--fc-border)">Chat List</h4>
              <div className="px-2 pb-2"><ConversationList /></div>
            </aside>
          </Grid>
          <Grid size={8} height={'100%'}>
            <Conversation />
          </Grid>
          <Grid size={'grow'} height={'100%'}>
            <aside className="relative z-0 h-full overflow-auto">
              <h4 className="mb-2 p-2 text-center uppercase sticky top-0 left-0 bg-(--fc-background) border-b border-b-(--fc-border)">Members List</h4>
              <div className="px-2 pb-2"><MemberList /></div>
            </aside>
          </Grid>
        </Grid>
      </WebsocketProvider>
    </ProtectedRoute>
  )
}

export default RoomPage;
