import { useEffect, useRef, useState } from "react";
import { HandleBar } from "../Handlebar/HandleBar";
import type { NodeProps } from "../types";
import "./node.scss";

const Node = (props: NodeProps) => {
  const { source, target, node, types } = props;
  const data = node.getData();
  const { x, y } = node.getPosition();

  const [position, setPosition] = useState({ x, y });

  const draggingRef = useRef(false);
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startPosRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    draggingRef.current = true;
    startMouseRef.current = { x: e.clientX, y: e.clientY };
    startPosRef.current = { ...position };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!draggingRef.current) return;

    const dx = e.clientX - startMouseRef.current.x;
    const dy = e.clientY - startMouseRef.current.y;

    setPosition({
      x: startPosRef.current.x + dx,
      y: startPosRef.current.y + dy,
    });
  };

  const onMouseUp = () => {
    draggingRef.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      data-node-id={node.getId()}
      className="node-wrapper"
      onMouseDown={onMouseDown}
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: "grab",
      }}
    >
      {target && <HandleBar type="target" position="top" />}

      <div className="node">{types[node.getType()]?.(node.getData()) || data.label}</div>

      {source && <HandleBar type="source" position="bottom" />}
    </div>
  );
};

export default Node;
