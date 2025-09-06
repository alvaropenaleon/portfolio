import { useWindowStore } from '@/store/windowStore';
import type { WindowID } from '@/lib/definitions';
import { useMemo } from 'react';

export function useWindowNav(id: WindowID) {
  const { wins, setParam, replaceParams } = useWindowStore();
  const win = wins[id];

  const pathname = `/${id}` as const;
  
  const params = useMemo(() => {
    if (!win?.route.params) return new URLSearchParams();
    return new URLSearchParams(win.route.params);
  }, [win?.route.params]);

  const setParamFn = (key: string, value?: string) => {
    setParam(id, key, value);
  };

  const replaceParamsFn = (newParams: Record<string, string | undefined>) => {
    replaceParams(id, newParams);
  };

  return {
    pathname,
    params,
    setParam: setParamFn,
    replaceParams: replaceParamsFn,
  };
}