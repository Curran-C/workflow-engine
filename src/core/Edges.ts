import type { EdgeInterface } from "./type"

export class Edge {
    private id: string
    private source: string
    private target: string

    constructor(edge: EdgeInterface) {
        this.id = edge.id
        this.source = edge.source
        this.target = edge.target
    }

    getId() {
        return this.id
    }

    getSource() {
        return this.source
    }

    getTarget() {
        return this.target
    }
}