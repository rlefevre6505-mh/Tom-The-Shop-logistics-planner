import { type JSX, useState, useEffect } from "react";
import type { requirement } from "../../lib/types.ts";
import EditingViewButton from "../buttons/EditingViewButton";
// import FormInput from "../form-elements/FormInput.tsx";
// import { useAppDispatch } from "../../app/hooks.ts";
// import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import ConfirmationModal from "./ConfirmationModal.tsx";
import "./AddForm.css";

export default function RequiredVehicles(): JSX.Element {
  const [requirementState, setRequirementState] = useState<requirement[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  // const dispatch = useAppDispatch();

  async function handleDelete(id: number) {
    const response = await fetch(
      "https://tom-the-shop-server.onrender.com/delete-requirement",
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
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-required-vehicles",
      );
      const data: requirement[] = await response.json();
      console.log(data);
      setRequirementState(data);
    }
    fetchRequiredVehicles();
  }, []);

  return (
    <div>
      <EditingViewButton
        containedString={"Add a new requirement"}
        stateString={"add-required-vehicle"}
      />
      <EditingViewButton containedString={"Back"} stateString={"vehicles"} />
      <h1>Vehicle Requirements</h1>
      {requirementState.map((r) => {
        return (
          <div className="list-event-section">
            <p className="requirement">{`Shop "${r.shop_name}" requires vehicle "${r.vehicle_name}"`}</p>

            <button
              onClick={() => {
                setPendingDeleteId(r.required_vehicle_id);
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
