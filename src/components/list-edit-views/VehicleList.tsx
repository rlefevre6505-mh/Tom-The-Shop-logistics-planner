import { type JSX, useState, useEffect } from "react";
import type { vehicle } from "../../lib/types";
import ConfirmationModal from "./ConfirmationModal";
import EditingViewButton from "../buttons/EditingViewButton";
import { handleEditChangeFactory } from "../../lib/functions";
import "./Lists.css";
import { Icons } from "../Icons";
import Spinner from "../Spinner";

export default function EditVehicleList(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
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
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/get-vehicles",
        );
        const data: vehicle[] = await response.json();
        setVehicleState(data);
      } finally {
        setLoading(false);
      }
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
      "https://tom-the-shop-server-7h2n.onrender.com/update-vehicle",
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
      "https://tom-the-shop-server-7h2n.onrender.com/delete-vehicle",
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
      <div className="list-container">
        <h1>Edit List Of Vehicles</h1>
        <div className="button-container-small">
          <EditingViewButton
            icon={Icons.add}
            containedString="Add a new vehicle"
            stateString="add-vehicle"
          />
          <EditingViewButton
            icon={Icons.inspect}
            containedString={"View required vehicles"}
            stateString={"required-vehicles"}
          />
        </div>
        {loading ? (
          <Spinner />
        ) : (
          vehicleState.map((v) => (
            <div key={v.id}>
              {editingId === v.id ? (
                <>
                  <div className="list-block">
                    <div className="list-input-section">
                      <input
                        className="text-input"
                        type="text"
                        name="vehicle_name"
                        value={editValues.vehicle_name}
                        onChange={handleEditChange}
                      />
                      <input
                        className="num-input"
                        type="text"
                        name="vehicle_reg"
                        value={editValues.vehicle_reg}
                        onChange={handleEditChange}
                      />
                    </div>
                    <div className="save-button-section">
                      <button onClick={() => saveEdit(v.id)}>
                        {Icons.tick}Save
                      </button>
                      <button onClick={cancelEditing}>
                        {Icons.cancel}Cancel
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="list-button-section">
                    <div className="list-text-section">
                      <p>{v.vehicle_name}</p>
                      {/* <p>{v.vehicle_reg}</p> */}
                    </div>
                    <button onClick={() => startEditing(v)}>
                      {" "}
                      {Icons.edit} Edit
                    </button>
                    <button
                      onClick={() => {
                        setPendingDeleteId(v.id);
                        setShowModal(true);
                      }}
                    >
                      {Icons.delete}
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

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
    </>
  );
}
