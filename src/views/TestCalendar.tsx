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
    // TODO: add events variable to dependancies
  }, []);

  return (
    <FullCalendar
      plugins={[multiMonthPlugin, listPlugin]}
      initialView="multiMonthYear"
      multiMonthMaxColumns={1}
      //   height={"100%"}
      headerToolbar={{
        start: "multiMonthYear listYear",
        center: "title",
        end: "today prev,next",
      }}
      events={events}
    />
  );
}
