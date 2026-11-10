import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MEDIA_SLOTS, MediaSlot, TEXT_SLOTS } from "../clad/content";
import {
  assignFile,
  exportOverrides,
  FrameMessage,
  importOverrides,
  resetAll,
  resetMedia,
  resetText,
  setMedia,
  setText,
  StudioMessage,
  useContent,
  useResolvedSrc,
} from "../clad/store";

/* ------------------------------------------------------------------ */
/* Breakpoints                                                         */
/* ------------------------------------------------------------------ */

type BpKind = "desktop" | "tablet" | "mobile";
type Frame = { id: BpKind; label: string; width: number; height: number };

const PRESETS: Record<BpKind, Frame> = {
  desktop: { id: "desktop", label: "Desktop", width: 1440, height: 900 },
  tablet: { id: "tablet", label: "Tablet", width: 810, height: 1080 },
  mobile: { id: "mobile", label: "Mobile", width: 390, height: 844 },
};
const ORDER: BpKind[] = ["desktop", "tablet", "mobile"];
const GAP = 80;
const LAYOUT_KEY = "clad-studio-layout-v1";

type Selection = { kind: "media" | "text"; id: string } | null;

function loadLayout(): { frames: Frame[]; zoom: number } {
  try {
    const raw = localStorage.getItem(LAYOUT_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { frames: [PRESETS.desktop], zoom: 0.5 };
}

const frameSrc = () => `${window.location.pathname}${window.location.search}#/?embed=1`;

/* ------------------------------------------------------------------ */
/* Studio                                                              */
/* ------------------------------------------------------------------ */

export default function Studio() {
  const initial = useMemo(loadLayout, []);
  const [frames, setFrames] = useState<Frame[]>(initial.frames);
  const [zoom, setZoom] = useState(initial.zoom);
  const [sel, setSel] = useState<Selection>(null);
  const [tab, setTab] = useState<"inspect" | "layers">("layers");
  const [resizing, setResizing] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const iframes = useRef(new Map<BpKind, HTMLIFrameElement>());

  useEffect(() => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify({ frames, zoom }));
  }, [frames, zoom]);

  /* ---------- messaging with frames ---------- */
  const broadcast = useCallback((msg: Omit<StudioMessage, "source">) => {
    iframes.current.forEach((f) =>
      f.contentWindow?.postMessage({ source: "clad-studio", ...msg }, window.location.origin),
    );
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent<FrameMessage>) => {
      if (e.origin !== window.location.origin || e.data?.source !== "clad-frame") return;
      if (e.data.type === "select") {
        setSel({ kind: e.data.kind, id: e.data.id });
        setTab("inspect");
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    broadcast({ type: "highlight", id: sel?.id ?? null } as Omit<StudioMessage, "source">);
  }, [sel, broadcast]);

  const selectAndReveal = (s: NonNullable<Selection>) => {
    setSel(s);
    setTab("inspect");
    broadcast({ type: "reveal", id: s.id } as Omit<StudioMessage, "source">);
  };

  /* ---------- breakpoints ---------- */
  const has = (k: BpKind) => frames.some((f) => f.id === k);
  const addFrame = (k: BpKind) =>
    setFrames((fs) => (fs.some((f) => f.id === k) ? fs : [...fs, PRESETS[k]].sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id))));
  const removeFrame = (k: BpKind) => setFrames((fs) => (fs.length > 1 ? fs.filter((f) => f.id !== k) : fs));
  const generateBreakpoints = () => {
    setFrames((fs) => {
      const next = [...fs];
      (["tablet", "mobile"] as BpKind[]).forEach((k) => !next.some((f) => f.id === k) && next.push(PRESETS[k]));
      return next.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));
    });
  };
  const setWidth = (k: BpKind, w: number) =>
    setFrames((fs) => fs.map((f) => (f.id === k ? { ...f, width: Math.round(Math.min(2560, Math.max(320, w))) } : f)));

  /* ---------- zoom ---------- */
  const framesRef = useRef(frames);
  framesRef.current = frames;
  const fit = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return;
    const fs = framesRef.current;
    const totalW = fs.reduce((s, f) => s + f.width, 0) + (GAP + 90) * (fs.length - 1) + 240;
    const maxH = Math.max(...fs.map((f) => f.height)) + 300;
    const z = Math.min((el.clientWidth - 24) / totalW, (el.clientHeight - 24) / maxH, 1);
    setZoom(Math.max(0.1, Math.floor(z * 100) / 100));
  }, []);
  useEffect(() => {
    const ro = new ResizeObserver(() => fit());
    if (canvasRef.current) ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, [fit]);
  // Re-fit whenever a breakpoint is added or removed.
  useEffect(() => {
    fit();
  }, [frames.length, fit]);

  // Ctrl/Cmd + wheel zoom, like a design tool.
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(0.1, +(z * (e.deltaY > 0 ? 0.92 : 1.08)).toFixed(3))));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Esc clears selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSel(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- frame resize by dragging the edge ---------- */
  const startResize = (k: BpKind, startX: number, startW: number) => {
    setResizing(true);
    const move = (e: PointerEvent) => setWidth(k, startW + (e.clientX - startX) / zoom);
    const up = () => {
      setResizing(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const src = useMemo(frameSrc, []);

  return (
    <div className="studio-root fixed inset-0 flex flex-col bg-[#111] font-body text-[13px] text-[#e8e8e8]">
      {/* ======================= TOP BAR ======================= */}
      <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/10 bg-[#161616] px-3">
        <div className="flex items-center gap-2 pr-3">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[#4b8bff] text-[13px] font-bold text-white">S</span>
          <span className="font-semibold">Studio</span>
          <span className="hidden text-white/40 sm:inline">/ Site</span>
        </div>

        <div className="mx-auto flex items-center gap-1 rounded-lg bg-white/5 p-1">
          {ORDER.map((k) => (
            <button
              key={k}
              onClick={() => (has(k) ? removeFrame(k) : addFrame(k))}
              title={has(k) ? `Hide ${PRESETS[k].label}` : `Add ${PRESETS[k].label}`}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors ${has(k) ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
            >
              <BpIcon k={k} />
              <span className="hidden md:inline">{PRESETS[k].label}</span>
            </button>
          ))}
          <button
            onClick={generateBreakpoints}
            className="ml-1 rounded-md bg-[#4b8bff] px-3 py-1.5 font-medium text-white transition-colors hover:bg-[#3a78ea]"
          >
            + Generate breakpoints
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button className="studio-icon-btn" onClick={() => setZoom((z) => Math.max(0.1, +(z - 0.1).toFixed(2)))} aria-label="Zoom out">−</button>
          <button className="w-14 rounded-md py-1.5 text-center text-white/70 hover:bg-white/10" onClick={fit} title="Zoom to fit">
            {Math.round(zoom * 100)}%
          </button>
          <button className="studio-icon-btn" onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(2)))} aria-label="Zoom in">+</button>
          <a
            href={`${window.location.pathname}#/`}
            target="_blank"
            rel="noreferrer"
            className="ml-2 rounded-md bg-white px-3 py-1.5 font-medium text-black hover:bg-white/90"
          >
            Preview ↗
          </a>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ======================= CANVAS ======================= */}
        <div
          ref={canvasRef}
          className="studio-canvas relative min-w-0 flex-1 overflow-auto"
          onClick={(e) => e.target === e.currentTarget && setSel(null)}
        >
          <div
            className="relative"
            style={{
              width: (frames.reduce((s, f) => s + f.width, 0) + (GAP + 30 / zoom) * (frames.length - 1) + 120 + 30 / zoom) * zoom,
              height: (Math.max(...frames.map((f) => f.height)) + 120 + 48 / zoom) * zoom,
            }}
          >
            <div
              className="absolute left-0 top-0 flex items-start"
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "0 0",
                padding: `${60 + 48 / zoom}px ${60 + 30 / zoom}px 60px 60px`,
                gap: GAP + 30 / zoom,
              }}
            >
              {frames.map((f) => (
                <div key={f.id} className="relative shrink-0" style={{ width: f.width }}>
                  {/* frame header */}
                  <div
                    className="absolute left-0 flex w-full items-center justify-between"
                    style={{ fontSize: 13 / zoom, top: -38 / zoom, height: 28 / zoom }}
                  >
                    <div className="flex items-center gap-[0.5em] text-white/70">
                      <span style={{ display: "inline-flex", transform: `scale(${1 / zoom})`, transformOrigin: "left center", width: 14 / zoom }}>
                        <BpIcon k={f.id} />
                      </span>
                      <span className="font-medium text-white">{f.label}</span>
                      <input
                        type="number"
                        value={f.width}
                        onChange={(e) => setWidth(f.id, Number(e.target.value) || f.width)}
                        className="w-[5.5em] rounded-[0.3em] bg-white/10 px-[0.4em] py-[0.1em] text-white outline-none focus:ring-1 focus:ring-[#4b8bff]"
                        aria-label={`${f.label} width`}
                      />
                      <span className="text-white/40">px</span>
                    </div>
                    {frames.length > 1 && (
                      <button className="text-white/40 hover:text-white" onClick={() => removeFrame(f.id)} aria-label={`Remove ${f.label}`}>
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="overflow-hidden rounded-[10px] bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_30px_80px_rgba(0,0,0,0.6)]">
                    <iframe
                      ref={(el) => {
                        if (el) iframes.current.set(f.id, el);
                        else iframes.current.delete(f.id);
                      }}
                      title={`${f.label} preview`}
                      src={src}
                      style={{ width: f.width, height: f.height, display: "block", border: 0, pointerEvents: resizing ? "none" : "auto" }}
                      onLoad={() => broadcast({ type: "highlight", id: sel?.id ?? null } as Omit<StudioMessage, "source">)}
                    />
                  </div>

                  {/* resize handle */}
                  <div
                    className="studio-resize absolute top-0 flex h-full cursor-ew-resize items-center justify-center"
                    style={{ width: 22 / zoom, right: -24 / zoom }}
                    onPointerDown={(e) => {
                      e.preventDefault();
                      startResize(f.id, e.clientX, f.width);
                    }}
                    title="Drag to resize"
                  >
                    <span className="rounded-full bg-white/25" style={{ width: 5 / zoom, height: 64 / zoom }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ======================= RIGHT PANEL ======================= */}
        <aside className="flex w-[320px] shrink-0 flex-col border-l border-white/10 bg-[#161616]">
          <div className="flex shrink-0 gap-1 border-b border-white/10 p-2">
            {(["inspect", "layers"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setTab(k)}
                className={`flex-1 rounded-md py-1.5 font-medium capitalize ${tab === k ? "bg-white/10 text-white" : "text-white/50 hover:text-white"}`}
              >
                {k === "inspect" ? "Inspector" : "Layers"}
              </button>
            ))}
          </div>

          <div className="studio-scroll min-h-0 flex-1 overflow-y-auto">
            {tab === "layers" ? (
              <Layers sel={sel} onPick={selectAndReveal} />
            ) : sel?.kind === "media" ? (
              <MediaInspector id={sel.id} onReveal={() => selectAndReveal(sel)} />
            ) : sel?.kind === "text" ? (
              <TextInspector id={sel.id} onReveal={() => selectAndReveal(sel)} />
            ) : (
              <EmptyInspector onLayers={() => setTab("layers")} />
            )}
          </div>

          <ProjectActions />
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Panel pieces                                                        */
/* ------------------------------------------------------------------ */

function BpIcon({ k }: { k: BpKind }) {
  const box = { desktop: [2, 4, 20, 13], tablet: [5, 2, 14, 20], mobile: [7, 2, 10, 20] }[k];
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} rx="2" />
      {k === "desktop" && <path d="M8 21h8M12 17v4" />}
    </svg>
  );
}

function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="border-b border-white/10 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-white/45">{title}</span>
        {right}
      </div>
      {children}
    </div>
  );
}

function Seg<T extends string>({ value, options, onChange }: { value: T; options: { v: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-md bg-white/5 p-0.5">
      {options.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          className={`flex-1 rounded px-2 py-1.5 ${value === o.v ? "bg-white/15 text-white" : "text-white/50 hover:text-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Thumb({ slot, className = "" }: { slot: MediaSlot; className?: string }) {
  const src = useResolvedSrc(slot.src);
  const style = { objectFit: slot.fit, objectPosition: `${slot.pos.x}% ${slot.pos.y}%` } as const;
  if (!src) return <div className={`studio-empty-thumb ${className}`} />;
  return slot.type === "video" ? (
    <video className={className} style={style} src={src} muted autoPlay loop playsInline />
  ) : (
    <img className={className} style={style} src={src} alt="" />
  );
}

function Layers({ sel, onPick }: { sel: Selection; onPick: (s: NonNullable<Selection>) => void }) {
  const content = useContent();
  const sections = Array.from(new Set([...MEDIA_SLOTS, ...TEXT_SLOTS].map((s) => s.section)));
  return (
    <div className="p-2">
      <p className="px-2 pb-2 pt-1 text-[12px] leading-relaxed text-white/45">
        Click any image, video or text on the canvas — or pick it here — to edit it. You can also drop files straight onto the canvas.
      </p>
      {sections.map((sec) => (
        <div key={sec} className="mb-1">
          <div className="px-2 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-white/40">{sec}</div>
          {MEDIA_SLOTS.filter((s) => s.section === sec).map((s) => (
            <button
              key={s.id}
              onClick={() => onPick({ kind: "media", id: s.id })}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left ${sel?.id === s.id ? "bg-[#4b8bff]/25 text-white" : "hover:bg-white/5"}`}
            >
              <Thumb slot={content.media[s.id]} className="h-7 w-10 shrink-0 rounded bg-white/5" />
              <span className="truncate">{s.label}</span>
              <span className="ml-auto text-[10px] uppercase text-white/35">{content.media[s.id].src ? content.media[s.id].type : "empty"}</span>
            </button>
          ))}
          {TEXT_SLOTS.filter((s) => s.section === sec).map((s) => (
            <button
              key={s.id}
              onClick={() => onPick({ kind: "text", id: s.id })}
              className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left ${sel?.id === s.id ? "bg-[#4b8bff]/25 text-white" : "hover:bg-white/5"}`}
            >
              <span className="grid h-7 w-10 shrink-0 place-items-center rounded bg-white/5 font-serif text-white/60">T</span>
              <span className="truncate">{s.label}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function EmptyInspector({ onLayers }: { onLayers: () => void }) {
  return (
    <div className="p-5 text-white/55">
      <p className="leading-relaxed">Nothing selected.</p>
      <p className="mt-2 leading-relaxed">
        Click an image, video or headline in any breakpoint to edit it. Everything you change updates every breakpoint instantly and is saved in this browser.
      </p>
      <button onClick={onLayers} className="mt-4 rounded-md bg-white/10 px-3 py-1.5 text-white hover:bg-white/15">
        Browse layers
      </button>
    </div>
  );
}

function MediaInspector({ id, onReveal }: { id: string; onReveal: () => void }) {
  const slot = useContent().media[id];
  const meta = MEDIA_SLOTS.find((s) => s.id === id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(slot.src.startsWith("idb:") ? "" : slot.src);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);

  useEffect(() => setUrl(slot.src.startsWith("idb:") ? "" : slot.src), [slot.src]);

  const onFile = async (file?: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      await assignFile(id, file);
    } finally {
      setBusy(false);
    }
  };

  const applyUrl = () => {
    const v = url.trim();
    if (v === slot.src) return;
    const looksVideo = /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(v);
    setMedia(id, { src: v, ...(v ? { type: looksVideo ? "video" : slot.type === "video" && !looksVideo ? "image" : slot.type } : {}) });
  };

  const setFocal = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMedia(id, {
      pos: {
        x: Math.round(((e.clientX - r.left) / r.width) * 100),
        y: Math.round(((e.clientY - r.top) / r.height) * 100),
      },
    });
  };

  return (
    <div>
      <Section
        title={meta?.section ?? "Media"}
        right={<button onClick={onReveal} className="text-[12px] text-[#7aa8ff] hover:underline">Show on canvas</button>}
      >
        <div className="mb-3 text-[15px] font-semibold text-white">{meta?.label ?? id}</div>
        {/* preview + focal point */}
        <div
          className={`relative aspect-[16/10] cursor-crosshair overflow-hidden rounded-lg bg-white/5 ${over ? "ring-2 ring-[#4b8bff]" : ""}`}
          onClick={slot.src ? setFocal : () => fileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => { e.preventDefault(); setOver(false); onFile(e.dataTransfer.files?.[0]); }}
          title={slot.src ? "Click to set the focal point" : "Click or drop a file"}
        >
          <Thumb slot={slot} className="h-full w-full" />
          {!slot.src && (
            <div className="absolute inset-0 grid place-items-center text-center text-white/45">
              <div>
                <div className="text-[22px]">⇪</div>
                <div className="mt-1">Drop an image or video</div>
              </div>
            </div>
          )}
          {slot.src && (
            <span
              className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,0.4)]"
              style={{ left: `${slot.pos.x}%`, top: `${slot.pos.y}%` }}
            />
          )}
          {busy && <div className="absolute inset-0 grid place-items-center bg-black/60 text-white">Saving…</div>}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button onClick={() => fileRef.current?.click()} className="rounded-md bg-[#4b8bff] py-2 font-medium text-white hover:bg-[#3a78ea]">
            Upload file
          </button>
          <button onClick={() => setMedia(id, { src: "", poster: "" })} className="rounded-md bg-white/10 py-2 text-white hover:bg-white/15">
            Clear
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
      </Section>

      <Section title="Source">
        <label className="mb-1.5 block text-white/50">Image or video URL</label>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={applyUrl}
          onKeyDown={(e) => e.key === "Enter" && applyUrl()}
          placeholder={slot.src.startsWith("idb:") ? "Using an uploaded file" : "https://…"}
          className="studio-input"
        />
        <div className="mt-3">
          <label className="mb-1.5 block text-white/50">Type</label>
          <Seg value={slot.type} onChange={(v) => setMedia(id, { type: v })} options={[{ v: "image", label: "Image" }, { v: "video", label: "Video" }]} />
        </div>
        {slot.type === "video" && (
          <div className="mt-3">
            <label className="mb-1.5 block text-white/50">Poster image URL (optional)</label>
            <input
              defaultValue={slot.poster ?? ""}
              key={slot.poster}
              onBlur={(e) => setMedia(id, { poster: e.target.value.trim() })}
              placeholder="Shown while the video loads"
              className="studio-input"
            />
          </div>
        )}
      </Section>

      <Section title="Layout">
        <label className="mb-1.5 block text-white/50">Fit</label>
        <Seg value={slot.fit} onChange={(v) => setMedia(id, { fit: v })} options={[{ v: "cover", label: "Fill" }, { v: "contain", label: "Fit" }]} />
        {(["x", "y"] as const).map((axis) => (
          <div key={axis} className="mt-3">
            <div className="mb-1 flex justify-between text-white/50">
              <span>Focal {axis.toUpperCase()}</span>
              <span>{slot.pos[axis]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={slot.pos[axis]}
              onChange={(e) => setMedia(id, { pos: { ...slot.pos, [axis]: Number(e.target.value) } })}
              className="studio-range w-full"
            />
          </div>
        ))}
      </Section>

      <Section title="Accessibility">
        <label className="mb-1.5 block text-white/50">Alt text</label>
        <input defaultValue={slot.alt} key={id + slot.alt} onBlur={(e) => setMedia(id, { alt: e.target.value })} className="studio-input" />
      </Section>

      <div className="p-4">
        <button onClick={() => resetMedia(id)} className="w-full rounded-md bg-white/5 py-2 text-white/70 hover:bg-white/10 hover:text-white">
          Reset to default
        </button>
      </div>
    </div>
  );
}

function TextInspector({ id, onReveal }: { id: string; onReveal: () => void }) {
  const value = useContent().text[id] ?? "";
  const meta = TEXT_SLOTS.find((s) => s.id === id);
  return (
    <div>
      <Section
        title={meta?.section ?? "Text"}
        right={<button onClick={onReveal} className="text-[12px] text-[#7aa8ff] hover:underline">Show on canvas</button>}
      >
        <div className="mb-3 text-[15px] font-semibold text-white">{meta?.label ?? id}</div>
        <textarea
          value={value}
          onChange={(e) => setText(id, e.target.value)}
          rows={Math.min(10, Math.max(3, Math.ceil(value.length / 34)))}
          className="studio-input resize-y leading-relaxed"
        />
        <button onClick={() => resetText(id)} className="mt-3 w-full rounded-md bg-white/5 py-2 text-white/70 hover:bg-white/10 hover:text-white">
          Reset to default
        </button>
      </Section>
    </div>
  );
}

function ProjectActions() {
  const importRef = useRef<HTMLInputElement>(null);
  const download = () => {
    const blob = new Blob([exportOverrides()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "site-content.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <div className="grid shrink-0 grid-cols-3 gap-1.5 border-t border-white/10 p-3">
      <button onClick={download} className="rounded-md bg-white/10 py-1.5 hover:bg-white/15" title="Download your edits as JSON">Export</button>
      <button onClick={() => importRef.current?.click()} className="rounded-md bg-white/10 py-1.5 hover:bg-white/15" title="Load edits from JSON">Import</button>
      <button
        onClick={() => window.confirm("Reset every image, video and text back to the defaults?") && resetAll()}
        className="rounded-md bg-white/10 py-1.5 text-[#ff8a8a] hover:bg-white/15"
      >
        Reset all
      </button>
      <input
        ref={importRef}
        type="file"
        accept="application/json"
        hidden
        onChange={async (e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (!f) return;
          try {
            importOverrides(await f.text());
          } catch {
            window.alert("That file isn't a valid site-content JSON export.");
          }
        }}
      />
    </div>
  );
}
