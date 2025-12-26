import { PostMedia } from "@/app/lib/fakebook/definitions"
import { Button } from "@mui/material";
import Image from "next/image";

const OneItemLayout = ({ items, setShowGallery }: {
  items: PostMedia[];
  setShowGallery: (newState: boolean) => void
}) => {
  const media = items[0];
  return (
    <div className="flex items-stretch justify-center max-h-80" onClick={() => setShowGallery(true)}>
      <div key={media.id} className={`type-${media.type} relative`}>
        {media.type === 'image' && (
          <Image src={media.source} alt={media.name} height={640} width={640}
            className="rounded-md object-contain h-full w-full" />
        )}
      </div>
    </div>
  )
}

const TwoItemsLayout = ({ items, setShowGallery }: {
  items: PostMedia[];
  setShowGallery: (newState: boolean) => void
}) => {
  const first = items[0];
  const second = items[1];
  return (
    <div className="flex items-stretch justify-center gap-2 max-h-80" onClick={() => setShowGallery(true)}>
      <div key={first.id} className={`type-${first.type} relative flex-auto`}>
        {first.type === 'image' && (
          <Image src={first.source} alt={first.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={second.id} className={`type-${second.type} relative flex-auto`}>
        {second.type === 'image' && (
          <Image src={second.source} alt={second.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
    </div>
  )
}

const ThreeItemsLayout = ({ items, setShowGallery }: {
  items: PostMedia[];
  setShowGallery: (newState: boolean) => void
}) => {
  const first = items[0];
  const second = items[1];
  const third = items[2];
  return (
    <div className="flex items-stretch justify-center gap-2 flex-wrap" onClick={() => setShowGallery(true)}>
      <div key={first.id} className={`type-${first.type} relative flex-auto aspect-square max-h-80`}>
        {first.type === 'image' && (
          <Image src={first.source} alt={first.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={second.id} className={`type-${second.type} relative flex-auto aspect-square max-h-80`}>
        {second.type === 'image' && (
          <Image src={second.source} alt={second.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
      <div key={third.id} className={`type-${third.type} relative flex-auto w-full max-h-80`}>
        {third.type === 'image' && (
          <Image src={third.source} alt={third.name} height={640} width={640}
            className="rounded-md object-cover w-full h-full object-top-left" />
        )}
      </div>
    </div>
  )
}

const OverThreeItemsLayout = ({ items, setShowGallery }: {
  items: PostMedia[];
  setShowGallery: (newState: boolean) => void
}) => {
  const visibleItemsFirst = items.slice(0, 2);
  const visibleItemsSecond = items.slice(2, 4);
  return (
    <div className="flex flex-col gap-2" onClick={() => setShowGallery(true)}>
      <div className="flex items-stretch justify-center gap-2 max-h-80">
        {visibleItemsFirst.map(media => (
          <div key={media.id} className={`type-${media.type} relative flex-auto aspect-square`}>
            {media.type === 'image' && (
              <Image src={media.source} alt={media.name} height={640} width={640}
                className="rounded-md object-cover h-full w-full object-top-left" />
            )}
          </div>
        ))}
      </div>
      <div className="flex items-stretch justify-center gap-2 max-h-80">
        {visibleItemsSecond.map(media => (
          <div key={media.id} className={`type-${media.type} relative flex-auto aspect-square`}>
            {media.type === 'image' && (
              <Image src={media.source} alt={media.name} height={640} width={640}
                className="rounded-md object-cover h-full w-full object-top-left" />
            )}
          </div>
        ))}
      </div>
      {items.length > 4 && (
        <div className="text-center">
          <Button type="button" variant="outlined">More (+{items.length - 4})</Button>
        </div>
      )}
    </div>
  )
}


export default function PostMediaLayout({ items, setShowGallery }: {
  items: PostMedia[];
  setShowGallery: (newState: boolean) => void
}) {
  if (items.length === 0) return;
  if (items.length === 1) return <OneItemLayout items={items} setShowGallery={setShowGallery} />;
  if (items.length === 2) return <TwoItemsLayout items={items} setShowGallery={setShowGallery} />;
  if (items.length === 3) return <ThreeItemsLayout items={items} setShowGallery={setShowGallery} />;
  if (items.length >= 4) return <OverThreeItemsLayout items={items} setShowGallery={setShowGallery} />;
}