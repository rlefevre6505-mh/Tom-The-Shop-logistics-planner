import type { JSX } from "react";
import { useState, useEffect } from "react";
import "./AddEvent.css";
import FormInput from "../components/FormInput";
import FormNumberInput from "../components/FormNumberInput";
import SubmitButton from "../components/SubmitButton";
import type { shop, vehicle } from "../lib/types.ts";

export default function AddEventView(): JSX.Element {
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
  });

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();

    console.log(formValues);

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
    });
  }

  // function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  //   setFormValues({ ...formValues, [e.target.name]: e.target.value });
  // }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;

    setFormValues({
      ...formValues,
      [name]: type === "number" ? Number(value) : value,
    });
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
      <h1>Add A New Event</h1>
      <div className="form-div main-div">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div>
              <FormInput
                name="title"
                type="text"
                value={formValues.title}
                onChange={handleInputChange}
                labelText="Title"
              />
            </div>
            <FormInput
              name="location"
              type="text"
              value={formValues.location}
              onChange={handleInputChange}
              labelText="Location"
            />
          </div>

          <div className="form-row">
            <FormInput
              name="start"
              type="date"
              value={formValues.start}
              onChange={handleInputChange}
              labelText="Start Date"
            />
            <FormInput
              name="end"
              type="date"
              value={formValues.end}
              onChange={handleInputChange}
              labelText="End Date"
            />
          </div>

          <FormNumberInput
            name="num_of_shops"
            type="number"
            value={formValues.num_of_shops}
            onChange={handleInputChange}
            labelText="Number Of Shops"
            min={0}
            maxLength={2}
          />
          <div className="select-div">
            {Number(formValues.num_of_shops) > 0 &&
              Array.from({ length: Number(formValues.num_of_shops) }).map(
                (_, i) => (
                  <select
                    key={`shop-select${i}`}
                    value={formValues.shops[i] ?? ""}
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

          <FormNumberInput
            name="num_of_vehicles"
            type="number"
            value={formValues.num_of_vehicles}
            onChange={handleInputChange}
            labelText="Number Of Vehicles"
            min={0}
            maxLength={2}
          />
          <div className="select-div">
            {Number(formValues.num_of_vehicles) > 0 &&
              Array.from({ length: Number(formValues.num_of_vehicles) }).map(
                (_, i) => (
                  <select
                    key={`vehicle-select${i}`}
                    value={formValues.vehicles[i] ?? ""}
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
          <SubmitButton containedString="Submit" />
        </form>
      </div>
    </>
  );
}
