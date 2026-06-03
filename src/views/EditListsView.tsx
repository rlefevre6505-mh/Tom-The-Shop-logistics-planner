import { type JSX } from "react";
import EditingViewButton from "../components/buttons/EditingViewButton";
import EditEventList from "../components/list-edit-views/EventList";
import EditShopList from "../components/list-edit-views/ShopList";
import EditVehicleList from "../components/list-edit-views/VehicleList";
import EditEquipmentList from "../components/list-edit-views/EquipmentLists";
import EditEquipmentInventory from "../components/list-edit-views/InventoryList";
import AddShop from "../components/list-edit-views/AddShop.tsx";
import AddVehicle from "../components/list-edit-views/AddVehicle.tsx";
import AddToEquipmentList from "../components/list-edit-views/AddToEquipmentList.tsx";
import RequiredVehicles from "../components/list-edit-views/RequiredVehicles.tsx";
import AddRequiredVehicle from "../components/list-edit-views/AddRequiredVehicle.tsx";
import { useAppSelector } from "../app/hooks.ts";
import "./EditListsView.css";

export default function EditListsView(): JSX.Element {
  const editingView = useAppSelector((state) => state.editingView.value);

  return (
    <>
      <h1>Edit Lists</h1>
      <div className="button-container">
        <EditingViewButton containedString={"Events"} stateString={"events"} />
        <EditingViewButton containedString={"Shops"} stateString={"shops"} />
        <EditingViewButton
          containedString={"Vehicles"}
          stateString={"vehicles"}
        />
        <EditingViewButton
          containedString={"Equipment Lists"}
          stateString={"equipment-lists"}
        />
        <EditingViewButton
          containedString={"Equipment Inventory"}
          stateString={"inventory"}
        />
      </div>

      <div>
        {editingView === "" && <p>no list selected</p>}
        {editingView === "events" && <EditEventList />}
        {editingView === "shops" && <EditShopList />}
        {editingView === "vehicles" && <EditVehicleList />}
        {editingView === "equipment-lists" && <EditEquipmentList />}
        {editingView === "inventory" && <EditEquipmentInventory />}
        {editingView === "add-shop" && <AddShop />}
        {editingView === "add-vehicle" && <AddVehicle />}
        {editingView === "add-to-equipment-list" && <AddToEquipmentList />}
        {editingView === "required-vehicles" && <RequiredVehicles />}
        {editingView === "add-required-vehicle" && <AddRequiredVehicle />}
      </div>
    </>
  );
}
