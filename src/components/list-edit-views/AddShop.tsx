import { type JSX, useState } from "react";
import type { shop } from "../../lib/types.ts";
import FormInput from "../../components/form-elements/FormInput.tsx";
import SubmitButton from "../../components/buttons/SubmitButton.tsx";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import "../../views/AddEvent.css";
import { handleInputChangeFactory } from "../../lib/functions.ts";
import ViewButton from "../buttons/ViewButton.tsx";
import "./AddForm.css";

export default function AddShop(): JSX.Element {
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<Omit<shop, "id">>({
    shop_name: "",
  });
  const handleInputChange = handleInputChangeFactory(setFormValues);

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    await fetch("https://tom-the-shop-server.onrender.com/add-shop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      shop_name: "",
    });
    dispatch(changeEditingView("shops"));
  }

  return (
    <>
      <h1>Add A New Shop</h1>
      <div className="form-div main-div">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-column">
            <FormInput
              name="shop_name"
              type="text"
              value={formValues.shop_name}
              onChange={handleInputChange}
              labelText="Shop name"
            />
          </div>
          <SubmitButton containedString="Submit" />{" "}
        </form>
        <ViewButton stateString={"edit-lists"} containedString={"Back"} />
      </div>
    </>
  );
}
