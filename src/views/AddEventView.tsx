import type { JSX } from "react";
import { useState } from "react";

export default function AddEventView(): JSX.Element {
  const [formValues, setFormValues] = useState({
    title: "",
    start: "",
    end: "",
  });

  function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();

    fetch("https://tom-the-shop-server.onrender.com/set-date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      title: "",
      start: "",
      end: "",
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  return (
    <>
      <h1>Add Event</h1>

      <div className="form-div main-div">
        <h3>Post a gig</h3>
        <form id="form" onSubmit={handleSubmit}>
          <label htmlFor="title">Event Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            required
            value={formValues.title}
            onChange={handleInputChange}
          />

          <label htmlFor="start">Start Date:</label>
          <input
            type="date"
            id="start"
            name="start"
            required
            value={formValues.start}
            onChange={handleInputChange}
          />

          <label htmlFor="end">End Date:</label>
          <input
            type="date"
            id="end"
            name="end"
            required
            value={formValues.end}
            onChange={handleInputChange}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
