import { FC, useLayoutEffect, useState } from "react";

type Point = { x: number; y: number };

interface ConnectionLineProps {
  sourceId: string;
  targetId: string;
}

const getCenter = (el: HTMLElement, container: HTMLElement): Point => {
  const elRect = el.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  return {
    x: elRect.left + elRect.width / 2 - containerRect.left,
    y: elRect.top + elRect.height / 2 - containerRect.top,
  };
};

const ConnectionLine: FC<ConnectionLineProps> = ({ sourceId, targetId }) => {
  const [points, setPoints] = useState<{ from: Point; to: Point } | null>(null);

  useLayoutEffect(() => {
    const container = document.querySelector(
      ".graph-canvas"
    ) as HTMLElement | null;

    if (!container) return;

    const sourceEl = document.querySelector(
      `[data-node-id="${sourceId}"]`
    ) as HTMLElement | null;

    const targetEl = document.querySelector(
      `[data-node-id="${targetId}"]`
    ) as HTMLElement | null;

    if (!sourceEl || !targetEl) return;

    setPoints({
      from: getCenter(sourceEl, container),
      to: getCenter(targetEl, container),
    });
  }, [sourceId, targetId]);

  if (!points) return null;

  const { from, to } = points;
  const controlX = (from.x + to.x) / 2;

  const d = `
    M ${from.x},${from.y}
    C ${controlX},${from.y}
      ${controlX},${to.y}
      ${to.x},${to.y}
  `;

  return <path d={d} stroke="black" strokeWidth={2} fill="none" />;
};

export default ConnectionLine;
