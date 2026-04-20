import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  // fetch request for events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/stored-events",
      );
      const data = await response.json();
      setEvents(data);
      console.log(data);
    }
    fetchData();
  }, []);

  // TODO: add db polling?

  return (
    <div className="calendar">
      <FullCalendar
        plugins={[
          multiMonthPlugin,
          listPlugin,
          dayGridPlugin,
          interactionPlugin,
        ]}
        initialView="multiMonthYear"
        multiMonthMaxColumns={1}
        headerToolbar={{
          start: "multiMonthYear listYear",
          center: "title",
          end: "today prev,next",
        }}
        events={events}
        //make date cells clickable
        selectable={true}
        select={() => {
          console.log("date cell clicked");
          // TODO: store clicked date in state (to be used in add-event form)
        }}
        //make events interactable
        editable={true}
        eventClick={() => {
          console.log("event clicked");
          // TODO: store clicked event in state  (to be used in edit-event form)
        }}
      />
    </div>
  );
}
