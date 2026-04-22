import type { JSX } from "react";
import { useAppSelector } from "../app/hooks.ts";

export default function EventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);
  console.log("EventDetails in Redux:", EventDetails);
  return (
    <>
      <h1>Event View</h1>
      <p>Event Title: {EventDetails?.title}</p>
      <p>
        Start: {EventDetails?.start.toLocaleString()} ~ End:{" "}
        {EventDetails?.end.toLocaleString()}
      </p>
      {EventDetails?.location && <p>Location: {EventDetails?.location}</p>}
    </>
  );
}
