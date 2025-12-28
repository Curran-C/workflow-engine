import { useRef } from "react";
import { useNodeData, useSetNodeData, useOn } from "../components/Node/hooks";

interface SumData {
  sum?: number;
}

export default function SumNode() {
  const data = useNodeData<SumData>();
  const setData = useSetNodeData<SumData>();
  const valuesRef = useRef<Record<string, number>>({});

  useOn("value", (value: any, from: string) => {
    valuesRef.current[from] = value;
    const sum = Object.values(valuesRef.current).reduce((a, b) => a + b, 0);
    setData({ sum });
  });

  return <strong>Sum: {data.sum ?? 0}</strong>;
}
