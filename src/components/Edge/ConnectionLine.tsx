import { useLayoutEffect, useState } from "react";
import type { FC } from "react";

type Point = { x: number; y: number };

interface ConnectionLineProps {
  sourceId: string;
  targetId: string;
}

const getHandlePosition = (nodeEl: HTMLElement, handleSelector: string, container: HTMLElement): Point => {
  const handleEl = nodeEl.querySelector(handleSelector) as HTMLElement | null;
  if (!handleEl) {
    // Fallback to node center if handle not found
    const nodeRect = nodeEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return {
      x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
      y: nodeRect.top + nodeRect.height / 2 - containerRect.top,
    };
  }

  const handleRect = handleEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: handleRect.left + handleRect.width / 2 - containerRect.left,
    y: handleRect.top + handleRect.height / 2 - containerRect.top,
  };
};

const ConnectionLine: FC<ConnectionLineProps> = ({ sourceId, targetId }) => {
  const [points, setPoints] = useState<{ from: Point; to: Point } | null>(null);

  useLayoutEffect(() => {
    const updatePoints = () => {
      const container = document.querySelector(".graph-canvas") as HTMLElement | null;

      if (!container) return;

      const sourceEl = document.querySelector(`[data-node-id="${sourceId}"]`) as HTMLElement | null;

      const targetEl = document.querySelector(`[data-node-id="${targetId}"]`) as HTMLElement | null;

      if (!sourceEl || !targetEl) return;

      // Get source handle (bottom handle) and target handle (top handle)
      const from = getHandlePosition(sourceEl, '.handlebar.bottom[data-handle-type="source"]', container);
      const to = getHandlePosition(targetEl, '.handlebar.top[data-handle-type="target"]', container);

      setPoints({ from, to });
    };

    updatePoints();

    let rafId: number | null = null;
    let pendingUpdate = false;

    // Throttled update function using requestAnimationFrame
    const scheduleUpdate = () => {
      if (!pendingUpdate) {
        pendingUpdate = true;
        rafId = requestAnimationFrame(() => {
          updatePoints();
          pendingUpdate = false;
        });
      }
    };

    // Update on resize
    const handleResize = () => {
      updatePoints();
    };
    window.addEventListener("resize", handleResize);

    // Update on mouse move (throttled with requestAnimationFrame)
    // This ensures smooth updates during node dragging
    const handleMouseMove = () => {
      scheduleUpdate();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [sourceId, targetId]);

  if (!points) return null;

  const { from, to } = points;

  // React Flow style Bezier curve calculation
  // Creates smooth S-curves connecting handles
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Calculate control point offset for smooth curves
  // React Flow uses a distance-based offset with a minimum threshold
  const distance = Math.sqrt(dx * dx + dy * dy);
  const minOffset = 50; // Minimum curve offset
  const maxOffset = 200; // Maximum curve offset
  const offset = Math.max(minOffset, Math.min(distance * 0.4, maxOffset));

  // Source control point: extends downward from source handle (bottom)
  const sourceControlX = from.x;
  const sourceControlY = from.y + offset;

  // Target control point: extends upward from target handle (top)
  const targetControlX = to.x;
  const targetControlY = to.y - offset;

  const d = `
    M ${from.x},${from.y}
    C ${sourceControlX},${sourceControlY}
      ${targetControlX},${targetControlY}
      ${to.x},${to.y}
  `;

  return <path d={d} stroke="black" strokeWidth={2} fill="none" />;
};

export default ConnectionLine;
