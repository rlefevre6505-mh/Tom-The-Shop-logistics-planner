import "./App.css";
import type { JSX } from "react";
import Header from "./components/Header.js";
import Menu from "./components/Menu.js";
// import CalendarView from "./views/CalendarView.tsx";
import AddEventView from "./views/AddEventView.tsx";
import EditEventView from "./views/EditEventView.tsx";
import EditListsView from "./views/EditListsView.tsx";
import { useAppSelector } from "./app/hooks.ts";
import TestCalendar from "./views/TestCalendar.tsx";

export default function App(): JSX.Element {
  const view = useAppSelector((state) => state.view.value);

  return (
    <>
      <Header />
      <Menu />

      <div className="view-div">
        {view === "calendar" && <TestCalendar />}
        {/* {view === "calendar" && <CalendarView />} */}
        {view === "add-event" && <AddEventView />}
        {view === "edit-event" && <EditEventView />}
        {view === "edit-lists" && <EditListsView />}
      </div>
    </>
  );
}
