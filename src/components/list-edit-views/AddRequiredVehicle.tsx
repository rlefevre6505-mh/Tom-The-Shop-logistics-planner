import { type JSX, useState, useEffect } from "react";
import type { shop, vehicle } from "../../lib/types.ts";
import SubmitButton from "../buttons/SubmitButton.tsx";
import EditingViewButton from "../buttons/EditingViewButton.tsx";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import { handleInputChangeFactory } from "../../lib/functions.ts";
import "./AddForm.css";
import { Icons } from "../Icons.tsx";

export default function AddRequiredVehicle(): JSX.Element {
  const [formValues, setFormValues] = useState<{
    shop_id: number | string;
    vehicle_id: number | string;
  }>({ shop_id: "", vehicle_id: "" });
  const [vehiclesState, setVehiclesState] = useState<vehicle[]>([]);
  const [shopsState, setShopsState] = useState<shop[]>([]);
  const dispatch = useAppDispatch();

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    console.log(formValues);
    e.preventDefault();
    await fetch(
      "https://tom-the-shop-server.onrender.com/add-required-vehicle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      },
    );
    setFormValues({
      shop_id: "",
      vehicle_id: "",
    });
    dispatch(changeEditingView("vehicles"));
  } // TODO: Update formvalues and create endpoint =========================================

  useEffect(() => {
    async function fetchVehicles() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-vehicles",
      );
      const data: vehicle[] = await response.json();
      console.log(data);
      setVehiclesState(data);
    }
    fetchVehicles();
    console.log(vehiclesState);
  }, []);

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

  const handleInputChange = handleInputChangeFactory(setFormValues);

  return (
    <div className="form-div main-div">
      <h2>Add a new vehicle requirement</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-column"></div>
        <p>This shop:</p>
        <select
          className="select"
          name="shop_id"
          value={formValues.shop_id}
          onChange={handleInputChange}
        >
          <option value="">Please select an option</option>
          {shopsState.map((s) => {
            return <option value={s.id}>{s.shop_name}</option>;
          })}
        </select>

        <p>requires this vehicle:</p>
        <select
          className="select"
          name="vehicle_id"
          value={formValues.vehicle_id}
          onChange={handleInputChange}
        >
          <option value="">Please select an option</option>
          {vehiclesState.map((v) => {
            return <option value={v.id}>{v.vehicle_name}</option>;
          })}
        </select>

        <SubmitButton containedString="Submit" />
      </form>
      <EditingViewButton
        icon={Icons.add}
        containedString={"Back"}
        stateString={"vehicles"}
      />
    </div>
  );
}
