// A full or disabled local cache must never crash React or prevent cloud writes.
export function writeLocalCache(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    if (typeof window !== "undefined") window.dispatchEvent(new Event("reveenorth:storage-error"));
    return false;
  }
}
