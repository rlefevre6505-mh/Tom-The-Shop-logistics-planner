import { type JSX, useState } from "react";
import FormTextArea from "../components/form-elements/FormTextArea";
import FormInput from "../components/form-elements/FormInput";
import SubmitButton from "../components/buttons/SubmitButton";
import { handleInputChangeFactory } from "../lib/functions";
import { useAppDispatch } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice";
import type { Email } from "../lib/types";
import "./HelpView.css";

export default function HelpView(): JSX.Element {
  const [formValues, setFormValues] = useState<Email>({
    name: "",
    email: "",
    message: "",
  });
  const dispatch = useAppDispatch();

  const handleInputChange = handleInputChangeFactory(setFormValues);
  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    await fetch("https://tom-the-shop-server-7h2n.onrender.com/email/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      name: "",
      email: "",
      message: "",
    });
    console.log("sending formvalues:", formValues);
    dispatch(changeView("calendar"));
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <FormInput
          name="name"
          type="text"
          value={formValues.name}
          onChange={handleInputChange}
          labelText="Your Name"
        />
        <FormInput
          name="email"
          type="text"
          value={formValues.email}
          onChange={handleInputChange}
          labelText="Your Email"
        />
        <FormTextArea
          name="message"
          value={formValues.message}
          onChange={handleTextAreaChange}
          labelText="Your message"
        />
        <SubmitButton containedString="Submit"></SubmitButton>
      </form>
    </>
  );
}
