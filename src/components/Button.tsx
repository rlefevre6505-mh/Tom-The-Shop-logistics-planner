import type { JSX } from "react";
import { useAppDispatch } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice.ts";

type buttonProps = {
  containedString: string;
  stateString: string;
};

export default function Button({
  containedString,
  stateString,
}: buttonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(changeView(stateString))}>
      {containedString}
    </button>
  );
}
