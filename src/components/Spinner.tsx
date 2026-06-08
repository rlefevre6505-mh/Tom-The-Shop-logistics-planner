import { type JSX } from "react";
import { Watch } from "react-loader-spinner";
import "./Spinner.css";

export default function Spinner(): JSX.Element {
  return (
    <Watch
      height="80"
      width="80"
      color="#74baad"
      ariaLabel="audio-loading"
      wrapperStyle={{}}
      wrapperClass="wrapper-class"
      visible={true}
    />
  );
}
