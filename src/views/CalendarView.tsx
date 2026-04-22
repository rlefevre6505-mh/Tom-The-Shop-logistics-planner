import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice.ts";
import { changeSelectedEvent } from "../features/selectedEvent/SelectedEventSlice.ts";
import { changeEventDetails } from "../features/eventDetails/EventDetailsSlice.ts";

export default function CalendarView() {
  const [events, setEvents] = useState([]);
  const SelectedEvent = useAppSelector((state) => state.selectedEvent.value);
  const dispatch = useAppDispatch();

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
  }, []);

  async function fetchSelectedEvent() {
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
    dispatch(changeEventDetails(data));
    // TODO: add db polling?
  }

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
        //make date cells clickable:
        selectable={true}
        select={() => {
          console.log("date cell clicked");
          // TODO: store clicked date in state (to be used in add-event form)
        }}
        //make events interactable:
        editable={true}
        eventClick={(info) => {
          dispatch(changeSelectedEvent(info.event.id));
          fetchSelectedEvent();
          dispatch(changeView("event-view"));
        }}
      />
    </div>
  );
}
