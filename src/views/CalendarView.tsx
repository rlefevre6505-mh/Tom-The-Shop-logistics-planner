// import type { JSX } from "react";
// import { Calendar } from "@fullcalendar/core";
// import multiMonthPlugin from "@fullcalendar/multimonth";

// export default function CalendarView(): JSX.Element {
//   // const calendar = new Calendar(calendarEl, {
//   //   plugins: [multiMonthPlugin],
//   //   initialView: "multiMonthYear",
//   //   multiMonthMaxColumns: 1, // force a single column
//   // });

//   return (
//     <>
//       <h1>Calendar</h1>
//       {/* {calendar} */}
//     </>
//   );
// }

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // for clicking + dragging
import multiMonthPlugin from "@fullcalendar/multimonth";
import "@fullcalendar/common/main.css";

export default function CalendarView() {
  const events = [
    {
      title: "Meeting",
      start: "2025-04-20T10:00:00",
      end: "2025-04-20T11:00:00",
    },
    {
      title: "Lunch",
      start: "2025-04-21T12:00:00",
    },
  ];

  return (
    <div style={{ padding: "1rem" }}>
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear",
        }}
        events={events}
        height="80vh"
      />
    </div>
  );
}
