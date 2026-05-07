import { useEffect, useState, type JSX } from "react";
// import EventClash from "../components/EventClash";
// import { useAppSelector } from "../app/hooks.ts";
// import "./AddEvent.css";

export default function ClashCheckerView(): JSX.Element {
  type Event = {
    id: number;
    title: string;
    start: string;
    end: string;
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
      {overlaps.map((o, i) => {
        return (
          <>
            <p key={`overlap${i}`}>{`${o.event.title} is overlapped by:`}</p>
            <ul>
              {o.overlapsWith.map((clash) => {
                return (
                  <>
                    <li>{clash.title}</li>
                  </>
                );
              })}
            </ul>
          </>
        );
      })}
    </>
  );
}
