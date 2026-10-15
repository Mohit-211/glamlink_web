import { GlamCardFormData } from "./types";

const DB_NAME = "glamcard_drafts";
const STORE_NAME = "drafts";
const DRAFT_POINTER_KEY = "glamcard_draft_id";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveDraft(data: GlamCardFormData): Promise<void> {
  const db = await openDb();
  const id = crypto.randomUUID();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(data, id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  localStorage.setItem(DRAFT_POINTER_KEY, id);
}

export async function loadDraft(): Promise<GlamCardFormData | null> {
  const id = localStorage.getItem(DRAFT_POINTER_KEY);
  if (!id) return null;

  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(id);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearDraft(): Promise<void> {
  const id = localStorage.getItem(DRAFT_POINTER_KEY);
  localStorage.removeItem(DRAFT_POINTER_KEY);
  if (!id) return;

  const db = await openDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).delete(id);
}