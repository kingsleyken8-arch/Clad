import { useEffect, useState, useSyncExternalStore } from "react";
import { Content, DEFAULT_CONTENT, MediaSlot } from "./content";

/*
 * Shared content store.
 *
 * Only overrides are persisted (localStorage), so defaults can evolve in code
 * without clobbering edits. Every window on the same origin — the studio and
 * each breakpoint iframe — stays in sync through a BroadcastChannel, with the
 * `storage` event as a fallback. Uploaded files live in IndexedDB and are
 * referenced from content as "idb:<key>".
 */

const LS_KEY = "clad-content-v1";
const CHANNEL = "clad-content";

type Overrides = {
  media: Record<string, Partial<MediaSlot>>;
  text: Record<string, string>;
};

const emptyOverrides = (): Overrides => ({ media: {}, text: {} });

function readOverrides(): Overrides {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return emptyOverrides();
    const parsed = JSON.parse(raw) as Partial<Overrides>;
    return { media: parsed.media ?? {}, text: parsed.text ?? {} };
  } catch {
    return emptyOverrides();
  }
}

function merge(o: Overrides): Content {
  const media: Content["media"] = {};
  for (const [id, slot] of Object.entries(DEFAULT_CONTENT.media)) {
    const ov = o.media[id] ?? {};
    media[id] = { ...slot, ...ov, pos: { ...slot.pos, ...(ov.pos ?? {}) } };
  }
  return { media, text: { ...DEFAULT_CONTENT.text, ...o.text } };
}

let overrides = readOverrides();
let snapshot = merge(overrides);
const listeners = new Set<() => void>();

const channel =
  typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL) : null;

function emit() {
  snapshot = merge(overrides);
  listeners.forEach((l) => l());
}

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(overrides));
  } catch {
    /* storage full or blocked — edits stay in memory for this session */
  }
  channel?.postMessage({ type: "sync" });
  emit();
}

channel?.addEventListener("message", () => {
  overrides = readOverrides();
  emit();
});
window.addEventListener("storage", (e) => {
  if (e.key === LS_KEY) {
    overrides = readOverrides();
    emit();
  }
});

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getContent() {
  return snapshot;
}

export function useContent() {
  return useSyncExternalStore(subscribe, getContent);
}

export function setMedia(id: string, patch: Partial<MediaSlot>) {
  const prev = overrides.media[id] ?? {};
  overrides = {
    ...overrides,
    media: {
      ...overrides.media,
      [id]: { ...prev, ...patch, ...(patch.pos ? { pos: { ...(prev.pos ?? {}), ...patch.pos } } : {}) } as Partial<MediaSlot>,
    },
  };
  persist();
}

export function resetMedia(id: string) {
  const media = { ...overrides.media };
  delete media[id];
  overrides = { ...overrides, media };
  persist();
}

export function setText(id: string, value: string) {
  overrides = { ...overrides, text: { ...overrides.text, [id]: value } };
  persist();
}

export function resetText(id: string) {
  const text = { ...overrides.text };
  delete text[id];
  overrides = { ...overrides, text };
  persist();
}

export function resetAll() {
  overrides = emptyOverrides();
  persist();
}

export function exportOverrides(): string {
  return JSON.stringify(overrides, null, 2);
}

export function importOverrides(json: string) {
  const parsed = JSON.parse(json) as Partial<Overrides>;
  overrides = { media: parsed.media ?? {}, text: parsed.text ?? {} };
  persist();
}

/* ----------------------------- IndexedDB blobs ----------------------------- */

const DB_NAME = "clad-media";
const STORE = "files";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putFile(file: Blob): Promise<string> {
  const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(file, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  return `idb:${key}`;
}

async function getFile(key: string): Promise<Blob | undefined> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE).objectStore(STORE).get(key);
    req.onsuccess = () => resolve(req.result as Blob | undefined);
    req.onerror = () => reject(req.error);
  });
}

const urlCache = new Map<string, Promise<string>>();

function resolveIdb(src: string): Promise<string> {
  let p = urlCache.get(src);
  if (!p) {
    p = getFile(src.slice(4)).then((b) => (b ? URL.createObjectURL(b) : ""));
    urlCache.set(src, p);
  }
  return p;
}

/** Resolves a slot src (URL or idb:key) to something an <img>/<video> can load. */
export function useResolvedSrc(src: string | undefined): string {
  const isIdb = !!src && src.startsWith("idb:");
  const [url, setUrl] = useState(isIdb ? "" : src ?? "");
  useEffect(() => {
    if (!src) return setUrl("");
    if (!src.startsWith("idb:")) return setUrl(src);
    let alive = true;
    resolveIdb(src).then((u) => alive && setUrl(u));
    return () => {
      alive = false;
    };
  }, [src]);
  return url;
}

/** Store a dropped/uploaded file and point a slot at it, inferring image vs video. */
export async function assignFile(id: string, file: File) {
  const src = await putFile(file);
  setMedia(id, { src, type: file.type.startsWith("video") ? "video" : "image" });
}

/* ------------------------------ embed messaging ----------------------------- */

export type StudioMessage =
  | { source: "clad-studio"; type: "highlight"; id: string | null }
  | { source: "clad-studio"; type: "reveal"; id: string };

export type FrameMessage = {
  source: "clad-frame";
  type: "select";
  id: string;
  kind: "media" | "text";
};

export function isEmbed(): boolean {
  return /[?&]embed=1/.test(window.location.hash);
}
