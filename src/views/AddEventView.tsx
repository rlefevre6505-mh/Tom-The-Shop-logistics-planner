import type { JSX } from "react";
import { useState } from "react";

export default function AddEventView(): JSX.Element {
  const [formValues, setFormValues] = useState({
    event_title: "",
    start_date: "",
    end_date: "",
  });

  function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    fetch("https://tom-the-shop-server.onrender.com/set-date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      event_title: "",
      start_date: "",
      end_date: "",
    });
  }

  function handleInputChange() {
    // e: React.SyntheticEvent<HTMLFormElement>
    // setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  // function handleInputChange(e: React.SyntheticEvent<HTMLFormElement>) {
  //   setFormValues({ ...formValues, [e.target.name]: e.target.value });
  // }

  return (
    <>
      <h1>Add Event</h1>

      <div className="form-div main-div">
        <h3>Post a gig</h3>
        <form id="form" onSubmit={handleSubmit}>
          <label htmlFor="event_title">Event Title:</label>
          <input
            type="text"
            id="event_title"
            name="event_title"
            required
            value={formValues.event_title}
            onChange={handleInputChange}
          />

          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            required
            value={formValues.start_date}
            onChange={handleInputChange}
          />

          <label htmlFor="end_date">End Date:</label>
          <input
            type="date"
            id="end_date"
            name="end_date"
            required
            value={formValues.end_date}
            onChange={handleInputChange}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
