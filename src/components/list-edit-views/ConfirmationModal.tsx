import type { JSX } from "react";

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
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "8px",
          minWidth: "300px",
          textAlign: "center",
        }}
      >
        <p>{message}</p>

        <button
          onClick={onConfirm}
          style={{ marginRight: "10px", background: "red", color: "white" }}
        >
          Yes, delete
        </button>

        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}
