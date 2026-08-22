import type { JSX } from "react";
import type { Overlap, Event, shop, vehicle } from "../lib/types";
import { toUKdate } from "../lib/functions";
import "./Warnings.css";

type EventClashProps = {
  e1: Overlap;
  e2: Event;
  sharedShops: shop[];
  sharedVehicles: vehicle[];
};

export default function EventClash({
  e1,
  e2,
  sharedShops,
  sharedVehicles,
}: EventClashProps): JSX.Element {
  return (
    <div key={`pair-${e1.event.id}-${e2.id}`} className="clash-block">
      <p className="clash-title">
        {e1.event.title} overlaps {e2.title} from
      </p>
      <p className="clash-title">
        {toUKdate(e2.start)} to {toUKdate(e1.event.end)}.
      </p>

      {sharedShops.length > 0 && (
        <div className="clash-flex">
          <p className="clash-heading">Shared Shops</p>
          <div className="clash-list">
            {sharedShops.map((shop) => (
              <p key={shop.id} className="warning">
                {shop.shop_name} is allocated to both events.
              </p>
            ))}
          </div>
        </div>
      )}

      {sharedVehicles.length > 0 && (
        <div className="clash-flex">
          <p className="clash-heading">Shared Vehicles</p>
          {sharedVehicles.map((vehicle) => (
            <p key={vehicle.id} className="warning">
              {vehicle.vehicle_name} is allocated to both events.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
