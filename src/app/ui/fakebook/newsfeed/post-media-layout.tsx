import { HTMLAttributes } from "react";
import { PostMedia } from "@/app/lib/fakebook/definitions"
import { faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@mui/material";
import Image from "next/image";

type LayoutProps = {
  items: PostMedia[];
  setGallery: (newState: { isOpen: boolean; initialIndex: number }) => void
}

type LayoutItemVideoProps = HTMLAttributes<HTMLElement> & { media: PostMedia };

const LayoutItemVideo = ({ media, ...props }: LayoutItemVideoProps) => {
  return (
    <div {...props}>
      <FontAwesomeIcon icon={faPlay} size="5x" className="text-gray-400" />
    </div>
  )
}

const OneItemLayout = ({ items, setGallery }: LayoutProps) => {
  const media = items[0];
  return (
    <div className="flex items-stretch justify-center">
      <div key={media.id} className={`type-${media.type} relative flex-auto`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 0 })}>
        {media.type === 'image' && (
          <Image src={media.source} alt={media.name} height={640} width={640}
            className="rounded-md object-contain h-full w-full max-h-80" />
        )}
        {media.type === 'video' && (
          <LayoutItemVideo
            media={media}
            className="rounded-xl object-contain w-full aspect-video flex items-center justify-center border-2 border-gray-400" />
        )}
      </div>
    </div>
  )
}

const TwoItemsLayout = ({ items, setGallery }: LayoutProps) => {
  const first = items[0];
  const second = items[1];
  return (
    <div className="flex items-stretch justify-center gap-2 max-h-80" >
      <div key={first.id} className={`type-${first.type} relative flex-auto`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 0 })}>
        {first.type === 'image' && (
          <Image src={first.source} alt={first.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={second.id} className={`type-${second.type} relative flex-auto`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 1 })}>
        {second.type === 'image' && (
          <Image src={second.source} alt={second.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
    </div>
  )
}

const ThreeItemsLayout = ({ items, setGallery }: LayoutProps) => {
  const first = items[0];
  const second = items[1];
  const third = items[2];
  return (
    <div className="flex items-stretch justify-center gap-2 flex-wrap" >
      <div key={first.id} className={`type-${first.type} relative flex-auto aspect-square max-h-80`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 0 })}
      >
        {first.type === 'image' && (
          <Image src={first.source} alt={first.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={second.id} className={`type-${second.type} relative flex-auto aspect-square max-h-80`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 1 })}>
        {second.type === 'image' && (
          <Image src={second.source} alt={second.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={third.id} className={`type-${third.type} relative flex-auto w-full max-h-80`}
        onClick={() => setGallery({ isOpen: true, initialIndex: 2 })}>
        {third.type === 'image' && (
          <Image src={third.source} alt={third.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
    </div>
  )
}

const OverThreeItemsLayout = ({ items, setGallery }: LayoutProps) => {
  const visibleItemsFirst = items.slice(0, 2);
  const visibleItemsSecond = items.slice(2, 4);
  return (
    <div className="flex flex-col gap-2" >
      <div className="flex items-stretch justify-center gap-2 max-h-80">
        {visibleItemsFirst.map((media, index) => (
          <div key={media.id} className={`type-${media.type} relative flex-auto aspect-square`}
            onClick={() => setGallery({ isOpen: true, initialIndex: index })}>
            {media.type === 'image' && (
              <Image src={media.source} alt={media.name} height={640} width={640}
                className="rounded-md object-cover h-full w-full object-top-left" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-stretch justify-center gap-2 max-h-80">
        {visibleItemsSecond.map((media, index) => (
          <div key={media.id} className={`type-${media.type} relative flex-auto aspect-square`}
            onClick={() => setGallery({ isOpen: true, initialIndex: index + 2 })}>
            {media.type === 'image' && (
              <Image src={media.source} alt={media.name} height={640} width={640}
                className="rounded-md object-cover h-full w-full object-top-left" />
            )}
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <div className="text-center">
          <Button type="button" variant="outlined" onClick={() => setGallery({ isOpen: true, initialIndex: 0 })}>More (+{items.length - 4})</Button>
        </div>
      )}
    </div>
  )
}


export default function PostMediaLayout({ items, setGallery }: LayoutProps) {
  if (items.length === 0) return;
  if (items.length === 1) return <OneItemLayout items={items} setGallery={setGallery} />;
  if (items.length === 2) return <TwoItemsLayout items={items} setGallery={setGallery} />;
  if (items.length === 3) return <ThreeItemsLayout items={items} setGallery={setGallery} />;
  if (items.length >= 4) return <OverThreeItemsLayout items={items} setGallery={setGallery} />;
}
