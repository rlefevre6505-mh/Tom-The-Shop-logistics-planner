import type { JSX } from "react";
import ViewButton from "./buttons/ViewButton.js";
import Logo from "./Logo.js";

export default function Menu(): JSX.Element {
  return (
    <>
      <div className="menu">
        <Logo />
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
