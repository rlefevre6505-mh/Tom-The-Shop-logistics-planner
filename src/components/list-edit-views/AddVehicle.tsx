import { type JSX, useState } from "react";
import type { vehicle } from "../../lib/types.ts";
import FormInput from "../form-elements/FormInput.tsx";
import SubmitButton from "../buttons/SubmitButton.tsx";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import "../../views/AddEvent.css";
import { handleInputChangeFactory } from "../../lib/functions.ts";
import EditingViewButton from "../buttons/EditingViewButton.tsx";
import "./AddForm.css";
import { Icons } from "../Icons.tsx";

export default function AddVehicle(): JSX.Element {
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<Omit<vehicle, "id">>({
    vehicle_name: "",
    vehicle_reg: "",
  });
  const handleInputChange = handleInputChangeFactory(setFormValues);

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/vehicle/add-vehicle",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      },
    );
    setFormValues({
      vehicle_name: "",
      vehicle_reg: "",
    });
    dispatch(changeEditingView("vehicles"));
  }

  return (
    <>
      <h1>Add A New Vehicle</h1>
      <div className="form-div main-div">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-column">
            <FormInput
              name="vehicle_name"
              type="text"
              value={formValues.vehicle_name}
              onChange={handleInputChange}
              labelText="Vehicle name"
            />
            <FormInput
              name="vehicle_reg"
              type="text"
              value={formValues.vehicle_reg}
              onChange={handleInputChange}
              labelText="Vehicle registration"
            />
          </div>
          <SubmitButton containedString="Submit" />
        </form>
        <EditingViewButton
          icon={Icons.back}
          stateString={"vehicles"}
          containedString={"Back"}
        />
      </div>
    </>
  );
}
