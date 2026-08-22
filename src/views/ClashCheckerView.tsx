import { useEffect, type JSX } from "react";
import type { Event } from "../lib/types";
import EventClash from "../components/EventClash";
// import { toUKdate } from "../lib/functions";
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
        {eventsWithWarnings.length > 0 ? (
          <>
            <h3 className="clash-heading">Allocation Warnings</h3>
            {eventsWithWarnings.map(({ event, warnings }) => (
              <div key={`validation-${event.id}`}>
                <div className="clash-section validation">
                  {warnings.map((warning, i) => (
                    <p key={`validation-${event.id}-${i}`} className="warning">
                      {warning}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>

      <div>
        {overlaps.length > 0 ? (
          <>
            <h3 className="clash-heading">Clashes</h3>

            {overlaps
              .filter((e1) => {
                const groupEvents = [e1.event, ...e1.overlapsWith];
                const groupShortages = getGroupEquipmentShortages(
                  groupEvents,
                  equipmentLists,
                  inventory,
                );
                if (groupShortages.length > 0) return true;
                return e1.overlapsWith.some((e2: Event) => {
                  return (
                    getSharedShops(e1.event, e2).length > 0 ||
                    getSharedVehicles(e1.event, e2).length > 0
                  );
                });
              })
              .map((e1) => {
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
                        <EventClash
                          e1={e1}
                          e2={e2}
                          sharedShops={sharedShops}
                          sharedVehicles={sharedVehicles}
                        />
                      );
                    })}

                    {groupShortages.length > 0 && (
                      <div className="clash-block">
                        <div className="clash-section equipment">
                          <h4>Equipment Shortages (Combined)</h4>
                          <div className="equipment-flex">
                            {groupShortages.map((s) => (
                              <p key={s.equipment_name} className="warning">
                                {s.equipment_name}: required {s.required},
                                available {s.available}, short by {s.shortage}.
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </>
        ) : null}
      </div>
    </div>
  );
}
