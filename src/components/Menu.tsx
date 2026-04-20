import type { JSX } from "react";
import Button from "./Button";
import Header from "./Header.js";

export default function Menu(): JSX.Element {
  return (
    <>
      <div className="menu">
        <Header />
        <Button containedString={"View Calendar"} stateString={"calendar"} />
        <Button containedString={"Add Event"} stateString={"add-event"} />
        <Button containedString={"Edit Event"} stateString={"edit-event"} />
        <Button containedString={"Edit Lists"} stateString={"edit-lists"} />
      </div>
    </>
  );
}
