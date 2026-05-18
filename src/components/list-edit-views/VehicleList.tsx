import { type JSX, useState, useEffect } from "react";
import type { vehicle } from "../../lib/types";
import ConfirmationModal from "./ConfirmationModal";
import EditingViewButton from "../buttons/EditingViewButton";
import { handleEditChangeFactory } from "../../lib/functions";

export default function EditVehicleList(): JSX.Element {
  const [vehicleState, setVehicleState] = useState<vehicle[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<vehicle, "id">>({
    vehicle_name: "",
    vehicle_reg: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const handleEditChange = handleEditChangeFactory(setEditValues);

  useEffect(() => {
    async function fetchVehicles() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-vehicles",
      );
      const data: vehicle[] = await response.json();
      setVehicleState(data);
    }
    fetchVehicles();
  }, []);

  function startEditing(item: vehicle) {
    setEditingId(item.id);
    setEditValues({
      vehicle_name: item.vehicle_name,
      vehicle_reg: item.vehicle_reg,
    });
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/update-vehicle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues }),
      },
    );
    if (response.ok) {
      setVehicleState((prev) =>
        prev.map((v) => (v.id === id ? { ...v, ...editValues } : v)),
      );
      setEditingId(null);
    }
  }

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-vehicle",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );
    if (response.ok) {
      setVehicleState((prev) => prev.filter((v) => v.id !== id));
    }
  }

  return (
    <>
      <h1>Edit List Of Vehicles</h1>
      {vehicleState.map((v) => (
        <div
          key={v.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {editingId === v.id ? (
            <>
              <input
                type="text"
                name="vehicle_name"
                value={editValues.vehicle_name}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="vehicle_reg"
                value={editValues.vehicle_reg}
                onChange={handleEditChange}
              />
              <button onClick={() => saveEdit(v.id)}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              <p>{v.vehicle_name}</p>
              <p>{v.vehicle_reg}</p>
              <button onClick={() => startEditing(v)}>Edit</button>
              <button
                onClick={() => {
                  setPendingDeleteId(v.id);
                  setShowModal(true);
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      {showModal && pendingDeleteId !== null && (
        <ConfirmationModal
          message="Are you sure you want to permanently delete this vehicle?"
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
      <EditingViewButton
        containedString="Add a new vehicle"
        stateString="add-vehicle"
      />
    </>
  );
}
