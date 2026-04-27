import type { JSX } from "react";

type submitButtonProps = {
  containedString: string;
};

export default function SubmitButton({
  containedString,
}: submitButtonProps): JSX.Element {
  return (
    <button type="submit" className="submit-button">
      {containedString}
    </button>
  );
}
