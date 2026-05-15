import { type JSX, useState, useEffect } from "react";
import type { Event } from "../../lib/types";
import { toUKdate } from "../../lib/functions";

export default function EditEventList(): JSX.Element {
  const [eventsState, setEventsState] = useState<Event[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/all-event-details",
      );
      const data: Event[] = await response.json();
      setEventsState(data);
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Delete Events From List</h1>
      {eventsState.map((e) => {
        return (
          <div>
            <p>{`${e.title} at ${e.location}`}</p>
            <p>{`${toUKdate(e.start)} to ${toUKdate(e.end)}`}</p>
          </div>
        );
      })}
    </>
  );
}
