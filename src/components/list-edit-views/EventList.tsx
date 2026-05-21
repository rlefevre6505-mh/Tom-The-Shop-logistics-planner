import { type JSX, useState, useEffect } from "react";
import type { Event } from "../../lib/types";
import { toUKdate } from "../../lib/functions";
import ConfirmationModal from "./ConfirmationModal";

export default function EditEventList(): JSX.Element {
  const [eventsState, setEventsState] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/all-event-details",
      );
      const data: Event[] = await response.json();
      setEventsState(data);
      console.log(data);
    }
    fetchData();
  }, []);

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-event",
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
      <h1>Delete Events From List</h1>
      {eventsState.map((e) => {
        return (
          <div>
            <p>{`${e.title} at ${e.location}`}</p>
            <p>{`${toUKdate(e.start)} to ${toUKdate(e.end)}`}</p>
            <button
              onClick={() => {
                setPendingDeleteId(e.id);
                setShowModal(true);
              }}
            >
              Delete
            </button>
          </div>
        );
      })}

      {showModal && pendingDeleteId !== null && (
        <ConfirmationModal
          message="Are you sure you want to permanently delete this shop?"
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
    </>
  );
}
