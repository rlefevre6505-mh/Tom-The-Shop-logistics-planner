import { type JSX } from "react";
import ViewButton from "./buttons/ViewButton.js";
import Logo from "./Logo.js";

type MenuProps = {
  menuClass: string;
  setMenuClass: React.Dispatch<React.SetStateAction<string>>;
};

export default function Menu({
  menuClass,
  setMenuClass,
}: MenuProps): JSX.Element {
  // const [menuClass, setMenuClass] = useState<string>("menu");

  return (
    <>
      <div className={menuClass}>
        {window.innerWidth >= 800 ? <Logo /> : null}

        {window.innerWidth < 800 ? <h3>Menu</h3> : null}

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
        <ViewButton
          containedString={"Clash Checker"}
          stateString={"clash-checker"}
          setMenuClass={setMenuClass}
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
