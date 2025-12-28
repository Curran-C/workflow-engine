import { createContext, useContext } from "react";
import { Node } from "../../core/Node";

export const NodeContext = createContext<{
  node: Node;
  version: number;
} | null>(null);

export function useNodeContext() {
  const ctx = useContext(NodeContext);
  if (!ctx) {
    throw new Error("Node hooks must be used inside NodeContext");
  }
  return ctx;
}
