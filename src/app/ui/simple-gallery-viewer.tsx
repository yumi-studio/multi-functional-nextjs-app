"use client";

import { faArrowLeft, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SimpleDialog } from "./dialogs";
import { useTheme } from "@mui/material";
import ReactPlayer from "react-player";

export type GalleryItem = {
  name: string;
  src: string;
  type: "image" | "video";
}

export default function SimpleGalleryViewer({
  items,
  isOpen,
  initialIndex,
  setIsOpen
}: {
  items: GalleryItem[];
  isOpen: boolean;
  initialIndex?: number;
  setIsOpen: (value: boolean) => void;
}) {
  const [viewerState, setViewerState] = useState({
    isReady: false,
    currentIndex: initialIndex ?? 0,
    viewerWidth: 0,
    viewerHeight: 0,
  });
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const thumbnailsWrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const swipeStartX = useRef(0);
  const viewerToPrev = () => {
    setViewerState(prev => ({ ...prev, currentIndex: prev.currentIndex === 0 ? (items.length - 1) : Math.max(prev.currentIndex - 1, 0) }));
  }
  const viewerToNext = () => {
    setViewerState(prev => ({ ...prev, currentIndex: prev.currentIndex === (items.length - 1) ? 0 : Math.min(prev.currentIndex + 1, items.length - 1) }));
  }
  const viewerJumpTo = (index: number) => {
    setViewerState(prev => ({ ...prev, currentIndex: index }));
  }
  const onPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    swipeStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.MouseEvent<HTMLDivElement>) => {
    const deltaX = e.clientX - swipeStartX.current;
    const threshold = 50;

    if (deltaX > threshold) viewerToPrev();
    if (deltaX < -threshold) viewerToNext();
  };
  const scrollToSlide = (index: number, immediately = false) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: immediately ? "instant" : "smooth",
      inline: "center",
      block: "center",
    })
    thumbnailRefs.current[index]?.scrollIntoView({
      behavior: immediately ? "instant" : "smooth",
      inline: "center",
      block: "center",
    });
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const update = () => setViewerState(prev => {
        const viewerWidth = window.innerWidth;
        const viewerHeight = window.innerHeight;
        return {
          ...prev,
          viewerWidth: viewerWidth,
          viewerHeight: viewerHeight,
        }
      });
      update();
      window.addEventListener("resize", update);

      const checkItemsReady = setInterval(() => {
        if (itemRefs.current.length === items.length && thumbnailRefs.current.length === items.length) {
          clearInterval(checkItemsReady);
          scrollToSlide(viewerState.currentIndex, true);
          setViewerState(prev => ({ ...prev, isReady: true }));
        }
      }, 100);

      return () => {
        window.removeEventListener("resize", update);
        clearInterval(checkItemsReady);
      }
    }
  }, []);

  useEffect(() => {
    scrollToSlide(viewerState.currentIndex);
  }, [viewerState.currentIndex]);

  return (
    <SimpleDialog open={isOpen} onClose={() => setIsOpen(false)}>
      <div className={"bg-black fixed z-50 left-1/2 top-1/2 -translate-1/2 flex flex-col"} style={{
        width: `${viewerState.viewerWidth}px`,
        height: `${viewerState.viewerHeight}px`
      }}>
        <div className="shrink-0 flex items-center p-3 w-full z-999 bg-[rgba(0,0,0,0.5)]" ref={headerWrapperRef}>
          <button onClick={() => setIsOpen(false)} type="button"><FontAwesomeIcon icon={faArrowLeft} width={"1rem"} height={"1rem"} color="white" /></button>
          <div className="ml-auto inline-flex gap-2">
            {items.length > 1 && (
              <>
                <button type="button" className="px-3 py-1 border border-white rounded-sm text-white"
                  onClick={viewerToPrev}>Prev</button>
                <button type="button" className="px-3 py-1 border border-white rounded-sm text-white"
                  onClick={viewerToNext}>Next</button>
              </>
            )}
          </div>
        </div>
        {/* Viewer inner */}
        <div className="w-full flex-auto overflow-hidden relative" style={{
          opacity: viewerState.isReady ? 100 : 0,
        }}>
          {/* Viewer inner track */}
          <div className="w-full h-full overflow-hidden whitespace-nowrap no-scrollbar" style={{
            fontSize: 0
          }}>
            {/* Viewer item */}
            {items.map((item, index) => (
              <div className="inline-block overflow-hidden relative touch-pan-y" key={index} style={{
                width: `${viewerState.viewerWidth}px`,
                height: `100%`
              }}
                ref={el => { itemRefs.current[index] = el; }}
                onPointerDown={onPointerDown}
                onPointerUp={onPointerUp}>
                {item.type === "image" && (
                  <Image src={item.src} alt={item.name} width={viewerState.viewerWidth} height={viewerState.viewerHeight}
                    className="object-contain w-full h-full"
                  />
                )}
                {item.type === "video" && (
                  // <video className="object-contain h-full w-full" src={item.src} width={viewerState.viewerWidth} height={viewerState.viewerHeight} controls />
                  <ReactPlayer src={item.src} className="" style={{
                    width: '100%',
                    height: '100%',
                  }} controls />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Viewer thumbnail track */}
        <div className="shrink-0 w-full p-3 overflow-auto">
          <div className="flex h-16 gap-2 w-fit min-w-full items-center justify-center"
            ref={thumbnailsWrapperRef}>
            {items.map((item, index) => (
              <div
                className={
                  `shrink-0 h-16 w-16 bg-black overflow-hidden rounded-md `
                  + (index === viewerState.currentIndex && " outline-2 outline-blue-300 ")
                }
                key={index}
                onClick={() => {
                  viewerJumpTo(index);
                }}
                ref={(el) => { thumbnailRefs.current[index] = el; }}>
                {item.type === "image" && (
                  <Image src={item.src} alt={item.name} width={64} height={64}
                    className="object-cover w-full h-full"
                  />
                )}
                {item.type === "video" && (
                  <div className="h-full aspect-square">
                    <FontAwesomeIcon icon={faVideo} widthAuto className="object-contain" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </SimpleDialog >
  )
}
