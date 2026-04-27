import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks.ts";

export default function EditEventView(): JSX.Element {
  type shop = {
    id: number;
    shop_name: string;
  };
  type vehicle = {
    id: number;
    vehicle_name: string;
  };
  const [shopsState, setShopsState] = useState<shop[]>([]);
  const [vehiclesState, setVehiclesState] = useState<vehicle[]>([]);
  const EventDetails = useAppSelector((state) => state.EventDetails.value);

  useEffect(() => {
    async function fetchShops() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-shops",
      );
      const data: shop[] = await response.json();
      setShopsState(data);
    }
    fetchShops();
  }, []);

  useEffect(() => {
    async function fetchVehicles() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-vehicles",
      );
      const data: vehicle[] = await response.json();
      setVehiclesState(data);
    }
    fetchVehicles();
  }, []);

  type FormValues = {
    title: string | undefined;
    start: string | undefined;
    end: string | undefined;
    date_added: Date | undefined;
    location: string | undefined;
    num_of_shops: number | undefined;
    shops: shop[] | undefined;
    num_of_vehicles: number | undefined;
    vehicles: vehicle[] | undefined;
    notes: string[];
  };
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    start: "",
    end: "",
    date_added: new Date(),
    location: "",
    num_of_shops: 0,
    shops: [],
    num_of_vehicles: 0,
    vehicles: [],
    notes: [],
  });

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();

    fetch("https://tom-the-shop-server.onrender.com/add-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      title: EventDetails?.title,
      start: EventDetails?.start.toString(),
      end: EventDetails?.end.toString(),
      date_added: EventDetails?.date_added,
      location: EventDetails?.location,
      num_of_shops: EventDetails?.num_of_shops,
      shops: EventDetails?.shops,
      num_of_vehicles: EventDetails?.num_of_vehicles,
      vehicles: EventDetails?.vehicles,
      notes: EventDetails?.notes,
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  function handleShopSelect(i: number, value: number) {
    const updated = [...formValues.shops];
    updated[i] = value;
    setFormValues({ ...formValues, shops: updated });
  }
  const selectedShopIds = formValues.shops;

  function handleVehicleSelect(i: number, value: number) {
    const updated = [...formValues.vehicles];
    updated[i] = value;
    setFormValues({ ...formValues, vehicles: updated });
  }
  const selectedVehicleIds = formValues.vehicles;

  return (
    <>
      <h1>Edit Event</h1>
      return (
      <>
        <h1>Add A New Event</h1>
        <div className="form-div main-div">
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="title">Event Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={EventDetails?.title}
              placeholder={EventDetails?.title}
              value={formValues.title}
              onChange={handleInputChange}
            />

            <label htmlFor="start">Start Date:</label>
            <input
              type="date"
              id="start"
              name="start"
              required
              value={formValues.start}
              onChange={handleInputChange}
            />

            <label htmlFor="end">End Date:</label>
            <input
              type="date"
              id="end"
              name="end"
              required
              value={formValues.end}
              onChange={handleInputChange}
            />

            <label htmlFor="location">Event location:</label>
            <input
              type="text"
              id="location"
              name="location"
              required
              value={formValues.location}
              onChange={handleInputChange}
            />

            <label htmlFor="num_of_shops">Number of shops required:</label>
            <input
              type="number"
              id="num_of_shops"
              name="num_of_shops"
              min={0}
              maxLength={2}
              required
              value={formValues.num_of_shops}
              onChange={handleInputChange}
            />

            <div className="select-div">
              {Number(formValues.num_of_shops) > 0 &&
                Array.from({ length: Number(formValues.num_of_shops) }).map(
                  (_, i) => (
                    <select
                      key={`shop-select${i}`}
                      onChange={(e) =>
                        handleShopSelect(i, Number(e.target.value))
                      }
                    >
                      <option key={`vehicle-option${i}`}>
                        Please select an option
                      </option>
                      {shopsState
                        .filter(
                          (s) =>
                            !selectedShopIds.includes(s.id) ||
                            s.id === formValues.shops[i],
                        )
                        .map((s) => {
                          return <option value={s.id}>{s.shop_name}</option>;
                        })}
                    </select>
                  ),
                )}
            </div>

            <label htmlFor="num_of_vehicles">
              Number of vehicles required:
            </label>
            <input
              type="number"
              id="num_of_vehicles"
              name="num_of_vehicles"
              min={0}
              maxLength={2}
              required
              value={formValues.num_of_vehicles}
              onChange={handleInputChange}
            />

            <div className="select-div">
              {Number(formValues.num_of_vehicles) > 0 &&
                Array.from({ length: Number(formValues.num_of_vehicles) }).map(
                  (_, i) => (
                    <select
                      key={`vehicle-select${i}`}
                      onChange={(e) =>
                        handleVehicleSelect(i, Number(e.target.value))
                      }
                    >
                      <option key={`vehicle-option${i}`}>
                        Please select an option
                      </option>
                      {vehiclesState
                        .filter(
                          (v) =>
                            !selectedVehicleIds.includes(v.id) ||
                            v.id === formValues.vehicles[i],
                        )
                        .map((v) => {
                          return <option value={v.id}>{v.vehicle_name}</option>;
                        })}
                    </select>
                  ),
                )}
            </div>

            <button type="submit">Submit</button>
          </form>
        </div>
      </>
      ); ``
    </>
  );
}
