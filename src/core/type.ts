import type { ComponentType } from "react"

// for Nodes.ts
export interface Position {
    x: number,
    y: number
}

export interface NodeData {
    type: string,
    label: string,
}

export interface NodeInterface {
    id: string
    initialPostion: Position
    data: NodeData
}

export interface EdgeInterface {
    id: string,
    source: string,
    target: string,
}

export interface NodeType {
    [key: string]: ComponentType<unknown>
}

