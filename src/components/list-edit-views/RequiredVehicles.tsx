import { type JSX, useState, useEffect } from "react";
import type { requirement } from "../../lib/types.ts";
import EditingViewButton from "../buttons/EditingViewButton";
// import FormInput from "../form-elements/FormInput.tsx";
// import { useAppDispatch } from "../../app/hooks.ts";
// import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import ConfirmationModal from "./ConfirmationModal.tsx";
import "./AddForm.css";
import { Icons } from "../Icons.tsx";
import Spinner from "../Spinner.tsx";

export default function RequiredVehicles(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [requirementState, setRequirementState] = useState<requirement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  // const dispatch = useAppDispatch();

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/vehicle/delete-requirement",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      },
    );
    if (response.ok) {
      setRequirementState((prev) =>
        prev.filter((r) => r.required_vehicle_id !== id),
      );
    }
  }

  useEffect(() => {
    async function fetchRequiredVehicles() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/vehicle/get-required-vehicles",
        );
        const data: requirement[] = await response.json();
        // console.log(data);
        setRequirementState(data);
      } finally {
        setLoading(false);
      }
    }
    fetchRequiredVehicles();
  }, []);

  return (
    <div className="list-container">
      <h1>Vehicle Requirements</h1>
      <div className="button-container-small">
        <EditingViewButton
          icon={Icons.back}
          containedString={"Back"}
          stateString={"vehicles"}
        />
        <EditingViewButton
          icon={Icons.add}
          containedString={"Add a new requirement"}
          stateString={"add-required-vehicle"}
        />
      </div>

      {loading ? (
        <Spinner />
      ) : (
        requirementState.map((r) => {
          return (
            <div className="list-event-section">
              <p className="requirement">{`Shop "${r.shop_name}" requires vehicle "${r.vehicle_name}"`}</p>

              <button
                onClick={() => {
                  setPendingDeleteId(r.required_vehicle_id);
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
          message="Are you sure you want to permanently delete this requirement?"
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
  );
}
