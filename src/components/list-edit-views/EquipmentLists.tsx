// export default function EditEquipmentList(): JSX.Element {
//   const [equipmentListsState, setEquipmentListsState] = useState<
//     EquipmentList[]
//   >([]);

//   useEffect(() => {
//     async function fetchEquipmentLists() {
//       const response = await fetch(
//         "https://tom-the-shop-server.onrender.com/get-equipment-lists",
//       );
//       const data: EquipmentList[] = await response.json();
//       setEquipmentListsState(data);
//       console.log(data);
//     }
//     fetchEquipmentLists();
//   }, []);

//   return (
//     <>
//       <h1>Edit Equipment Lists</h1>

//       {equipmentListsState.map((l) => {
//         return (
//           <div>
//             <h3>{l.shop_name}</h3>
//             {l.equipment.map((i) => {
//               return (
//                 <div>
//                   <p>{i.equipment_name}</p>
//                   <p>{i.required_amount}</p>
//                 </div>
//               );
//             })}
//           </div>
//         );
//       })}
//     </>
//   );
// }

import { type JSX, useEffect, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import type { EquipmentList, EquipmentListItem } from "../../lib/types";

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
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

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
      "https://tom-the-shop-server.onrender.com/update-equipment-list",
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

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-equipment-list",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );

    if (response.ok) {
      setEquipmentListsState((prev) =>
        prev.map((shop) => ({
          ...shop,
          equipment: shop.equipment.filter(
            (item) => item.equipment_list_id !== id,
          ),
        })),
      );
    }
  }

  return (
    <>
      <h1>Edit Equipment Lists</h1>

      {equipmentListsState.map((shop) => (
        <div key={shop.shop_id} style={{ marginBottom: "20px" }}>
          <h2>{shop.shop_name}</h2>

          {shop.equipment.map((item) => (
            <div
              key={item.equipment_list_id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              {editingId === item.equipment_list_id ? (
                <>
                  <input
                    type="text"
                    name="equipment_name"
                    value={editValues.equipment_name}
                    onChange={handleEditChange}
                  />

                  <input
                    type="number"
                    name="required_amount"
                    value={editValues.required_amount}
                    onChange={handleEditChange}
                  />

                  <button onClick={() => saveEdit(item.equipment_list_id)}>
                    Save
                  </button>
                  <button onClick={cancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{item.equipment_name}</p>
                  <p>Required: {item.required_amount}</p>

                  <button onClick={() => startEditing(item)}>Edit</button>
                  <button
                    onClick={() => {
                      setPendingDeleteId(item.equipment_list_id);
                      setShowModal(true);
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      {showModal && pendingDeleteId !== null && (
        <ConfirmationModal
          message="Are you sure you want to permanently delete this equipment requirement?"
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
