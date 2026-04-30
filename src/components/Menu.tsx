import type { JSX } from "react";
import ViewButton from "./ViewButton.js";
import Header from "./Header.js";

export default function Menu(): JSX.Element {
  return (
    <>
      <div className="menu">
        <Header />
        <ViewButton
          containedString={"View Calendar"}
          stateString={"calendar"}
        />
        <ViewButton containedString={"Add Event"} stateString={"add-event"} />
        <ViewButton containedString={"Edit Lists"} stateString={"edit-lists"} />
      </div>
    </>
  );
}
