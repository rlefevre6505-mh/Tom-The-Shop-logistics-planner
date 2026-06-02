import { type JSX } from "react";
import ViewButton from "./buttons/ViewButton.js";
import Logo from "./Logo.js";
import { useAppSelector } from "../app/hooks";
import {
  selectHasClashes,
  selectOverlaps,
} from "../features/ClashChecker/ClashCheckerSlice";
import { useAppDispatch } from "../app/hooks";
import { changeView } from "../features/view/viewSlice.js";

type MenuProps = {
  menuClass: string;
  setMenuClass: React.Dispatch<React.SetStateAction<string>>;
};

export default function Menu({
  menuClass,
  setMenuClass,
}: MenuProps): JSX.Element {
  const dispatch = useAppDispatch();
  const hasClashes = useAppSelector(selectHasClashes);
  const clashCount = useAppSelector(selectOverlaps).length;

  return (
    <>
      <div className={menuClass}>
        {window.innerWidth >= 800 ? <Logo /> : null}

        {window.innerWidth < 800 ? <h1>Menu</h1> : null}

        <ViewButton
          containedString={"View Calendar"}
          stateString={"calendar"}
          setMenuClass={setMenuClass}
        />
        <ViewButton
          containedString={"List Of Events"}
          stateString={"list-of-events"}
          setMenuClass={setMenuClass}
        />
        <ViewButton
          containedString={"Add Event"}
          stateString={"add-event"}
          setMenuClass={setMenuClass}
        />
        <ViewButton
          containedString={"Edit Lists"}
          stateString={"edit-lists"}
          setMenuClass={setMenuClass}
        />
        {/* <ViewButton
          containedString={"Clash Checker"}
          stateString={"clash-checker"}
          setMenuClass={setMenuClass}
        /> */}
        {clashCount !== 0 && (
          <button
            className={hasClashes ? "view-button-red" : "view-button"}
            onClick={() => {
              dispatch(changeView("clash-checker"));
              setMenuClass("menu-hidden");
            }}
          >
            Clashes ({clashCount})
          </button>
        )}

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
