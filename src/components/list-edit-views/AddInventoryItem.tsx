import type { JSX } from "react";
import { useState } from "react";
import "./AddEvent.css";
import FormInput from "../../components/form-elements/FormInput.tsx";
import FormNumberInput from "../../components/form-elements/FormNumberInput.tsx";
import SubmitButton from "../../components/buttons/SubmitButton.tsx";
import type {} from "../../lib/types.ts";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeView } from "../../features/view/viewSlice.ts";

export default function AddEventView(): JSX.Element {
  const dispatch = useAppDispatch();

  const [formValues, setFormValues] = useState({
    // TODO: add type
    // TODO: add formvalues state default
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
      // TODO: add default formvalues
    });
    dispatch(changeView("")); // TODO: set view to reroute to
  }
  // TODO: check matching endpoint in server

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setFormValues({
      ...formValues,
      [name]: type === "number" ? Number(value) : value,
    });
  }

  return (
    <>
      <h1>Add A New Event</h1>
      <div className="form-div main-div">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <FormInput
              name="end"
              type="date"
              value={formValues.end} // TODO: update to match formvalues
              onChange={handleInputChange}
              labelText="End Date"
            />
            <FormNumberInput
              name="" // TODO: add props
              type="number"
              value={formValues.num_of_shops} // TODO: update to match formvalues
              onChange={handleInputChange}
              labelText="" // TODO: add props
              min={0}
              maxLength={2}
            />
          </div>

          <SubmitButton containedString="Submit" />
        </form>
      </div>
    </>
  );
}
