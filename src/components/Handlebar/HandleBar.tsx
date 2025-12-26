import type { HandleBarProps } from "../types";
import "./handlebar.scss";

export const HandleBar = (props: HandleBarProps) => {
  const { type, position } = props;
  return <div className={`handlebar ${position}`} data-handle-type={type} data-handle-position={position}></div>;
};
