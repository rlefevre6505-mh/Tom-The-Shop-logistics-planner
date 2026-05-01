import type { JSX } from "react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks.ts";
import { changeEventDetails } from "../features/eventDetails/EventDetailsSlice.ts";
import { changeView } from "../features/view/viewSlice.ts";
import "./AddEvent.css";
import FormInput from "../components/FormInput.tsx";
import FormNumberInput from "../components/FormNumberInput";
import SubmitButton from "../components/SubmitButton";
import ViewButton from "../components/ViewButton.tsx";

export default function EditEventView(): JSX.Element {
  const dispatch = useAppDispatch();

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
    event_id: number | undefined;
    title: string | undefined;
    start: string | undefined;
    end: string | undefined;
    location: string | undefined;
    num_of_shops: number | undefined;
    shops: shop[];
    num_of_vehicles: number | undefined;
    vehicles: vehicle[];
  };

  const [formValues, setFormValues] = useState<FormValues>({
    event_id: EventDetails?.id,
    title: EventDetails?.title,
    start: EventDetails?.start,
    end: EventDetails?.end,
    location: EventDetails?.location,
    num_of_shops: EventDetails?.num_of_shops,
    shops: EventDetails?.shops ?? [],
    num_of_vehicles: EventDetails?.num_of_vehicles,
    vehicles: EventDetails?.vehicles ?? [],
  });

  useEffect(() => {
    if (EventDetails) {
      setFormValues({
        event_id: EventDetails.id,
        title: EventDetails.title,
        start: EventDetails.start,
        end: EventDetails.end,
        location: EventDetails.location,
        num_of_shops: EventDetails.num_of_shops,
        shops: EventDetails.shops ?? [],
        num_of_vehicles: EventDetails.num_of_vehicles,
        vehicles: EventDetails.vehicles ?? [],
      });
    }
  }, [EventDetails]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form values being submitted:", formValues);
    try {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/edit-event",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        },
      );
      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error:", response.status, errorData);
        return;
      }

      setFormValues({
        event_id: EventDetails?.id,
        title: "",
        start: "",
        end: "",
        location: "",
        num_of_shops: 0,
        shops: [],
        num_of_vehicles: 0,
        vehicles: [],
      });
    } catch (error) {
      console.error("Network error:", error);
    }
    async function fetchSelectedEvent(id: number) {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/selected-event",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        },
      );
      const data = await response.json();
      dispatch(changeEventDetails(data));
      console.log(data);
    }

    if (EventDetails?.id) {
      fetchSelectedEvent(EventDetails.id);
    }

    dispatch(changeView("event-view"));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    const parsedValue = type === "number" ? Number(value) : value;
    setFormValues({ ...formValues, [name]: parsedValue });
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
                    value={formValues.shops[i]?.id ?? ""}
                    onChange={(e) =>
                      handleShopSelect(i, Number(e.target.value))
                    }
                  >
                    <option value="">Please select an option</option>
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
                    value={formValues.vehicles[i]?.id ?? ""}
                    onChange={(e) =>
                      handleVehicleSelect(i, Number(e.target.value))
                    }
                  >
                    <option value="">Please select an option</option>
                    {vehiclesState
                      .filter(
                        (s) =>
                          !selectedVehicleIds.some((sel) => sel.id === s.id) ||
                          s.id === formValues.vehicles[i]?.id,
                      )
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.vehicle_name}
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
