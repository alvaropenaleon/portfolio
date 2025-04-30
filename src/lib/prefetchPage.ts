// src/lib/prefetchPage.ts
export function prefetchPage(path: string) {
    // If it’s already in the HTTP cache this is a no-op
    fetch(path, { method: 'GET', credentials: 'same-origin' }).catch(() => { });
}
