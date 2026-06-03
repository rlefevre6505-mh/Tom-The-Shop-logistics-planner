import { useEffect, type JSX } from "react";
import type { Event } from "../lib/types";
import { toUKdate } from "../lib/functions";
import "./ClashChecker.css";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchClashData,
  selectEvents,
  selectRequiredVehicles,
  selectOverlaps,
  selectEquipmentLists,
  selectInventory,
  getSharedShops,
  getSharedVehicles,
  getGroupEquipmentShortages,
  getEventAllocationWarnings,
} from "../features/ClashChecker/ClashCheckerSlice";

export default function ClashCheckerView(): JSX.Element {
  const dispatch = useAppDispatch();
  const events = useAppSelector(selectEvents);
  const overlaps = useAppSelector(selectOverlaps);
  const equipmentLists = useAppSelector(selectEquipmentLists);
  const inventory = useAppSelector(selectInventory);
  const requiredVehicles = useAppSelector(selectRequiredVehicles);

  useEffect(() => {
    void dispatch(fetchClashData());
  }, [dispatch]);

  const getEventWarnings = (event: Event) =>
    getEventAllocationWarnings(event, requiredVehicles);

  const eventsWithWarnings = events
    .map((event) => ({
      event,
      warnings: getEventWarnings(event),
    }))
    .filter(({ warnings }) => warnings.length > 0);

  return (
    <div className="clash-view">
      <div>
        <h3>Clashes (ordered by Start Date of first event)</h3>

        {overlaps.map((e1) => {
          const groupEvents = [e1.event, ...e1.overlapsWith];
          const groupShortages = getGroupEquipmentShortages(
            groupEvents,
            equipmentLists,
            inventory,
          );

          return (
            <div className="clash" key={`overlap${e1.event.id}`}>
              {e1.overlapsWith.map((e2: Event) => {
                const sharedShops = getSharedShops(e1.event, e2);
                const sharedVehicles = getSharedVehicles(e1.event, e2);

                return (
                  <div
                    key={`pair-${e1.event.id}-${e2.id}`}
                    className="clash-block"
                  >
                    <p className="clash-title">
                      {e1.event.title} overlaps {e2.title} from
                    </p>
                    <p className="clash-title">
                      {toUKdate(e2.start)} to {toUKdate(e1.event.end)}.
                    </p>

                    {sharedShops.length > 0 && (
                      <div className="clash-section shops">
                        <h4>Shared Shops</h4>
                        {sharedShops.map((shop) => (
                          <p key={shop.id} className="warning">
                            {shop.shop_name} is allocated to both events.
                          </p>
                        ))}
                      </div>
                    )}

                    {sharedVehicles.length > 0 && (
                      <div className="clash-section vehicles">
                        <h4>Shared Vehicles</h4>
                        {sharedVehicles.map((vehicle) => (
                          <p key={vehicle.id} className="warning">
                            {vehicle.vehicle_name} is allocated to both events.
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {groupShortages.length > 0 && (
                <div className="clash-block">
                  <div className="clash-section equipment">
                    <h4>Equipment Shortages (Combined)</h4>
                    {groupShortages.map((s) => (
                      <p key={s.equipment_name} className="warning">
                        {s.equipment_name}: required {s.required}, available{" "}
                        {s.available}, short by {s.shortage}.
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div>
        <h3>Allocation Warnings</h3>
        {eventsWithWarnings.map(({ event, warnings }) => (
          <div className="allocation-warning" key={`validation-${event.id}`}>
            <div className="clash-section validation">
              {warnings.map((warning, i) => (
                <p key={`validation-${event.id}-${i}`} className="warning">
                  {warning}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
