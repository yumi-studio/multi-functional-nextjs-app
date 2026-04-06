"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useVirtualizer } from '@tanstack/react-virtual'
import MessageItem from "./message-item";
import { Message } from "../lib/types";
import { getMessages } from "../lib/actions";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const itemsSizeRef = useRef({
    prev: 0,
    current: 0
  });
  const firstLoaded = useRef(false);

  const reversedMessages = [...messages].reverse();
  const rowVirtualizer = useVirtualizer({
    count: reversedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // fallback height
    overscan: 10
  });

  const loadMore = async () => {
    const el = parentRef.current;
    if (!el || isLoading || !hasMore) return;

    setIsLoading(true);
    const older = await getMessages();
    if (older.length === 0) {
      setHasMore(false);
    } else {
      itemsSizeRef.current.prev = messages.length;
      itemsSizeRef.current.current = messages.length + older.length;
      setMessages((prev) => [...prev, ...older]);
    }
    setIsLoading(false);
  };

  const handleScroll = () => {
    const el = parentRef.current;
    if (!el) return;

    if (el.scrollTop === 0 && !isLoading) {
      loadMore();
    }
  };

  useEffect(() => {
    const getMessagesTimer = setTimeout(async () => {
      try {
        loadMore();
      } catch {
        toast.error("Load failed");
      }
    }, 100);

    return () => {
      clearTimeout(getMessagesTimer);
    }
  }, []);

  useLayoutEffect(() => {
    const el = parentRef.current;
    if (!el || messages.length === 0) return;

    if (!firstLoaded.current) {
      firstLoaded.current = true;
      rowVirtualizer.scrollToIndex(messages.length - 1, { behavior: 'instant' });
    } else {
      rowVirtualizer.scrollToIndex((itemsSizeRef.current.current - itemsSizeRef.current.prev), { align: 'start', behavior: 'instant' });
    }
  }, [messages]);

  return (
    <>
      <div className="flex-auto w-full relative z-0 overflow-auto has-scrollbar scroll-m-4"
        ref={parentRef}
        onScroll={handleScroll}
      >
        {/* <Button className="w-full" variant="contained"
          onClick={() => loadMore()}
        >Load More</Button> */}
        {isLoading && <div className="absolute z-50 top-0 left-0 right-0 bottom-0 bg-white/20 flex items-center justify-center">Loading...</div>}
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
              <MessageItem
                key={message.id}
                data={message}
                virtualRow={virtualRow}
                measure={rowVirtualizer.measureElement}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

export default MessageList;
