import { type JSX, useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import type { EquipmentList, EquipmentListItem } from "../../lib/types";
import EditingViewButton from "../buttons/EditingViewButton";
import "./Lists.css";
import { Icons } from "../Icons";

export default function EditEquipmentList(): JSX.Element {
  const [equipmentListsState, setEquipmentListsState] = useState<
    EquipmentList[]
  >([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    equipment_name: "",
    required_amount: 0,
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    shop_id: number;
    equipment_id: number;
  } | null>(null);

  useEffect(() => {
    async function fetchEquipmentLists() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-equipment-lists",
      );
      const data = await response.json();
      setEquipmentListsState(data);
    }
    fetchEquipmentLists();
  }, []);

  function startEditing(item: EquipmentListItem) {
    setEditingId(item.equipment_list_id);
    setEditValues({
      equipment_name: item.equipment_name,
      required_amount: item.required_amount,
    });
  }

  function cancelEditing() {
    setEditingId(null);
  }

  function handleEditChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: name === "required_amount" ? Number(value) : value,
    }));
  }

  async function saveEdit(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/update-equipment-list-item",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues }),
      },
    );
    if (response.ok) {
      setEquipmentListsState((prev) =>
        prev.map((shop) => ({
          ...shop,
          equipment: shop.equipment.map((item) =>
            item.equipment_list_id === id ? { ...item, ...editValues } : item,
          ),
        })),
      );
      setEditingId(null);
    }
  }

  async function handleDelete(shop_id: number, equipment_id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-equipment-list-item",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop_id, equipment_id }),
      },
    );
    if (response.ok) {
      setEquipmentListsState((prev) =>
        prev.map((shop) =>
          shop.shop_id === shop_id
            ? {
                ...shop,
                equipment: shop.equipment.filter(
                  (item) => item.equipment_id !== equipment_id,
                ),
              }
            : shop,
        ),
      );
    }
  }

  return (
    <>
      <div className="list-container">
        <h1>Edit Equipment Lists</h1>
        <EditingViewButton
          icon={Icons.add}
          containedString="Add an item to an equipment list"
          stateString="add-to-equipment-list"
        />
        {equipmentListsState.map((shop) => (
          <div className="list-container" key={shop.shop_id}>
            <h2>{shop.shop_name}</h2>
            {shop.equipment.map((item) => (
              <div key={item.equipment_list_id}>
                {editingId === item.equipment_list_id ? (
                  <>
                    <div className="list-block">
                      <div className="list-input-section">
                        <p>{item.equipment_name}</p>
                        <input
                          className="num-input"
                          type="number"
                          name="required_amount"
                          value={editValues.required_amount}
                          onChange={handleEditChange}
                        />
                      </div>
                      <div className="save-button-section">
                        <button
                          onClick={() => saveEdit(item.equipment_list_id)}
                        >
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
                        <p>{item.equipment_name}</p>
                        <div className="gap" />
                        <p className="required-amount">
                          {item.required_amount}
                        </p>
                      </div>

                      <button onClick={() => startEditing(item)}>
                        {Icons.edit}Edit
                      </button>
                      <button
                        onClick={() => {
                          setPendingDelete({
                            shop_id: shop.shop_id,
                            equipment_id: item.equipment_id,
                          });
                          setShowModal(true);
                        }}
                      >
                        {Icons.delete}Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
        {showModal && pendingDelete && (
          <ConfirmationModal
            message="Are you sure you want to permanently delete this equipment requirement?"
            onConfirm={async () => {
              await handleDelete(
                pendingDelete.shop_id,
                pendingDelete.equipment_id,
              );
              setShowModal(false);
              setPendingDelete(null);
            }}
            onCancel={() => {
              setShowModal(false);
              setPendingDelete(null);
            }}
          />
        )}
      </div>
    </>
  );
}
