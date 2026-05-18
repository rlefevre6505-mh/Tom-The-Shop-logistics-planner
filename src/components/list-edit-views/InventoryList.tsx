import { type JSX, useState, useEffect } from "react";
import type { EquipmentItem } from "../../lib/types";
import ConfirmationModal from "./ConfirmationModal";
import ViewButton from "../buttons/ViewButton";
import { handleEditChangeFactory } from "../../lib/functions";

export default function EditEquipmentInventory(): JSX.Element {
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<EquipmentItem, "id">>({
    equipment_name: "",
    current_amount: 0,
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const handleEditChange = handleEditChangeFactory(setEditValues);

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-inventory",
      );
      const data: EquipmentItem[] = await response.json();
      setInventory(data);
    }
    fetchInventory();
  }, []);

  function startEditing(item: EquipmentItem) {
    setEditingId(item.id);
    setEditValues({
      equipment_name: item.equipment_name,
      current_amount: item.current_amount,
    });
  }

  function cancelEditing() {
    setEditingId(null);
  }

  // function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   const { name, value } = e.target;
  //   setEditValues((prev) => ({
  //     ...prev,
  //     [name]: name === "current_amount" ? Number(value) : value,
  //   }));
  // }

  async function saveEdit(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/update-inventory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues }),
      },
    );
    if (response.ok) {
      console.log("response OK");
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...editValues } : item,
        ),
      );
      setEditingId(null);
    }
  }

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-inventory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );
    if (response.ok) {
      console.log("response OK");
      setInventory((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <>
      <h1>Edit Equipment Inventory</h1>
      {inventory.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {editingId === item.id ? (
            <>
              {/* INLINE EDIT FORM */}
              <input
                type="text"
                name="equipment_name"
                value={editValues.equipment_name}
                onChange={handleEditChange}
              />

              <input
                type="number"
                name="current_amount"
                value={editValues.current_amount}
                onChange={handleEditChange}
              />

              <button onClick={() => saveEdit(item.id)}>Save</button>
              <button onClick={cancelEditing}>Cancel</button>
            </>
          ) : (
            <>
              {/* NORMAL VIEW */}
              <p>{item.equipment_name}</p>
              <p>{item.current_amount}</p>

              <button onClick={() => startEditing(item)}>Edit</button>
              <button
                onClick={() => {
                  setPendingDeleteId(item.id);
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
          message={`Are you sure you want to permanently delete this item?`}
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
      <ViewButton
        containedString={`Add a new item`}
        stateString={`add-inventory-item`}
      />
    </>
  );
}
