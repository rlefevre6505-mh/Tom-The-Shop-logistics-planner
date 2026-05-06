import "./App.css";
import type { JSX } from "react";
import Menu from "./components/Menu.js";
import CalendarView from "./views/CalendarView.tsx";
import AddEventView from "./views/AddEventView.tsx";
import EditEventView from "./views/EditEventView.tsx";
import EditListsView from "./views/EditListsView.tsx";
import EventView from "./views/EventView.tsx";
import AddNotesView from "./views/AddNotesView.tsx";
import ClashCheckerView from "./views/ClashCheckerView.tsx";
import { useAppSelector } from "./app/hooks.ts";

export default function App(): JSX.Element {
  const view = useAppSelector((state) => state.view.value);

  return (
    <>
      <div className="main">
        <Menu />
        <div className="view-div">
          {view === "calendar" && <CalendarView />}
          {view === "add-event" && <AddEventView />}
          {view === "edit-event" && <EditEventView />}
          {view === "edit-lists" && <EditListsView />}
          {view === "event-view" && <EventView />}
          {view === "add-note" && <AddNotesView />}
          {view === "clash-checker" && <ClashCheckerView />}
        </div>
      </div>
    </>
  );
}
