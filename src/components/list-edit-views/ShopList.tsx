import { type JSX, useState, useEffect } from "react";
import type {shop} from '../../lib/types'

export default function EditShopList(): JSX.Element {
const [shopState, setShopState] = useState<shop[]>([])
  
    useEffect(() => {
    async function fetchShops() {
      const response = await fetch(
        "https://tom-the-shop-server.onrender.com/get-shops",
      );
      const data: shop[] = await response.json();
      setShopState(data);
      console.log(data)
    }
    fetchShops();
  }, []);

  return (
    <>
      <h1>Edit List Of Shops</h1>
            {shopState.map((s)=>{
        return(
        <div>
          <p>{s.shop_name}</p>
         
        </div>)
      })}
    </>
  );
}
