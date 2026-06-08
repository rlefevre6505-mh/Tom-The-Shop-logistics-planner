import { useEffect, useState, type JSX } from "react";
import { useAppSelector } from "../app/hooks.ts";
import type { requirement } from "../lib/types.ts";
import ViewButton from "../components/buttons/ViewButton.tsx";
import Note from "../components/Note.tsx";
import Spinner from "../components/Spinner.tsx";
import { Icons } from "../components/Icons.tsx";
import "./EventView.css";

export default function EventView(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const EventDetails = useAppSelector((state) => state.EventDetails.value);
  const [requirementState, setRequirementState] = useState<requirement[]>([]);

  useEffect(() => {
    // console.log(EventDetails);
  });

  useEffect(() => {
    async function fetchRequiredVehicles() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/get-required-vehicles",
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

  // Find requirements where the shop is assigned but the vehicle is not
  const unmetRequirements = requirementState.filter((req) => {
    const shopAssigned = EventDetails?.shops?.some(
      (shop) => shop.id === req.shop_id,
    );
    if (!shopAssigned) return false;
    const vehicleAssigned = EventDetails?.vehicles?.some(
      (v) => v.id === req.vehicle_id,
    );
    return !vehicleAssigned;
  });

  if (loading) return <Spinner />;

  return (
    <div className="event-container">
      <div>
        <h1>Event: {EventDetails?.title}</h1>
        <p>Event added on {EventDetails?.date_added.toString()}</p>
        <p>
          Start: {EventDetails?.start.toLocaleString()} ~ End:{" "}
          {EventDetails?.end.toLocaleString()}
        </p>
        {EventDetails?.location && <p>Location: {EventDetails?.location}</p>}
        <h3>Shops Required: {EventDetails?.num_of_shops}</h3>
        <p>Currently Allocated:</p>
        <ul>
          {EventDetails?.shops?.length !== 0 ? (
            EventDetails?.shops?.map((s, i) => {
              return <li key={`shop${i}`}>{s.shop_name}</li>;
            })
          ) : (
            <p>NONE</p>
          )}
          {EventDetails?.shops?.length !== EventDetails?.num_of_shops && (
            <p className="warning">
              Number of shops does not match requirement!
            </p>
          )}
        </ul>
        <h3>Vehicles Required: {EventDetails?.num_of_vehicles}</h3>{" "}
        <p>Currently Allocated:</p>
        <ul>
          {EventDetails?.vehicles?.length !== 0 ? (
            EventDetails?.vehicles?.map((v, i) => {
              return <li key={`vehicle${i}`}>{v.vehicle_name}</li>;
            })
          ) : (
            <p>NONE</p>
          )}
          {EventDetails?.vehicles?.length !== EventDetails?.num_of_vehicles && (
            <p className="warning">
              Number of vehicles does not match requirement!
            </p>
          )}
        </ul>
        {unmetRequirements.length > 0 && (
          <div className="warning-section">
            {unmetRequirements.map((req, i) => (
              <p key={`unmet-req-${i}`} className="warning">
                Shop "{req.shop_name}"" requires vehicle "{req.vehicle_name}",
                but it is not yet assigned to this event.
              </p>
            ))}
          </div>
        )}
        <ViewButton
          containedString={"Edit Event"}
          stateString={"edit-event"}
          icon={Icons.edit}
        />
      </div>
      <div className="notes-section">
        {EventDetails?.notes && <h3>Notes</h3>}
        <div className="notes-container">
          {EventDetails?.notes &&
            EventDetails?.notes?.map((n, i) => {
              return <Note key={`note${i}`} text={n.note} i={i} />;
            })}
        </div>
        <ViewButton
          containedString={"Add A Note"}
          stateString={"add-note"}
          icon={Icons.add}
        />
      </div>
    </div>
  );
}
