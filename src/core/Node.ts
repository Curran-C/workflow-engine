import type { FC } from "react";
import type { NodeData, NodeInterface, Position } from "./type";

export class Node {

    private id: string
    private initialPosition: Position
    private data: NodeData
    private type: FC

    constructor(node: NodeInterface) {
        this.id = node.id
        this.initialPosition = node.initialPosition
        this.data = node.data
        this.type = node.type
    }

    getId() {
        return this.id
    }

    getPosition() {
        return this.initialPosition
    }

    getData() {
        return this.data
    }

    getType() {
        return this.type
    }
}