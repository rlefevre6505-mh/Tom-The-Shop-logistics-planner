import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import { useState, useEffect } from "react";

export default function TestCalendar() {
  const [events, setEvents] = useState([]);

  // fetch request for events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/stored-events",
      );
      const data = await response.json();
      setEvents(data);
    }
    fetchData();
    console.log(events);
  }, []);

  // TODO: add db polling

  // const test_events = [
  //   {
  //     start: "2026-04-24T00:00:00.000Z",
  //     end: "2026-04-26T00:00:00.000Z",
  //     title: "test event 1",
  //   },
  //   {
  //     start: "2026-05-01T00:00:00.000Z",
  //     end: "2026-05-02T00:00:00.000Z",
  //     title: "test event 2",
  //   },
  // ];

  return (
    <FullCalendar
      plugins={[multiMonthPlugin, listPlugin]}
      initialView="multiMonthYear"
      multiMonthMaxColumns={1}
      // height={"90vh"}
      headerToolbar={{
        start: "multiMonthYear listYear",
        center: "title",
        end: "today prev,next",
      }}
      events={events}
      // events={test_events}
    />
  );
}
