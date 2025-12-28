// src/nodes/NumberInputNode.tsx
import { useEmit } from "../components/Node/hooks";

interface Props {
  label: string;
}

export default function NumberInputNode({ label }: Props) {
  const emit = useEmit();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    emit("value", value);
  };

  return (
    <div>
      <div>{label}</div>
      <input type="number" onChange={handleChange} style={{ width: "80px" }} />
    </div>
  );
}
