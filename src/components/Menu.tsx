import { type JSX } from "react";
import ViewButton from "./buttons/ViewButton.js";
import Logo from "./Logo.js";
import { useAppSelector } from "../app/hooks";
import {
  // selectHasClashes,
  selectClashCount,
} from "../features/ClashChecker/ClashCheckerSlice";
import { useAppDispatch } from "../app/hooks";
import { changeView } from "../features/view/viewSlice.js";
import { Icons } from "./Icons.js";

type MenuProps = {
  menuClass: string;
  setMenuClass: React.Dispatch<React.SetStateAction<string>>;
};

export default function Menu({
  menuClass,
  setMenuClass,
}: MenuProps): JSX.Element {
  const dispatch = useAppDispatch();
  // const hasClashes = useAppSelector(selectHasClashes);
  const clashCount = useAppSelector(selectClashCount);

  return (
    <>
      <div className={menuClass}>
        {window.innerWidth >= 800 ? <Logo /> : null}
        {/* {window.innerWidth < 800 ? <h1>Menu</h1> : null} */}
        {clashCount !== 0 && (
          <button
            className={clashCount > 0 ? "view-button-red" : "view-button"}
            onClick={() => {
              dispatch(changeView("clash-checker"));
              setMenuClass("menu-hidden");
            }}
          >
            {Icons.warning}Warnings ({clashCount})
          </button>
        )}
        <ViewButton
          containedString={"View Calendar"}
          stateString={"calendar"}
          setMenuClass={setMenuClass}
          icon={Icons.calendar}
        ></ViewButton>
        <ViewButton
          containedString={"List Of Events"}
          stateString={"list-of-events"}
          setMenuClass={setMenuClass}
          icon={Icons.events}
        />
        <ViewButton
          containedString={"Add Event"}
          stateString={"add-event"}
          setMenuClass={setMenuClass}
          icon={Icons.add}
        />
        <ViewButton
          containedString={"Edit Database"}
          stateString={"edit-lists"}
          setMenuClass={setMenuClass}
          icon={Icons.edit}
        />
        <ViewButton
          containedString={"Help"}
          stateString={"help"}
          setMenuClass={setMenuClass}
          icon={Icons.help}
        />
        {window.innerWidth < 800 ? (
          <button
            onClick={() => {
              setMenuClass("menu-hidden");
            }}
            className="close-button"
          >
            close
          </button>
        ) : null}
      </div>
    </>
  );
}
