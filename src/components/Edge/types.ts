import type { Graph } from "../../core/Graph";

export type Point = { x: number; y: number };

export interface ConnectionLineProps {
  sourceId: string;
  targetId: string;
}

export interface EdgesLayerProps {
  graph: Graph;
}
