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

        <ViewButton
          containedString={"View Calendar"}
          stateString={"calendar"}
        />
        <ViewButton
          containedString={"List Of Events"}
          stateString={"list-of-events"}
        />
        <ViewButton containedString={"Add Event"} stateString={"add-event"} />
        <ViewButton containedString={"Edit Lists"} stateString={"edit-lists"} />
        <ViewButton
          containedString={"Clash Checker"}
          stateString={"clash-checker"}
        />
      </div>
    </>
  );
}
