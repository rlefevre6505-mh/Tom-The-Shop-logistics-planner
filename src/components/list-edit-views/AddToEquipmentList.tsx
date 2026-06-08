import { type JSX, useState, useEffect } from "react";
import SubmitButton from "../buttons/SubmitButton.tsx";
import { useAppDispatch } from "../../app/hooks.ts";
import { changeEditingView } from "../../features/EditingView/EditingViewSlice.ts";
import "../../views/AddEvent.css";
import { handleInputChangeFactory } from "../../lib/functions.ts";
import FormNumberInput from "../form-elements/FormNumberInput.tsx";
import type { shop, EquipmentItem } from "../../lib/types.ts";
import EditingViewButton from "../buttons/EditingViewButton.tsx";
import "./AddForm.css";
import { Icons } from "../Icons.tsx";
import Spinner from "../Spinner.tsx";

export default function AddToEquipmentList(): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const [shopsState, setShopsState] = useState<shop[]>([]);
  const [inventory, setInventory] = useState<EquipmentItem[]>([]);
  const [formValues, setFormValues] = useState<{
    shop_id: number | string;
    item_id: number | string;
    amount: number | string;
  }>({
    shop_id: "",
    item_id: "",
    amount: "",
  });

  useEffect(() => {
    async function fetchShops() {
      try {
        const response = await fetch(
          "https://tom-the-shop-server-7h2n.onrender.com/get-shops",
        );
        const data: shop[] = await response.json();
        // console.log(data);
        setShopsState(data);
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  useEffect(() => {
    async function fetchInventory() {
      const response = await fetch(
        "https://tom-the-shop-server-7h2n.onrender.com/get-inventory",
      );
      const data: EquipmentItem[] = await response.json();
      // console.log(data);
      setInventory(data);
    }
    fetchInventory();
  }, []);

  const handleInputChange = handleInputChangeFactory(setFormValues);

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement | HTMLTextAreaElement>,
  ) {
    e.preventDefault();
    await fetch(
      "https://tom-the-shop-server-7h2n.onrender.com/add-to-equipment-list",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      },
    );
    // console.log(formValues);
    setFormValues({
      shop_id: "",
      item_id: "",
      amount: "",
    });
    dispatch(changeEditingView("equipment-lists"));
  }

  return (
    <>
      <h1>Add To An Equipment List</h1>
      <div className="form-div main-div">
        {loading ? (
          <Spinner />
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-column">
              <select
                className="select"
                name="shop_id"
                value={formValues.shop_id}
                onChange={handleInputChange}
              >
                <option value="">Please select an option</option>
                {shopsState.map((s, i) => {
                  return (
                    <option key={`shop-option${i}`} value={s.id}>
                      {s.shop_name}
                    </option>
                  );
                })}
              </select>

              <select
                className="select"
                name="item_id"
                value={formValues.item_id}
                onChange={handleInputChange}
              >
                <option value="">Please select an option</option>
                {inventory.map((a, i) => {
                  return (
                    <option key={`item-option${i}`} value={a.id}>
                      {a.equipment_name}
                    </option>
                  );
                })}
              </select>

              <FormNumberInput
                name="amount"
                type="number"
                value={formValues.amount}
                onChange={handleInputChange}
                labelText="Amount Of Item"
                min={0}
                maxLength={3}
              />
            </div>
            <SubmitButton containedString="Submit" />
          </form>
        )}
        <EditingViewButton
          icon={Icons.back}
          stateString={"equipment-lists"}
          containedString={"Back"}
        />
      </div>
    </>
  );
}
