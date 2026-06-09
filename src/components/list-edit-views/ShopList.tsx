import { type JSX, useState, useEffect } from "react";
import type { shop } from "../../lib/types";
import ConfirmationModal from "./ConfirmationModal";
import EditingViewButton from "../buttons/EditingViewButton";
import { handleEditChangeFactory } from "../../lib/functions";
import "./Lists.css";
import { Icons } from "../Icons";
import Spinner from "../Spinner";

export default function EditShopList(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [shopState, setShopState] = useState<shop[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Omit<shop, "id">>({
    shop_name: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const handleEditChange = handleEditChangeFactory(setEditValues);

  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/shop/get-shops",
        );
        const data: shop[] = await response.json();
        setShopState(data);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  function startEditing(item: shop) {
    setEditingId(item.id);
    setEditValues({
      shop_name: item.shop_name,
    });
  }

  function cancelEditing() {
    setEditingId(null);
  }

  async function saveEdit(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/shop/update-shop",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues }),
      },
    );
    if (response.ok) {
      setShopState((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...editValues } : s)),
      );
      setEditingId(null);
    }
  }

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/shop/delete-shop",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );
    if (response.ok) {
      setShopState((prev) => prev.filter((s) => s.id !== id));
    }
  }

  return (
    <>
      <div className="list-container">
        <h1>Edit List Of Shops</h1>
        <EditingViewButton
          icon={Icons.add}
          containedString="Add a new shop"
          stateString="add-shop"
        />
        {loading ? (
          <Spinner />
        ) : (
          shopState.map((s) => (
            <div key={s.id}>
              {editingId === s.id ? (
                <>
                  <div className="list-block">
                    <div className="list-input-section">
                      <input
                        type="text"
                        name="shop_name"
                        value={editValues.shop_name}
                        onChange={handleEditChange}
                      />
                    </div>{" "}
                    <div className="save-button-section">
                      <button onClick={() => saveEdit(s.id)}>
                        {Icons.tick}Save
                      </button>
                      <button onClick={cancelEditing}>
                        {Icons.cancel}Cancel
                      </button>
                    </div>{" "}
                  </div>
                </>
              ) : (
                <>
                  <div className="list-button-section">
                    <div className="list-text-section">
                      <p>{s.shop_name}</p>
                    </div>
                    <button onClick={() => startEditing(s)}>
                      {Icons.edit}Edit
                    </button>
                    <button
                      onClick={() => {
                        setPendingDeleteId(s.id);
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
      </div>
    </>
  );
}
