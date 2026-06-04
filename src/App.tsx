import "./App.css";
import { type JSX, useState } from "react";
import Menu from "./components/Menu.js";
import CalendarView from "./views/CalendarView.tsx";
import AddEventView from "./views/AddEventView.tsx";
import EditEventView from "./views/EditEventView.tsx";
import EditListsView from "./views/EditListsView.tsx";
import EventView from "./views/EventView.tsx";
import AddNotesView from "./views/AddNotesView.tsx";
import ClashCheckerView from "./views/ClashCheckerView.tsx";
import { useAppSelector } from "./app/hooks.ts";
import ListOfEvents from "./views/ListOfEventsView.tsx";
import AddInventoryItem from "./components/list-edit-views/AddInventoryItem.tsx";
import Logo from "./components/Logo.tsx";
import { Icons } from "./components/Icons.tsx";

export default function App(): JSX.Element {
  const view = useAppSelector((state) => state.view.value);
  const [menuClass, setMenuClass] = useState<string>("menu-hidden");

  return (
    <>
      <div className="main">
        {window.innerWidth < 800 ? (
          <header className="header">
            {" "}
            <Logo />{" "}
            <button
              onClick={() => {
                setMenuClass("menu");
              }}
            >
              {Icons.menu}Menu
            </button>{" "}
          </header>
        ) : null}
        <Menu menuClass={menuClass} setMenuClass={setMenuClass} />
        <div className="view-div">
          {view === "calendar" && <CalendarView />}
          {view === "list-of-events" && <ListOfEvents />}
          {view === "add-event" && <AddEventView />}
          {view === "edit-event" && <EditEventView />}
          {view === "edit-lists" && <EditListsView />}
          {view === "event-view" && <EventView />}
          {view === "add-note" && <AddNotesView />}
          {view === "clash-checker" && <ClashCheckerView />}
          {view === "add-inventory-item" && <AddInventoryItem />}
        </div>
      </div>
    </>
  );
}
