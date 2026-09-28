import { type JSX, useState } from "react";
import FormTextArea from "../components/form-elements/FormTextArea";
import FormInput from "../components/form-elements/FormInput";
import SubmitButton from "../components/buttons/SubmitButton";
import { handleInputChangeFactory } from "../lib/functions";
import { useAppDispatch } from "../app/hooks.ts";
import { changeView } from "../features/view/viewSlice";
import { apiRequest } from "../lib/functions";
import ErrorModal from "./list-edit-views/ErrorModal.tsx";
import type { Email } from "../lib/types";
import "../views/HelpView.css";

export default function SupportForm(): JSX.Element {
  const [formValues, setFormValues] = useState<Email>({
    name: "",
    email: "",
    message: "",
  });
  const [errorState, setErrorState] = useState<string>("")
  const dispatch = useAppDispatch();

  const handleInputChange = handleInputChangeFactory(setFormValues);
  function handleTextAreaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    setErrorState("");

    const result = await apiRequest("https://tom-the-shop-server-7h2n.onrender.com/email/support", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });

    if (!result.ok) {
    setErrorState(result.error ?? "");
    return; 
  }

    setFormValues({
      name: "",
      email: "",
      message: "",
    });
    // console.log("sending formvalues:", formValues);
    dispatch(changeView("help")); //! update to reroute to how-to guide
  }

  return (
    <>
        {errorState !== "" && (
          <ErrorModal
            message={`ERROR: ${errorState}`}
            onConfirm={() => {
            setErrorState("");
            }}
          />
        )}

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
