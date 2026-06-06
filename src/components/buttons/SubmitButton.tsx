import type { JSX } from "react";
import { Icons } from "../Icons";

type submitButtonProps = {
  containedString: string;
};

export default function SubmitButton({
  containedString,
}: submitButtonProps): JSX.Element {
  return (
    <button type="submit" className="submit-button">
      {Icons.tick}
      {containedString}
    </button>
  );
}
