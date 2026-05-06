import { useEffect, useState, type JSX } from "react";
import type { eventDetailsObject } from "../lib/types";
import EventClash from "../components/EventClash";
// import { useAppSelector } from "../app/hooks.ts";
// import "./AddEvent.css";

export default function ClashCheckerView(): JSX.Element {
  type eventsArray = eventDetailsObject[];
  const [allEvents, setAllEvents] = useState<eventsArray>([]);

  //   const EventDetails = useAppSelector((state) => state.EventDetails.value);

  // fetch all events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/all-event-details",
      );
      const data = await response.json();
      setAllEvents(data);
      console.log(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Clashes</h1>

      {allEvents.map(() => {
        return;
        <>
          <EventClash></EventClash>
        </>;
      })}
    </>
  );
}
