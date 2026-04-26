import type { JSX } from "react";
import { useState, useEffect } from "react";
import "./AddEvent.css";

export default function AddEventView(): JSX.Element {
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

  // useEffect(() => {
  //   console.log(vehiclesState);
  // }, [vehiclesState]);

  type FormValues = {
    title: string;
    start: string;
    end: string;
    date_added: Date;
    location: string;
    num_of_shops: number;
    shops: number[];
    num_of_vehicles: number;
    vehicles: number[];
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
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    // console.log(formValues.vehicles);
  }

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
                  <select key={`shop-select${i}`}>
                    <option>Please select an option</option>
                    {shopsState.map((s) => {
                      return <option value={s.id}>{s.shop_name}</option>;
                    })}
                  </select>
                ),
              )}
          </div>

          <label htmlFor="num_of_vehicles">Number of shops required:</label>
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
                  <select key={`vehicle-select${i}`}>
                    <option>Please select an option</option>
                    {vehiclesState.map((v) => {
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
  );
}
