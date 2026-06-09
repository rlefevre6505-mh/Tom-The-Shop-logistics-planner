import type { JSX } from "react";
import "../views/HelpView.css";

export default function HowTo(): JSX.Element {
  return (
    <div>
      <h1>How To Guide</h1>
      <h2>Viewing & Editing Events</h2>
      <p>
        Existing events can be viewed in the <b>Calendar</b> or in the{" "}
        <b>List Of Events</b> views, selectable in the menu. From there, each
        event can be clicked on in order to view all details for that event,
        edit the details, or add a note to the event. The <b>Event Details</b>{" "}
        view will also show warnings for allocation issues, eg. &quot;the number
        of shops required does not match the amount allocated&quot; or &quot;A
        shop that requires a certain vehicle is assigned, but the specified
        vehicle is not&quot;.{" "}
      </p>
      <p>
        <b>NB.</b> notes can only be read in the <b>Event Details</b> view.
      </p>
      <h2>Adding A New Event</h2>
      <p>
        Clicking <b>Add Event</b> in the menu gives you a form that requires at
        minimum:
      </p>
      <ul>
        <li>- a title</li>
        <li>- a location</li>
        <li>- a start date</li>
        <li>- a end date</li>
      </ul>
      <p>and optionally:</p>
      <ul>
        <li>- how many shops are needed</li>
        <li>- which shops are assigned</li>
        <li>- how many vechiles are needed</li>
        <li>- which vechiles are assigned</li>
      </ul>
      <p>
        These optional details can be added later by selecting the event for
        editing.
      </p>
      <h2>Important Concepts</h2>
      <h4>Equipment Lists</h4>
      <p>
        Each shop has an equipment list associated with it. This is a list of
        all the required equipment that this shop must always be deployed with.
        These lists are populated wiht equipment items from the equipment
        inventory list and are used to track the possibility of equipment
        shortages and generate warnings if a shortage is detected.
      </p>
      <h4>Required Vechiles</h4>
      <p>
        Each shop can optionally have a vehicle assigned to it as
        &quot;required&quot;. This means that is the shop needs this vehicle to
        go wiht it, so if the shop is assigned to a festival without the
        required vechile this will cause a warning.
      </p>
      <h2>Warnings</h2>
      <p>
        The red <b>Warnings</b> button will not appear in the menu if there are
        currently no warnings to view. If there are warnings it will be visible
        and will show how many warnings need to be reviewed in brackets on the
        right side of the button.
      </p>
      <ul>
        <b>Warnings take 2 forms:</b>

        <li>- allocation warnings</li>
        <li>- clashes</li>
      </ul>
      <p>
        <b>Allocation warnings</b> occur when number of shops/vehicles allocated
        to an event does not match the declared amount required or when a
        required vehicle is not allocated. These should be addressed before
        moving on to clashes, as changing these details may resolve or change
        aspects of a clash. Each allocation warning present adds 1 to the total
        displayed in the <b>Warnings</b> button.
      </p>
      <p>
        <b>Clashes</b> are defined by an overlap between events. One clash can
        include more than 2 events and is defined by the start date of the first
        overlapping event, with warnings for issues between this event and the
        other events listed separately within the clash. Regardless of the
        number of events involved in a clash, a summary of combined equipment
        shortages is displayed at the bottom of the clash. The system checks for
        overlaps and compares the details of all events involved to check for
        any issues twice every second, for example:
      </p>
      <ul>
        <li>
          A specific shop or vehicle is assigned to multiple overlapping events
        </li>
        <li>or</li>
        <li>
          The required amount of certain equipment items needed (based on the
          allocated shops and their equipment lists) may exceed the amount
          available
        </li>{" "}
      </ul>
      <p>
        <b>NB. </b>
        Each allocation warning present adds 1 to the total displayed in the{" "}
        <b>Warnings</b> button. Each clash also adds 1 to the total displayed in
        the <b>Warnings</b> button, but can include multiple sub-warnings. As
        such, 1 clash may require multiple changes to be made to be fully
        resolved.
      </p>
      <h2>Editing Lists</h2>
      <p>
        In the <b>Edit Lists</b> view, you can directly create, edit and delete
        data on the app's database, allowing full control of your data. However,
        be aware that there is currently no backup fo rthe database, so these
        changes cannot be undone. The edits you can use are:
      </p>
      <ul>
        <b> Events</b>
        <li>- delete an event</li>
      </ul>
      <ul>
        <b> Shops</b> <li>- edit the name of a shop</li>
        <li>- add a new shop</li>
        <li>- delete a shop</li>
      </ul>
      <ul>
        <b>Vehicles</b>
        <li>- edit the name of a vehicle</li>
        <li>- edit the registration of a vehicle</li>
        <li>- add a new vehicle</li>
        <li>- delete a vehicle</li>
        <li>- add a vehicle requirement</li>
        <li>- delete a vehicle requirement</li>
        <li>- delete a vehicle</li>
      </ul>
      <ul>
        <b>Equipment Lists</b>
        <li>- delete an item from an equipment list</li>
        <li>- add an item from an equipment list</li>
        <li>- edit the amount of an item on an equipment list</li>
      </ul>
      <ul>
        <b>Equipment Inventory</b>
        <li>- delete an item from the inventory</li>
        <li>- add a new item to the inventory</li>
        <li>- edit the name of an item in the inventory</li>
        <li>- edit the current amount of an item in the inventory</li>
      </ul>
    </div>
  );
}
