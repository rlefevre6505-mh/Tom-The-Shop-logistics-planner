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

const eventColorClasses = [
  "event-color-1",
  "event-color-2",
  "event-color-3",
  "event-color-4",
  "event-color-5",
  "event-color-6",
  "event-color-7",
  "event-color-8",
];

export default function CalendarView() {
  const [events, setEvents] = useState<calendarEvent[]>([]);
  // const SelectedEvent = useAppSelector((state) => state.selectedEvent.value);
  const dispatch = useAppDispatch();
  const aspect = window.innerWidth < 800 ? 0.65 : 1;

  // fetch request for events
  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/stored-events",
      );
      const data = await response.json();
      const fixedEvents = data.map((event: calendarEvent, index: number) => {
        const end = new Date(String(event.end));
        end.setDate(end.getDate() + 1);
        return {
          ...event,
          end: end.toISOString().slice(0, 10),
          classNames: [eventColorClasses[index % eventColorClasses.length]],
        } as EventInput;
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
          start: "multiMonthYear dayGridMonth listYear",
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
        aspectRatio={aspect}
        eventClick={async (info) => {
          dispatch(changeSelectedEvent(info.event.id));
          await fetchSelectedEvent(parseInt(info.event.id));
          dispatch(changeView("event-view"));
        }}
      />
    </div>
  );
}
