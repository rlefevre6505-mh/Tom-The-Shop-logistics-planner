import { useEffect, useState, type JSX } from "react";
import type { shop, vehicle, note } from "../lib/types";
// import EventClash from "../components/EventClash";
import { toUKdate } from "../lib/functions";
import "./ClashChecker.css";

export default function ClashCheckerView(): JSX.Element {
  type Event = {
    id: number;
    title: string;
    start: string;
    end: string;
    date_added: string;
    location: string;
    notes: note[];
    num_of_shops: number;
    num_of_vehicles: number;
    shops: shop[];
    vehicles: vehicle[];
  };

  type Overlap = {
    event: Event;
    overlapsWith: Event[];
  };

  const [overlaps, setOverlaps] = useState<Overlap[]>([]);

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
        if (overlap) {
          overlapsWith.push(b);
        }
      }
      if (overlapsWith.length > 0) {
        results.push({ event: a, overlapsWith });
      }
    }
    console.log(results);
    return results;
  }

  function getSharedShops(e1: Event, e2: Event): shop[] {
    return e1.shops.filter((s1) => e2.shops.some((s2) => s2.id === s1.id));
  }
  function getSharedVehicles(e1: Event, e2: Event): vehicle[] {
    return e1.vehicles.filter((v1) =>
      e2.vehicles.some((v2) => v2.id === v1.id),
    );
  }

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/all-event-details",
      );
      const data: Event[] = await response.json();
      const found = findOverlappingEvents(data);
      setOverlaps(found);
    }
    fetchData();
  }, []);

  return (
    <>
      <h3>Clashes (ordered by Start Date of first event)</h3>

      {overlaps.map((e1) => {
        return (
          <div className="clash" key={`overlap${e1.event.id}`}>
            {e1.overlapsWith.map((e2) => {
              const sharedShops = getSharedShops(e1.event, e2);

              return (
                <ul key={`clash${e1.event.id}-${e2.id}`}>
                  <p>{`${e1.event.title} overlaps ${e2.title} from ${toUKdate(e2.start)} to ${toUKdate(e1.event.end)}.`}</p>
                  {sharedShops.length > 0 ? (
                    sharedShops.map((shop) => (
                      <p
                        key={shop.id}
                      >{`${shop.shop_name} is allocated to both events.`}</p>
                    ))
                  ) : (
                    <p>No shared shops</p>
                  )}
                </ul>
              );
            })}

            {e1.overlapsWith.map((e2) => {
              const sharedVehicles = getSharedVehicles(e1.event, e2);
              return (
                <ul key={`clash${e1.event.id}-${e2.id}`}>
                  {sharedVehicles.length > 0 ? (
                    sharedVehicles.map((vehicle) => (
                      <p
                        key={vehicle.id}
                      >{`${vehicle.vehicle_name} is allocated to both events.`}</p>
                    ))
                  ) : (
                    <p>No shared vehicles</p>
                  )}
                </ul>
              );
            })}
          </div>
        );
      })}
    </>
  );
}
