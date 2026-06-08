import type { JSX } from "react";
type FormTextAreaProps = {
  name: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  labelText: string;
};

export default function FormTextArea({
  name,
  value,
  onChange,
  labelText,
}: FormTextAreaProps): JSX.Element {
  return (
    <div className="form-textarea">
      <label className="textarea-label" htmlFor={name}>
        {labelText}
      </label>
      <textarea
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
