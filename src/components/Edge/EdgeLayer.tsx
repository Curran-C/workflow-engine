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
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 1,
      }}
    >
      {graph.getEdges().map((edge) => (
        <ConnectionLine key={edge.getId()} sourceId={edge.getSource()} targetId={edge.getTarget()} />
      ))}
    </svg>
  );
};

export default EdgesLayer;
