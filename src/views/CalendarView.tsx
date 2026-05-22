import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import type { EventInput } from "@fullcalendar/core";
import type { calendarEvent } from "../lib/types.ts";
import { useAppDispatch } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice.ts";
import { changeSelectedEvent } from "../features/selectedEvent/SelectedEventSlice.ts";
import { changeEventDetails } from "../features/eventDetails/EventDetailsSlice.ts";
import "./CalendarView.css";

export default function CalendarView() {
  const [events, setEvents] = useState<calendarEvent[]>([]);
  // const SelectedEvent = useAppSelector((state) => state.selectedEvent.value);
  const dispatch = useAppDispatch();

  // fetch request for events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/stored-events",
      );
      const data = await response.json();

      // FIX: make end date inclusive for FullCalendar
      const fixedEvents = data.map((event: calendarEvent) => {
        const end = new Date(String(event.end));
        end.setDate(end.getDate() + 1);
        return {
          ...event,
          end: end.toISOString().slice(0, 10),
        };
      });
      setEvents(fixedEvents);
    }
    fetchData();
  }, []);

  async function fetchSelectedEvent(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/selected-event",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      },
    );
    const data = await response.json();
    dispatch(changeEventDetails(data));
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
        multiMonthMaxColumns={2}
        headerToolbar={{
          start: "multiMonthYear listYear",
          center: "title",
          end: "today prev,next",
        }}
        events={events as EventInput[]}
        selectable={false}
        editable={false}
        eventStartEditable={false}
        eventDurationEditable={false}
        droppable={false}
        dateClick={undefined}
        // select={() => {
        //   console.log("date cell clicked");
        //   // TODO: store clicked date in state (to be used in add-event form)
        // }}
        eventClick={async (info) => {
          dispatch(changeSelectedEvent(info.event.id));
          await fetchSelectedEvent(parseInt(info.event.id));
          dispatch(changeView("event-view"));
        }}
      />
    </div>
  );
}
