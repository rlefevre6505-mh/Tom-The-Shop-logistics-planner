import type { JSX } from "react";
import type { addNoteFormValues } from "../lib/types.ts";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks.ts";
import { changeEventDetails } from "../features/eventDetails/EventDetailsSlice.ts";
import { changeView } from "../features/view/viewSlice.ts";
import SubmitButton from "../components/buttons/SubmitButton.tsx";
import FormTextArea from "../components/form-elements/FormTextArea.tsx";
import ViewButton from "../components/buttons/ViewButton";
import "./AddNotes.css";
import { Icons } from "../components/Icons.tsx";

export default function AddEventView(): JSX.Element {
  const EventDetails = useAppSelector((state) => state.EventDetails.value);
  const dispatch = useAppDispatch();
  const [formValues, setFormValues] = useState<addNoteFormValues>({
    note: "",
    event_id: EventDetails?.id,
  });

  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    await fetch("https://tom-the-shop-server.onrender.com/add-note", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

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
      // console.log(data);
    }
    if (EventDetails?.id) {
      fetchSelectedEvent(EventDetails.id);
    }
    setFormValues({
      note: "",
      event_id: EventDetails?.id,
    });
    // console.log("updated");
    dispatch(changeView("event-view"));
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
        <SubmitButton containedString="Submit"></SubmitButton>
        <ViewButton
          containedString={"Back"}
          stateString={"event-view"}
          icon={Icons.back}
        />
      </form>
    </>
  );
}
