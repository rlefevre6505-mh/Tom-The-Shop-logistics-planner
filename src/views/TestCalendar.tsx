import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import listPlugin from "@fullcalendar/list";

export default function TestCalendar() {
  // TODO: fetch event data and set as variable "events"
  // TODO: set " events={events} " in FullCalendar props

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
    />
  );
}
