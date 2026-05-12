import { type JSX, useState, useEffect } from "react";
import type {vehicle} from '../../lib/types'

export default function EditVehicleList(): JSX.Element {
const [vehicleState, setVehicleState] = useState<vehicle[]>([])

  useEffect(() => {
    async function fetchVehicles() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-vehicles",
      );
      const data: vehicle[] = await response.json();
      setVehicleState(data);
      console.log(data)
    }
    fetchVehicles();
  }, []);

  return (
    <>
      <h1>Edit List Of Vehicle</h1>
      {vehicleState.map((v)=>{
        return(
        <div>
          <p>{v.vehicle_name}</p>
          <p>{v.vehicle_reg}</p>
        </div>)
      })}
    </>
  );
}
