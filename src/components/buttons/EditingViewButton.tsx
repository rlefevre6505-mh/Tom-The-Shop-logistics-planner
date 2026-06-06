import type { JSX } from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";

type editingViewButtonProps = {
  containedString: string;
  stateString: string;
  icon?: JSX.Element;
};

export default function EditingViewButton({
  containedString,
  stateString,
  icon,
}: editingViewButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      className="editing-view-button"
      onClick={() => dispatch(changeEditingView(stateString))}
    >
      {icon}
      {containedString}
    </button>
  );
}
