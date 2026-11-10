import { CSSProperties, DragEvent, ElementType, useState } from "react";
import { MEDIA_SLOTS } from "./content";
import { assignFile, FrameMessage, isEmbed, useContent, useResolvedSrc } from "./store";

const EMBED = isEmbed();

function selectInStudio(id: string, kind: "media" | "text") {
  const msg: FrameMessage = { source: "athlete-frame", type: "select", id, kind };
  window.parent?.postMessage(msg, window.location.origin);
}

const slotLabel = (id: string) => MEDIA_SLOTS.find((s) => s.id === id)?.label ?? id;

/**
 * An image or video slot. Fills its parent (absolute inset-0), so the
 * parent controls size and shape. In the studio it's clickable and accepts
 * file drops; on the live site it's a plain image/video.
 */
export function Media({
  id,
  className = "",
  style,
  imgClassName = "",
  eager = false,
}: {
  id: string;
  className?: string;
  style?: CSSProperties;
  imgClassName?: string;
  eager?: boolean;
}) {
  const slot = useContent().media[id];
  const src = useResolvedSrc(slot?.src);
  const poster = useResolvedSrc(slot?.poster);
  const [dragOver, setDragOver] = useState(false);

  if (!slot) return null;

  const objectStyle: CSSProperties = {
    objectFit: slot.fit,
    objectPosition: `${slot.pos.x}% ${slot.pos.y}%`,
  };

  const editProps = EMBED
    ? {
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          selectInStudio(id, "media");
        },
        onDragOver: (e: DragEvent) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop: (e: DragEvent) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) assignFile(id, file).then(() => selectInStudio(id, "media"));
        },
      }
    : {};

  return (
    <div
      data-edit-id={id}
      data-cursor="view"
      className={`media-slot absolute inset-0 overflow-hidden ${dragOver ? "is-drop" : ""} ${className}`}
      style={style}
      {...editProps}
    >
      {!src ? (
        <Placeholder id={id} />
      ) : slot.type === "video" ? (
        <video
          key={src}
          className={`h-full w-full ${imgClassName}`}
          style={objectStyle}
          src={src}
          poster={poster || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <img
          className={`h-full w-full select-none ${imgClassName}`}
          style={objectStyle}
          src={src}
          alt={slot.alt}
          draggable={false}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
      )}
    </div>
  );
}

function Placeholder({ id }: { id: string }) {
  const isLogo = id.startsWith("partner");
  return (
    <div className={`placeholder h-full w-full ${isLogo ? "is-logo" : ""}`}>
      <div className="placeholder-inner">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <circle cx="9" cy="10" r="1.8" />
          <path d="M21 16l-5.5-5.5L5 21" />
        </svg>
        <span>{slotLabel(id)}</span>
        {EMBED && <em>Click to replace · drop a file</em>}
      </div>
    </div>
  );
}

/** Props that make any element act as a selectable text slot in the studio. */
export function textEditProps(id: string) {
  return {
    "data-edit-text": id,
    onClick: EMBED
      ? (e: React.MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          selectInStudio(id, "text");
        }
      : undefined,
  };
}

/** Text slot. Renders the stored string; selectable in the studio. */
export function Text({
  id,
  as: Tag = "span",
  className = "",
  style,
}: {
  id: string;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
}) {
  const value = useContent().text[id] ?? "";
  return (
    <Tag
      data-edit-text={id}
      className={className}
      style={style}
      onClick={
        EMBED
          ? (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              selectInStudio(id, "text");
            }
          : undefined
      }
    >
      {value}
    </Tag>
  );
}
