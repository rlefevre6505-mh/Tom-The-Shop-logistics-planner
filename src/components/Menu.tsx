import type { JSX } from "react";
import Button from "./Button";

export default function Menu(): JSX.Element {
  return (
    <>
      <Button containedString={"View Calendar"} stateString={"calendar"} />
      <Button containedString={"Add Event"} stateString={"add-event"} />
      <Button containedString={"Edit Event"} stateString={"edit-event"} />
      <Button containedString={"Edit Lists"} stateString={"edit-lists"} />
    </>
  );
}
