"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SimpleDialog } from "./dialogs";

export type GalleryItem = {
	name: string;
	src: string;
	type: "image" | "video";
}

export default function SimpleGalleryViewer({
	items,
	isOpen,
	setIsOpen
}: {
	items: GalleryItem[];
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}) {
	const [viewerState, setViewerState] = useState({
		currentIndex: 0,
		viewerWidth: 0,
		viewerHeight: 0
	});
	const viewerToPrev = () => {
		setViewerState(prev => ({ ...prev, currentIndex: Math.max(prev.currentIndex - 1, 0) }));
	}
	const viewerToNext = () => {
		setViewerState(prev => ({ ...prev, currentIndex: Math.min(prev.currentIndex + 1, items.length - 1) }));
	}

	useEffect(() => {
		if (typeof window !== "undefined") {
			const update = () => setViewerState(prev => ({ ...prev, viewerWidth: window.innerWidth, viewerHeight: window.innerHeight }));
			update();
			window.addEventListener("resize", update);

			return () => {
				window.removeEventListener("resize", update);
			}
		}
	}, []);

	return (
		<SimpleDialog open={isOpen} onClose={() => setIsOpen(false)}>
			<div className={"media-preview absolute top-0 left-0 w-full h-full bg-black"}>
				<div className="preview-header flex items-center p-3 absolute top-0 left-0 right-0 z-999 bg-[rgba(0,0,0,0.5)]">
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
			</div>
			<div className="preview-inner w-full h-full overflow-hidden">
				<div className="preview-track inline-block whitespace-nowrap h-full w-max" style={{
					transform: `translateX(-${viewerState.currentIndex * viewerState.viewerWidth}px)`,
					transition: "transform 0.3s ease-in-out",
				}}>
					{items.map((item, index) => (
						<div className="preview-item inline-block h-full w-svw overflow-hidden relative" key={index}>
							{item.type === "image" && (
								<Image src={item.src} alt={item.name} width={viewerState.viewerWidth} height={viewerState.viewerHeight}
									className="object-contain h-full w-full"
								/>
							)}
							{item.type === "video" && (
								<video className="object-contain h-full w-full" src={item.src} width={viewerState.viewerWidth} height={viewerState.viewerHeight} controls />
							)}
						</div>
					))}
				</div>
			</div>
		</SimpleDialog >
	)
}
