import type { JSX } from "react";
import { useState } from "react";
import { useAppSelector } from "../app/hooks.ts";
import SubmitButton from "../components/SubmitButton";
import FormTextArea from "../components/FormTextArea";
import ViewButton from "../components/ViewButton";

export default function AddEventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);

  type FormValues = {
    note: string;
    event_id: number | undefined;
  };
  const [formValues, setFormValues] = useState<FormValues>({
    note: "",
    event_id: EventDetails?.id,
  });

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    fetch("https://tom-the-shop-server.onrender.com/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      note: "",
      event_id: undefined,
    });
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <FormTextArea
          name="note"
          value={formValues.note}
          onChange={handleTextAreaChange}
          labelText="Add A Note"
        />
        <SubmitButton containedString="Submit" />
      </form>
      <ViewButton containedString={"Cancel"} stateString={"event-view"} />
    </>
  );
}
