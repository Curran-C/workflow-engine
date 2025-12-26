import type { Node } from "../core/Node";

export interface NodeProps {
  types: object;
  source: string;
  node: Node;
  target: string;
}

export interface HandleBarProps {
  type: "source" | "target";
  position?: "top" | "bottom" | "left" | "right";
}
