import type { JSX } from "react";

type NoteProps = {
  text: string;
  i: number;
};

export default function Note({ text, i }: NoteProps): JSX.Element {
  return (
    <div className="note-div" key={`note${i}`}>
      <p>{text}</p>
    </div>
  );
}
