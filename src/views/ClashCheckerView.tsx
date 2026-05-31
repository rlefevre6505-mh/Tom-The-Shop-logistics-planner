import { useEffect, useState, type JSX } from "react";
import type {
  Event,
  shop,
  vehicle,
  EquipmentList,
  EquipmentItem,
  Overlap,
} from "../lib/types";
import { toUKdate } from "../lib/functions";
import "./ClashChecker.css";

export default function ClashCheckerView(): JSX.Element {
  const [overlaps, setOverlaps] = useState<Overlap[]>([]);
  const [equipmentListsState, setEquipmentListsState] = useState<
    EquipmentList[]
  >([]);
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);

  function findOverlappingEvents(events: Event[]): Overlap[] {
    const results: Overlap[] = [];
    for (let i = 0; i < events.length; i++) {
      const a = events[i];
      const overlapsWith: Event[] = [];
      for (let j = i + 1; j < events.length; j++) {
        const b = events[j];
        const overlap =
          new Date(a.start) < new Date(b.end) &&
          new Date(a.end) > new Date(b.start);
        if (overlap) overlapsWith.push(b);
      }
      if (overlapsWith.length > 0) results.push({ event: a, overlapsWith });
    }
    return results;
  }

  // Display only events that end after 2 days ago
  function isCurrent(dateStr: string): boolean {
    const endDate = new Date(dateStr);
    const today = new Date();
    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);
    return endDate >= dayBeforeYesterday;
  }

  function getSharedShops(e1: Event, e2: Event): shop[] {
    return e1.shops.filter((s1) => e2.shops.some((s2) => s2.id === s1.id));
  }
  function getSharedVehicles(e1: Event, e2: Event): vehicle[] {
    return e1.vehicles.filter((v1) =>
      e2.vehicles.some((v2) => v2.id === v1.id),
    );
  }

  // Equipment shortages
  function getEventEquipmentTotals(event: Event) {
    if (!equipmentListsState) return {};
    const totals: Record<number, { name: string; amount: number }> = {};
    event.shops.forEach((shop) => {
      const list = equipmentListsState.find((el) => el.shop_id === shop.id);
      if (!list) return;
      list.equipment.forEach((item) => {
        if (!totals[item.equipment_id]) {
          totals[item.equipment_id] = {
            name: item.equipment_name,
            amount: 0,
          };
        }
        totals[item.equipment_id].amount += item.required_amount;
      });
    });
    return totals;
  }

  // Combined shortages for events in the overlap group
  function getGroupEquipmentShortages(events: Event[]) {
    if (!equipmentListsState) return [];
    const combined: Record<number, { name: string; amount: number }> = {};
    events.forEach((ev) => {
      const totals = getEventEquipmentTotals(ev);
      for (const id in totals) {
        if (!combined[id]) {
          combined[id] = { ...totals[id] };
        } else {
          combined[id].amount += totals[id].amount;
        }
      }
    });

    const shortages = [];
    for (const id in combined) {
      const req = combined[id];
      const inv = inventory.find((i) => i.id === Number(id));
      if (inv && req.amount > inv.current_amount) {
        shortages.push({
          equipment_name: req.name,
          required: req.amount,
          available: inv.current_amount,
          shortage: req.amount - inv.current_amount,
        });
      }
    }
    return shortages;
  }

  // Fetch data
  useEffect(() => {
    async function fetchEventData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/all-event-details",
      );
      const data: Event[] = await response.json();
      setOverlaps(findOverlappingEvents(data));
    }
    fetchEventData();
  }, []);

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

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-inventory",
      );
      const data: EquipmentItem[] = await response.json();
      setInventory(data);
    }
    fetchInventory();
  }, []);

  return (
    <>
      <h3>Clashes (ordered by Start Date of first event)</h3>

      {overlaps
        .filter((o) => {
          const e1Recent = isCurrent(o.event.end);
          const anyE2Recent = o.overlapsWith.some((ev) => isCurrent(ev.end));
          return e1Recent || anyE2Recent;
        })
        .map((e1) => {
          // NEW: build group once
          const groupEvents = [e1.event, ...e1.overlapsWith];
          const groupShortages = getGroupEquipmentShortages(groupEvents);

          return (
            <div className="clash" key={`overlap${e1.event.id}`}>
              {e1.overlapsWith.map((e2) => {
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

                    {/* Shared shops */}
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

                    {/* Shared vehicles */}
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

              {/* NEW: ONE combined equipment shortage block */}
              {groupShortages.length > 0 && (
                <div className="clash-block">
                  <div className="clash-section equipment">
                    <h4>Equipment Shortages (Combined)</h4>
                    {groupShortages.map((s) => (
                      <p key={s.equipment_name} className="warning">
                        {s.equipment_name} — required {s.required}, available{" "}
                        {s.available}, short by {s.shortage}.
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </>
  );
}
