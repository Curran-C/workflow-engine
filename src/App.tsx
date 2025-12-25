import type { FC } from "react";
import type { GraphProps } from "./types";
import type { EdgeInterface, NodeInterface } from "./core/type";
import { Graph } from "./core/Graph";

const App: FC<GraphProps> = (props) => {
  const { nodes, edges, nodeTypes, children } = props;

  const graph = new Graph(nodes, edges, nodeTypes);

  return (
    <div>
      Graph
      {children}
    </div>
  );
};

export default App;
