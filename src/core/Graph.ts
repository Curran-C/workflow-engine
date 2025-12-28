import { Edge } from "./Edges";
import { Node } from "./Node";
import type { EdgeInterface, NodeInterface, NodeType } from "./type";

export class Graph {
  private nodes: Map<string, Node>;
  private edges: Map<string, Edge>;
  private nodeTypes: NodeType[] | undefined;

  constructor(initialNodes: NodeInterface[], initialEdges: EdgeInterface[], nodeTypes?: NodeType | undefined) {
    this.nodes = new Map();
    this.edges = new Map();
    this.nodeTypes = nodeTypes;

    this.initNodes(initialNodes);
    this.initEdges(initialEdges);
  }

  private initNodes(nodes: NodeInterface[]) {
    nodes.forEach((node) => {
      const nodeInstance = new Node(node, this);
      this.nodes.set(nodeInstance.getId(), nodeInstance);
    });
  }

  private initEdges(edges: EdgeInterface[]) {
    edges.forEach((edge) => {
      const edgeInterface = new Edge(edge);
      this.edges.set(edgeInterface.getId(), edgeInterface);
    });
  }

  getNodes() {
    return Array.from(this.nodes.values());
  }

  getEdges() {
    return Array.from(this.edges.values());
  }

  getNodeById(id: string) {
    return this.nodes.get(id);
  }

  //gets the source nodes
  getOutgoingEdges(node: Node) {
    const nodeId = node.getId();
    return this.getEdges().reduce((acc, val) => {
      if (val.getSource() === nodeId) acc.push(val);
      return acc;
    }, []);
  }

  //gets the destination nodes
  getIncomingEdges(node: Node) {
    const nodeId = node.getId();
    return this.getEdges().reduce((acc, val) => {
      if (val.getTarget() === nodeId) acc.push(val);
      return acc;
    }, []);
  }

  emit(fromId: string, type: string, payload: any) {
    const fromNode = this.nodes.get(fromId);
    if (!fromNode) return;

    this.getOutgoingEdges(fromNode).forEach((edge) => {
      const target = this.nodes.get(edge.getTarget());
      if (target) {
        target._receive(type, payload, fromId);
      }
    });
  }
}
