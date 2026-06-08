import type { JSX } from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeView } from "../../features/view/viewSlice.ts";

type viewButtonProps = {
  containedString: string;
  stateString: string;
  setMenuClass?: React.Dispatch<React.SetStateAction<string>>;
  icon: JSX.Element;
};

export default function ViewButton({
  containedString,
  stateString,
  setMenuClass,
  icon,
}: viewButtonProps): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <button
      className="view-button"
      onClick={() => {
        dispatch(changeView(stateString));
        setMenuClass?.("menu-hidden");
      }}
    >
      {icon}
      <p className="contained-string">{containedString}</p>
    </button>
  );
}
