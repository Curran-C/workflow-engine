import type { NodeData, NodeInterface, Position } from "./type";
import type { Graph } from "./Graph";

type Handler = (payload: any, from: string) => void;

export class Node {
  private id: string;
  private initialPosition: Position;
  private data: NodeData;
  private type: string;
  private graph: Graph;
  private handlers = new Map<string, Handler[]>();
  private __onDataChange?: () => void;

  constructor(node: NodeInterface, graph: Graph) {
    this.id = node.id;
    this.initialPosition = node.initialPosition;
    this.data = node.data;
    this.type = node.type;
    this.graph = graph;
  }

  getId() {
    return this.id;
  }

  getPosition() {
    return this.initialPosition;
  }

  getData() {
    return this.data;
  }

  getType() {
    return this.type;
  }

  setData(value: any) {
    this.data = { ...this.data, ...value };
    this.__onDataChange?.();
  }

  _bindOnDataChange(callback: () => void) {
    this.__onDataChange = callback;
  }

  emit(type: string, payload: any) {
    this.graph.emit(this.id, type, payload);
  }

  on(type: string, handler: Handler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type)!.push(handler);
  }

  off(type: string, handler: Handler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  _receive(type: string, payload: any, from: string) {
    this.handlers.get(type)?.forEach((h) => h(payload, from));
  }
}
