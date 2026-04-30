"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'
import MessageItem from "@/modules/freechat/view/ui/MessageItem";
import { useConversationStore } from "@/modules/freechat/view/stores/conversation.store";
import { getMessages } from "@/modules/freechat/view/actions/conversations";
import { debounce } from "lodash";
import { useRoomParams } from "@/modules/freechat/view/hooks/usePagesParams";

const MessageListSkeleton = () => {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-start justify-start gap-3 w-full px-2 py-1 mt-2 animate-pulse">
          {/* Avatar skeleton */}
          <div className="flex-auto grow-0 shrink-0 w-12 h-12 rounded-full bg-gray-300"></div>

          {/* Name + Message content skeleton */}
          <div className="flex-auto overflow-hidden">
            <div className="text-sm mb-1 flex items-center justify-start gap-2">
              <span className="h-4 bg-gray-300 rounded w-20"></span>
              <span className="h-4 bg-gray-300 rounded w-12"></span>
              <span className="h-4 bg-gray-300 rounded w-16"></span>
            </div>
            <div className="p-2 bg-gray-300 rounded-md max-w-3xl h-16"></div>
          </div>
        </div>
      ))}
    </>
  )
}

const MessageList = () => {
  const { id } = useRoomParams();
  const messages = useConversationStore(state => state.messages);
  const addMessages = useConversationStore(state => state.addMessages);
  const loadingRef = useRef(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<string | null>(null);
  const itemsSizeRef = useRef({
    prev: 0,
    current: 0
  });
  const autoScroll = useRef(true);

  const reversedMessages = [...messages].reverse();
  const rowVirtualizer = useVirtualizer({
    count: reversedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // fallback item height
    overscan: 10,
    measureElement: (el) => el.getBoundingClientRect().height,
  });

  const loadMore = debounce(async () => {
    const el = parentRef.current;
    if (!el || loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    // Use older message as anchor to load more older messages
    const older = await getMessages(id as string, anchorRef.current);
    const anchorMessage = older.length > 0 ? older[older.length - 1] : null;
    console.log('[DEBUG] Load older messages', older);
    console.log('[DEBUG] Anchor message', anchorMessage);
    if (anchorMessage) {
      anchorRef.current = anchorMessage.id;
    }
    if (older.length === 0) {
      setHasMore(false);
    } else {
      itemsSizeRef.current.prev = messages.length;
      itemsSizeRef.current.current = messages.length + older.length;
      addMessages(older, 'older');
    }
    loadingRef.current = false;
  }, 200);

  const handleScroll = () => {
    const el = parentRef.current;
    if (!el) return;

    if ((el.scrollHeight - el.scrollTop) > 1000) {
      autoScroll.current = false;
    } else {
      autoScroll.current = true;
    }

    if (el.scrollTop === 0 && !loadingRef.current && hasMore) {
      loadMore();
    }
  };

  useEffect(() => {
    loadMore();
  }, []);

  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el) return;

    if (autoScroll.current) {
      rowVirtualizer.scrollToOffset(el.scrollHeight, { behavior: 'instant' });
    }
  }, [messages]);

  return (
    <>
      <div className="flex-auto w-full relative z-0 overflow-auto has-scrollbar"
        ref={parentRef}
        onScroll={handleScroll}
      >
        {/* <Button className="w-full" variant="contained"
          onClick={() => loadMore()}
        >Load More</Button> */}
        {loadingRef.current && <div className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-white/20 flex items-center justify-center">Loading...</div>}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const message = reversedMessages[virtualRow.index];

            return (
              <div
                key={message.id}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                data-index={virtualRow.index}
                data-id={message.id}
                ref={rowVirtualizer.measureElement}
              >
                <MessageItem
                  data={message}
                  virtualRow={virtualRow}
                  measure={rowVirtualizer.measureElement}
                />
              </div>
            )
          })}
        </div>

        {/* {!isOnLatest && (
          <div className="sticky w-full bottom-0 left-0 right-0 z-10 text-center">
            <Button type="button" size="medium" disableRipple color="primary" variant="contained"
              sx={{
                borderRadius: '9999px',
              }}
              onClick={() => { rowVirtualizer.scrollToIndex(messages.length - 1, { behavior: 'instant' }) }}>
              <FontAwesomeIcon icon={faAngleDoubleDown} width={'1rem'} height={'1rem'} fontSize={'1rem'} />
            </Button>
          </div>
        )} */}
      </div>
    </>
  )
}

export default MessageList;
