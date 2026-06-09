import { type JSX, useState } from "react";
import HowTo from "../components/HowTo.tsx";
import SupportForm from "../components/SupportForm.tsx";
import { Icons } from "../components/Icons.tsx";
import "./HelpView.css";

export default function HelpView(): JSX.Element {
  const [helpView, setHelpView] = useState<"guide" | "support">("guide");

  return (
    <div className="help-div">
      <div className="small-button-container">
        {helpView === "guide" ? (
          <button
            className="editing-view-button"
            onClick={() => {
              setHelpView("support");
            }}
          >
            {Icons.support}Request Support
          </button>
        ) : (
          <button
            className="editing-view-button"
            onClick={() => {
              setHelpView("guide");
            }}
          >
            {Icons.question}How To Guide
          </button>
        )}
      </div>
      {helpView === "guide" ? <HowTo /> : <SupportForm />}
    </div>
  );
}
