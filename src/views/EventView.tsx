import type { JSX } from "react";
import { useEffect } from "react";
import { useAppSelector } from "../app/hooks.ts";

export default function EventView(): JSX.Element {
  const SelectedEvent = useAppSelector((state) => state.selectedEvent.value);

  // fetch request for events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/selected-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: SelectedEvent }),
        },
      );

      const data = await response.json();
      console.log("Event data:", data);
    }

    if (SelectedEvent) {
      fetchData();
    }
  }, [SelectedEvent]);

  return (
    <>
      <h1>Event View</h1>
      <h2>Event ID: {SelectedEvent}</h2>
    </>
  );
}
