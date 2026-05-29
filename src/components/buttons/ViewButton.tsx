import type { JSX } from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeView } from "../../features/view/viewSlice.ts";

type viewButtonProps = {
  containedString: string;
  stateString: string;
  setMenuClass: React.Dispatch<React.SetStateAction<string>>;
};

export default function ViewButton({
  containedString,
  stateString,
  setMenuClass,
}: viewButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      className="view-button"
      onClick={() => {
        dispatch(changeView(stateString));
        setMenuClass("menu-hidden");
      }}
    >
      {containedString}
    </button>
  );
}
