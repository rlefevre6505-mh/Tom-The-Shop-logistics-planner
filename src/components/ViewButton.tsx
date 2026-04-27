import type { JSX } from "react";
import { useAppDispatch } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice.ts";

type viewButtonProps = {
  containedString: string;
  stateString: string;
};

export default function ViewButton({
  containedString,
  stateString,
}: viewButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(changeView(stateString))}>
      {containedString}
    </button>
  );
}
