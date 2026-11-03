const compactKeys = new Set(['reveenorth:app-state', 'reveenorth:user', 'reveenorth:categories']);

// Recurring bills share the same pictures. Store each picture once in the local
// cache, while keeping the cloud payload and the application's data unchanged.
export function packLocalCache(value: string): string {
  try {
    const pictures: string[] = [];
    const indexes = new Map<string, number>();
    const payload = JSON.parse(JSON.stringify(JSON.parse(value), (_key, item) => {
      if (typeof item !== 'string' || !item.startsWith('data:image/')) return item;
      let index = indexes.get(item);
      if (index === undefined) { index = pictures.length; indexes.set(item, index); pictures.push(item); }
      return { __reveenorthPicture: index };
    }));
    const packed = JSON.stringify({ __reveenorthCache: 1, pictures, payload });
    return packed.length < value.length ? packed : value;
  } catch { return value; }
}

export function readLocalCache(key: string): string | null {
  const value = localStorage.getItem(key);
  if (!value || !compactKeys.has(key)) return value;
  const parsed = JSON.parse(value);
  if (parsed?.__reveenorthCache !== 1 || !Array.isArray(parsed.pictures)) return value;
  return JSON.stringify(parsed.payload, (_key, item) => {
    if (item && typeof item === 'object' && Object.keys(item).length === 1 && Number.isInteger(item.__reveenorthPicture)) {
      const picture = parsed.pictures[item.__reveenorthPicture];
      if (typeof picture !== 'string') throw new Error('Invalid cached image reference');
      return picture;
    }
    return item;
  });
}

// A full or disabled local cache must never crash React or prevent cloud writes.
export function writeLocalCache(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, compactKeys.has(key) ? packLocalCache(value) : value);
    return true;
  } catch { return false; }
}
