import type { JSX } from "react";

type listButtonProps = {
  containedString: string;
  stateString: string;
  setListState: (value: string) => void;
};

export default function ListButton({
  containedString,
  stateString,
  setListState,
}: listButtonProps): JSX.Element {
  return (
    <button className="list-button" onClick={() => setListState(stateString)}>
      {containedString}
    </button>
  );
}
