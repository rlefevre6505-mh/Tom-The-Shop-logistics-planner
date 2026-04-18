import type { JSX, useState } from "react";

export default function AddEventView(): JSX.Element {
  const [formValues, setFormValues] = useState({
    event_date: "",
  });

  function handleSubmit(e) {
    e.preventDefault();

    fetch("https://.../set-date", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formValues),
    });
    setFormValues({
      event_date: "",
    });
  }

  function handleInputChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  return (
    <>
      <h1>Add Event</h1>

      <div className="form-div main-div">
        <h3>Post a gig</h3>
        <form id="form" onSubmit={handleSubmit}>
          <label htmlFor="event_date">Date:</label>
          <input
            type="date"
            id="event_date"
            name="event_date"
            required
            value={formValues.event_date}
            onChange={handleInputChange}
          />

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
