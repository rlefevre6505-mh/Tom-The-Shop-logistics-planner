import "./App.css";
import type { JSX } from "react";
import Menu from "./components/Menu.js";
import AddEventView from "./views/AddEventView.tsx";
import EditEventView from "./views/EditEventView.tsx";
import EditListsView from "./views/EditListsView.tsx";
import { useAppSelector } from "./app/hooks.ts";
import CalendarView from "./views/CalendarView.tsx";

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
        </div>
      </div>
    </>
  );
}
