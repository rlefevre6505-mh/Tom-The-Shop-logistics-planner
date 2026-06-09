import { type JSX, useState, useEffect } from "react";
import type { Event } from "../../lib/types";
import { toUKdate } from "../../lib/functions";
import ConfirmationModal from "./ConfirmationModal";
import "./Lists.css";
import { Icons } from "../Icons";
import Spinner from "../Spinner";

export default function EditEventList(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [eventsState, setEventsState] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/event/all-event-details",
        );
        const data: Event[] = await response.json();
        setEventsState(data);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/event/delete-event",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );
    if (response.ok) {
      setEventsState((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <>
      <div className="list-container">
        <h1>Delete Events From List</h1>
        {loading ? (
          <Spinner />
        ) : (
          eventsState.map((e, i) => {
            return (
              <div key={`event-div${i}`} className="list-event-section">
                <div className="event-text">
                  <p>{`${e.title} at ${e.location}`}</p>
                  <p>{`${toUKdate(e.start)} to ${toUKdate(e.end)}`}</p>
                </div>
                <button
                  onClick={() => {
                    setPendingDeleteId(e.id);
                    setShowModal(true);
                  }}
                >
                  {Icons.delete}Delete
                </button>
              </div>
            );
          })
        )}

        {showModal && pendingDeleteId !== null && (
          <ConfirmationModal
            message="Are you sure you want to permanently delete this event?"
            onConfirm={async () => {
              await handleDelete(pendingDeleteId);
              setShowModal(false);
              setPendingDeleteId(null);
            }}
            onCancel={() => {
              setShowModal(false);
              setPendingDeleteId(null);
            }}
          />
        )}
      </div>
    </>
  );
}
