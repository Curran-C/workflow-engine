import { Graph } from "./core/Graph";
import Node from "./components/Node/Node";
import EdgesLayer from "./components/Edge/EdgeLayer";
import NumberInputNode from "./deleteLater/NumberInputNode";
import SumNode from "./deleteLater/SumNode";

const initialNodes = [
  {
    id: "a",
    initialPosition: { x: 0, y: 0 },
    type: "number",
    data: { label: "A" },
  },
  {
    id: "b",
    initialPosition: { x: 0, y: 150 },
    type: "number",
    data: { label: "B" },
  },
  {
    id: "sum",
    initialPosition: { x: 300, y: 75 },
    type: "sum",
    data: {},
  },
];

const initialEdges = [
  { id: "a-sum", source: "a", target: "sum" },
  { id: "b-sum", source: "b", target: "sum" },
];

const nodeTypes = {
  number: NumberInputNode,
  sum: SumNode,
};

const graph = new Graph(initialNodes, initialEdges);

export default function App() {
  return (
    <div className="graph-canvas" style={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {graph.getNodes().map((node) => {
        const hasSource = graph.getOutgoingEdges(node).length > 0;
        const hasTarget = graph.getIncomingEdges(node).length > 0;

        return <Node key={node.getId()} node={node} source={hasSource} target={hasTarget} types={nodeTypes} />;
      })}

      <EdgesLayer graph={graph} />
    </div>
  );
}
