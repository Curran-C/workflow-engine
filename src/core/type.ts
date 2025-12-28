import type { ComponentType, FC } from "react";

// for Nodes.ts
export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  type?: string;
  label: string;
}

export interface NodeInterface {
  id: string;
  initialPosition: Position;
  data: NodeData;
  type: string;
}

export interface EdgeInterface {
  id: string;
  source: string;
  target: string;
}

export interface NodeType {
  [key: string]: ComponentType<any>;
}
