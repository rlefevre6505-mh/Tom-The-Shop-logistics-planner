import { useState, type JSX } from "react";
import ListButton from "../components/buttons/ListButton";
import EditEventList from "../components/list-edit-views/EventList";
import EditShopList from "../components/list-edit-views/ShopList";
import EditVehicleList from "../components/list-edit-views/VehicleList";
import EditEquipmentList from "../components/list-edit-views/EquipmentLists";
import EditEquipmentInventory from "../components/list-edit-views/InventoryList";
import "./EditListsView.css";

export default function EditListsView(): JSX.Element {
  const [listState, setListState] = useState<string>("");

  return (
    <>
      <h1>Edit Lists</h1>
      <div className="button-container">
        <ListButton
          containedString={"Events"}
          stateString={"events"}
          setListState={setListState}
        />
        <ListButton
          containedString={"Shops"}
          stateString={"shops"}
          setListState={setListState}
        />
        <ListButton
          containedString={"Vehicles"}
          stateString={"vehicles"}
          setListState={setListState}
        />
        <ListButton
          containedString={"Equipment Lists"}
          stateString={"equipment-lists"}
          setListState={setListState}
        />
        <ListButton
          containedString={"Equipment Inventory"}
          stateString={"inventory"}
          setListState={setListState}
        />
      </div>

      <div>
        {listState === "" && <p>no list selected</p>}
        {listState === "events" && <EditEventList />}
        {listState === "shops" && <EditShopList />}
        {listState === "vehicles" && <EditVehicleList />}
        {listState === "equipment-lists" && <EditEquipmentList />}
        {listState === "inventory" && <EditEquipmentInventory />}
      </div>
    </>
  );
}
