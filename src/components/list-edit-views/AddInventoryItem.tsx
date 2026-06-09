import { type JSX, useState } from "react";
import type { AddInventoryItemValues } from "../../lib/types.ts";
import FormInput from "../form-elements/FormInput.tsx";
import FormNumberInput from "../form-elements/FormNumberInput.tsx";
import SubmitButton from "../buttons/SubmitButton.tsx";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeView } from "../../features/view/viewSlice.ts";
import "../../views/AddEvent.css";
import { handleInputChangeFactory } from "../../lib/functions.ts";
import EditingViewButton from "../buttons/EditingViewButton.tsx";
import { Icons } from "../Icons.tsx";
import "./AddForm.css";

export default function AddInventoryItem(): JSX.Element {
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<AddInventoryItemValues>({
    name: "",
    amount: "",
  });
  const handleInputChange = handleInputChangeFactory(setFormValues);

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/equipment/add-inventory-item",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      },
    );
    setFormValues({
      name: "",
      amount: "",
    });
    dispatch(changeView("edit-lists"));
  }

  return (
    <>
      <h1>Add A New Inventory Item</h1>
      <div className="form-div main-div">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-column">
            <FormInput
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleInputChange}
              labelText="Item name"
            />
            <FormNumberInput
              name="amount"
              type="number"
              value={formValues.amount}
              onChange={handleInputChange}
              labelText="Amount"
              min={0}
              maxLength={3}
            />
          </div>
          <SubmitButton containedString="Submit" />{" "}
        </form>
        <EditingViewButton
          icon={Icons.back}
          stateString={"inventory"}
          containedString={"Back"}
        />
      </div>
    </>
  );
}
