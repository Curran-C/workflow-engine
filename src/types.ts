import type { EdgeInterface, NodeInterface, NodeType } from "./core/type";

export interface GraphProps {
    nodes: NodeInterface[]
    edges: EdgeInterface[]
    nodeTypes?: NodeType[] | undefined
}