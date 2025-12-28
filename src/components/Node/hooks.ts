import { useEffect, useRef, useCallback } from "react";
import { useNodeContext } from "./NodeContext";

export function useNodeData<T = any>() {
  const { node, version } = useNodeContext();
  // version is used to trigger re-renders when data changes
  void version;
  // Access data directly to avoid any method-level caching issues
  return (node as any).data as T;
}

export function useSetNodeData<T = any>() {
  const { node } = useNodeContext();
  return useCallback(
    (data: T) => {
      node.setData(data);
    },
    [node]
  );
}

export function useEmit() {
  const { node } = useNodeContext();
  return useCallback(
    (type: string, payload: any) => {
      node.emit(type, payload);
    },
    [node]
  );
}

export function useOn(type: string, handler: (payload: any, from: string) => void) {
  const { node } = useNodeContext();
  const handlerRef = useRef(handler);

  // Always keep the handler ref up to date
  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    // Create a stable wrapper that calls the current handler
    const stableHandler = (payload: any, from: string) => {
      handlerRef.current(payload, from);
    };

    node.on(type, stableHandler);

    // Return cleanup function
    return () => {
      node.off(type, stableHandler);
    };
  }, [node, type]);
}
