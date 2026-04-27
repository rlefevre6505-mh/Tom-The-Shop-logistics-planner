type FormInputProps = {
  type: string;
  name: string;
  value: string | number;
  defaultValue: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
};

export default function FormInputLoaded({
  type,
  name,
  value,
  defaultValue,
  onChange,
  labelText,
}: FormInputProps) {
  return (
    <div className="form-input">
      <label htmlFor={name}>{labelText}</label>
      <input
        type={type}
        id={name}
        name={name}
        required
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
}
