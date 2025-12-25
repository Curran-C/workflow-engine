import type { NodeData, NodeInterface, Position } from "./type";

export class Node {

    private id: string
    private initialPosition: Position
    private data: NodeData

    constructor(node: NodeInterface) {
        this.id = node.id
        this.initialPosition = node.initialPostion
        this.data = node.data
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
}