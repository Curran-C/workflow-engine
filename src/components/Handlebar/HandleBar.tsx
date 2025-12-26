import type { HandleBarProps } from "../types";
import "./handlebar.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const HandleBar = (props: HandleBarProps) => {
  const { type, position } = props;
  return <div className={`handlebar ${position}`}></div>;
};
