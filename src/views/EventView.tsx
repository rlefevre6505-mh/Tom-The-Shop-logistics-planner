import type { JSX } from "react";
import { useAppSelector } from "../app/hooks.ts";

export default function EventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);
  console.log("EventDetails in Redux:", EventDetails);
  return (
    <>
      <h1>Event: {EventDetails?.title}</h1>
      <p>Event added on {EventDetails?.date_added.toString()}</p>
      <p>
        Start: {EventDetails?.start.toLocaleString()} ~ End:{" "}
        {EventDetails?.end.toLocaleString()}
      </p>
      {EventDetails?.location && <p>Location: {EventDetails?.location}</p>}
      <h2>Shops Required: {EventDetails?.num_of_shops}</h2>
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
          <p className="warning">Number of shops does not match requirement!</p>
        )}
      </ul>
      <h2>Vehicles Required: {EventDetails?.num_of_vehicles}</h2>{" "}
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
    </>
  );
}
