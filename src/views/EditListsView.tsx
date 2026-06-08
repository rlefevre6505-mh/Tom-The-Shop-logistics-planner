import { type JSX } from "react";
import EditingViewButton from "../components/buttons/EditingViewButton";
import EditEventList from "../components/list-edit-views/EventList.tsx";
import EditShopList from "../components/list-edit-views/ShopList.tsx";
import EditVehicleList from "../components/list-edit-views/VehicleList.tsx";
import EditEquipmentList from "../components/list-edit-views/EquipmentLists.tsx";
import EditEquipmentInventory from "../components/list-edit-views/InventoryList.tsx";
import AddShop from "../components/list-edit-views/AddShop.tsx";
import AddVehicle from "../components/list-edit-views/AddVehicle.tsx";
import AddToEquipmentList from "../components/list-edit-views/AddToEquipmentList.tsx";
import RequiredVehicles from "../components/list-edit-views/RequiredVehicles.tsx";
import AddRequiredVehicle from "../components/list-edit-views/AddRequiredVehicle.tsx";
import AddInventoryItem from "../components/list-edit-views/AddInventoryItem.tsx";
import { useAppSelector } from "../app/hooks.ts";
import "./EditListsView.css";
import { Icons } from "../components/Icons.tsx";

export default function EditListsView(): JSX.Element {
  const editingView = useAppSelector((state) => state.editingView.value);

  return (
    <>
      <h1>Editable Lists:</h1>
      <div className="button-container">
        <EditingViewButton
          icon={Icons.events}
          containedString={"Events"}
          stateString={"events"}
        />
        <EditingViewButton
          icon={Icons.shop}
          containedString={"Shops"}
          stateString={"shops"}
        />
        <EditingViewButton
          icon={Icons.vehicle}
          containedString={"Vehicles"}
          stateString={"vehicles"}
        />
        <EditingViewButton
          icon={Icons.equipment}
          containedString={"Equipment Lists"}
          stateString={"equipment-lists"}
        />
        <EditingViewButton
          icon={Icons.lists}
          containedString={"Equipment Inventory"}
          stateString={"inventory"}
        />
      </div>

      <div>
        {editingView === "" && (
          <h2>
            <i>No list selected</i>
          </h2>
        )}
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
        {editingView === "add-inventory-item" && <AddInventoryItem />}
      </div>
    </>
  );
}
