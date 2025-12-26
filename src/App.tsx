import type { FC } from "react";
import type { GraphProps } from "./types";
import { Graph } from "./core/Graph";
import Node from "./components/Node/Node";
import Text from "./deleteLater/Text";
import EdgesLayer from "./components/Edge/EdgeLayer";

const App: FC<GraphProps> = (props) => {
  const { nodes, edges, nodeTypes, children } = props;

  const initialNodes = [
    { id: "n1", initialPosition: { x: 0, y: 0 }, data: { label: "Node 1" } },
    { id: "n2", initialPosition: { x: 0, y: 100 }, data: { label: "Node 2" } },
    { id: "n3", initialPosition: { x: 0, y: 200 }, data: { label: "Node 3", txt: "hello" }, type: "text" },
  ];
  const initialEdges = [
    { id: "n1-n2", source: "n1", target: "n2" },
    { id: "n2-n3", source: "n2", target: "n3" },
  ];

  const tempNodeTypes = {
    text: Text,
  };

  const graph = new Graph(initialNodes, initialEdges);

  //this is under the assumption that there can only be one source and target
  return (
    <div className="graph-canvas" style={{ position: "relative", width: "100%", height: "100%" }}>
      <EdgesLayer graph={graph} />
      {graph.getNodes().map((node) => {
        const hasSource = graph.getOutgoingEdges(node).length > 0;
        const hasTarget = graph.getIncomingEdges(node).length > 0;

        return <Node types={tempNodeTypes} key={node.getId()} node={node} source={hasSource} target={hasTarget} />;
      })}
    </div>
  );
};

export default App;
