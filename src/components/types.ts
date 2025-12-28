import type { Node } from "../core/Node";
import type { NodeType } from "../core/type";

export interface NodeProps {
  types: NodeType;
  source: boolean;
  node: Node;
  target: boolean;
}

export interface HandleBarProps {
  type: "source" | "target";
  position?: "top" | "bottom" | "left" | "right";
}
