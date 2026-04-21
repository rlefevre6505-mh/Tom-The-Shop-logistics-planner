import type { JSX } from "react";
import { useAppSelector } from "../app/hooks.ts";

export default function EventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);

  return (
    <>
      <h1>Event View</h1>
      <p>
        {EventDetails?.title}: {EventDetails?.start} - {EventDetails?.end}
      </p>
      <p>{EventDetails?.date_added}</p>
      {EventDetails?.location && (
        <p>Event location: {EventDetails?.location}</p>
      )}
    </>
  );
}
