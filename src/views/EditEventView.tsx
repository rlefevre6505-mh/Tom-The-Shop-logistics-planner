import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useAppSelector } from "../app/hooks.ts";
import "./AddEvent.css";
import FormInput from "../components/FormInput.tsx";
import FormNumberInput from "../components/FormNumberInput";
import SubmitButton from "../components/SubmitButton";
import ViewButton from "../components/ViewButton.tsx";

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
    location: string | undefined;
    num_of_shops: number | undefined;
    shops: shop[];
    num_of_vehicles: number | undefined;
    vehicles: vehicle[];
    notes: string[];
  };

  const [formValues, setFormValues] = useState<FormValues>({
    title: EventDetails?.title,
    start: EventDetails?.start,
    end: EventDetails?.end,
    location: EventDetails?.location,
    num_of_shops: EventDetails?.num_of_shops,
    shops: EventDetails?.shops ?? [], // ← always array
    num_of_vehicles: EventDetails?.num_of_vehicles,
    vehicles: EventDetails?.vehicles ?? [], // ← always array
    notes: EventDetails?.notes ?? [],
  });

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();

    fetch("https://tom-the-shop-server.onrender.com/edit-event", {
      method: "UPDATE", // TODO: update server query
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      title: "",
      start: "",
      end: "",
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
  }

  function handleShopSelect(i: number, id: number) {
    const selected = shopsState.find((s) => s.id === id);
    if (!selected) return;
    const updated = [...(formValues.shops ?? [])];
    updated[i] = selected;

    setFormValues({ ...formValues, shops: updated });
  }

  const selectedShopIds = formValues.shops;

  function handleVehicleSelect(i: number, id: number) {
    const selected = vehiclesState.find((v) => v.id === id);
    if (!selected) return;
    const updated = [...(formValues.vehicles ?? [])];
    updated[i] = selected;
    setFormValues({ ...formValues, vehicles: updated });
  }

  const selectedVehicleIds = formValues.vehicles;

  return (
    <>
      <h1>Edit Event Details</h1>
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
                          !selectedShopIds.some((sel) => sel.id === s.id) ||
                          s.id === formValues.shops[i]?.id,
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.shop_name}
                        </option>
                      ))}
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
                          !selectedVehicleIds.some((sel) => sel.id === v.id) ||
                          v.id === formValues.vehicles[i]?.id,
                      )
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.vehicle_name}
                        </option>
                      ))}
                  </select>
                ),
              )}
          </div>

          <SubmitButton containedString="Submit" />
        </form>
        <ViewButton containedString={"Cancel"} stateString={"event-view"} />
      </div>
    </>
  );
}
