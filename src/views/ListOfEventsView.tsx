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
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/all-event-details",
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
      "https://tom-the-shop-server-7h2n.onrender.com/selected-event",
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
      {loading ? (
        <Spinner />
      ) : (
        eventsList
          .filter((e) => {
            const endDate = new Date(e.end);
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 2);
            return endDate >= yesterday;
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
