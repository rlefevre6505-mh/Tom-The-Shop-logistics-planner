type FormInputProps = {
  type: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  labelText: string;
};

export default function FormInput({
  type,
  name,
  value,
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
        onChange={onChange}
      />
    </div>
  );
}
