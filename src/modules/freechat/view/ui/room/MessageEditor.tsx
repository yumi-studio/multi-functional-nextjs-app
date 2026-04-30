'use client';

import { TextareaAutosize } from "@mui/material";
import { EditorIconButton } from "@/modules/freechat/view/ui/buttons";
import { cn } from "@/app/lib/utils";
import { faChevronRight, faFileAlt, faImage, faMicrophone, faSmile, faSpinner, faVideo } from "@fortawesome/free-solid-svg-icons";
import { use, useActionState, useEffect, useRef, useState } from "react";
import { sendMessage } from "@/modules/freechat/view/actions/conversations";
import { useSocketStore } from "@/modules/freechat/view/stores/socket.store";
import { alertInDevelop, getParticipantName } from "@/modules/freechat/shared/utils";
import { useParams } from "next/navigation";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import { CHAT_EVENTS } from "@/modules/freechat/shared/constants/socket";
import { useAuth } from "@/modules/freechat/view/context/auth.context";

const MessageEditor = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const sendMessageFormRef = useRef<HTMLFormElement>(null);
  const [state, sendMessageAction, pending] = useActionState(sendMessage, undefined);
  const socket = useSocketStore(s => s.socket);
  const [typing, setTyping] = useState(false);
  const typingParticipants = useConversationStore(s => s.typingParticipants);
  const participantMe = useConversationStore(s => s.members.find(m => m.userId === user?.id));
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || ((event.shiftKey || event.ctrlKey || event.altKey) && event.key === 'Enter')) return;
    if (!sendMessageFormRef.current) return;

    event.preventDefault();
    sendMessageFormRef.current.requestSubmit();
    setTyping(false);
  };

  useEffect(() => {
    if (pending || !socket || !state?.data) return;
    socket.emit(CHAT_EVENTS.MESSAGE_CREATE, state.data);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [state, pending, socket]);

  useEffect(function typingStateChange() {
    if (!participantMe || !socket) return;
    socket.emit(CHAT_EVENTS.CHAT_TYPING, {
      conversationId: id, participantId: participantMe.id, displayName: getParticipantName(participantMe), isTyping: typing
    });
  }, [id, socket, participantMe, typing]);

  return (
    <div className="shrink-0 grow-0 relative z-10 w-full p-3 bg-(--fc-background)">
      {/* Presence wrapper */}
      <div className="relative -z-10 w-full">
        {typingParticipants.length > 0 && (
          <div className="absolute bottom-0 left-0 inline-block w-auto p-2 pb-4 -mb-2 bg-(--fc-surface-muted) rounded-md">
            <span className="text-(--fc-text-secondary) text-sm">{typingParticipants.map(p => p.name).join(', ')} is typing...</span>
          </div>
        )}
      </div>
      <div className="w-full h-auto border-2 border-(--fc-border) p-3 rounded-md bg-inherit">
        {/* Wrapper for text and selected files */}
        <form action={sendMessageAction} id="form-send-message" ref={sendMessageFormRef}>
          <input type="hidden" name="conversationId" value={id} />
          {/* Text content */}
          <TextareaAutosize
            className={cn([
              "w-full h-10 focus:h-32 p-2 outline-0 rounded-md bg-(--fc-surface) text-(--fc-text-secondary)",
              "focus:text-(--fc-text-primary)"
            ])}
            placeholder="Type something..."
            name="content"
            disabled={pending}
            onKeyDown={handleTextareaKeyDown}
            onChange={e => { setTyping(e.target.value.length > 0); }}
            ref={textareaRef}
          />
        </form>
        <div className="h-0.5 bg-(--fc-border) my-3" />
        <div className="w-full flex items-center gap-2 bg-inherit">
          <div className="inline-flex gap-2 bg-inherit">
            <EditorIconButton title="Upload Image" icon={faImage} onClick={alertInDevelop} />
            <EditorIconButton title="Upload Video" icon={faVideo} onClick={alertInDevelop} />
            <EditorIconButton title="Upload Record" icon={faMicrophone} onClick={alertInDevelop} />
            <EditorIconButton title="Upload Document" icon={faFileAlt} onClick={alertInDevelop} />
          </div>
          <div className="ml-auto inline-flex gap-2">
            <EditorIconButton title="Send Sticker" icon={faSmile} type="primary" onClick={alertInDevelop} />
            <EditorIconButton
              title="Send Message"
              icon={pending ? faSpinner : faChevronRight}
              type="primary"
              disabled={pending}
              className={cn([pending && 'animate-spin pointer-events-none'])}
              onClick={() => { sendMessageFormRef.current?.requestSubmit() }} />
          </div>
        </div>
      </div>
    </div >
  )
}
export default MessageEditor;