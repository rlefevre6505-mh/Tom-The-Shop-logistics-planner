import { type JSX, useState } from "react";
import "./Modal.css";
import { Icons } from "../Icons";


interface ErrorModalProps {
  message: string;
  onConfirm: () => void;
}


export default function ErrorModal({
  message,
  onConfirm,
}: ErrorModalProps): JSX.Element {


    const [copied, setCopied] = useState<boolean>(false);
   
    function copyToClipboard () {
    navigator.clipboard.writeText(message);
    setCopied(true)
  };


  return (
    <div className="backdrop">
      <div className="modal">
        <p>{message}</p>
        <div className="button-container">
          <button onClick={copyToClipboard}>{Icons.copy} {copied ? "Copied" : "Copy to clipboard"}</button>
          <button onClick={onConfirm}>{Icons.tick}Acknowledge</button>
        </div>{" "}
      </div>
    </div>
  );
}
