import type { JSX } from "react";
import "./Modal.css";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  message,
  onConfirm,
  onCancel,
}: ConfirmModalProps): JSX.Element {
  return (
    <div
      className="backdrop"
      // style={{
      //   position: "fixed",
      //   inset: 0,
      //   background: "rgba(0,0,0,0.6)",
      //   display: "flex",
      //   justifyContent: "center",
      //   alignItems: "center",
      //   zIndex: 9999,
      // }}
    >
      <div className="modal">
        <p>{message}</p>
        <button onClick={onConfirm}>Yes, delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
