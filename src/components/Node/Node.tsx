import { HandleBar } from "../Handlebar/HandleBar";
import type { NodeProps } from "../types";
import "./node.scss";

const Node = (props: NodeProps) => {
  const { source, target, node, types } = props;
  const data = node.getData();
  return (
    <div data-node-id={node.getId()} className="node-wrapper">
      {target && <HandleBar type="target" position="top" />}

      <div className="node">{types[node.getType()]?.(node.getData()) || data.label}</div>

      {source && <HandleBar type="source" position="bottom" />}
    </div>
  );
};

export default Node;
