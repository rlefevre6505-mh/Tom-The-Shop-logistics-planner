import type { JSX } from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";

type editingViewButtonProps = {
  containedString: string;
  stateString: string;
};

export default function EditingViewButton({
  containedString,
  stateString,
}: editingViewButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button onClick={() => dispatch(changeEditingView(stateString))}>
      {containedString}
    </button>
  );
}
