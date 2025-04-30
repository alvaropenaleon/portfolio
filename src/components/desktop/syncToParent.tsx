'use client';
import { useEffect } from 'react';

export default function SyncToParent() {
  useEffect(() => {
    const send = () => {
      const url  = new URL(window.location.href);
      const id   = url.pathname.split('/')[2];     // 'about' | 'archive'
      const path = '/' + id + url.search;
      window.parent.postMessage({ type:'iframe-path', id, path }, window.origin);
    };

    /* initial */
    send();

    /* back / forward */
    window.addEventListener('popstate', send);

    /* intercept programmatic navigation (pushState / replaceState) */
    const wrap = (key: 'pushState' | 'replaceState') => {
      const orig = history[key];
      history[key] = function (...args) {
        orig.apply(this, args);
        send();
      };
    };
    wrap('pushState');
    wrap('replaceState');

    return () => {
      window.removeEventListener('popstate', send);
      history.pushState  = history.pushState;   // restore originals implicitly
      history.replaceState = history.replaceState;
    };
  }, []);

  return null;
}
