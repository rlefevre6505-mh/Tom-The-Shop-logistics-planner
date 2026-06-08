import type { JSX } from "react";
import "./Modal.css";
import { Icons } from "../Icons";

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
    <div className="backdrop">
      <div className="modal">
        <p>{message}</p>
        <div className="button-container">
          <button onClick={onConfirm}>{Icons.delete}Yes, delete</button>
          <button onClick={onCancel}>{Icons.cancel}Cancel</button>
        </div>{" "}
      </div>
    </div>
  );
}
