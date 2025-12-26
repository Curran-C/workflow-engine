import type { FC } from "react";
import ConnectionLine from "./ConnectionLine";
import type { EdgesLayerProps } from "./types";

const EdgesLayer: FC<EdgesLayerProps> = ({ graph }) => {
  return (
    <svg
      className="edges-layer"
      width="100%"
      height="100%"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      {graph.getEdges().map((edge) => (
        <ConnectionLine key={edge.getId()} sourceId={edge.getSource()} targetId={edge.getTarget()} />
      ))}
    </svg>
  );
};

export default EdgesLayer;
