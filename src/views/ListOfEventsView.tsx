import { useEffect, useState, type JSX } from "react";
import type { Event } from "../lib/types";
import "./ListOfEventsView.css";
import { toUKdate } from "../lib/functions";
import { useAppDispatch } from "../app/hooks.ts";
import { changeSelectedEvent } from "../features/selectedEvent/SelectedEventSlice.ts";
import { changeView } from "../features/view/viewSlice.ts";
import { changeEventDetails } from "../features/eventDetails/EventDetailsSlice.ts";
import Spinner from "../components/Spinner.tsx";

export default function ListOfEvents(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [sortOrder, setSortOrder] = useState<"start" | "name">("start");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/event/all-event-details",
        );
        const data: Event[] = await response.json();
        setEventsList(data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function fetchSelectedEvent(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/event/selected-event",
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
    <>
      <h1>Current & Upcoming Events</h1>
      <div className="options">
        <div>
          <label htmlFor="event-sort-order">Order by</label>
          <select
            id="event-sort-order"
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as "start" | "name")
            }
          >
            <option value="start">Start date</option>
            <option value="name">Event name</option>
          </select>
        </div>

        <div className="event-date-filter">
          <label>
            From
            <input
              className="date-picker"
              type="date"
              value={dateFrom}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </label>
          <label>
            To
            <input
              className="date-picker"
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </label>
        </div>
      </div>
      {loading ? (
        <Spinner />
      ) : (
        eventsList
          .filter((e) => {
            const endDate = new Date(e.end);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 2);
            const eventStart = new Date(e.start);
            const fromDate = dateFrom
              ? new Date(`${dateFrom}T00:00:00`)
              : undefined;
            const toDate = dateTo
              ? new Date(`${dateTo}T23:59:59.999`)
              : undefined;

            return (
              endDate >= yesterday &&
              (!fromDate || eventStart >= fromDate) &&
              (!toDate || eventStart <= toDate)
            );
          })
          .sort((firstEvent, secondEvent) => {
            if (sortOrder === "name") {
              return firstEvent.title.localeCompare(
                secondEvent.title,
                undefined,
                {
                  sensitivity: "base",
                },
              );
            }

            return (
              new Date(firstEvent.start).getTime() -
              new Date(secondEvent.start).getTime()
            );
          })
          .map((e, i) => {
            return (
              <div
                className="event-div"
                key={`event${i}`}
                onClick={async () => {
                  dispatch(changeSelectedEvent(e.id));
                  await fetchSelectedEvent(e.id);
                  dispatch(changeView("event-view"));
                }}
              >
                <p>{`${e.title} at ${e.location}`}</p>
                <p>{`${toUKdate(e.start)} to ${toUKdate(e.end)}`}</p>
              </div>
            );
          })
      )}
    </>
  );
}
