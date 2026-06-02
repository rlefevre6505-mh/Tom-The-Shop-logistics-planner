import { useEffect, type JSX } from "react";
import { useAppSelector } from "../app/hooks.ts";
import ViewButton from "../components/buttons/ViewButton.tsx";
import Note from "../components/Note.tsx";
import "./EventView.css";

export default function EventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);

  useEffect(() => {
    console.log(EventDetails);
  });

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
        <ViewButton containedString={"Edit Event"} stateString={"edit-event"} />
      </div>
      <div className="notes-section">
        {EventDetails?.notes && <h3>Notes</h3>}
        <div className="notes-container">
          {EventDetails?.notes &&
            EventDetails?.notes?.map((n, i) => {
              return <Note text={n.note} i={i} />;
            })}
        </div>
        <ViewButton containedString={"Add A Note"} stateString={"add-note"} />
      </div>
    </div>
  );
}
